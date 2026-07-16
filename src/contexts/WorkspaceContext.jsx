import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/workspaces');
      const fetchedWorkspaces = response.data.data;
      setWorkspaces(fetchedWorkspaces);
      
      if (fetchedWorkspaces.length > 0 && !activeWorkspace) {
        // If there's no active workspace set, default to the first one
        const storedWorkspaceId = localStorage.getItem('activeWorkspaceId');
        const found = fetchedWorkspaces.find(w => w.id === storedWorkspaceId);
        setActiveWorkspace(found || fetchedWorkspaces[0]);
      }
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setLoading(false);
    }
  }, [user]);

  const selectWorkspace = (workspaceId) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setActiveWorkspace(workspace);
      localStorage.setItem('activeWorkspaceId', workspace.id);
    }
  };

  const createWorkspace = async (name, description) => {
    const response = await api.post('/workspaces', { name, description });
    const newWorkspace = response.data.data;
    setWorkspaces(prev => [...prev, newWorkspace]);
    selectWorkspace(newWorkspace.id);
    return newWorkspace;
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, loading, selectWorkspace, createWorkspace, refreshWorkspaces: fetchWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
