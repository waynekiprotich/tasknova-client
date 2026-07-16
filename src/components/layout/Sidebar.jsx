import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Settings, 
  Users, 
  LogOut,
  Calendar,
  MessageSquare,
  Bell,
  BarChart2,
  ChevronLeft
} from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { useUIStore } from '../../stores/useUIStore';
import './Sidebar.css';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: CheckSquare },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isSidebarCollapsed ? 96 : 280 }}
      className="sidebar-container"
    >
      <button 
        onClick={toggleSidebar}
        className={`sidebar-toggle-btn ${isSidebarCollapsed ? "collapsed" : "expanded"}`}
      >
        <ChevronLeft size={16} />
      </button>

      <div className="sidebar-inner">
        <div className="sidebar-header">
          <motion.div 
            animate={{ opacity: isSidebarCollapsed ? 0 : 1, display: isSidebarCollapsed ? 'none' : 'block' }}
            transition={{ duration: 0.2 }}
            className="sidebar-logo"
          >
            TaskNova
          </motion.div>
          {isSidebarCollapsed && (
            <div className="sidebar-logo-collapsed">
              TN
            </div>
          )}
        </div>
        
        <div className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-item ${isActive ? "sidebar-item-active" : ""} ${isSidebarCollapsed ? "collapsed" : ""}`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <item.icon
                  className="sidebar-icon"
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={false}
                    animate={{ opacity: 1 }}
                    className="sidebar-text"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            )
          })}
        </div>
        
        <div className="sidebar-footer">
          <button
            onClick={logout}
            className={`sidebar-logout-btn ${isSidebarCollapsed ? "collapsed" : ""}`}
            title={isSidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="sidebar-logout-icon" />
            {!isSidebarCollapsed && (
              <span className="sidebar-text">Logout</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
