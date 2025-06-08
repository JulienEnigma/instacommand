
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Terminal, Zap, ArrowUp } from 'lucide-react';

interface Command {
  input: string;
  output: string;
  timestamp: string;
  success: boolean;
}

interface StanleySuggestion {
  text: string;
  reason: string;
  timestamp: string;
}

export const CommandInterface = () => {
  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  const [stanleySuggestions, setStanleySuggestions] = useState<StanleySuggestion[]>([
    {
      text: 'pause ops',
      reason: 'High activity detected - prevent burnout',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  ]);

  const allCommands = [
    'scan #photography', 'scan #streetphotography', 'scan #filmmaking',
    'follow @target', 'follow batch', 'follow priority',
    'status all', 'status targets', 'status campaigns',
    'pause ops', 'resume ops', 'pause campaign',
    'reflex update', 'reflex status', 'reflex revert',
    'initiate ghost_reach', 'initiate shadow_network',
    'stanley report', 'stanley analysis', 'stanley suggest',
    'export logs', 'export targets', 'clear logs'
  ];

  const getCommandSuggestions = (input: string) => {
    return allCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(input.toLowerCase()) && cmd !== input
    ).slice(0, 5);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyCommands = commandHistory.map(cmd => cmd.input);
      if (historyIndex < historyCommands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommandInput(historyCommands[historyCommands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const historyCommands = commandHistory.map(cmd => cmd.input);
        setCommandInput(historyCommands[historyCommands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getCommandSuggestions(commandInput);
      if (suggestions.length > 0) {
        setCommandInput(suggestions[0]);
      }
    } else if (e.key === 'Enter' && !isExecuting) {
      executeCommand();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommandInput(value);
    setHistoryIndex(-1);
    setShowAutocomplete(value.length > 0 && getCommandSuggestions(value).length > 0);
  };

  const executeCommand = () => {
    if (!commandInput.trim()) return;

    setIsExecuting(true);
    setShowAutocomplete(false);
    
    setTimeout(() => {
      const mockResponses = [
        { text: `Executing: ${commandInput}`, success: true },
        { text: `Target ${commandInput} added to queue`, success: true },
        { text: `Scan completed for ${commandInput} - 15 new targets`, success: true },
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

      setCommandHistory(prev => [...prev, newCommand].slice(-20));
      setCommandInput('');
      setIsExecuting(false);
      setHistoryIndex(-1);
      
      if (response.success) {
        toast.success(`Command executed: ${commandInput}`);
      } else {
        toast.error(`Command failed: ${commandInput}`);
      }
    }, 1000 + Math.random() * 2000);
  };

  const executeSuggestion = (suggestion: string) => {
    setCommandInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Generate Stanley suggestions periodically
  useEffect(() => {
    const suggestions = [
      { text: 'pause ops', reason: 'High activity detected - prevent burnout' },
      { text: 'reflex update', reason: 'Performance decline - neural refresh needed' },
      { text: 'scan #filmfestival', reason: 'High engagement window detected' },
      { text: 'stanley analysis', reason: 'Pattern anomaly requires review' },
      { text: 'export logs', reason: 'Daily backup recommended' }
    ];

    const interval = setInterval(() => {
      const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setStanleySuggestions(prev => [...prev.slice(-2), {
        ...suggestion,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      }]);
    }, Math.random() * 15000 + 10000);

    return () => clearInterval(interval);
  }, []);

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
      {/* Stanley Suggestions */}
      {stanleySuggestions.length > 0 && (
        <Card className="bg-orange-900/20 border-orange-500/30 text-orange-300 backdrop-blur-md">
          <CardContent className="p-3">
            <div className="text-xs text-orange-400 mb-2">🧠 STANLEY SUGGESTS:</div>
            {stanleySuggestions.slice(-1).map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-mono">
                    Type: <span className="text-orange-200 font-bold">{suggestion.text}</span>
                  </div>
                  <div className="text-xs text-orange-400/70">{suggestion.reason}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => executeSuggestion(suggestion.text)}
                  className="bg-orange-600 hover:bg-orange-500 text-black text-xs"
                >
                  Use
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold tracking-wider flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-red-500" />
            COMMAND INTERFACE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={commandInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={commandInput ? '' : 'scan #photography'}
                  className="bg-black/80 border-red-800/50 text-red-400 font-mono placeholder-red-700/50 focus:border-red-500"
                  disabled={isExecuting}
                />
                {!commandInput && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-700/40 font-mono text-sm pointer-events-none">
                    scan #photography
                  </div>
                )}
                
                {/* Autocomplete dropdown */}
                {showAutocomplete && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-black/90 border border-red-800/50 rounded-md mt-1 max-h-32 overflow-y-auto">
                    {getCommandSuggestions(commandInput).map((cmd, index) => (
                      <div
                        key={index}
                        onClick={() => setCommandInput(cmd)}
                        className="px-3 py-2 text-sm font-mono text-red-400 hover:bg-red-900/30 cursor-pointer"
                      >
                        {cmd}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            
            {/* History indicator */}
            {historyIndex >= 0 && (
              <div className="absolute -top-6 left-0 text-xs text-red-500/70 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                History {historyIndex + 1}/{commandHistory.length}
              </div>
            )}
          </div>
          
          <div>
            <div className="text-xs text-red-500/70 mb-2 tracking-wider">
              QUICK COMMANDS: (↑/↓ for history, Tab to autocomplete)
            </div>
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
