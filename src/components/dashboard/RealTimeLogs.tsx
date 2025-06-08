
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  action: string;
  target?: string;
  details: string;
  type: 'follow' | 'story' | 'dm' | 'engage' | 'scan' | 'system' | 'stanley';
  outcome: 'success' | 'warning' | 'error';
  probability?: number;
}

export const RealTimeLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'follow' | 'dm' | 'error' | 'stanley'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const logTemplates = [
    { action: '→ Followed', target: '@julien_film', details: 'Follow-back probability: 82%', type: 'follow' as const, outcome: 'success' as const, probability: 82 },
    { action: '→ Viewed story', target: '@alice.k', details: 'Story engagement logged', type: 'story' as const, outcome: 'success' as const },
    { action: '→ Engagement logged', target: '@filmfest.mythos', details: 'Added to high-value targets', type: 'engage' as const, outcome: 'success' as const },
    { action: '→ DM sent', target: '@urban_lens', details: 'Message: "Amazing street work!" delivered', type: 'dm' as const, outcome: 'success' as const },
    { action: '→ Hashtag scan', target: '#streetphotography', details: '12 new targets identified', type: 'scan' as const, outcome: 'success' as const },
    { action: '→ Target analysis', target: '@photo_maven', details: 'Compatibility: 94% - queued', type: 'scan' as const, outcome: 'success' as const },
    { action: '→ Post liked', target: '@creative_souls', details: 'Urban landscape series', type: 'engage' as const, outcome: 'success' as const },
    { action: '→ Story batch', target: '@city_explorer', details: 'Viewed 3/5 stories in sequence', type: 'story' as const, outcome: 'success' as const },
    { action: '→ Follow attempt', target: '@private_account', details: 'Account private - follow pending', type: 'follow' as const, outcome: 'warning' as const },
    { action: '→ DM failed', target: '@restricted_user', details: 'DMs not allowed - user settings', type: 'dm' as const, outcome: 'error' as const },
    { action: '[Stanley] Strategy shift', target: '', details: 'Engagement down 12%. Switching to alternate pool.', type: 'stanley' as const, outcome: 'success' as const },
    { action: '[Stanley] Suggestion', target: '', details: 'Type "pause ops" to avoid burnout', type: 'stanley' as const, outcome: 'success' as const },
    { action: '[SYS] Reflex update', target: '', details: 'Neural pathways optimized - v2.1.4', type: 'system' as const, outcome: 'success' as const },
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
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></span>
            LIVE OPERATIONS LOG
          </CardTitle>
          
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
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="space-y-1 font-mono text-sm">
            {filteredLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 py-1 animate-fade-in">
                <span className="text-red-500/70 text-xs w-20 flex-shrink-0">
                  [{log.timestamp}]
                </span>
                <span className="text-xs">{getOutcomeIcon(log.outcome)}</span>
                <div className="flex-1 min-w-0">
                  <span className={getLogColor(log.type)}>
                    {log.action} {log.target && <span className="text-red-300 font-bold">{log.target}</span>}
                  </span>
                  <div className="text-red-400/70 text-xs mt-1 ml-4 break-words">
                    {log.details}
                    {log.probability && (
                      <span className="text-green-400 font-bold ml-2">
                        — followback probability: {log.probability}%
                      </span>
                    )}
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
