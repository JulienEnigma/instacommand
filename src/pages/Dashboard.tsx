
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

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-red-400 font-mono overflow-hidden">
      {/* Animated background with red grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/10 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>
      
      {/* Glassmorphism overlay */}
      <div className="relative z-10">
        {/* Header with Live Stats and System Status */}
        <div className="border-b border-red-800/30 bg-black/80 backdrop-blur-md">
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

        <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
          {/* Left Column - Mission Controls & Stanley */}
          <div className="col-span-3 space-y-6">
            <MissionControls />
            <StanleyInterface />
            <ReflexNode />
          </div>

          {/* Center Column - Real-Time Logs & Campaign */}
          <div className="col-span-6 space-y-6">
            <CampaignMode />
            <RealTimeLogs />
          </div>

          {/* Right Column - Command Interface & Tactical */}
          <div className="col-span-3 space-y-6">
            <CommandInterface />
            <TacticalRadar />
            <TargetIntelligence />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
