
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, Target, Trophy, Crosshair } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  codename: string;
  status: 'active' | 'completed' | 'scheduled' | 'failed';
  progress: number;
  timeRemaining: string;
  target: number;
  current: number;
  description: string;
}

export const CampaignMode = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Operation: Ghost Reach',
      codename: 'GHOST_REACH',
      status: 'active',
      progress: 67,
      timeRemaining: '02:14:33',
      target: 100,
      current: 67,
      description: '100 new followers from film niche'
    },
    {
      id: '2',
      name: 'Operation: Shadow Network',
      codename: 'SHADOW_NET',
      status: 'scheduled',
      progress: 0,
      timeRemaining: '06:00:00',
      target: 50,
      current: 0,
      description: 'High-value photographer targets'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.status === 'active' && campaign.progress < 100) {
          const newProgress = Math.min(campaign.progress + Math.random() * 2, 100);
          return {
            ...campaign,
            progress: newProgress,
            current: Math.floor((newProgress / 100) * campaign.target)
          };
        }
        return campaign;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-600 animate-pulse';
      case 'completed': return 'bg-green-600';
      case 'scheduled': return 'bg-yellow-600';
      case 'failed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Crosshair className="mr-2 h-5 w-5 text-red-500" />
          CAMPAIGN OPERATIONS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="p-4 bg-red-950/20 border border-red-800/30 rounded backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-bold text-red-300">{campaign.name}</h4>
                  <Badge className={`${getStatusColor(campaign.status)} text-xs text-white`}>
                    {campaign.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 font-mono mb-1">
                  [{campaign.codename}]
                </div>
                <p className="text-sm text-gray-300">{campaign.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm font-bold text-red-300">
                  <Timer className="mr-1 h-3 w-3" />
                  {campaign.timeRemaining}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <Target className="mr-1 h-3 w-3" />
                  Progress
                </span>
                <span className="font-mono">
                  {campaign.current}/{campaign.target} ({campaign.progress.toFixed(0)}%)
                </span>
              </div>
              <Progress 
                value={campaign.progress} 
                className="h-2 bg-red-950/50"
              />
            </div>
            
            {campaign.status === 'completed' && (
              <div className="mt-3 flex items-center text-green-400 text-sm">
                <Trophy className="mr-1 h-3 w-3" />
                Mission Accomplished
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
