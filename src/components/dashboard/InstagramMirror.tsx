
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Camera, Download, RefreshCw } from 'lucide-react';

interface ProfileStats {
  followers: number;
  following: number;
  posts: number;
  lastUpdate: string;
}

interface RecentActivity {
  action: string;
  target: string;
  timestamp: string;
  outcome: 'success' | 'pending' | 'failed';
}

export const InstagramMirror = () => {
  const [viewMode, setViewMode] = useState<'profile' | 'metrics' | 'activity'>('profile');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<ProfileStats>({
    followers: 1247,
    following: 892,
    posts: 156,
    lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    { action: 'Followed', target: '@julien_film', timestamp: '2 min ago', outcome: 'success' },
    { action: 'Story viewed', target: '@alice.k', timestamp: '5 min ago', outcome: 'success' },
    { action: 'DM sent', target: '@filmfest.mythos', timestamp: '8 min ago', outcome: 'pending' },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 3),
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
      setIsRefreshing(false);
    }, 2000);
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center justify-between">
          <div className="flex items-center">
            <Instagram className="mr-2 h-5 w-5 text-red-500" />
            LIVE MIRROR
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="bg-red-700/50 hover:bg-red-600 border-red-600"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        
        <div className="flex space-x-1">
          {['profile', 'metrics', 'activity'].map((mode) => (
            <Button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              size="sm"
              variant={viewMode === mode ? 'default' : 'outline'}
              className={`text-xs ${
                viewMode === mode 
                  ? 'bg-red-700 text-white' 
                  : 'bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30'
              }`}
            >
              {mode.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'profile' && (
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-red-900/20 to-black border border-red-800/30 rounded flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-8 w-8 text-red-500/50 mx-auto mb-2" />
                <div className="text-xs text-red-500/70">Profile Screenshot</div>
                <div className="text-xs text-gray-500 mt-1">Updates every 30s</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-red-300">{stats.posts}</div>
                <div className="text-gray-500">Posts</div>
              </div>
              <div>
                <div className="font-bold text-red-300">{stats.followers.toLocaleString()}</div>
                <div className="text-gray-500">Followers</div>
              </div>
              <div>
                <div className="font-bold text-red-300">{stats.following}</div>
                <div className="text-gray-500">Following</div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'metrics' && (
          <div className="space-y-3">
            <div className="p-3 bg-red-950/20 border border-red-800/30 rounded">
              <div className="text-sm font-bold mb-2">Last 24 Hours</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>New followers:</span>
                  <span className="text-green-400 font-mono">+12</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile visits:</span>
                  <span className="text-blue-400 font-mono">+47</span>
                </div>
                <div className="flex justify-between">
                  <span>Story views:</span>
                  <span className="text-yellow-400 font-mono">+23</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Last sync: {stats.lastUpdate}
            </div>
          </div>
        )}

        {viewMode === 'activity' && (
          <div className="space-y-2">
            <div className="text-sm font-bold mb-3">Recent Actions</div>
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-2 bg-black/40 border border-red-800/20 rounded text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={getOutcomeColor(activity.outcome)}>
                      {activity.action}
                    </span>
                    <span className="text-red-300 ml-1">{activity.target}</span>
                  </div>
                  <span className="text-gray-500">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-red-800/30">
          <Button
            size="sm"
            className="w-full bg-purple-700/50 hover:bg-purple-600 border-purple-600 text-xs"
          >
            <Download className="mr-2 h-3 w-3" />
            Archive Current State
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
