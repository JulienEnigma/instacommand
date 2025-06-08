
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Target, Trophy, Archive, Play, Pause, Copy } from 'lucide-react';
import { Campaign } from './types';
import { getStatusColor } from './utils';

interface CampaignItemProps {
  campaign: Campaign;
  onArchive: (id: string) => void;
  onPause: (id: string) => void;
  onDuplicate: (campaign: Campaign) => void;
}

export const CampaignItem = ({ campaign, onArchive, onPause, onDuplicate }: CampaignItemProps) => {
  return (
    <div className="p-4 bg-red-950/20 border border-red-800/30 rounded backdrop-blur-sm">
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
          {campaign.status !== 'archived' && (
            <div className="flex items-center text-sm font-bold text-red-300">
              <Timer className="mr-1 h-3 w-3" />
              {campaign.timeRemaining}
            </div>
          )}
          {campaign.completedAt && (
            <div className="text-xs text-green-400">
              Completed: {campaign.completedAt}
            </div>
          )}
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
      
      {campaign.status === 'completed' && campaign.verdict && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-green-400 text-sm">
            <Trophy className="mr-1 h-3 w-3" />
            Mission Accomplished
          </div>
          <div className="text-xs text-cyan-400 bg-black/40 p-2 rounded border border-cyan-800/30">
            <span className="text-orange-400 font-bold">[Stanley]</span> {campaign.verdict}
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onDuplicate(campaign)}
              className="bg-purple-600/30 text-purple-300 border-purple-600/50 hover:bg-purple-600/50 text-xs"
            >
              <Copy className="mr-1 h-3 w-3" />
              Duplicate
            </Button>
            <Button
              size="sm"
              onClick={() => onArchive(campaign.id)}
              className="bg-blue-600/30 text-blue-300 border-blue-600/50 hover:bg-blue-600/50 text-xs"
            >
              <Archive className="mr-1 h-3 w-3" />
              Archive
            </Button>
          </div>
        </div>
      )}

      {campaign.status === 'active' && (
        <div className="mt-3 flex space-x-2">
          <Button
            size="sm"
            onClick={() => onPause(campaign.id)}
            className="bg-orange-600/30 text-orange-300 border-orange-600/50 hover:bg-orange-600/50 text-xs"
          >
            <Pause className="mr-1 h-3 w-3" />
            Pause
          </Button>
        </div>
      )}

      {campaign.status === 'paused' && (
        <div className="mt-3 flex space-x-2">
          <Button
            size="sm"
            onClick={() => onPause(campaign.id)}
            className="bg-green-600/30 text-green-300 border-green-600/50 hover:bg-green-600/50 text-xs"
          >
            <Play className="mr-1 h-3 w-3" />
            Resume
          </Button>
        </div>
      )}
    </div>
  );
};
