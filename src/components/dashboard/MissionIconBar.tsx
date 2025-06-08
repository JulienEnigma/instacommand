
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Zap, Trash2, Power, RotateCcw } from 'lucide-react';
import { toast } from "sonner";

export const MissionIconBar = () => {
  const executeCommand = (command: string, action: string) => {
    switch (action) {
      case 'start':
        toast.success(`✅ Sweep initiated - scanning targets`);
        break;
      case 'pause':
        toast.warning(`⏸️ Operations paused`);
        break;
      case 'reflex':
        toast.info(`⚡ Forcing reflex update`);
        break;
      case 'clear':
        toast.success(`🗑️ Logs cleared`);
        break;
      case 'terminate':
        toast.error(`🛑 Session terminated`);
        break;
      default:
        toast.success(`EXECUTING: ${command}`);
    }
  };

  const controls = [
    {
      icon: Play,
      label: 'Sweep',
      action: 'start',
      command: 'NEW SWEEP INITIATED',
      color: 'bg-red-700/50 hover:bg-red-600 text-red-300'
    },
    {
      icon: Pause,
      label: 'Pause',
      action: 'pause',
      command: 'OPS PAUSED',
      color: 'bg-yellow-700/50 hover:bg-yellow-600 text-yellow-300'
    },
    {
      icon: Zap,
      label: 'Reflex',
      action: 'reflex',
      command: 'REFLEX UPDATE',
      color: 'bg-purple-700/50 hover:bg-purple-600 text-purple-300'
    },
    {
      icon: Trash2,
      label: 'Clear',
      action: 'clear',
      command: 'LOGS CLEARED',
      color: 'bg-orange-700/50 hover:bg-orange-600 text-orange-300'
    },
    {
      icon: Power,
      label: 'Terminate',
      action: 'terminate',
      command: 'TERMINATED',
      color: 'bg-gray-700/50 hover:bg-gray-600 text-gray-300 border border-red-800/30'
    }
  ];

  return (
    <div className="flex items-center space-x-2">
      {controls.map((control, index) => (
        <Button
          key={index}
          onClick={() => executeCommand(control.command, control.action)}
          size="sm"
          className={`${control.color} border-none font-mono text-xs transition-all duration-200 hover:shadow-lg hover:scale-105`}
          title={control.label}
        >
          <control.icon className="h-4 w-4 mr-1" />
          {control.label}
        </Button>
      ))}
    </div>
  );
};
