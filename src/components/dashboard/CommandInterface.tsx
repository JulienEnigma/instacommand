
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Terminal, Zap } from 'lucide-react';

interface Command {
  input: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export const CommandInterface = () => {
  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    {
      input: 'scan @filmmakers',
      output: 'Initiated scan on @filmmakers hashtag. Found 23 targets.',
      timestamp: '14:32:18',
      success: true
    },
    {
      input: 'status targets',
      output: 'Active: 3, Queued: 28, Completed: 15',
      timestamp: '14:30:45',
      success: true
    }
  ]);

  const executeCommand = () => {
    if (!commandInput.trim()) return;

    setIsExecuting(true);
    
    // Cinematic execution effect
    setTimeout(() => {
      const mockResponses = [
        { text: `Executing: ${commandInput}`, success: true },
        { text: `Target ${commandInput} added to queue`, success: true },
        { text: `Scan completed for ${commandInput}`, success: true },
        { text: `Operation ${commandInput} initiated`, success: true },
        { text: `Analysis complete for ${commandInput}`, success: true },
        { text: `Command ${commandInput} processed successfully`, success: true },
        { text: `Error: Access denied for ${commandInput}`, success: false }
      ];

      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const newCommand: Command = {
        input: commandInput,
        output: response.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        success: response.success
      };

      setCommandHistory(prev => [...prev, newCommand].slice(-20)); // Keep last 20 commands
      setCommandInput('');
      setIsExecuting(false);
      
      if (response.success) {
        toast.success(`Command executed: ${commandInput}`);
      } else {
        toast.error(`Command failed: ${commandInput}`);
      }
    }, 1000 + Math.random() * 2000); // 1-3 second delay for cinematic effect
  };

  const quickCommands = [
    'scan #photography',
    'follow @target',
    'status all',
    'pause ops',
    'reflex update',
    'initiate ghost_reach',
    'stanley report'
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold tracking-wider flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-red-500" />
            COMMAND INTERFACE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command..."
              className="bg-black/80 border-red-800/50 text-red-400 font-mono placeholder-red-700/50 focus:border-red-500"
              onKeyPress={(e) => e.key === 'Enter' && !isExecuting && executeCommand()}
              disabled={isExecuting}
            />
            <Button 
              onClick={executeCommand}
              disabled={isExecuting}
              className={`px-6 font-bold transition-all duration-300 ${
                isExecuting 
                  ? 'bg-red-900 text-red-300 animate-pulse' 
                  : 'bg-red-700 hover:bg-red-600 text-black hover:shadow-lg hover:shadow-red-500/50'
              }`}
            >
              {isExecuting ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  EXEC
                </>
              ) : (
                'EXEC'
              )}
            </Button>
          </div>
          
          <div>
            <div className="text-xs text-red-500/70 mb-2 tracking-wider">QUICK COMMANDS:</div>
            <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
              {quickCommands.map((cmd, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setCommandInput(cmd)}
                  className="justify-start text-xs bg-black/60 border-red-800/30 text-red-400 hover:bg-red-900/30 hover:border-red-600 font-mono transition-all duration-200 break-words text-left"
                >
                  {'>'} {cmd}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold tracking-wider">COMMAND HISTORY</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3 font-mono text-xs">
              {commandHistory.slice().reverse().map((cmd, index) => (
                <div key={index} className="border-l-2 border-red-800/50 pl-3 animate-fade-in">
                  <div className="text-red-500/70">[{cmd.timestamp}]</div>
                  <div className="text-red-300 break-words">
                    {'>'} {cmd.input}
                  </div>
                  <div className={`mt-1 break-words ${cmd.success ? 'text-red-400/70' : 'text-red-500'}`}>
                    {cmd.output}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
