import React, { useState, useContext } from 'react';
import { X, Lock, Globe } from 'lucide-react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function CreateProjectModal({ isOpen, onClose }) {
  const { createProject } = useContext(ProjectContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createProject(name, description, isPrivate);
      setName('');
      setDescription('');
      setIsPrivate(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold text-white">New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
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
              label="Project Name"
              placeholder="e.g. Website Redesign"
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
                placeholder="What is this project for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setIsPrivate(!isPrivate)}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isPrivate ? 'bg-primary-500 border-primary-500' : 'border-gray-500'}`}>
                {isPrivate && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <div className="flex-1">
                <div className="flex items-center text-sm font-medium text-white">
                  {isPrivate ? <Lock className="w-4 h-4 mr-2 text-primary-400" /> : <Globe className="w-4 h-4 mr-2 text-green-400" />}
                  {isPrivate ? 'Private Project' : 'Public Project'}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {isPrivate ? 'Only members you invite can see this.' : 'Anyone in the workspace can view and join.'}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
