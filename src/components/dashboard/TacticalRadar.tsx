
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, MapPin } from 'lucide-react';

interface RadarBlip {
  id: string;
  x: number;
  y: number;
  type: 'new_follower' | 'high_value' | 'lost' | 'active_target';
  intensity: number;
  label: string;
}

export const TacticalRadar = () => {
  const [blips, setBlips] = useState<RadarBlip[]>([
    { id: '1', x: 60, y: 40, type: 'high_value', intensity: 0.9, label: '@filmmaker_jane' },
    { id: '2', x: 30, y: 70, type: 'new_follower', intensity: 0.7, label: '@photo_mike' },
    { id: '3', x: 80, y: 20, type: 'active_target', intensity: 0.8, label: '@visual_artist' },
    { id: '4', x: 45, y: 85, type: 'lost', intensity: 0.3, label: '@urban_explorer' }
  ]);

  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    // Radar sweep animation
    const sweepInterval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 50);

    // Add new blips occasionally
    const blipInterval = setInterval(() => {
      const types: RadarBlip['type'][] = ['new_follower', 'high_value', 'active_target'];
      const newBlip: RadarBlip = {
        id: Date.now().toString(),
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        type: types[Math.floor(Math.random() * types.length)],
        intensity: Math.random() * 0.5 + 0.5,
        label: `@target_${Math.floor(Math.random() * 1000)}`
      };

      setBlips(prev => [...prev.slice(-8), newBlip]);
    }, 8000);

    return () => {
      clearInterval(sweepInterval);
      clearInterval(blipInterval);
    };
  }, []);

  const getBlipColor = (type: RadarBlip['type']) => {
    switch (type) {
      case 'new_follower': return 'bg-green-500 shadow-green-500/50';
      case 'high_value': return 'bg-yellow-500 shadow-yellow-500/50';
      case 'lost': return 'bg-red-500 shadow-red-500/50';
      case 'active_target': return 'bg-blue-500 shadow-blue-500/50';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Radar className="mr-2 h-5 w-5 text-red-500" />
          TACTICAL RADAR
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48 bg-black/80 rounded border border-red-800/30 overflow-hidden">
          {/* Radar grid */}
          <div className="absolute inset-0">
            {/* Concentric circles */}
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="absolute border border-red-800/20 rounded-full"
                style={{
                  width: `${i * 25}%`,
                  height: `${i * 25}%`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
            
            {/* Cross lines */}
            <div className="absolute w-full h-px bg-red-800/20 top-1/2 transform -translate-y-1/2" />
            <div className="absolute h-full w-px bg-red-800/20 left-1/2 transform -translate-x-1/2" />
          </div>

          {/* Radar sweep */}
          <div 
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, rgba(255, 0, 0, 0.1) 30deg, transparent 60deg)`,
              transform: 'rotate(0deg)'
            }}
          />

          {/* Blips */}
          {blips.map((blip) => (
            <div
              key={blip.id}
              className={`absolute w-2 h-2 rounded-full ${getBlipColor(blip.type)} animate-pulse shadow-lg`}
              style={{
                left: `${blip.x}%`,
                top: `${blip.y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: blip.intensity
              }}
              title={blip.label}
            />
          ))}

          {/* Center dot */}
          <div className="absolute w-1 h-1 bg-red-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>New Followers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>High Value</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Active Targets</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Lost</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
