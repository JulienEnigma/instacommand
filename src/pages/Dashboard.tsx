
import React from 'react';
import { TopMetricsStrip } from "@/components/dashboard/TopMetricsStrip";
import { MissionIconBar } from "@/components/dashboard/MissionIconBar";
import { CampaignMode } from "@/components/dashboard/CampaignMode";
import { TacticalRadar } from "@/components/dashboard/TacticalRadar";
import { ReflexIntelligence } from "@/components/dashboard/ReflexIntelligence";
import { RealTimeLogs } from "@/components/dashboard/RealTimeLogs";
import { TargetPanel } from "@/components/dashboard/TargetPanel";
import { CommandFooter } from "@/components/dashboard/CommandFooter";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-red-400 font-mono overflow-hidden">
      {/* Animated background with red grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-950/5 to-gray-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>
      
      {/* Main content - no scroll, locked layout */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Metrics Strip */}
        <TopMetricsStrip />
        
        {/* Main Dashboard Content */}
        <div className="flex-1 p-4 flex space-x-4 overflow-hidden">
          {/* Left Column - Mission Controls + Logs */}
          <div className="flex flex-col space-y-4 flex-1">
            {/* Mission Icon Bar */}
            <div className="bg-black/60 border border-red-800/30 rounded-lg p-3 backdrop-blur-md">
              <MissionIconBar />
            </div>
            
            {/* Massive Logs Section */}
            <div className="flex-1">
              <RealTimeLogs />
            </div>
          </div>
          
          {/* Center Column - Campaigns + Radar */}
          <div className="flex flex-col space-y-4 w-80">
            <div className="h-1/2">
              <CampaignMode />
            </div>
            <div className="h-1/2">
              <TacticalRadar />
            </div>
          </div>
          
          {/* Right Top - Reflex Intelligence */}
          <div className="flex flex-col space-y-4 w-80">
            <div className="h-1/2">
              <ReflexIntelligence />
            </div>
            <div className="h-1/2">
              <TargetPanel />
            </div>
          </div>
        </div>
        
        {/* Command Footer */}
        <CommandFooter />
      </div>
    </div>
  );
};

export default Dashboard;
