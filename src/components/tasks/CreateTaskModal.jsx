import React, { useState } from 'react';
import { X, Flag, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../utils/api';

export default function CreateTaskModal({ isOpen, onClose, projectId, onTaskCreated, initialStatus = 'backlog' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/tasks', {
        project_id: projectId,
        title,
        description,
        status: initialStatus,
        priority,
        position: 0 // Ideally this is calculated based on existing tasks
      });
      
      onTaskCreated(response.data.data);
      setTitle('');
      setDescription('');
      setPriority('none');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'none', label: 'No Priority', color: 'bg-gray-500' },
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-surface border border-border shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200" style={{ borderRadius: 'var(--radius-modal)' }}>
        <div className="flex items-center justify-between p-10 border-b border-border/50">
          <h2 className="text-xl font-semibold text-foreground">Create Task</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-sm text-red-500 border border-red-500/20">
                {error}
              </div>
            )}
            
            <Input
              label="Task Title"
              placeholder="e.g. Design homepage hero section"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
            
            <div className="w-full">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Description (Optional)
              </label>
              <textarea
                className="flex w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground resize-none h-24"
                placeholder="Add more details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-colors ${
                      priority === opt.value 
                        ? 'border-border bg-surface-hover text-foreground' 
                        : 'border-border/50 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mb-1.5 ${opt.color}`} />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Create Task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
