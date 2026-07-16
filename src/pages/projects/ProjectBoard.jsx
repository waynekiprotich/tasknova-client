import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import api from '../../utils/api';
import { initSocket, disconnectSocket } from '../../utils/socket';
import { AuthContext } from '../../contexts/AuthContext';
import KanbanColumn from '../../components/tasks/KanbanColumn';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import { Avatar } from '../../components/ui/Avatar';
import './Kanban.css';

// Status configuration
const STATUSES = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
};

export default function ProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({}); // { backlog: [...], todo: [...], ... }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedColumnForNewTask, setSelectedColumnForNewTask] = useState('backlog');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Initialize columns
    const initialColumns = Object.keys(STATUSES).reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {});
    setTasks(initialColumns);

    const fetchProjectAndTasks = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/tasks/project/${projectId}`)
        ]);
        
        setProject(projectRes.data.data);
        
        // Group tasks by status
        const grouped = { ...initialColumns };
        
        // Sort tasks by position before grouping
        const sortedTasks = [...tasksRes.data.data].sort((a, b) => a.position - b.position);
        
        sortedTasks.forEach(task => {
          if (grouped[task.status]) {
            grouped[task.status].push(task);
          } else {
            // Fallback for unknown statuses
            grouped.backlog.push(task);
          }
        });
        
        setTasks(grouped);
      } catch (err) {
        console.error(err);
        setError('Failed to load project board');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();

    // Set up Socket.IO
    const token = localStorage.getItem('token');
    const socket = initSocket(token);

    socket.on('task:created', (newTask) => {
      if (newTask.project_id === projectId) {
        setTasks(prev => {
          const status = newTask.status || 'backlog';
          return {
            ...prev,
            [status]: [...prev[status], newTask]
          };
        });
      }
    });

    socket.on('task:updated', (updatedTask) => {
      if (updatedTask.project_id === projectId) {
        setTasks(prev => {
          // This is a naive update that doesn't handle status changes well across columns yet,
          // but works for basic live updates. For full drag-and-drop live sync, more logic is needed.
          const next = { ...prev };
          
          // Remove from all columns first
          Object.keys(next).forEach(col => {
            next[col] = next[col].filter(t => t.id !== updatedTask.id);
          });
          
          // Add to new column and sort
          next[updatedTask.status].push(updatedTask);
          next[updatedTask.status].sort((a, b) => a.position - b.position);
          
          return next;
        });
      }
    });

    socket.on('task:deleted', ({ id }) => {
      setTasks(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(col => {
          next[col] = next[col].filter(t => t.id !== id);
        });
        return next;
      });
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid column
    if (!destination) return;

    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumn = source.droppableId;
    const endColumn = destination.droppableId;
    
    // Optimistic UI update
    setTasks(prev => {
      const newTasks = { ...prev };
      
      const draggedTask = newTasks[startColumn].find(t => t.id === draggableId);
      
      // Remove from source
      newTasks[startColumn] = Array.from(newTasks[startColumn]);
      newTasks[startColumn].splice(source.index, 1);
      
      // Add to destination
      newTasks[endColumn] = Array.from(newTasks[endColumn]);
      
      // Update task status and position
      const updatedTask = { ...draggedTask, status: endColumn };
      newTasks[endColumn].splice(destination.index, 0, updatedTask);
      
      // Recompute positions for destination column
      newTasks[endColumn] = newTasks[endColumn].map((t, i) => ({ ...t, position: i }));
      
      return newTasks;
    });

    // Send API update
    try {
      await api.put(`/tasks/${draggableId}`, {
        status: endColumn,
        position: destination.index
      });
    } catch (err) {
      console.error("Failed to update task via API", err);
      // In a real app, we'd revert the state here on failure
    }
  };

  const handleOpenCreateModal = (columnId) => {
    setSelectedColumnForNewTask(columnId);
    setIsTaskModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-foreground animate-spin" />
          <p className="text-gray-400 font-medium tracking-wide">Loading Board...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-red-500 mb-4">{error || 'Project not found'}</p>
        <Link to="/projects" className="text-foreground hover:underline">
          Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="kanban-board-container">
      {/* Board Header */}
      <div className="kanban-header">
        <div className="kanban-header-left">
          <Link to="/projects" className="kanban-back-btn">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="kanban-title">
              {project.name}
            </h1>
            <p className="kanban-subtitle">{project.description || "Project Board"}</p>
          </div>
        </div>
        
        <div className="kanban-header-right">
          <div className="kanban-team-avatars">
            <div style={{ zIndex: 20 }}><Avatar name={user?.name} size="md" /></div>
            <div style={{ zIndex: 10 }}><Avatar name="John Doe" size="md" /></div>
            <div className="kanban-add-user-btn">
              <Users size={16} color="var(--color-text-secondary)" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="kanban-scroll-area">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-columns-container">
            {Object.entries(STATUSES).map(([statusKey, title]) => (
              <KanbanColumn
                key={statusKey}
                columnId={statusKey}
                title={title}
                tasks={tasks[statusKey] || []}
                onAddTask={handleOpenCreateModal}
                onTaskClick={(task) => setSelectedTask(task)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        initialStatus={selectedColumnForNewTask}
        onTaskCreated={(task) => {
          setTasks(prev => {
            const status = task.status || 'backlog';
            if (prev[status].some(t => t.id === task.id)) return prev;
            return {
              ...prev,
              [status]: [...prev[status], task]
            };
          });
        }}
      />

      <TaskDetailsModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
}
