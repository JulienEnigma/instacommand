
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Heart, MessageCircle, Eye } from 'lucide-react';

const mockData = [
  { name: 'Mon', followers: 4000, engagement: 2400, reach: 8000 },
  { name: 'Tue', followers: 4300, engagement: 2600, reach: 8200 },
  { name: 'Wed', followers: 4500, engagement: 2800, reach: 8400 },
  { name: 'Thu', followers: 4800, engagement: 3200, reach: 8800 },
  { name: 'Fri', followers: 5100, engagement: 3500, reach: 9200 },
  { name: 'Sat', followers: 5400, engagement: 3800, reach: 9600 },
  { name: 'Sun', followers: 5700, engagement: 4100, reach: 10000 },
];

export const AnalyticsOverview = () => {
  return (
    <div className="grid gap-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">5,734</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">4.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+2.3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">62.4K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+18.7%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">+127</div>
            <p className="text-xs text-muted-foreground">followers/day average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>7-day growth trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="followers" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Engagement Analytics</CardTitle>
            <CardDescription>Likes, comments, and reach trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="engagement" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="reach" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
