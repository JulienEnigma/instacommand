
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { Target, Zap, Trophy, TrendingUp, Calendar, Users, Heart } from 'lucide-react';

const growthData = [
  { name: 'Jan', followers: 3200, engagement: 3.8, posts: 12 },
  { name: 'Feb', followers: 3580, engagement: 4.1, posts: 14 },
  { name: 'Mar', followers: 4100, engagement: 4.5, posts: 16 },
  { name: 'Apr', followers: 4620, engagement: 4.8, posts: 18 },
  { name: 'May', followers: 5240, engagement: 5.1, posts: 20 },
  { name: 'Jun', followers: 5730, engagement: 4.9, posts: 19 },
];

const goalProgress = [
  { name: '10K Followers', value: 57, color: '#8B5CF6' },
];

const contentTypes = [
  { name: 'Videos', value: 45, fill: '#8B5CF6' },
  { name: 'Carousels', value: 30, fill: '#EC4899' },
  { name: 'Photos', value: 20, fill: '#F59E0B' },
  { name: 'Reels', value: 5, fill: '#10B981' },
];

const milestones = [
  { milestone: "First 1K followers", date: "Feb 15", achieved: true },
  { milestone: "5K followers", date: "May 22", achieved: true },
  { milestone: "10K followers", date: "Target: Aug 30", achieved: false },
  { milestone: "First viral post (100K views)", date: "Target: Sep 15", achieved: false },
  { milestone: "Brand partnership", date: "Target: Oct 1", achieved: false },
];

export const GrowthMetrics = () => {
  return (
    <div className="grid gap-6">
      {/* Goal Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">5,730</div>
                <div className="text-sm text-muted-foreground">/ 10,000 followers</div>
              </div>
              <Progress value={57} className="h-3" />
              <div className="text-sm text-center">
                <span className="text-green-400">57%</span> complete
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5" />
              Growth Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">+127</div>
              <div className="text-sm text-muted-foreground">followers/day</div>
              <div className="text-xs">
                <span className="text-green-400">↗ +23%</span> vs last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5" />
              Best Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-400">May 2024</div>
              <div className="text-sm text-muted-foreground">+1,118 followers</div>
              <div className="text-xs">5.1% avg engagement</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Trajectory
          </CardTitle>
          <CardDescription>Follower growth and engagement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }} 
              />
              <Bar yAxisId="left" dataKey="followers" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#F59E0B" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Content Type Performance
            </CardTitle>
            <CardDescription>Which content formats drive the most engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {contentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Growth Milestones
            </CardTitle>
            <CardDescription>Track your journey and upcoming goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${milestone.achieved ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <div>
                      <div className="font-medium text-sm">{milestone.milestone}</div>
                      <div className="text-xs text-muted-foreground">{milestone.date}</div>
                    </div>
                  </div>
                  <Badge variant={milestone.achieved ? "default" : "secondary"} className="text-xs">
                    {milestone.achieved ? "✓ Done" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
