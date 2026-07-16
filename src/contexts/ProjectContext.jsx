import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { WorkspaceContext } from './WorkspaceContext';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { activeWorkspace } = useContext(WorkspaceContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    if (!activeWorkspace) {
      setProjects([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/projects/workspace/${activeWorkspace.id}`);
      setProjects(response.data.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace]);

  const createProject = async (name, description, isPrivate) => {
    const response = await api.post('/projects', {
      workspace_id: activeWorkspace.id,
      name,
      description,
      is_private: isPrivate
    });
    const newProject = response.data.data;
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, createProject, refreshProjects: fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
