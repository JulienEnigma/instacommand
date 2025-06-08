
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trash2, Zap, Crosshair, Power } from 'lucide-react';
import { toast } from "sonner";

export const MissionControls = () => {
  const executeCommand = (command: string, action: string) => {
    // Show more specific feedback based on action type
    switch (action) {
      case 'start':
        toast.success(`✅ Browser automation initiated - scanning targets`);
        break;
      case 'pause':
        toast.warning(`⏸️ All operations paused - ${new Date().toLocaleTimeString()}`);
        break;
      case 'upgrade':
        toast.info(`🔄 Forcing reflex update - ETA 30 seconds`);
        break;
      case 'clear':
        toast.success(`🗑️ Logs cleared - ${new Date().toLocaleTimeString()}`);
        break;
      case 'terminate':
        toast.error(`🛑 Browser session terminated - all processes stopped`);
        break;
      default:
        toast.success(`EXECUTING: ${command}`);
    }
  };

  const controls = [
    {
      icon: Play,
      label: 'START SWEEP',
      action: 'start',
      command: 'NEW SWEEP INITIATED',
      color: 'bg-red-700 hover:bg-red-600 hover:shadow-red-500/30'
    },
    {
      icon: Pause,
      label: 'PAUSE OPS',
      action: 'pause',
      command: 'ALL OPS PAUSED',
      color: 'bg-yellow-700 hover:bg-yellow-600 hover:shadow-yellow-500/30'
    },
    {
      icon: Zap,
      label: 'REFLEX UPDATE',
      action: 'upgrade',
      command: 'REFLEX UPGRADE FORCED',
      color: 'bg-purple-700 hover:bg-purple-600 hover:shadow-purple-500/30'
    },
    {
      icon: Trash2,
      label: 'CLEAR LOGS',
      action: 'clear',
      command: 'LOGS CLEARED',
      color: 'bg-orange-700 hover:bg-orange-600 hover:shadow-orange-500/30'
    },
    {
      icon: Power,
      label: 'TERMINATE',
      action: 'terminate',
      command: 'BROWSER SESSION TERMINATED',
      color: 'bg-gray-700 hover:bg-gray-600 border border-red-800 hover:shadow-red-500/30'
    }
  ];

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Crosshair className="mr-2 h-5 w-5 text-red-500" />
          MISSION CONTROLS
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        {/* Horizontal tile grid layout */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
          {controls.map((control, index) => (
            <Button
              key={index}
              onClick={() => executeCommand(control.command, control.action)}
              className={`
                flex flex-col items-center justify-center p-2 h-full min-h-[60px]
                text-black font-bold text-xs leading-tight
                transition-all duration-300 hover:shadow-lg
                ${control.color}
                ${index === 4 ? 'col-span-3' : ''}
              `}
            >
              <control.icon className="h-4 w-4 mb-1 flex-shrink-0" />
              <span className="text-center break-words">{control.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
