
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Terminal, Zap, ArrowUp } from 'lucide-react';

interface CommandInputProps {
  commandInput: string;
  isExecuting: boolean;
  historyIndex: number;
  showAutocomplete: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onExecute: () => void;
  getCommandSuggestions: (input: string) => string[];
  setCommandInput: (cmd: string) => void;
  quickCommands: string[];
}

export const CommandInput: React.FC<CommandInputProps> = ({
  commandInput,
  isExecuting,
  historyIndex,
  showAutocomplete,
  onInputChange,
  onKeyDown,
  onExecute,
  getCommandSuggestions,
  setCommandInput,
  quickCommands
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <Terminal className="mr-2 h-5 w-5 text-red-500" />
          COMMAND INTERFACE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[calc(100%-80px)]">
        <div className="relative">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={commandInput}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
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
              onClick={onExecute}
              disabled={isExecuting}
              className={`px-6 font-bold transition-all duration-300 flex-shrink-0 ${
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
              History {historyIndex + 1}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="text-xs text-red-500/70 mb-2 tracking-wider">
            QUICK COMMANDS: (↑/↓ for history, Tab to autocomplete)
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-20 overflow-y-auto">
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
  );
};
