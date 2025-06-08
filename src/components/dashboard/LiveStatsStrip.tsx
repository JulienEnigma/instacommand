
import React, { useState, useEffect } from 'react';

interface Stats {
  currentTargets: number;
  newFollowersToday: number;
  dmsSent: number;
  lastReflexUpdate: string;
  stanleyStatus: string;
}

export const LiveStatsStrip = () => {
  const [stats, setStats] = useState<Stats>({
    currentTargets: 31,
    newFollowersToday: 12,
    dmsSent: 4,
    lastReflexUpdate: '6h ago',
    stanleyStatus: 'ACTIVE'
  });

  useEffect(() => {
    // Mock auto-refresh every 20 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentTargets: Math.floor(Math.random() * 50) + 20,
        newFollowersToday: prev.newFollowersToday + Math.floor(Math.random() * 2),
        dmsSent: prev.dmsSent + Math.floor(Math.random() * 2),
      }));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-8 text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-red-500/70">TARGETS:</span>
        <span className="text-red-300 font-bold font-mono">{stats.currentTargets}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-red-500/70">NEW FOLLOWERS:</span>
        <span className="text-red-300 font-bold font-mono">{stats.newFollowersToday}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-red-500/70">DMS SENT:</span>
        <span className="text-red-300 font-bold font-mono">{stats.dmsSent}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-red-500/70">STANLEY:</span>
        <span className="text-green-400 font-bold font-mono animate-pulse">{stats.stanleyStatus}</span>
      </div>
    </div>
  );
};
