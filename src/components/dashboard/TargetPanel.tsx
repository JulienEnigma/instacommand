
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Users, MapPin, TrendingUp, Heart } from 'lucide-react';

interface TargetProfile {
  id: string;
  username: string;
  displayName: string;
  followers: number;
  followbackLikelihood: number;
  tags: string[];
  lastEngagement: string;
  location?: string;
  mutualConnections: number;
  engagementRate: number;
  status: 'queued' | 'active' | 'completed' | 'high-value';
}

export const TargetPanel = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'nearby' | 'high-value'>('all');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [targets, setTargets] = useState<TargetProfile[]>([
    {
      id: '1',
      username: '@julien_film',
      displayName: 'Julien Moreau',
      followers: 2847,
      followbackLikelihood: 89,
      tags: ['photography', 'urban', 'street'],
      lastEngagement: '2 min ago',
      location: 'Paris, FR',
      mutualConnections: 3,
      engagementRate: 4.2,
      status: 'high-value'
    },
    {
      id: '2',
      username: '@alice.k',
      displayName: 'Alice Kim',
      followers: 1203,
      followbackLikelihood: 76,
      tags: ['film', 'indie', 'festival'],
      lastEngagement: '8 min ago',
      mutualConnections: 1,
      engagementRate: 3.8,
      status: 'active'
    },
    {
      id: '3',
      username: '@urban_lens',
      displayName: 'Urban Lens',
      followers: 4521,
      followbackLikelihood: 94,
      tags: ['street', 'documentary', 'city'],
      lastEngagement: '15 min ago',
      location: 'NYC, US',
      mutualConnections: 5,
      engagementRate: 5.1,
      status: 'high-value'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high-value': return 'bg-purple-600/30 text-purple-300 border-purple-600/50';
      case 'active': return 'bg-green-600/30 text-green-300 border-green-600/50';
      case 'completed': return 'bg-blue-600/30 text-blue-300 border-blue-600/50';
      default: return 'bg-gray-600/30 text-gray-300 border-gray-600/50';
    }
  };

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood >= 85) return 'text-green-400';
    if (likelihood >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredTargets = targets.filter(target => {
    switch (activeTab) {
      case 'nearby': return target.location;
      case 'high-value': return target.status === 'high-value';
      default: return true;
    }
  });

  const selectedTargetData = targets.find(t => t.id === selectedTarget);

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Target className="mr-2 h-5 w-5 text-red-500" />
          TARGET INTELLIGENCE
        </CardTitle>
        
        <div className="flex space-x-1">
          {['all', 'nearby', 'high-value'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              size="sm"
              variant={activeTab === tab ? 'default' : 'outline'}
              className={`text-xs ${
                activeTab === tab 
                  ? 'bg-red-700 text-white' 
                  : 'bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30'
              }`}
            >
              {tab.toUpperCase().replace('-', ' ')}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-120px)]">
        <ScrollArea className="h-full">
          <div className="space-y-3">
            {filteredTargets.map((target) => (
              <div 
                key={target.id}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  selectedTarget === target.id 
                    ? 'border-red-500 bg-red-950/20' 
                    : 'border-red-800/20 bg-black/40 hover:border-red-700/50'
                }`}
                onClick={() => setSelectedTarget(selectedTarget === target.id ? null : target.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-red-300">{target.username}</div>
                    <div className="text-xs text-gray-400">{target.displayName}</div>
                  </div>
                  <Badge className={getStatusColor(target.status)}>
                    {target.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{target.followers.toLocaleString()}</span>
                    </div>
                    {target.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{target.location}</span>
                      </div>
                    )}
                  </div>
                  <span className={`font-bold ${getLikelihoodColor(target.followbackLikelihood)}`}>
                    {target.followbackLikelihood}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {target.tags.map((tag) => (
                    <Badge key={tag} className="bg-gray-700/50 text-gray-300 text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {selectedTarget === target.id && (
                  <div className="border-t border-red-800/20 pt-2 mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Mutual Connections:</span>
                        <span className="text-blue-400 ml-1 font-bold">{target.mutualConnections}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Engagement Rate:</span>
                        <span className="text-green-400 ml-1 font-bold">{target.engagementRate}%</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">Last Engagement:</span>
                      <span className="text-yellow-400 ml-1">{target.lastEngagement}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
