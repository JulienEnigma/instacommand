
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Command {
  input: string;
  output: string;
  timestamp: string;
  success: boolean;
}

interface CommandHistoryProps {
  commandHistory: Command[];
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ commandHistory }) => {
  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-wider">COMMAND HISTORY</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ScrollArea className="h-full">
          <div className="space-y-3 font-mono text-xs">
            {commandHistory.slice().reverse().map((cmd, index) => (
              <div key={index} className="flex items-start space-x-3 py-1 animate-fade-in">
                <span className="text-red-500/70 text-xs w-20 flex-shrink-0 font-mono">
                  [{cmd.timestamp}]
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-red-300 break-words">
                    {'>'} {cmd.input}
                  </div>
                  <div className={`mt-1 break-words ${cmd.success ? 'text-red-400/70' : 'text-red-500'}`}>
                    {cmd.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
