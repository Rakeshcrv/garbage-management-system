import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Sidebar from './components/Sidebar';
import { getCurrentUser } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Login setUser={setUser} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'Citizen':
        return <CitizenDashboard user={user} setUser={setUser} />;
      case 'Worker':
        return <WorkerDashboard user={user} setUser={setUser} />;
      case 'Admin':
        return <AdminDashboard user={user} setUser={setUser} />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <div className="flex h-screen bg-dark">
      {(user.role === 'Admin' || user.role === 'Worker') && <Sidebar user={user} setUser={setUser} />}
      <div className="flex-1 overflow-auto">
        {renderDashboard()}
      </div>
    </div>
  );
}

export default App;