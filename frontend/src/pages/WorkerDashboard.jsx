import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const WorkerDashboard = ({ user, setUser }) => {
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchTasks();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.getPickupRequests();
      setRequests(response.data);
      // Filter routes for today
      const today = new Date().toISOString().split('T')[0];
      const todayRoutes = response.data.filter(req =>
        req.status === 'Assigned' && req.pickupDate.split('T')[0] === today
      );
      setRoutes(todayRoutes);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateRequestStatus(id, status);
      toast.success(`Request marked as ${status}`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const markTaskCollected = async (id) => {
    try {
      await api.markTaskCollected(id);
      toast.success('Task marked as collected');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
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
      <h1 className="text-2xl font-bold text-primary mb-6">Worker Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assigned Tasks */}
        <div className="bg-darker rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">AI Assigned Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <img src={`http://localhost:5001${task.garbageReport?.imagePath}`} alt="Garbage" className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {task.latitude.toFixed(4)},<br />{task.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {new Date(task.scheduledTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {task.status === 'ASSIGNED' && (
                        <button
                          onClick={() => markTaskCollected(task.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md text-xs transition duration-200"
                        >
                          Collected
                        </button>
                      )}
                      {task.status === 'COLLECTED' && (
                        <span className="text-green-500 font-medium text-sm">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Requests */}
        <div className="bg-darker rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">My Assigned Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{request.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{request.garbageType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(request.pickupDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${getStatusColor(request.status)}`}>{request.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === 'Assigned' && (
                        <button
                          onClick={() => updateStatus(request.id, 'Collected')}
                          className="bg-primary hover:bg-secondary text-white font-bold py-1 px-3 rounded-md text-sm transition duration-200"
                        >
                          Mark Collected
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Route */}
        <div className="bg-darker rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Today's Route</h2>
          </div>
          <div className="p-6">
            {routes.length === 0 ? (
              <p className="text-gray-400">No pickups scheduled for today.</p>
            ) : (
              <ul className="space-y-4">
                {routes.map((route, index) => (
                  <li key={route.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-md">
                    <div>
                      <p className="font-medium">{route.address}</p>
                      <p className="text-sm text-gray-400">{route.garbageType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(route.pickupDate).toLocaleTimeString()}</p>
                      <span className={`text-sm font-medium ${getStatusColor(route.status)}`}>{route.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;