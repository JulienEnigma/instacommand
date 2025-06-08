
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Target {
  username: string;
  bio: string;
  location: string;
  strategy: string;
  status: 'queued' | 'active' | 'completed';
}

export const TargetIntelligence = () => {
  const [targets, setTargets] = useState<Target[]>([
    {
      username: '@julien_film',
      bio: 'Film director, visual storyteller',
      location: 'Los Angeles, CA',
      strategy: 'FOLLOW + STORY_VIEW',
      status: 'active'
    },
    {
      username: '@alice.k',
      bio: 'Creative photographer, coffee enthusiast',
      location: 'Brooklyn, NY',
      strategy: 'STORY_VIEW + DM',
      status: 'queued'
    },
    {
      username: '@filmfest.mythos',
      bio: 'Independent film festival curator',
      location: 'Austin, TX',
      strategy: 'FOLLOW + ENGAGE',
      status: 'completed'
    },
    {
      username: '@urban_lens',
      bio: 'Street photography, urban exploration',
      location: 'Berlin, DE',
      strategy: 'FOLLOW',
      status: 'queued'
    }
  ]);

  useEffect(() => {
    // Mock target updates
    const interval = setInterval(() => {
      setTargets(prev => prev.map(target => 
        Math.random() > 0.9 ? 
          { ...target, status: target.status === 'queued' ? 'active' : target.status } : 
          target
      ));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'completed': return 'bg-blue-600';
      case 'queued': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-900 border-green-800 text-green-400">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider">TARGET INTELLIGENCE</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {targets.map((target, index) => (
              <div key={index} className="p-3 bg-black border border-green-800 rounded">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-green-300">{target.username}</span>
                  <Badge className={`${getStatusColor(target.status)} text-xs`}>
                    {target.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div className="text-gray-400">{target.bio}</div>
                  <div className="text-gray-500">📍 {target.location}</div>
                  <div className="text-yellow-400 font-mono">→ {target.strategy}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
