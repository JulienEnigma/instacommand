
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
    <div className="min-h-screen bg-black text-red-400 font-mono overflow-hidden">
      {/* Animated background with red grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950/10 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>
      
      {/* Main content without scrolling */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header with Live Stats and System Status */}
        <div className="border-b border-red-800/30 bg-black/80 backdrop-blur-md flex-shrink-0">
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

        {/* Main dashboard content - full height, no scroll */}
        <div className="flex-1 p-4 overflow-hidden">
          {/* Full height grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
            {/* Column 1 - Mission Controls (top) and Campaign Mode (bottom) */}
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 min-h-0">
                <MissionControls />
              </div>
              <div className="flex-1 min-h-0">
                <CampaignMode />
              </div>
            </div>

            {/* Column 2 - Instagram Mirror (top) and Stanley Interface (bottom) */}
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 min-h-0">
                <InstagramMirror />
              </div>
              <div className="flex-1 min-h-0">
                <StanleyInterface />
              </div>
            </div>

            {/* Column 3 - Real Time Logs (full height) */}
            <div className="h-full">
              <RealTimeLogs />
            </div>

            {/* Column 4 - Command Interface (top), Reflex Node (middle), Tactical Radar (bottom) */}
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 min-h-0">
                <CommandInterface />
              </div>
              <div className="flex-1 min-h-0">
                <ReflexNode />
              </div>
              <div className="flex-1 min-h-0">
                <TacticalRadar />
              </div>
            </div>

            {/* Column 5 - Target Intelligence (full height) */}
            <div className="h-full lg:col-span-3 xl:col-span-1">
              <TargetIntelligence />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
