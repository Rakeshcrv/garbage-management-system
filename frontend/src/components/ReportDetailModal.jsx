import React, { useState } from 'react';
import Modal from './Modal';
import Timeline from './Timeline';
import { getStatusBadge, formatDate, GARBAGE_TYPE_ICONS } from '../utils/statusHelpers.jsx';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const ReportDetailModal = ({ isOpen, onClose, report, workers, onUpdate }) => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!selectedWorker) {
      toast.error('Please select a worker to assign');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Approving report:', report.id, 'with worker:', selectedWorker);
      
      // Find the selected worker's name for the success message
      const selectedWorkerData = workers.find(w => w.id === parseInt(selectedWorker));
      const workerName = selectedWorkerData ? selectedWorkerData.name : 'worker';
      
      const response = await api.updateGarbageReportStatus(report.id, 'approve', selectedWorker);
      console.log('Approve response:', response.data);
      
      toast.success(`Work assigned to ${workerName}`);
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Approve error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to approve report';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setLoading(true);
    try {
      await api.updateGarbageReportStatus(report.id, 'reject', null, adminNotes);
      toast.success('Report rejected');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to reject report');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedWorker) {
      toast.error('Please select a worker');
      return;
    }
    
    setLoading(true);
    try {
      await api.updateGarbageReportStatus(report.id, 'assign', selectedWorker);
      toast.success('Worker assigned successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to assign worker');
    } finally {
      setLoading(false);
    }
  };

  if (!report) return null;

  const canApprove = report.status === 'REPORTED';
  const canAssign = report.status === 'APPROVED';
  const canReject = ['REPORTED', 'APPROVED'].includes(report.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Details" wide>
      <div className="space-y-6">
        {/* Report Header */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-bold text-white">#{report.id}</span>
          {getStatusBadge(report.status)}
        </div>

        {/* Image */}
        {report.imagePath && (
          <div className="text-center">
            <img
              src={`http://localhost:5001${report.imagePath}`}
              alt="Garbage Report"
              className="max-h-64 rounded-lg mx-auto object-cover"
            />
          </div>
        )}

        {/* Report Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Citizen</label>
            <p className="font-medium text-white">{report.citizen?.name || 'Unknown'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Garbage Type</label>
            <p className="font-medium text-white">
              {GARBAGE_TYPE_ICONS[report.garbageType] || '🗑️'} {report.garbageType}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Reported Date</label>
            <p className="font-medium text-white">{formatDate(report.createdAt)}</p>
          </div>
          {report.preferredDate && (
            <div>
              <label className="text-sm text-gray-400">Preferred Date</label>
              <p className="font-medium text-white">{formatDate(report.preferredDate)}</p>
            </div>
          )}
          {report.address && (
            <div className="col-span-2">
              <label className="text-sm text-gray-400">Address</label>
              <p className="font-medium text-white">{report.address}</p>
            </div>
          )}
          {report.notes && (
            <div className="col-span-2">
              <label className="text-sm text-gray-400">Notes</label>
              <p className="font-medium text-white italic">"{report.notes}"</p>
            </div>
          )}
          {report.adminNotes && (
            <div className="col-span-2">
              <label className="text-sm text-gray-400">Admin Notes</label>
              <p className="font-medium text-white italic">"{report.adminNotes}"</p>
            </div>
          )}
          <div className="col-span-2">
            <label className="text-sm text-gray-400">Location</label>
            <a
              href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </a>
          </div>
        </div>

        {/* Timeline */}
        {report.statusHistory && (
          <div>
            <h4 className="font-semibold text-white mb-3">Status Timeline</h4>
            <Timeline statusHistory={report.statusHistory} />
          </div>
        )}

        {/* Admin Actions */}
        {canApprove && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-300 mb-3">⏳ Assign this request to a worker for collection</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Worker for Assignment
                </label>
                <select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                >
                  <option value="">-- Select Worker --</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.activeAssignments || 0} active tasks)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={loading || !selectedWorker}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Processing...' : selectedWorker ? `Assign to ${workers.find(w => w.id === parseInt(selectedWorker))?.name || 'Worker'}` : 'Select Worker First'}
                </button>
                <button
                  onClick={() => document.getElementById('reject-section').classList.remove('hidden')}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {canAssign && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <p className="text-sm text-green-300 mb-3">✓ Request approved - Now assign a worker</p>
            <div className="flex gap-2">
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
              >
                <option value="">Select worker...</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.activeAssignments || 0} active tasks)
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        )}

        {/* Reject Section */}
        {canReject && (
          <div id="reject-section" className="hidden">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-sm text-red-300 mb-3">Are you sure you want to reject this request?</p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for rejection
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                  placeholder="Provide a reason..."
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => document.getElementById('reject-section').classList.add('hidden')}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed/Rejected Status */}
        {(['COMPLETED', 'REJECTED'].includes(report.status)) && (
          <div className={`text-center p-4 rounded-lg ${
            report.status === 'COMPLETED' 
              ? 'bg-green-900/20 border border-green-700' 
              : 'bg-red-900/20 border border-red-700'
          }`}>
            <p className={`font-medium ${
              report.status === 'COMPLETED' ? 'text-green-300' : 'text-red-300'
            }`}>
              {report.status === 'COMPLETED' ? '✅ This request has been completed' : '❌ This request was rejected'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReportDetailModal;
