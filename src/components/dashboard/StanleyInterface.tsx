
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, AlertTriangle } from 'lucide-react';

interface StanleyMessage {
  type: 'status' | 'warning' | 'insight' | 'decision';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export const StanleyInterface = () => {
  const [messages, setMessages] = useState<StanleyMessage[]>([
    {
      type: 'status',
      message: 'Neural pathways optimized. Ready for operations.',
      timestamp: '14:32:18',
      priority: 'medium'
    },
    {
      type: 'insight',
      message: 'Detecting higher engagement from visual artists 18:00-22:00.',
      timestamp: '14:30:12',
      priority: 'high'
    }
  ]);

  const stanleyThoughts = [
    { type: 'warning', message: 'Engagement levels dropping. Switching to fallback strategy.', priority: 'high' },
    { type: 'insight', message: 'Optimal targeting window detected for film community.', priority: 'medium' },
    { type: 'decision', message: 'Adjusting comment patterns for higher authenticity.', priority: 'medium' },
    { type: 'status', message: 'Processing 847 new potential targets from hashtag sweep.', priority: 'low' },
    { type: 'warning', message: 'Rate limit approaching. Implementing cool-down protocol.', priority: 'high' },
    { type: 'insight', message: 'User behavioral pattern suggests peak activity in 2 hours.', priority: 'medium' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const thought = stanleyThoughts[Math.floor(Math.random() * stanleyThoughts.length)];
      const newMessage: StanleyMessage = {
        ...thought,
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
      case 'warning': return <AlertTriangle className="h-3 w-3" />;
      case 'insight': return <Brain className="h-3 w-3" />;
      case 'decision': return <Zap className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Brain className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
          STANLEY NEURAL INTERFACE
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
            <div className="text-sm font-mono leading-relaxed">
              [Stanley] {msg.message}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
