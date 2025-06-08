
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cpu, Zap, RefreshCw } from 'lucide-react';

interface ReflexUpdate {
  timestamp: string;
  module: string;
  change: string;
  impact: number;
}

export const ReflexNode = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [recentUpdates, setRecentUpdates] = useState<ReflexUpdate[]>([
    {
      timestamp: '14:28:15',
      module: 'Comment Strategy',
      change: 'Enhanced authenticity patterns',
      impact: 8.2
    },
    {
      timestamp: '14:15:03',
      module: 'Target Selection',
      change: 'Optimized for visual artists',
      impact: 9.1
    }
  ]);

  const reflexModules = [
    'Comment Strategy',
    'Target Selection',
    'Engagement Timing',
    'Content Analysis',
    'Behavioral Adaptation'
  ];

  useEffect(() => {
    // Simulate self-updates
    const updateInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every interval
        setIsUpdating(true);
        setUpdateProgress(0);
        
        const updateProgressInterval = setInterval(() => {
          setUpdateProgress(prev => {
            if (prev >= 100) {
              clearInterval(updateProgressInterval);
              setIsUpdating(false);
              
              // Add new update to history
              const module = reflexModules[Math.floor(Math.random() * reflexModules.length)];
              const changes = [
                'Enhanced pattern recognition',
                'Optimized targeting algorithms',
                'Improved response authenticity',
                'Updated engagement timing',
                'Refined content analysis'
              ];
              
              const newUpdate: ReflexUpdate = {
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                module,
                change: changes[Math.floor(Math.random() * changes.length)],
                impact: Math.random() * 3 + 7
              };
              
              setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
              return 0;
            }
            return prev + Math.random() * 15 + 5;
          });
        }, 200);
      }
    }, 2000);

    return () => clearInterval(updateInterval);
  }, []);

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-red-500" />
          REFLEX NODE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Update Status */}
        <div className="p-3 bg-red-950/20 border border-red-800/30 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">Self-Improvement Status</span>
            <Badge className={`${isUpdating ? 'bg-yellow-600 animate-pulse' : 'bg-green-600'} text-xs`}>
              {isUpdating ? 'UPDATING' : 'STABLE'}
            </Badge>
          </div>
          
          {isUpdating && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Rewriting Neural Pathways...</span>
                <span>{Math.floor(updateProgress)}%</span>
              </div>
              <Progress value={updateProgress} className="h-1 bg-red-950/50" />
            </div>
          )}
        </div>

        {/* Recent Updates */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-red-300">Recent Self-Modifications</h4>
          {recentUpdates.map((update, index) => (
            <div key={index} className="p-2 bg-black/40 border border-red-800/20 rounded text-xs">
              <div className="flex items-start justify-between mb-1">
                <span className="font-mono text-gray-400">[{update.timestamp}]</span>
                <Badge className="bg-purple-600/30 text-purple-300 text-xs">
                  +{update.impact.toFixed(1)}%
                </Badge>
              </div>
              <div className="text-red-300 font-bold">{update.module}</div>
              <div className="text-gray-300">{update.change}</div>
            </div>
          ))}
        </div>

        {/* Neural Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-red-300">Neural Activity</h4>
          <div className="grid grid-cols-3 gap-2">
            {['Logic', 'Learning', 'Adaptation'].map((activity) => (
              <div key={activity} className="text-center">
                <div className={`w-6 h-6 mx-auto mb-1 rounded-full ${
                  Math.random() > 0.5 ? 'bg-green-500 animate-pulse' : 'bg-red-800'
                }`}></div>
                <div className="text-xs">{activity}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
