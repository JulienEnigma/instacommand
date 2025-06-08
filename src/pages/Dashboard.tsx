
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LiveStatsStrip } from "@/components/dashboard/LiveStatsStrip";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { MissionControls } from "@/components/dashboard/MissionControls";
import { TargetIntelligence } from "@/components/dashboard/TargetIntelligence";
import { RealTimeLogs } from "@/components/dashboard/RealTimeLogs";
import { CommandInterface } from "@/components/dashboard/CommandInterface";
import { TacticalRadar } from "@/components/dashboard/TacticalRadar";
import { CampaignMode } from "@/components/dashboard/CampaignMode";
import { ReflexNode } from "@/components/dashboard/ReflexNode";
import { StanleyInterface } from "@/components/dashboard/StanleyInterface";
import { InstagramMirror } from "@/components/dashboard/InstagramMirror";
import { SystemOptimization } from "@/components/dashboard/SystemOptimization";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-red-400 font-mono">
      {/* Animated background with red grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/10 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>
      
      {/* Main content with proper scrolling */}
      <div className="relative z-10 min-h-screen">
        {/* Header with Live Stats and System Status */}
        <div className="border-b border-red-800/30 bg-black/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-red-300 tracking-wider glitch-text">
                STANLEY COMMAND CENTER
              </h1>
              <LiveStatsStrip />
            </div>
            <SystemStatus />
          </div>
        </div>

        {/* Scrollable content area */}
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-6">
            {/* Enhanced responsive grid layout - 3 tiles per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div className="h-80">
                <MissionControls />
              </div>
              <div className="h-80">
                <CampaignMode />
              </div>
              <div className="h-80">
                <InstagramMirror />
              </div>

              {/* Row 2 */}
              <div className="h-80">
                <StanleyInterface />
              </div>
              <div className="h-80">
                <RealTimeLogs />
              </div>
              <div className="h-80">
                <CommandInterface />
              </div>

              {/* Row 3 */}
              <div className="h-80">
                <ReflexNode />
              </div>
              <div className="h-80">
                <TacticalRadar />
              </div>
              <div className="h-80">
                <SystemOptimization />
              </div>

              {/* Row 4 */}
              <div className="h-80">
                <TargetIntelligence />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;
