import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import ManageRoles from './pages/ManageRoles';
import ManageUsers from './pages/ManageUsers';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/roles" 
        element={
          <ProtectedRoute>
            <ManageRoles />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      {/* Add additional routes for Departments, Categories as needed later */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
