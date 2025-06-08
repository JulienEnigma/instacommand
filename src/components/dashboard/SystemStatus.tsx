
import React, { useState, useEffect } from 'react';

type SystemState = 'online' | 'offline' | 'reflex';

export const SystemStatus = () => {
  const [status, setStatus] = useState<SystemState>('online');

  useEffect(() => {
    // Mock status ping every 30 seconds
    const interval = setInterval(() => {
      const states: SystemState[] = ['online', 'online', 'online', 'reflex', 'offline'];
      setStatus(states[Math.floor(Math.random() * states.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-red-500',
          text: 'OPS RUNNING',
          pulse: true
        };
      case 'offline':
        return {
          color: 'bg-gray-500',
          text: 'OFFLINE',
          pulse: false
        };
      case 'reflex':
        return {
          color: 'bg-yellow-500',
          text: 'REFLEX REWRITE',
          pulse: true
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''} shadow-lg`}></div>
        <span className="text-xs font-bold tracking-wider text-red-300">{config.text}</span>
      </div>
      <div className="text-xs text-red-500/70 font-mono">
        {new Date().toLocaleTimeString('en-US', { hour12: false })}
      </div>
    </div>
  );
};
