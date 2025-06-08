
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, Target } from 'lucide-react';

interface StanleyMessage {
  type: 'analysis' | 'alert' | 'recommendation' | 'status';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  data?: string;
}

export const StanleyInterface = () => {
  const [messages, setMessages] = useState<StanleyMessage[]>([
    {
      type: 'status',
      message: 'System optimized. Ready for operations.',
      timestamp: '14:32:18',
      priority: 'medium',
      data: 'Uptime: 4h 23m'
    },
    {
      type: 'recommendation',
      message: 'Higher engagement detected 18:00-22:00 for visual artists.',
      timestamp: '14:30:12',
      priority: 'high',
      data: '+34% response rate'
    }
  ]);

  const stanleyInsights: Omit<StanleyMessage, 'timestamp'>[] = [
    { 
      type: 'alert', 
      message: 'Engagement rate dropping. Switching to backup strategy.', 
      priority: 'high',
      data: '-12% last hour'
    },
    { 
      type: 'recommendation', 
      message: 'Optimal targeting window detected for film community.', 
      priority: 'medium',
      data: '847 active users'
    },
    { 
      type: 'analysis', 
      message: 'Comment patterns adjusted for higher authenticity score.', 
      priority: 'medium',
      data: '+8.5% effectiveness'
    },
    { 
      type: 'status', 
      message: 'Processing 847 new targets from hashtag analysis.', 
      priority: 'low',
      data: 'Queue: 847 pending'
    },
    { 
      type: 'alert', 
      message: 'Rate limit approaching. Implementing cooldown at 14:45.', 
      priority: 'high',
      data: '85% capacity'
    },
    { 
      type: 'recommendation', 
      message: '@filmfest.mythos follows 2 of your targets. Coordinated timing suggested.', 
      priority: 'medium',
      data: 'Mutual connections: 2'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const insight = stanleyInsights[Math.floor(Math.random() * stanleyInsights.length)];
      const newMessage: StanleyMessage = {
        ...insight,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };

      setMessages(prev => [...prev.slice(-4), newMessage]);
    }, Math.random() * 8000 + 5000);

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
      case 'analysis': return <Target className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Brain className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
          STANLEY AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 rounded border ${getPriorityColor(msg.priority)} animate-fade-in`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center space-x-2">
                {getTypeIcon(msg.type)}
                <Badge className="text-xs bg-red-900/30 text-red-300 border-red-700">
                  {msg.type.toUpperCase()}
                </Badge>
              </div>
              <span className="text-xs text-gray-500">{msg.timestamp}</span>
            </div>
            <div className="text-sm leading-relaxed mb-1">
              {msg.message}
            </div>
            {msg.data && (
              <div className="text-xs font-mono text-gray-400 mt-2 p-2 bg-black/40 rounded">
                {msg.data}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
