
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-red-400 font-mono">
      {/* Animated background with red grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/10 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>
      
      {/* Main content without scrolling */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header with Live Stats and System Status */}
        <div className="border-b border-red-800/30 bg-black/80 backdrop-blur-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-red-300 tracking-wider glitch-text">
                  SOCIAL COMMANDER
                </h1>
                <p className="text-xs text-red-500/70 tracking-wide">
                  Powered by EnigmaOS and Stanley • From Enigma Releasing
                </p>
              </div>
              <LiveStatsStrip />
            </div>
            <SystemStatus />
          </div>
        </div>

        {/* Main dashboard content - restructured for full height */}
        <div className="flex-1 p-4 overflow-hidden">
          {/* Grid with 2 equal height rows */}
          <div className="h-full grid grid-rows-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Row 1 - spans full height of first row */}
            <div className="h-full">
              <MissionControls />
            </div>
            <div className="h-full">
              <CampaignMode />
            </div>
            <div className="h-full">
              <InstagramMirror />
            </div>
            <div className="h-full">
              <StanleyInterface />
            </div>

            {/* Row 2 - spans full height of second row */}
            <div className="h-full">
              <RealTimeLogs />
            </div>
            <div className="h-full">
              <CommandInterface />
            </div>
            <div className="h-full">
              <ReflexNode />
            </div>
            <div className="h-full lg:col-span-2 xl:col-span-1">
              <TacticalRadar />
            </div>
            <div className="h-full lg:col-start-1 xl:col-start-auto">
              <TargetIntelligence />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
