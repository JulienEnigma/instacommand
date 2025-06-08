
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from 'lucide-react';

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
      case 'active': return 'bg-green-600/30 text-green-300 border-green-600';
      case 'completed': return 'bg-blue-600/30 text-blue-300 border-blue-600';
      case 'queued': return 'bg-yellow-600/30 text-yellow-300 border-yellow-600';
      default: return 'bg-gray-600/30 text-gray-300 border-gray-600';
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Users className="mr-2 h-5 w-5 text-red-500" />
          TARGET INTELLIGENCE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {targets.map((target, index) => (
              <div key={index} className="p-3 bg-red-950/20 border border-red-800/30 rounded animate-fade-in">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-red-300 break-all">{target.username}</span>
                  <Badge className={`${getStatusColor(target.status)} text-xs border`}>
                    {target.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div className="text-red-400/70 break-words">{target.bio}</div>
                  <div className="text-red-500/70 break-words">📍 {target.location}</div>
                  <div className="text-yellow-400 font-mono break-words">→ {target.strategy}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
