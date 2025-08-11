import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import ManageRoles from './pages/administrative/RolesPage';
import ManageUsers from './pages/administrative/UsersPage';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/MainDashboard';
import ManageMunicipalities from './pages/geographical/MunicipalitiesPage';
import ManageStates from './pages/geographical/StatesPage';

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
      <Route 
        path="/states" 
        element={
          <ProtectedRoute>
            <ManageStates />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/municipalities" 
        element={
          <ProtectedRoute>
            <ManageMunicipalities />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
