
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

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Crosshair className="mr-2 h-5 w-5 text-red-500" />
          MISSION CONTROLS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => executeCommand('NEW SWEEP INITIATED', 'start')}
          className="w-full bg-red-700 hover:bg-red-600 text-black font-bold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
        >
          <Play className="mr-2 h-4 w-4" />
          START NEW SWEEP
        </Button>
        
        <Button 
          onClick={() => executeCommand('ALL OPS PAUSED', 'pause')}
          className="w-full bg-yellow-700 hover:bg-yellow-600 text-black font-bold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50"
        >
          <Pause className="mr-2 h-4 w-4" />
          PAUSE ALL OPS
        </Button>
        
        <Button 
          onClick={() => executeCommand('REFLEX UPGRADE FORCED', 'upgrade')}
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
        >
          <Zap className="mr-2 h-4 w-4" />
          FORCE REFLEX UPDATE
        </Button>
        
        <Button 
          onClick={() => executeCommand('LOGS CLEARED', 'clear')}
          className="w-full bg-orange-700 hover:bg-orange-600 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          CLEAR LOGS
        </Button>
        
        <Button 
          onClick={() => executeCommand('BROWSER SESSION TERMINATED', 'terminate')}
          className="w-full bg-gray-700 hover:bg-gray-600 text-red-400 font-bold border border-red-800 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
        >
          <Power className="mr-2 h-4 w-4" />
          TERMINATE BROWSER SESSION
        </Button>
      </CardContent>
    </Card>
  );
};
