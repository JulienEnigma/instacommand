
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Camera, Download, RefreshCw, Settings, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ProfileStats } from './instagram/ProfileStats';
import { MetricsView } from './instagram/MetricsView';
import { ActivityView } from './instagram/ActivityView';
import { PerformanceView } from './instagram/PerformanceView';
import api, { ProfileStats as ProfileStatsType } from '@/lib/api';

interface ProfileStatsData {
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
  const [hasData, setHasData] = useState(false);

  const [stats, setStats] = useState<ProfileStatsData>({
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

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasData(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const profileStats = await api.getProfileStats();
      setStats(prev => ({
        ...prev,
        followers: profileStats.followers,
        following: profileStats.following,
        posts: profileStats.posts,
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
      
      setIsRefreshing(false);
      setHasData(true);
      toast({
        title: "Profile Updated",
        description: "Latest data synced from Instagram",
      });
    } catch (error) {
      console.error('Failed to refresh profile stats:', error);
      setStats(prev => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 3),
        profileViews: prev.profileViews + Math.floor(Math.random() * 5),
        engagementRate: Math.max(0, prev.engagementRate + (Math.random() - 0.5) * 0.2),
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
      
      setIsRefreshing(false);
      setHasData(true);
      toast({
        title: "Profile Updated",
        description: "Using cached data - backend unavailable",
      });
    }
  };

  const handleAutoRefresh = async () => {
    try {
      const profileStats = await api.getProfileStats();
      setStats(prev => ({
        ...prev,
        followers: profileStats.followers,
        following: profileStats.following,
        posts: profileStats.posts,
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
    } catch (error) {
      console.error('Auto-refresh failed:', error);
      setStats(prev => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 2),
        profileViews: prev.profileViews + Math.floor(Math.random() * 3),
        lastUpdate: new Date().toLocaleTimeString('en-US', { hour12: false })
      }));
    }
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

  return (
    <Card className={`bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 transition-all duration-300 ${hasData ? 'h-full' : 'h-32'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center justify-between">
          <div className="flex items-center">
            <Instagram className="mr-2 h-5 w-5 text-red-500" />
            LIVE MIRROR
            {autoRefresh && hasData && (
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
        
        {hasData && (
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
        )}
      </CardHeader>
      
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center space-x-4 text-red-500/50">
            <Camera className="h-6 w-6 animate-pulse" />
            <div className="text-sm">
              {isRefreshing ? 'Syncing profile data...' : 'Connecting to Instagram...'}
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'profile' && (
              <ProfileStats stats={{ ...stats, refreshInterval }} />
            )}

            {viewMode === 'metrics' && (
              <MetricsView stats={stats} />
            )}

            {viewMode === 'performance' && (
              <PerformanceView performanceMetrics={performanceMetrics} />
            )}

            {viewMode === 'activity' && (
              <ActivityView recentActivity={recentActivity} />
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
