import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Subjects } from './pages/Subjects';
import { SubjectDetails } from './pages/SubjectDetails';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Home } from './pages/Home';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/disciplinas" element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          } />

          <Route path="/disciplinas/:id" element={
            <ProtectedRoute>
              <SubjectDetails />
            </ProtectedRoute>
          } />

          <Route path="/tarefas" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />

          <Route path="/calendario" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
