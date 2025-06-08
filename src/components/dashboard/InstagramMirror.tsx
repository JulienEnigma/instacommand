
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Instagram, Camera, Download, RefreshCw, TrendingUp, Eye, Clock, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProfileStats {
  followers: number;
  following: number;
  posts: number;
  lastUpdate: string;
  engagementRate: number;
  profileViews: number;
  storyViews: number;
}

interface RecentActivity {
  action: string;
  target: string;
  timestamp: string;
  outcome: 'success' | 'pending' | 'failed';
}

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
}

export const InstagramMirror = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'profile' | 'metrics' | 'activity' | 'performance'>('profile');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [nextRefresh, setNextRefresh] = useState(30);

  const [stats, setStats] = useState<ProfileStats>({
    followers: 1247,
    following: 892,
    posts: 156,
    lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false }),
    engagementRate: 4.2,
    profileViews: 89,
    storyViews: 234
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    { action: 'Followed', target: '@julien_film', timestamp: '2 min ago', outcome: 'success' },
    { action: 'Story viewed', target: '@alice.k', timestamp: '5 min ago', outcome: 'success' },
    { action: 'DM sent', target: '@filmfest.mythos', timestamp: '8 min ago', outcome: 'pending' },
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { label: 'Follower Growth', value: 12, change: +3, unit: '/day' },
    { label: 'Engagement Rate', value: 4.2, change: +0.3, unit: '%' },
    { label: 'Story Completion', value: 67, change: -2, unit: '%' },
    { label: 'Profile Reach', value: 1240, change: +156, unit: '/week' }
  ]);

  // Auto-refresh countdown
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setNextRefresh(prev => {
        if (prev <= 1) {
          handleAutoRefresh();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 3),
        profileViews: prev.profileViews + Math.floor(Math.random() * 5),
        engagementRate: Math.max(0, prev.engagementRate + (Math.random() - 0.5) * 0.2),
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
      
      // Update performance metrics
      setPerformanceMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * metric.value * 0.1),
        change: (Math.random() - 0.5) * metric.value * 0.2
      })));

      setIsRefreshing(false);
      toast({
        title: "Profile Updated",
        description: "Latest data synced from Instagram",
      });
    }, 2000);
  };

  const handleAutoRefresh = () => {
    setStats(prev => ({
      ...prev,
      followers: prev.followers + Math.floor(Math.random() * 2),
      profileViews: prev.profileViews + Math.floor(Math.random() * 3),
      lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
    }));
  };

  const exportData = () => {
    const data = {
      stats,
      recentActivity,
      performanceMetrics,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `instagram-mirror-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Profile data saved successfully",
    });
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center justify-between">
          <div className="flex items-center">
            <Instagram className="mr-2 h-5 w-5 text-red-500" />
            LIVE MIRROR
            {autoRefresh && (
              <div className="ml-3 text-xs text-yellow-400 flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {nextRefresh}s
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
              variant={autoRefresh ? "default" : "outline"}
              className={`text-xs ${
                autoRefresh 
                  ? 'bg-green-700 text-white' 
                  : 'bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30'
              }`}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              className="bg-red-700/50 hover:bg-red-600 border-red-600"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
        
        <div className="flex space-x-1">
          {['profile', 'metrics', 'activity', 'performance'].map((mode) => (
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
                <div className="text-xs text-gray-500 mt-1">
                  Auto-updates every {refreshInterval}s
                </div>
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
                  <span className="text-blue-400 font-mono">+{stats.profileViews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Story views:</span>
                  <span className="text-yellow-400 font-mono">+{stats.storyViews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement rate:</span>
                  <span className="text-purple-400 font-mono">{stats.engagementRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Last sync: {stats.lastUpdate}
            </div>
          </div>
        )}

        {viewMode === 'performance' && (
          <div className="space-y-3">
            <div className="text-sm font-bold mb-3">Performance Metrics</div>
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-3 bg-black/40 border border-red-800/20 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-red-300">{metric.label}</span>
                  <span className={`text-xs ${getChangeColor(metric.change)}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}{metric.unit}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-red-400">
                    {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}{metric.unit}
                  </span>
                  <div className="flex-1">
                    <Progress 
                      value={Math.min(100, (metric.value / (metric.value + Math.abs(metric.change))) * 100)} 
                      className="h-1 bg-red-950/50"
                    />
                  </div>
                </div>
              </div>
            ))}
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
            onClick={exportData}
            className="w-full bg-purple-700/50 hover:bg-purple-600 border-purple-600 text-xs"
          >
            <Download className="mr-2 h-3 w-3" />
            Export Mirror Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
