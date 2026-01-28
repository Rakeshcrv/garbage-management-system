import React from 'react';
import { formatDateTime } from '../utils/statusHelpers.jsx';

const Timeline = ({ statusHistory, className = '' }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className={`text-center py-4 text-gray-500 ${className}`}>
        No status history available
      </div>
    );
  }

  const history = Array.isArray(statusHistory) ? statusHistory : JSON.parse(statusHistory);

  return (
    <div className={`timeline-container ${className}`}>
      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold capitalize text-white">
                  {entry.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDateTime(entry.timestamp)}
                </span>
              </div>
              {entry.note && (
                <p className="text-sm text-gray-300 italic">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
