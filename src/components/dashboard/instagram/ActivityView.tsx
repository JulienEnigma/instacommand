
import React from 'react';

interface RecentActivity {
  action: string;
  target: string;
  timestamp: string;
  outcome: 'success' | 'pending' | 'failed';
}

interface ActivityViewProps {
  recentActivity: RecentActivity[];
}

export const ActivityView: React.FC<ActivityViewProps> = ({ recentActivity }) => {
  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-bold mb-3">Recent Actions</div>
      {recentActivity.map((activity, index) => (
        <div key={index} className="p-2 bg-black/40 border border-red-800/20 rounded text-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className={getOutcomeColor(activity.outcome)}>
                {activity.action}
              </span>
              <span className="text-red-300 ml-1">{activity.target}</span>
            </div>
            <span className="text-gray-500">{activity.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
