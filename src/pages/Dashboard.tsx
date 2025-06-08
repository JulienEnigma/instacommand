
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

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header with Live Stats and System Status */}
      <div className="border-b border-green-800 bg-gray-900">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-green-300">INSTAGRAM OPS CENTER</h1>
            <LiveStatsStrip />
          </div>
          <SystemStatus />
        </div>
      </div>

      <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        {/* Mission Controls - Left Sidebar */}
        <div className="col-span-3">
          <MissionControls />
          <div className="mt-6">
            <TargetIntelligence />
          </div>
        </div>

        {/* Main Content - Real-Time Logs */}
        <div className="col-span-6">
          <RealTimeLogs />
        </div>

        {/* Command Interface - Right Panel */}
        <div className="col-span-3">
          <CommandInterface />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
