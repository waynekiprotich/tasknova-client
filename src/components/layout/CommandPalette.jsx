import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Command, X } from 'lucide-react';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import api from '../../utils/api';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Toggle with Cmd+K
  useKeyboardShortcut('k', () => {
    setIsOpen((prev) => !prev);
  });

  // Close on Escape
  useKeyboardShortcut('escape', () => {
    setIsOpen(false);
  }, false); // no metaKey required

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(response.data.data);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelectResult = (task) => {
    setIsOpen(false);
    // Navigate to the project board and possibly open the task modal.
    // For now, we will navigate to the project board. The task modal opens via state.
    navigate(`/projects/${task.project_id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <Card className="relative w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden flex flex-col mx-4 z-10 animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-lg"
            placeholder="Search tasks across all projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="ml-3 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((task) => (
                <button
                  key={task.id}
                  className="w-full flex flex-col items-start px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-left"
                  onClick={() => handleSelectResult(task)}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-1">
                      {task.title}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {task.description && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                      {task.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              No tasks found matching "{query}"
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Type to start searching</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
