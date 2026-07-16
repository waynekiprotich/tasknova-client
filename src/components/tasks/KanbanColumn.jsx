import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ columnId, title, tasks, onAddTask, onTaskClick }) {
  // Let's remove tailwind colors completely. If we want custom badges per column:
  const getBadgeColor = (id) => {
    switch (id) {
      case 'todo': return 'var(--color-primary-500)';
      case 'in_progress': return 'var(--color-warning)';
      case 'done': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getBadgeBg = (id) => {
    switch (id) {
      case 'todo': return 'rgba(59, 130, 246, 0.1)';
      case 'in_progress': return 'rgba(245, 158, 11, 0.1)';
      case 'done': return 'rgba(16, 185, 129, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  return (
    <div className="kanban-column">
      {/* Column Header */}
      <div className="kanban-column-header">
        <div className="kanban-column-title-group">
          <div 
            className="kanban-column-badge"
            style={{ 
              color: getBadgeColor(columnId),
              backgroundColor: getBadgeBg(columnId)
            }}
          >
            {title}
          </div>
          <span className="kanban-column-count">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(columnId)}
          className="kanban-add-task-btn"
          title="Add task"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-droppable-area ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
