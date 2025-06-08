
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
      glassStyle: 'bg-emerald-500/10 border-emerald-400/20 hover:bg-emerald-400/20 hover:border-emerald-300/40 hover:shadow-emerald-400/20 text-emerald-300'
    },
    {
      icon: Pause,
      label: 'PAUSE OPS',
      action: 'pause',
      command: 'ALL OPS PAUSED',
      glassStyle: 'bg-amber-500/10 border-amber-400/20 hover:bg-amber-400/20 hover:border-amber-300/40 hover:shadow-amber-400/20 text-amber-300'
    },
    {
      icon: Zap,
      label: 'REFLEX UPDATE',
      action: 'upgrade',
      command: 'REFLEX UPGRADE FORCED',
      glassStyle: 'bg-violet-500/10 border-violet-400/20 hover:bg-violet-400/20 hover:border-violet-300/40 hover:shadow-violet-400/20 text-violet-300'
    },
    {
      icon: Trash2,
      label: 'CLEAR LOGS',
      action: 'clear',
      command: 'LOGS CLEARED',
      glassStyle: 'bg-orange-500/10 border-orange-400/20 hover:bg-orange-400/20 hover:border-orange-300/40 hover:shadow-orange-400/20 text-orange-300'
    },
    {
      icon: Power,
      label: 'TERMINATE',
      action: 'terminate',
      command: 'BROWSER SESSION TERMINATED',
      glassStyle: 'bg-red-500/10 border-red-400/20 hover:bg-red-400/20 hover:border-red-300/40 hover:shadow-red-400/20 text-red-300'
    }
  ];

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Crosshair className="mr-2 h-5 w-5 text-red-500" />
          MISSION CONTROLS
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-90px)] p-6">
        <div className="flex flex-col gap-6 h-full">
          {/* First row - START and PAUSE */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {controls.slice(0, 2).map((control, index) => {
              const IconComponent = control.icon;
              return (
                <button
                  key={index}
                  onClick={() => executeCommand(control.command, control.action)}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 h-full min-h-[100px]
                    rounded-xl border backdrop-blur-xl
                    font-semibold text-xs leading-tight tracking-wide
                    transition-all duration-500 ease-out
                    hover:scale-105 active:scale-95
                    shadow-lg hover:shadow-xl
                    ${control.glassStyle}
                  `}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 rounded-xl shadow-inner opacity-20" />
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                    <IconComponent className="h-6 w-6 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-center break-words px-2 drop-shadow-sm">
                      {control.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" 
                       style={{ boxShadow: 'inset 0 0 20px currentColor' }} />
                </button>
              );
            })}
          </div>

          {/* Second row - REFLEX and CLEAR */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {controls.slice(2, 4).map((control, index) => {
              const IconComponent = control.icon;
              return (
                <button
                  key={index + 2}
                  onClick={() => executeCommand(control.command, control.action)}
                  className={`
                    group relative flex flex-col items-center justify-center p-6 h-full min-h-[100px]
                    rounded-xl border backdrop-blur-xl
                    font-semibold text-xs leading-tight tracking-wide
                    transition-all duration-500 ease-out
                    hover:scale-105 active:scale-95
                    shadow-lg hover:shadow-xl
                    ${control.glassStyle}
                  `}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 rounded-xl shadow-inner opacity-20" />
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                    <IconComponent className="h-6 w-6 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-center break-words px-2 drop-shadow-sm">
                      {control.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" 
                       style={{ boxShadow: 'inset 0 0 20px currentColor' }} />
                </button>
              );
            })}
          </div>

          {/* Third row - TERMINATE (full width) */}
          <div className="flex-1">
            <button
              onClick={() => executeCommand(controls[4].command, controls[4].action)}
              className={`
                group relative flex flex-col items-center justify-center p-6 w-full h-full min-h-[100px]
                rounded-xl border backdrop-blur-xl
                font-semibold text-xs leading-tight tracking-wide
                transition-all duration-500 ease-out
                hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                ${controls[4].glassStyle}
              `}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-xl shadow-inner opacity-20" />
              <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                <Power className="h-6 w-6 flex-shrink-0 drop-shadow-sm" />
                <span className="text-center break-words px-2 drop-shadow-sm">
                  {controls[4].label}
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" 
                   style={{ boxShadow: 'inset 0 0 20px currentColor' }} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
