// Status configuration and utilities
export const STATUS_CONFIG = {
  REPORTED: {
    label: 'Reported',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '📝'
  },
  APPROVED: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
    icon: '✅'
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'bg-blue-100 text-blue-800',
    icon: '👷'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-purple-100 text-purple-800',
    icon: '🔄'
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-600 text-white',
    icon: '✅'
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: '❌'
  },
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳'
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'bg-blue-100 text-blue-800',
    icon: '👷'
  },
  COLLECTED: {
    label: 'Collected',
    color: 'bg-green-600 text-white',
    icon: '✅'
  }
};

// Garbage type icons
export const GARBAGE_TYPE_ICONS = {
  'dry': '📦',
  'wet': '🥬',
  'mixed': '🗑️',
  'hazardous': '☢️',
  'e-waste': '💻',
  'Dry': '📦',
  'Wet': '🥬',
  'E-waste': '💻'
};

// Status badge component
export const getStatusBadge = (status) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800',
    icon: '📋'
  };
  
  return (
    <span className={`status-badge ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
};

// Format date utilities
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Timeline utilities
export const formatTimelineEntry = (entry) => {
  return {
    status: entry.status,
    timestamp: formatDateTime(entry.timestamp),
    note: entry.note,
    icon: STATUS_CONFIG[entry.status]?.icon || '📋'
  };
};

// Worker statistics utilities
export const calculateWorkerStats = (worker) => {
  const activeAssignments = worker.activeAssignments || 0;
  const completedAssignments = worker.completedAssignments || 0;
  const efficiency = worker.efficiency || 0;
  const maxTasks = worker.maxTasks || 10;
  
  return {
    activeAssignments,
    completedAssignments,
    efficiency,
    maxTasks,
    workloadPercentage: Math.round((activeAssignments / maxTasks) * 100),
    availability: maxTasks - activeAssignments
  };
};
