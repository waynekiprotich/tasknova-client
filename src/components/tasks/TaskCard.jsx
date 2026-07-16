import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, Paperclip, GripVertical, CheckCircle2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

const priorityColors = {
  none: 'transparent',
  low: '#DDE2FF',
  medium: '#8C9EFF',
  high: 'var(--color-danger)',
};

const priorityBadges = {
  high: <Badge variant="danger" className="task-card-badge">High</Badge>,
  medium: <Badge variant="warning" className="task-card-badge">Med</Badge>,
  low: <Badge variant="primary" className="task-card-badge">Low</Badge>,
}

export default function TaskCard({ task, index, onClick }) {
  // Mock progress calculation
  const progress = Math.floor(Math.random() * 100);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Priority edge indicator */}
          <div 
            className="task-card-edge"
            style={{ backgroundColor: priorityColors[task.priority] || priorityColors.none }}
          />
          
          <div className="task-card-content">
            <div className="task-card-header">
              <div className="task-card-badges">
                {priorityBadges[task.priority]}
                {task.title.includes('UI') && <Badge variant="neutral" className="task-card-badge">Design</Badge>}
              </div>
              <button className="task-drag-handle">
                <GripVertical size={16} />
              </button>
            </div>

            <h4 className="task-card-title">
              {task.title}
            </h4>
            
            {task.description && (
              <p className="task-card-desc">
                {task.description}
              </p>
            )}

            {/* Progress bar mock */}
            <div className="task-progress-container">
              <div className="task-progress-header">
                <span className="task-progress-label">
                  <CheckCircle2 size={12} /> Progress
                </span>
                <span>{progress}%</span>
              </div>
              <div className="task-progress-bar-bg">
                <div className="task-progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: progress > 50 ? 'var(--color-success)' : 'var(--color-primary-500)' }}></div>
              </div>
            </div>
            
            <div className="task-card-footer">
              <div className="task-card-stats">
                <div className="task-stat-item">
                  <MessageSquare size={14} />
                  {Math.floor(Math.random() * 5)}
                </div>
                <div className="task-stat-item">
                  <Paperclip size={14} />
                  {Math.floor(Math.random() * 3)}
                </div>
              </div>
              
              <div className="task-card-assignee">
                {task.assignee_id ? (
                  <Avatar name="A" size="sm" />
                ) : (
                  <div className="task-unassigned">
                    <span className="sr-only">Unassigned</span>
                  </div>
                )}
                
                {/* Navigation Arrow */}
                <div className="task-nav-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
