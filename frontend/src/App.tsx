import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import ManageOrganisms from './pages/administrative/OrganismsPage';
import ManageRoles from './pages/administrative/RolesPage';
import ManageUsers from './pages/administrative/UsersPage';
import LoginPage from './pages/auth/LoginPage';
import AdministrativeDashboard from './pages/dashboard/AdministrativeDashboard';
import GeographicalDashboard from './pages/dashboard/GeographicalDashboard';
import MainDashboard from './pages/dashboard/MainDashboard';
import ManageMunicipalities from './pages/geographical/MunicipalitiesPage';
import ManageParishes from './pages/geographical/ParishesPage';
import ManageStates from './pages/geographical/StatesPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Main Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Specialized Dashboards */}
      <Route 
        path="/dashboard/administrative" 
        element={
          <ProtectedRoute>
            <AdministrativeDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/dashboard/geographical" 
        element={
          <ProtectedRoute>
            <GeographicalDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Administrative Routes */}
      <Route 
        path="/organisms" 
        element={
          <ProtectedRoute>
            <ManageOrganisms />
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
      
      {/* Geographical Routes */}
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
      <Route 
        path="/parishes" 
        element={
          <ProtectedRoute>
            <ManageParishes />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
