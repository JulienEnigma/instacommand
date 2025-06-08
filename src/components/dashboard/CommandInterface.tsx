
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Command {
  input: string;
  output: string;
  timestamp: string;
}

export const CommandInterface = () => {
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    {
      input: 'scan @filmmakers',
      output: 'Initiated scan on @filmmakers hashtag. Found 23 targets.',
      timestamp: '14:32:18'
    },
    {
      input: 'status targets',
      output: 'Active: 3, Queued: 28, Completed: 15',
      timestamp: '14:30:45'
    }
  ]);

  const executeCommand = () => {
    if (!commandInput.trim()) return;

    const mockResponses = [
      `Executing: ${commandInput}`,
      `Target ${commandInput} added to queue`,
      `Scan completed for ${commandInput}`,
      `Operation ${commandInput} initiated`,
      `Analysis complete for ${commandInput}`,
      `Command ${commandInput} processed successfully`
    ];

    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    const newCommand: Command = {
      input: commandInput,
      output: response,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setCommandHistory(prev => [...prev, newCommand]);
    setCommandInput('');
    toast.success(`Command executed: ${commandInput}`);
  };

  const quickCommands = [
    'scan #photography',
    'follow @target',
    'status all',
    'pause ops',
    'reflex update'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-green-800 text-green-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold tracking-wider">COMMAND INTERFACE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command..."
              className="bg-black border-green-800 text-green-400 font-mono"
              onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
            />
            <Button 
              onClick={executeCommand}
              className="bg-green-700 hover:bg-green-600 text-black font-bold px-6"
            >
              EXEC
            </Button>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-2">QUICK COMMANDS:</div>
            <div className="grid grid-cols-1 gap-1">
              {quickCommands.map((cmd, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setCommandInput(cmd)}
                  className="justify-start text-xs bg-black border-green-800 text-green-400 hover:bg-green-800 font-mono"
                >
                  {'>'} {cmd}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-green-800 text-green-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold tracking-wider">COMMAND HISTORY</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3 font-mono text-xs">
              {commandHistory.map((cmd, index) => (
                <div key={index} className="border-l-2 border-green-800 pl-3">
                  <div className="text-gray-500">[{cmd.timestamp}]</div>
                  <div className="text-green-300">
                    {'>'} {cmd.input}
                  </div>
                  <div className="text-gray-400 mt-1">
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
