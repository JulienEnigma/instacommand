
import React from 'react';
import { Camera } from 'lucide-react';

interface ProfileStatsData {
  followers: number;
  following: number;
  posts: number;
  refreshInterval: number;
}

interface ProfileStatsProps {
  stats: ProfileStatsData;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gradient-to-br from-red-900/20 to-black border border-red-800/30 rounded flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-8 w-8 text-red-500/50 mx-auto mb-2" />
          <div className="text-xs text-red-500/70">Profile Screenshot</div>
          <div className="text-xs text-gray-500 mt-1">
            Auto-updates every {stats.refreshInterval}s
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
  );
};
