
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radar, MapPin, Info } from 'lucide-react';

interface RadarBlip {
  id: string;
  x: number;
  y: number;
  type: 'new_follower' | 'high_value' | 'lost' | 'active_target';
  intensity: number;
  label: string;
  timeActive: number; // minutes
  engagementLevel: number; // 0-100
  lastAction: string;
}

export const TacticalRadar = () => {
  const [blips, setBlips] = useState<RadarBlip[]>([
    { 
      id: '1', 
      x: 60, 
      y: 40, 
      type: 'high_value', 
      intensity: 0.9, 
      label: '@filmmaker_jane',
      timeActive: 45,
      engagementLevel: 85,
      lastAction: 'story viewed'
    },
    { 
      id: '2', 
      x: 30, 
      y: 70, 
      type: 'new_follower', 
      intensity: 0.7, 
      label: '@photo_mike',
      timeActive: 12,
      engagementLevel: 60,
      lastAction: 'followed back'
    },
    { 
      id: '3', 
      x: 80, 
      y: 20, 
      type: 'active_target', 
      intensity: 0.8, 
      label: '@visual_artist',
      timeActive: 120,
      engagementLevel: 75,
      lastAction: 'DM sent'
    },
    { 
      id: '4', 
      x: 45, 
      y: 85, 
      type: 'lost', 
      intensity: 0.3, 
      label: '@urban_explorer',
      timeActive: 5,
      engagementLevel: 20,
      lastAction: 'unfollowed'
    }
  ]);

  const [sweepAngle, setSweepAngle] = useState(0);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(null);
  const [hoveredBlip, setHoveredBlip] = useState<RadarBlip | null>(null);

  useEffect(() => {
    // Radar sweep animation
    const sweepInterval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 50);

    // Update blip positions and add new ones
    const blipInterval = setInterval(() => {
      const types: RadarBlip['type'][] = ['new_follower', 'high_value', 'active_target'];
      const actions = ['followed', 'DM sent', 'story viewed', 'post liked', 'comment left'];
      const newBlip: RadarBlip = {
        id: Date.now().toString(),
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        type: types[Math.floor(Math.random() * types.length)],
        intensity: Math.random() * 0.5 + 0.5,
        label: `@target_${Math.floor(Math.random() * 1000)}`,
        timeActive: Math.floor(Math.random() * 180),
        engagementLevel: Math.floor(Math.random() * 100),
        lastAction: actions[Math.floor(Math.random() * actions.length)]
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

  const getTypeDescription = (type: RadarBlip['type']) => {
    switch (type) {
      case 'new_follower': return 'Recently followed you back';
      case 'high_value': return 'High engagement potential';
      case 'lost': return 'Unfollowed or blocked';
      case 'active_target': return 'Currently being engaged';
      default: return 'Unknown status';
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center justify-between">
          <div className="flex items-center">
            <Radar className="mr-2 h-5 w-5 text-red-500" />
            TACTICAL RADAR
          </div>
          <Badge className="bg-red-900/30 text-red-300 border-red-700 text-xs">
            LIVE
          </Badge>
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

          {/* Clear axis labels */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-green-400 font-bold">
            HIGH ENGAGEMENT
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-bold">
            LOW ENGAGEMENT
          </div>
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-400 font-bold">
            RECENT
          </div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-yellow-400 font-bold">
            OLDER
          </div>

          {/* Radar sweep */}
          <div 
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, rgba(255, 0, 0, 0.1) 30deg, transparent 60deg)`,
              transform: 'rotate(0deg)'
            }}
          />

          {/* Blips with tooltips */}
          {blips.map((blip) => (
            <div
              key={blip.id}
              className={`absolute w-2 h-2 rounded-full ${getBlipColor(blip.type)} animate-pulse shadow-lg cursor-pointer hover:scale-150 transition-transform`}
              style={{
                left: `${blip.x}%`,
                top: `${blip.y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: blip.intensity
              }}
              onClick={() => setSelectedBlip(blip)}
              onMouseEnter={() => setHoveredBlip(blip)}
              onMouseLeave={() => setHoveredBlip(null)}
            />
          ))}

          {/* Hover tooltip */}
          {hoveredBlip && (
            <div 
              className="absolute bg-black/90 border border-red-800/50 rounded p-2 text-xs z-10 pointer-events-none"
              style={{
                left: `${hoveredBlip.x}%`,
                top: `${Math.max(10, hoveredBlip.y - 15)}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold text-red-300">{hoveredBlip.label}</div>
              <div className="text-gray-400">Last: {hoveredBlip.lastAction}</div>
              <div className="text-yellow-400">Engagement: {hoveredBlip.engagementLevel}%</div>
            </div>
          )}

          {/* Center dot */}
          <div className="absolute w-1 h-1 bg-red-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Selected blip details */}
        {selectedBlip && (
          <div className="mt-4 p-3 bg-red-950/20 border border-red-800/30 rounded">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-red-300">{selectedBlip.label}</span>
              <button 
                onClick={() => setSelectedBlip(null)}
                className="text-gray-500 hover:text-red-400"
              >
                ×
              </button>
            </div>
            <div className="text-xs space-y-1">
              <div>Status: {getTypeDescription(selectedBlip.type)}</div>
              <div>Last Action: {selectedBlip.lastAction}</div>
              <div>Active for: {selectedBlip.timeActive}m</div>
              <div>Engagement Level: {selectedBlip.engagementLevel}%</div>
            </div>
          </div>
        )}

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
            <span>Lost/Blocked</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          Hover blips for details. X-axis: Time active, Y-axis: Engagement level
        </div>
      </CardContent>
    </Card>
  );
};
