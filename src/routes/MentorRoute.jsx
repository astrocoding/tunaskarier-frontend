import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider } from '../contexts/SidebarContext';

const MentorRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'mentor') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};

export default MentorRoute; 