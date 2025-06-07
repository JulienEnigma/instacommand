
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { MapPin, Clock, Users2, Target } from 'lucide-react';

const audienceData = [
  { name: '18-24', value: 35, color: '#8B5CF6' },
  { name: '25-34', value: 40, color: '#EC4899' },
  { name: '35-44', value: 20, color: '#F59E0B' },
  { name: '45+', value: 5, color: '#10B981' },
];

const locationData = [
  { country: 'United States', percentage: 45 },
  { country: 'United Kingdom', percentage: 15 },
  { country: 'Canada', percentage: 12 },
  { country: 'Australia', percentage: 8 },
  { country: 'Germany', percentage: 6 },
  { country: 'Others', percentage: 14 },
];

const interestData = [
  { interest: 'Technology', engagement: 85 },
  { interest: 'Fitness', engagement: 72 },
  { interest: 'Travel', engagement: 68 },
  { interest: 'Food', engagement: 56 },
  { interest: 'Fashion', engagement: 43 },
];

export const AudienceAnalysis = () => {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Demographics */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Age Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {audienceData.map((item) => (
                <Badge key={item.name} variant="secondary" className="bg-slate-700">
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locationData.map((location) => (
                <div key={location.country} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{location.country}</span>
                    <span>{location.percentage}%</span>
                  </div>
                  <Progress value={location.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Hours */}
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Peak Activity Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">9-11 PM</div>
                <p className="text-sm text-muted-foreground">Optimal posting window</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Weekdays</div>
                  <div className="text-muted-foreground">6-9 PM peak</div>
                </div>
                <div>
                  <div className="font-medium">Weekends</div>
                  <div className="text-muted-foreground">11 AM-2 PM peak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interest Analysis */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Audience Interests & Engagement
          </CardTitle>
          <CardDescription>Topics that resonate most with your followers</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interestData}>
              <XAxis dataKey="interest" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="engagement" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
