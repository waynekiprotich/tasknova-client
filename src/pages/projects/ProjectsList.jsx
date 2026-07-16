import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckSquare, Clock, Globe, Lock } from 'lucide-react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { WorkspaceContext } from '../../contexts/WorkspaceContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import CreateProjectModal from '../../components/projects/CreateProjectModal';

export default function ProjectsList() {
  const { projects, loading } = useContext(ProjectContext);
  const { activeWorkspace } = useContext(WorkspaceContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!activeWorkspace) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-gray-500">Please select a workspace first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage projects in {activeWorkspace.name}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-foreground"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="clay-card rounded-xl p-12 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by creating your first project to organize tasks and collaborate with your team.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="secondary">
            Create a Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="h-full hover-lift group cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-surface-hover rounded-xl group-hover:bg-border smooth-transition">
                      <CheckSquare className="w-5 h-5 text-foreground" />
                    </div>
                    {project.is_private ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="group-hover:text-foreground smooth-transition">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="border-t border-border pt-4 text-xs text-gray-400 flex justify-between mt-auto">
                  <div className="flex items-center font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
