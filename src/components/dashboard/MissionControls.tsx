
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trash2, Zap } from 'lucide-react';
import { toast } from "sonner";

export const MissionControls = () => {
  const executeCommand = (command: string) => {
    toast.success(`EXECUTING: ${command}`);
  };

  return (
    <Card className="bg-gray-900 border-green-800 text-green-400">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider">MISSION CONTROLS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => executeCommand('NEW SWEEP INITIATED')}
          className="w-full bg-green-700 hover:bg-green-600 text-black font-bold"
        >
          <Play className="mr-2 h-4 w-4" />
          START NEW SWEEP
        </Button>
        
        <Button 
          onClick={() => executeCommand('ALL OPS PAUSED')}
          className="w-full bg-yellow-700 hover:bg-yellow-600 text-black font-bold"
        >
          <Pause className="mr-2 h-4 w-4" />
          PAUSE ALL OPS
        </Button>
        
        <Button 
          onClick={() => executeCommand('REFLEX UPGRADE FORCED')}
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold"
        >
          <Zap className="mr-2 h-4 w-4" />
          FORCE SELF-UPGRADE
        </Button>
        
        <Button 
          onClick={() => executeCommand('LOGS CLEARED')}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-bold"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          CLEAR LOGS
        </Button>
        
        <Button 
          onClick={() => executeCommand('EMERGENCY PROTOCOL')}
          className="w-full bg-gray-700 hover:bg-gray-600 text-red-400 font-bold border border-red-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          EMERGENCY STOP
        </Button>
      </CardContent>
    </Card>
  );
};
