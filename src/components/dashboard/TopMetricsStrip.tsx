
import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Users, MessageSquare, Clock } from 'lucide-react';

interface SystemMetrics {
  opsStatus: 'running' | 'paused' | 'error';
  newFollowers: number;
  dmsSent: number;
  cpuUsage: number;
  memoryUsage: number;
  reflexUpdateCountdown: number;
}

export const TopMetricsStrip = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    opsStatus: 'running',
    newFollowers: 13,
    dmsSent: 4,
    cpuUsage: 42,
    memoryUsage: 48,
    reflexUpdateCountdown: 17940 // 4h 59m in seconds
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        newFollowers: prev.newFollowers + Math.floor(Math.random() * 2),
        dmsSent: prev.dmsSent + Math.floor(Math.random() * 2),
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        reflexUpdateCountdown: Math.max(0, prev.reflexUpdateCountdown - 1)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900/90 border-b border-red-800/30 px-6 py-2 backdrop-blur-md">
      <div className="flex items-center justify-between text-sm font-mono">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${metrics.opsStatus === 'running' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
            <span className={getStatusColor(metrics.opsStatus)}>
              OPS: {metrics.opsStatus.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-red-300">Followers: </span>
            <span className="text-green-400 font-bold">+{metrics.newFollowers}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-purple-400" />
            <span className="text-red-300">DMs: </span>
            <span className="text-blue-400 font-bold">{metrics.dmsSent}</span>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-orange-400" />
              <span className="text-red-300">CPU: </span>
              <span className={`font-bold ${metrics.cpuUsage > 70 ? 'text-red-400' : 'text-green-400'}`}>
                {metrics.cpuUsage}%
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-cyan-400" />
              <span className="text-red-300">Memory: </span>
              <span className={`font-bold ${metrics.memoryUsage > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                {metrics.memoryUsage}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-red-300">Reflex Update: </span>
            <span className="text-yellow-400 font-bold">{formatCountdown(metrics.reflexUpdateCountdown)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
