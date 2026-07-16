import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-foreground/10 blur-[120px] mix-blend-screen animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-foreground/5 blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Task<span className="text-gradient">Nova</span>
          </h1>
          <p className="text-gray-400">Collaborate with your team at light speed.</p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
}
