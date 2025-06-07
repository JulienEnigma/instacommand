
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Eye, Users, Heart, MessageCircle, ExternalLink } from 'lucide-react';

const competitorData = [
  {
    name: "@techguru_mike",
    followers: "128K",
    engagement: "4.2%",
    growth: "+12%",
    trend: "up",
    posts: 847,
    avgLikes: "5.2K",
    niche: "Tech Reviews"
  },
  {
    name: "@productivitypro",
    followers: "89K",
    engagement: "6.1%",
    growth: "+8%",
    trend: "up",
    posts: 592,
    avgLikes: "4.8K",
    niche: "Productivity"
  },
  {
    name: "@startup_sam",
    followers: "156K",
    engagement: "3.8%",
    growth: "-2%",
    trend: "down",
    posts: 1203,
    avgLikes: "6.1K",
    niche: "Entrepreneurship"
  },
  {
    name: "@ai_insider",
    followers: "67K",
    engagement: "7.3%",
    growth: "+25%",
    trend: "up",
    posts: 324,
    avgLikes: "3.9K",
    niche: "AI & Tech"
  }
];

const performanceData = [
  { name: 'Week 1', you: 4.2, competitor1: 3.8, competitor2: 5.1 },
  { name: 'Week 2', you: 4.5, competitor1: 4.1, competitor2: 4.9 },
  { name: 'Week 3', you: 4.8, competitor1: 4.3, competitor2: 5.3 },
  { name: 'Week 4', you: 5.1, competitor1: 4.0, competitor2: 5.0 },
];

const topPosts = [
  {
    account: "@techguru_mike",
    content: "Why I switched from iPhone to...",
    likes: "12.4K",
    comments: "892",
    engagement: "8.2%",
    type: "Video"
  },
  {
    account: "@productivitypro",
    content: "My morning routine that changed everything",
    likes: "9.8K",
    comments: "567",
    engagement: "7.1%",
    type: "Carousel"
  },
  {
    account: "@ai_insider",
    content: "ChatGPT vs Claude: The honest comparison",
    likes: "15.2K",
    comments: "1.2K",
    engagement: "9.3%",
    type: "Video"
  }
];

export const CompetitorTracker = () => {
  return (
    <div className="grid gap-6">
      {/* Competitor Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitorData.map((competitor, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{competitor.name}</CardTitle>
                {competitor.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>
              <Badge variant="secondary" className="w-fit text-xs">{competitor.niche}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Followers</span>
                <span className="font-medium">{competitor.followers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Engagement</span>
                <span className="font-medium text-purple-400">{competitor.engagement}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Growth</span>
                <span className={`font-medium ${competitor.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {competitor.growth}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Likes</span>
                <span className="font-medium">{competitor.avgLikes}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Comparison */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Engagement Rate Comparison
          </CardTitle>
          <CardDescription>Your performance vs top competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
              <Line type="monotone" dataKey="you" stroke="#8B5CF6" strokeWidth={3} name="You" />
              <Line type="monotone" dataKey="competitor1" stroke="#F59E0B" strokeWidth={2} name="@techguru_mike" />
              <Line type="monotone" dataKey="competitor2" stroke="#10B981" strokeWidth={2} name="@productivitypro" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Posts */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Competitor's Top Posts
          </CardTitle>
          <CardDescription>Analyze what's working in your niche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-purple-400">{post.account}</div>
                    <div className="text-sm text-muted-foreground">{post.content}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{post.type}</Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-400" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-blue-400" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span>{post.engagement}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost" className="h-6 px-2">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
