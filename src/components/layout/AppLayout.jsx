import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CreateWorkspaceModal from '../workspaces/CreateWorkspaceModal';
import CommandPalette from './CommandPalette';
import { useUIStore } from '../../stores/useUIStore';
import './AppLayout.css';

export default function AppLayout() {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className="layout-root">
      <div className="layout-container">
        <Sidebar />
        
        <div className="layout-main-wrapper">
          <div className="layout-header-wrapper">
            <Header onCreateWorkspace={() => setIsWorkspaceModalOpen(true)} />
          </div>
          
          <main className="layout-main-content">
            <div className="layout-page-wrapper">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <CreateWorkspaceModal 
        isOpen={isWorkspaceModalOpen} 
        onClose={() => setIsWorkspaceModalOpen(false)} 
      />
      
      <CommandPalette />
    </div>
  );
}
