import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImageViewer from './pages/ImageViewer';
import ImageUpload from './pages/ImageUpload';
import AnnotationEditor from './pages/AnnotationEditor';
import UserManagement from './pages/UserManagement';
import EventLogs from './pages/EventLogs';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/images" element={<ImageViewer />} />
        <Route path="/upload" element={<ImageUpload />} />
        <Route path="/annotate/:imageId" element={<AnnotationEditor />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/events" element={<EventLogs />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default App; 