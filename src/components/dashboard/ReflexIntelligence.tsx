
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Cpu, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface StanleyMessage {
  type: 'analysis' | 'alert' | 'recommendation' | 'status';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export const ReflexIntelligence = () => {
  const [stanleyMessages, setStanleyMessages] = useState<StanleyMessage[]>([
    {
      type: 'recommendation',
      message: 'Higher engagement 18:00-22:00 for visual artists',
      timestamp: '14:32:18',
      priority: 'high'
    }
  ]);

  const [reflexStatus, setReflexStatus] = useState({
    isUpdating: false,
    updateProgress: 0,
    lastUpdate: 'v2.1.4',
    neuralActivity: { logic: true, learning: true, adaptation: false }
  });

  const stanleyInsights = [
    { type: 'alert', message: 'Engagement rate dropping. Switching strategy.', priority: 'high' },
    { type: 'recommendation', message: 'Optimal window detected for film community.', priority: 'medium' },
    { type: 'analysis', message: 'Comment patterns adjusted for authenticity.', priority: 'medium' },
    { type: 'status', message: '847 new targets from hashtag analysis.', priority: 'low' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const insight = stanleyInsights[Math.floor(Math.random() * stanleyInsights.length)];
      const newMessage: StanleyMessage = {
        ...insight,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      } as StanleyMessage;

      setStanleyMessages(prev => [newMessage, ...prev.slice(0, 2)]);
      
      // Randomly trigger reflex updates
      if (Math.random() > 0.98) {
        setReflexStatus(prev => ({ ...prev, isUpdating: true, updateProgress: 0 }));
        
        const progressInterval = setInterval(() => {
          setReflexStatus(prev => {
            if (prev.updateProgress >= 100) {
              clearInterval(progressInterval);
              return { ...prev, isUpdating: false, updateProgress: 0 };
            }
            return { ...prev, updateProgress: prev.updateProgress + Math.random() * 15 + 5 };
          });
        }, 200);
      }
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-3 w-3" />;
      case 'recommendation': return <TrendingUp className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Brain className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
          REFLEX INTELLIGENCE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stanley Section */}
        <div className="space-y-2">
          <div className="text-sm font-bold text-red-300 mb-2">Stanley AI Insights</div>
          {stanleyMessages.map((msg, index) => (
            <div key={index} className={`p-2 rounded border ${getPriorityColor(msg.priority)} animate-fade-in`}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(msg.type)}
                  <Badge className="text-xs bg-red-900/30 text-red-300 border-red-700">
                    {msg.type.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <div className="text-xs leading-relaxed">{msg.message}</div>
            </div>
          ))}
        </div>

        {/* Reflex Status Section */}
        <div className="space-y-2 border-t border-red-800/20 pt-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-red-300 flex items-center">
              <Cpu className="mr-2 h-4 w-4" />
              Reflex Node Status
            </div>
            <Badge className={`text-xs ${reflexStatus.isUpdating ? 'bg-yellow-600 animate-pulse' : 'bg-green-600'}`}>
              {reflexStatus.isUpdating ? 'UPDATING' : 'STABLE'}
            </Badge>
          </div>
          
          {reflexStatus.isUpdating && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Neural pathway optimization...</span>
                <span>{Math.floor(reflexStatus.updateProgress)}%</span>
              </div>
              <Progress value={reflexStatus.updateProgress} className="h-1 bg-red-950/50" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-2">
            {Object.entries(reflexStatus.neuralActivity).map(([activity, active]) => (
              <div key={activity} className="text-center">
                <div className={`w-4 h-4 mx-auto mb-1 rounded-full ${
                  active ? 'bg-green-500 animate-pulse' : 'bg-red-800'
                }`}></div>
                <div className="text-xs capitalize">{activity}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
