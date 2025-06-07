
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";
import { AudienceAnalysis } from "@/components/dashboard/AudienceAnalysis";
import { ContentStrategy } from "@/components/dashboard/ContentStrategy";
import { CompetitorTracker } from "@/components/dashboard/CompetitorTracker";
import { MissionControl } from "@/components/dashboard/MissionControl";
import { GrowthMetrics } from "@/components/dashboard/GrowthMetrics";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Instagram Command Center
          </h1>
          <p className="text-slate-300 mt-2">AI-Powered Growth Intelligence Dashboard</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-purple-600">Audience</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600">Content</TabsTrigger>
            <TabsTrigger value="competitors" className="data-[state=active]:bg-purple-600">Intel</TabsTrigger>
            <TabsTrigger value="growth" className="data-[state=active]:bg-purple-600">Growth</TabsTrigger>
            <TabsTrigger value="mission" className="data-[state=active]:bg-purple-600">Mission</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="audience" className="mt-6">
            <AudienceAnalysis />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentStrategy />
          </TabsContent>

          <TabsContent value="competitors" className="mt-6">
            <CompetitorTracker />
          </TabsContent>

          <TabsContent value="growth" className="mt-6">
            <GrowthMetrics />
          </TabsContent>

          <TabsContent value="mission" className="mt-6">
            <MissionControl />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
