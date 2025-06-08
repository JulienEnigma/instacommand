
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Send } from 'lucide-react';
import { toast } from "sonner";

interface CommandEcho {
  input: string;
  output: string;
  timestamp: string;
  success: boolean;
  stanleyComment?: string;
}

export const CommandFooter = () => {
  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandEchoes, setCommandEchoes] = useState<CommandEcho[]>([
    {
      input: 'scan #filmfestival',
      output: 'Detected 8 high-engagement targets',
      timestamp: '14:32:18',
      success: true,
      stanleyComment: 'Peak activity window - optimal timing'
    }
  ]);

  const allCommands = [
    'scan #photography', 'scan #streetphotography', 'scan #filmmaking',
    'follow @target', 'follow batch', 'follow priority',
    'status all', 'status targets', 'status campaigns',
    'pause ops', 'resume ops', 'pause campaign',
    'reflex update', 'reflex status', 'stanley report'
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isExecuting) {
      executeCommand();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = allCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(commandInput.toLowerCase())
      );
      if (suggestions.length > 0) {
        setCommandInput(suggestions[0]);
      }
    }
  };

  const executeCommand = () => {
    if (!commandInput.trim()) return;

    setIsExecuting(true);
    
    setTimeout(() => {
      const stanleyComments = [
        'User responded via Story View, possible follow-back',
        'High compatibility detected - proceed with engagement',
        'Rate limit approaching - consider cooldown',
        'Target shows mutual connections - increase priority'
      ];

      const mockResponses = [
        'Operation executed successfully',
        `Target ${commandInput} added to queue`,
        `Scan completed - 15 new targets found`,
        'Analysis complete - results logged'
      ];

      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const stanleyComment = Math.random() > 0.5 ? stanleyComments[Math.floor(Math.random() * stanleyComments.length)] : undefined;
      
      const newEcho: CommandEcho = {
        input: commandInput,
        output: response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        success: true,
        stanleyComment
      };

      setCommandEchoes(prev => [...prev.slice(-4), newEcho]);
      setCommandInput('');
      setIsExecuting(false);
      
      toast.success(`Command executed: ${commandInput}`);
    }, 1000 + Math.random() * 1500);
  };

  return (
    <div className="bg-black/80 border-t border-red-800/30 backdrop-blur-md">
      {/* Command Echo Area */}
      <div className="px-6 py-2 border-b border-red-800/20">
        <ScrollArea className="h-20">
          <div className="space-y-1 font-mono text-xs">
            {commandEchoes.map((echo, index) => (
              <div key={index} className="animate-fade-in">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">&gt;</span>
                  <span className="text-green-400">{echo.input}</span>
                  <span className="text-gray-500">[{echo.timestamp}]</span>
                </div>
                <div className="text-blue-400 ml-4">{echo.output}</div>
                {echo.stanleyComment && (
                  <div className="text-purple-400 ml-4 italic">
                    [Stanley] {echo.stanleyComment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Command Input */}
      <div className="px-6 py-3">
        <div className="flex items-center space-x-4">
          <Terminal className="h-5 w-5 text-red-500" />
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-red-500 font-mono">&gt;</span>
            <Input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command... (Tab for autocomplete)"
              className="bg-black/40 border-red-800/30 text-red-300 font-mono focus:border-red-600"
              disabled={isExecuting}
            />
            <Button
              onClick={executeCommand}
              disabled={isExecuting || !commandInput.trim()}
              size="sm"
              className="bg-red-700/50 hover:bg-red-600 border-red-600"
            >
              {isExecuting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
