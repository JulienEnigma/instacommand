import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Activity } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  action: string;
  target?: string;
  details: string;
  type: 'follow' | 'story' | 'dm' | 'engage' | 'scan' | 'system' | 'stanley';
  outcome: 'success' | 'warning' | 'error';
  probability?: number;
  followbackChance?: number;
  stanleyComment?: string;
}

export const RealTimeLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'follow' | 'dm' | 'error' | 'stanley'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const logTemplates = [
    { 
      action: 'Followed', 
      target: '@julien_film', 
      details: 'Urban photographer - high compatibility', 
      type: 'follow' as const, 
      outcome: 'success' as const, 
      probability: 82, 
      followbackChance: 82,
      stanleyComment: 'Strong mutual interest signals detected'
    },
    { 
      action: 'Followed', 
      target: '@alice.k', 
      details: 'Film community member', 
      type: 'follow' as const, 
      outcome: 'success' as const, 
      probability: 67, 
      followbackChance: 67,
      stanleyComment: 'User responded via Story View, possible follow-back'
    },
    { 
      action: 'Viewed story', 
      target: '@urban_lens', 
      details: 'Story engagement logged', 
      type: 'story' as const, 
      outcome: 'success' as const,
      stanleyComment: 'High engagement timing - optimal window'
    },
    { 
      action: 'DM sent', 
      target: '@creative_souls', 
      details: 'Message delivered successfully', 
      type: 'dm' as const, 
      outcome: 'success' as const,
      stanleyComment: 'Response probability elevated based on recent activity'
    }
  ];

  useEffect(() => {
    // Add initial logs
    const initialLogs = logTemplates.slice(0, 8).map((template, index) => ({
      timestamp: new Date(Date.now() - (8 - index) * 60000).toLocaleTimeString('en-US', { hour12: false }),
      ...template
    }));
    setLogs(initialLogs);

    // Mock real-time log streaming
    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        ...template
      };

      setLogs(prev => [...prev.slice(-50), newLog]);
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'follow': return 'text-green-400';
      case 'story': return 'text-blue-400';
      case 'dm': return 'text-purple-400';
      case 'engage': return 'text-yellow-400';
      case 'scan': return 'text-cyan-400';
      case 'system': return 'text-red-400';
      case 'stanley': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  const getFollowbackDisplay = (followbackChance?: number) => {
    if (!followbackChance) return null;
    
    const color = followbackChance >= 80 ? 'text-green-400' : 
                  followbackChance >= 60 ? 'text-yellow-400' : 'text-red-400';
    
    return (
      <span className={`${color} font-bold ml-2`}>
        — followback probability: {followbackChance}%
      </span>
    );
  };

  const exportLogs = (format: 'json' | 'csv') => {
    const dataStr = format === 'json' 
      ? JSON.stringify(logs, null, 2)
      : [
          'Timestamp,Action,Target,Details,Type,Outcome,Probability,FollowbackChance',
          ...logs.map(log => 
            `"${log.timestamp}","${log.action}","${log.target || ''}","${log.details}","${log.type}","${log.outcome}","${log.probability || ''}","${log.followbackChance || ''}"`
          )
        ].join('\n');
    
    const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stanley-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'error') return log.outcome === 'error';
    return log.type === filter;
  });

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-wider flex items-center">
            <Activity className="mr-2 h-5 w-5 text-red-500" />
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></span>
            LIVE OPERATIONS LOG
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {['all', 'follow', 'dm', 'error', 'stanley'].map((filterType) => (
                <Button
                  key={filterType}
                  size="sm"
                  variant={filter === filterType ? 'default' : 'outline'}
                  onClick={() => setFilter(filterType as any)}
                  className={`text-xs ${
                    filter === filterType 
                      ? 'bg-red-700 text-white' 
                      : 'bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30'
                  }`}
                >
                  {filterType === 'error' ? '🔴' : filterType === 'stanley' ? '🧠' : ''}{filterType.toUpperCase()}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-1">
              <Button
                size="sm"
                onClick={() => exportLogs('json')}
                className="bg-purple-600/30 text-purple-300 border-purple-600/50 hover:bg-purple-600/50 text-xs"
                title="Export as JSON"
              >
                <Download className="h-3 w-3" />
                JSON
              </Button>
              <Button
                size="sm"
                onClick={() => exportLogs('csv')}
                className="bg-green-600/30 text-green-300 border-green-600/50 hover:bg-green-600/50 text-xs"
                title="Export as CSV"
              >
                <Download className="h-3 w-3" />
                CSV
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="space-y-1 font-mono text-sm">
            {filteredLogs.map((log, index) => (
              <div key={index} className="flex flex-col space-y-1 py-1 animate-fade-in">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500/70 text-xs w-20 flex-shrink-0 font-mono">
                    [{log.timestamp}]
                  </span>
                  <span className="text-xs flex-shrink-0">{getOutcomeIcon(log.outcome)}</span>
                  <div className="flex-1 min-w-0">
                    <span className={getLogColor(log.type)}>
                      {log.action} {log.target && <span className="text-red-300 font-bold">{log.target}</span>}
                      {log.type === 'follow' && getFollowbackDisplay(log.followbackChance)}
                    </span>
                    <div className="text-red-400/70 text-xs mt-1 break-words">
                      {log.details}
                    </div>
                  </div>
                </div>
                {log.stanleyComment && (
                  <div className="ml-24 text-purple-400/80 text-xs italic">
                    [Stanley] {log.stanleyComment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
