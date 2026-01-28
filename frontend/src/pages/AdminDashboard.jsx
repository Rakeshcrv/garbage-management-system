import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { getStatusBadge, formatDate, calculateWorkerStats } from '../utils/statusHelpers.jsx';
import ReportDetailModal from '../components/ReportDetailModal';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [activeSection, setActiveSection] = useState('pendingRequests');
  const [workerForm, setWorkerForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const openReportModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const loadData = async () => {
    try {
      const [reportsRes, workersRes] = await Promise.all([
        api.getGarbageReports(),
        api.getWorkerStats(),
      ]);

      console.log('Workers loaded:', workersRes.data);
      setReports(reportsRes.data);
      setWorkers(workersRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    }
  };

  const createWorker = async (e) => {
    e.preventDefault();
    try {
      await api.createUser({ ...workerForm, role: 'Worker' });
      toast.success('Worker added');
      setActiveSection('workers');
      setWorkerForm({ name: '', email: '', password: '' });
      loadData();
    } catch {
      toast.error('Failed to create worker');
    }
  };

  const deleteWorker = async (id) => {
    if (!confirm('Delete this worker?')) return;
    try {
      console.log('Deleting worker:', id);
      await api.deleteUser(id);
      toast.success('Worker deleted successfully');
      loadData();
    } catch (error) {
      console.error('Delete worker error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete worker';
      toast.error(errorMessage);
    }
  };

  const updateStatus = async (id, action) => {
    if (action === 'reject') {
      await api.updateGarbageReportStatus(id, 'reject', null);
      loadData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection('addWorker')}
          className={`px-4 py-2 rounded ${activeSection === 'addWorker' ? 'bg-primary text-white' : 'bg-gray-700'}`}
        >
          Add New Worker
        </button>
        <button
          onClick={() => setActiveSection('pendingRequests')}
          className={`px-4 py-2 rounded ${activeSection === 'pendingRequests' ? 'bg-primary text-white' : 'bg-gray-700'}`}
        >
          Pending Garbage Requests
        </button>
        <button
          onClick={() => setActiveSection('workers')}
          className={`px-4 py-2 rounded ${activeSection === 'workers' ? 'bg-primary text-white' : 'bg-gray-700'}`}
        >
          Workers
        </button>
      </div>

      {activeSection === 'addWorker' && (
        <form onSubmit={createWorker} className="bg-darker p-4 rounded space-y-4">
          <h2 className="p-4 font-bold">Add New Worker</h2>
          <input
            placeholder="Name"
            className="w-full p-2 bg-gray-800 rounded"
            value={workerForm.name}
            onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            className="w-full p-2 bg-gray-800 rounded"
            value={workerForm.email}
            onChange={e => setWorkerForm({ ...workerForm, email: e.target.value })}
            required
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full p-2 bg-gray-800 rounded"
            value={workerForm.password}
            onChange={e => setWorkerForm({ ...workerForm, password: e.target.value })}
            required
          />
          <button className="bg-green-600 px-4 py-2 rounded">Create</button>
        </form>
      )}

      {activeSection === 'pendingRequests' && (
        <div className="bg-darker rounded overflow-hidden">
          <h2 className="p-4 font-bold">Pending Garbage Reports</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Citizen</th>
                <th className="p-2">Photo</th>
                <th className="p-2">Location</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports
                .filter(r => r.status === 'REPORTED')
                .map(r => (
                  <tr key={r.id}>
                    <td className="p-2 font-mono text-xs">{r.id}</td>
                    <td className="p-2">{r.citizen?.name}</td>
                    <td className="p-2">
                      <img
                        src={`http://localhost:5001${r.imagePath}`}
                        className="w-16 h-16 rounded object-cover cursor-pointer"
                        onClick={() => setSelectedImage(`http://localhost:5001${r.imagePath}`)}
                      />
                    </td>
                    <td className="p-2">
                      <a
                        href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                        target="_blank"
                        className="text-blue-400"
                      >
                        View Map
                      </a>
                    </td>
                    <td className="p-2">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => openReportModal(r)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, 'reject')}
                        className="bg-red-600 px-2 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'workers' && (
        <div className="bg-darker rounded overflow-hidden">
          <h2 className="p-4 font-bold">Workers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {workers.map(w => {
              const stats = calculateWorkerStats(w);
              return (
                <div key={w.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{w.name}</h3>
                        <p className="text-xs text-gray-400">{w.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">{stats.efficiency}%</div>
                      <div className="text-xs text-gray-400">Efficiency</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-700 rounded p-2 text-center">
                      <div className="text-lg font-bold text-green-400">{stats.activeAssignments}</div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                    <div className="bg-gray-700 rounded p-2 text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.completedAssignments}</div>
                      <div className="text-xs text-gray-400">Completed</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Workload</span>
                      <span>{stats.workloadPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(stats.workloadPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteWorker(w.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm transition"
                  >
                    Delete Worker
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative">
            <img src={selectedImage} className="max-h-[90vh] max-w-[90vw]"/>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        report={selectedReport}
        workers={workers}
        onUpdate={loadData}
      />
    </div>
  );
};

export default AdminDashboard;
