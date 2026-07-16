import React, { useState, useContext } from 'react';
import { X, Calendar, Flag, User, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import CommentList from './CommentList';
import AttachmentList from './AttachmentList';
import './TaskDetailsModal.css';

export default function TaskDetailsModal({ task, isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('comments');
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  
  if (!isOpen || !task) return null;

  const handleTitleSave = async () => {
    if (title.trim() === '' || title === task.title) {
      setEditingTitle(false);
      return;
    }
    try {
      await api.put(`/tasks/${task.id}`, { title });
      // Socket handles the update on the board, but modal relies on prop. 
      // Ideally modal takes an ID and fetches, or parent passes updated task. 
      // For now, optimistic update in parent is enough if parent updates the prop.
    } catch (err) {
      console.error('Failed to update title', err);
    }
    setEditingTitle(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      
      <div className="modal-container">
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-badges">
            <div className={`modal-badge modal-badge-status-${task.status}`}>
              {task.status.replace('_', ' ')}
            </div>
            <div className={`modal-badge modal-badge-priority-${task.priority}`}>
              <Flag size={14} style={{ marginRight: '0.25rem' }} />
              {task.priority} Priority
            </div>
          </div>
          
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="modal-body">
          
          {/* Left Panel: Task Details */}
          <div className="modal-content-left">
            <div className="modal-title-section">
              {editingTitle ? (
                <input
                  type="text"
                  className="modal-title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  autoFocus
                />
              ) : (
                <h2 
                  className="modal-title-display"
                  onClick={() => setEditingTitle(true)}
                >
                  {task.title}
                </h2>
              )}
            </div>
            
            <div className="modal-meta-row">
              <div className="modal-meta-item">
                <User size={16} className="modal-meta-icon" />
                <span className="modal-meta-label">Assignee:</span>
                {task.assignee_id ? (
                  <span className="modal-meta-value">Assigned</span>
                ) : (
                  <button className="modal-meta-value-btn">
                    Unassigned
                  </button>
                )}
              </div>
              
              <div className="modal-meta-item">
                <Calendar size={16} className="modal-meta-icon" />
                <span className="modal-meta-label">Created:</span>
                <span className="modal-meta-value">{format(new Date(task.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
            
            <div className="modal-section">
              <h3 className="modal-section-title">Description</h3>
              <div className="modal-description-box">
                {task.description ? (
                  <p className="modal-description-text">{task.description}</p>
                ) : (
                  <p className="modal-description-empty">No description provided. Click to add one.</p>
                )}
              </div>
            </div>

            <div className="modal-section">
              <AttachmentList taskId={task.id} currentUser={user} />
            </div>
          </div>
          
          {/* Right Panel: Comments & Activity */}
          <div className="modal-content-right">
            <div className="modal-tabs">
              <button 
                className={`modal-tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                Activity
              </button>
            </div>
            
            <div className="modal-tab-content">
              {activeTab === 'comments' ? (
                <CommentList taskId={task.id} currentUser={user} />
              ) : (
                <div className="modal-empty-state">
                  Activity log coming soon...
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
