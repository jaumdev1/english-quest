import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { user, initialized } = useAuth();
  
  // Mostrar loading enquanto inicializa
  if (!initialized) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">✨</div>
          <p className="text-dark-100">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
} 