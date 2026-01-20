import { Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import { getCurrentUser } from '../utils/auth';

const AdminRoutes = () => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  return <AdminDashboard />;
};

export default AdminRoutes;
