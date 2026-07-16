import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { WorkspaceContext } from '../../contexts/WorkspaceContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function CreateWorkspaceModal({ isOpen, onClose }) {
  const { createWorkspace } = useContext(WorkspaceContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createWorkspace(name, description);
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold text-white">Create Workspace</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-sm text-red-500 border border-red-500/20">
                {error}
              </div>
            )}
            
            <Input
              label="Workspace Name"
              placeholder="e.g. Engineering Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                className="flex w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:border-primary-500 resize-none h-24"
                placeholder="What is this workspace for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Create Workspace
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
