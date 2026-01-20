import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = ({ user, setUser }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0, collected: 0 });
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Worker',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, requestsRes, usersRes, reportsRes] = await Promise.all([
        api.getStats(),
        api.getPickupRequests(),
        api.getUsers(),
        api.getGarbageReports(),
      ]);
      setStats(statsRes.data);
      setRequests(requestsRes.data);
      setUsers(usersRes.data);
      setWorkers(usersRes.data.filter(u => u.role === 'Worker'));
      setReports(reportsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createUser(userFormData);
      toast.success('User created successfully!');
      setShowUserForm(false);
      setUserFormData({ name: '', email: '', password: '', role: 'Worker' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (id, action) => {
    try {
      await api.updateGarbageReportStatus(id, action);
      toast.success(`Report ${action}d successfully!`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${action} report`);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.deleteUser(id);
      toast.success('User deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const assignWorker = async (requestId, workerId) => {
    try {
      await api.assignWorker(requestId, workerId);
      toast.success('Worker assigned successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to assign worker');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500';
      case 'Assigned': return 'text-blue-500';
      case 'Collected': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <button
          onClick={() => setShowUserForm(!showUserForm)}
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          {showUserForm ? 'Cancel' : 'Add Worker'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-darker p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300">Total Requests</h3>
          <p className="text-3xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="bg-darker p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-darker p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300">Collected</h3>
          <p className="text-3xl font-bold text-green-500">{stats.collected}</p>
        </div>
      </div>

      {showUserForm && (
        <div className="bg-darker p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Worker</h2>
          <form onSubmit={handleUserSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userFormData.name}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userFormData.email}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userFormData.password}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  name="role"
                  value={userFormData.role}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Worker">Worker</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Requests */}
        <div className="bg-darker rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">All Pickup Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Citizen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{request.citizen?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.garbageType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${getStatusColor(request.status)}`}>{request.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.worker?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === 'Pending' && (
                        <select
                          onChange={(e) => assignWorker(request.id, e.target.value)}
                          className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm"
                          defaultValue=""
                        >
                          <option value="" disabled>Assign Worker</option>
                          {workers.map((worker) => (
                            <option key={worker.id} value={worker.id}>{worker.name}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workers List */}
        <div className="bg-darker rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Workers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.filter(u => u.role === 'Worker').map((worker) => (
                  <tr key={worker.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{worker.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{worker.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteUser(worker.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Garbage Reports */}
        <div className="bg-darker rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Garbage Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Citizen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{report.citizen?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={`http://localhost:5001${report.imagePath}`} alt="Garbage" className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${report.status === 'REPORTED' ? 'text-yellow-500' : report.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.status === 'REPORTED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReportAction(report.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;