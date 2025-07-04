import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarProvider } from '../contexts/SidebarContext';

const CompanyRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'company') {
    return <Navigate to="/login" replace />;
  }
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};

export default CompanyRoute; 