
import React from 'react';

interface MetricsData {
  profileViews: number;
  storyViews: number;
  engagementRate: number;
  lastUpdate: string;
}

interface MetricsViewProps {
  stats: MetricsData;
}

export const MetricsView: React.FC<MetricsViewProps> = ({ stats }) => {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-red-950/20 border border-red-800/30 rounded">
        <div className="text-sm font-bold mb-2">Last 24 Hours</div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>New followers:</span>
            <span className="text-green-400 font-mono">+12</span>
          </div>
          <div className="flex justify-between">
            <span>Profile visits:</span>
            <span className="text-blue-400 font-mono">+{stats.profileViews}</span>
          </div>
          <div className="flex justify-between">
            <span>Story views:</span>
            <span className="text-yellow-400 font-mono">+{stats.storyViews}</span>
          </div>
          <div className="flex justify-between">
            <span>Engagement rate:</span>
            <span className="text-purple-400 font-mono">{stats.engagementRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Last sync: {stats.lastUpdate}
      </div>
    </div>
  );
};
