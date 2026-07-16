import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { WorkspaceContext } from '../../contexts/WorkspaceContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ChevronDown, Moon, Sun, Search, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import NotificationBell from './NotificationBell';
import './Header.css';

export default function Header({ onCreateWorkspace }) {
  const { user } = useContext(AuthContext);
  const { activeWorkspace } = useContext(WorkspaceContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="header-container"
    >
      
      {/* Left Section: Search */}
      <div className="header-search">
        <Search className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search projects, tasks, members..."
        />
        <span className="header-search-shortcut">
          ⌘ K
        </span>
      </div>

      {/* Right Section: Controls */}
      <div className="header-actions">
        
        {/* Tool Icons */}
        <div className="header-icon-group">
          <button 
            className="header-icon-btn"
            title="Messages"
          >
            <MessageSquare size={20} />
          </button>
          
          <div className="header-icon-btn" title="Notifications">
            <NotificationBell />
          </div>

          <button 
            onClick={toggleTheme} 
            className="header-icon-btn"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* User Profile Block */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="header-profile"
          >
            <div className="header-profile-avatar">
              <Avatar name={user?.name || 'Guest User'} size="md" />
            </div>
            <div className="header-profile-info">
              <span className="header-profile-name">
                {user?.name || 'Guest User'}
              </span>
              <span className="header-profile-handle">
                @{user?.name ? user.name.toLowerCase().replace(/\s/g, '') : 'guest'}
              </span>
            </div>
            <ChevronDown className="header-profile-chevron" />
          </button>
          
          {/* Mock Dropdown for Avatar */}
          {isDropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-full right-0 mt-3 w-56 clay-card py-2 z-50 overflow-hidden"
              style={{ borderRadius: 'var(--radius-dropdown)' }}
            >
              <div className="px-4 py-3 border-b border-border/50 mb-1">
                <p className="text-sm font-bold text-foreground">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-text-secondary">{user?.email || 'guest@tasknova.com'}</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors">
                Preferences
              </button>
              <div className="border-t border-border/50 mt-1 pt-1">
                <button className="w-full text-left px-4 py-2 text-sm font-medium text-danger hover:bg-red-500/10 transition-colors">
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </motion.header>
  );
}
