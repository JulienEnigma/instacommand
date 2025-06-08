
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  timestamp: string;
  action: string;
  target?: string;
  details: string;
  type: 'follow' | 'story' | 'dm' | 'engage' | 'scan' | 'system';
}

export const RealTimeLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const logTemplates = [
    { action: '→ Followed', target: '@julien_film', details: 'Engagement score: 8.2/10', type: 'follow' as const },
    { action: '→ Viewed story of', target: '@alice.k', details: 'Story engagement +1', type: 'story' as const },
    { action: '→ Logged engagement data for', target: '@filmfest.mythos', details: 'Data updated in target intel', type: 'engage' as const },
    { action: '→ Sent contextual DM to', target: '@urban_lens', details: 'Message: "Amazing street photography!"', type: 'dm' as const },
    { action: '→ Scanning hashtag', target: '#streetphotography', details: 'Found 12 new targets', type: 'scan' as const },
    { action: '→ Target assessment', target: '@photo_maven', details: 'Compatibility: 94% - Added to queue', type: 'scan' as const },
    { action: '→ Liked recent post by', target: '@creative_souls', details: 'Post: urban landscape series', type: 'engage' as const },
    { action: '→ Story view completed', target: '@city_explorer', details: 'Viewed 3/5 stories', type: 'story' as const },
    { action: '→ Profile analysis', target: '@visual_artist', details: 'High engagement potential detected', type: 'scan' as const },
    { action: '→ Followed back by', target: '@indie_filmmaker', details: 'Mutual follow established', type: 'follow' as const },
    { action: '[SYSTEM] Reflex node', target: '', details: 'Self-analysis cycle initiated', type: 'system' as const },
    { action: '[SYSTEM] Target queue', target: '', details: 'Updated with 8 new prospects', type: 'system' as const },
    { action: '→ Geographic scan', target: 'Los Angeles', details: 'Film industry targets identified', type: 'scan' as const },
  ];

  useEffect(() => {
    // Add initial logs
    const initialLogs = logTemplates.slice(0, 5).map((template, index) => ({
      timestamp: new Date(Date.now() - (5 - index) * 60000).toLocaleTimeString('en-US', { hour12: false }),
      ...template
    }));
    setLogs(initialLogs);

    // Mock real-time log streaming every 2-5 seconds
    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        ...template
      };

      setLogs(prev => [...prev.slice(-50), newLog]); // Keep last 50 logs
    }, Math.random() * 3000 + 2000); // 2-5 second intervals

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
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
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-wider flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></span>
          REAL-TIME INFILTRATION LOGS
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="space-y-1 font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 py-1 animate-fade-in">
                <span className="text-red-500/70 text-xs w-20 flex-shrink-0">
                  [{log.timestamp}]
                </span>
                <div className="flex-1 min-w-0">
                  <span className={getLogColor(log.type)}>
                    {log.action} {log.target && <span className="text-red-300 font-bold">{log.target}</span>}
                  </span>
                  <div className="text-red-400/70 text-xs mt-1 ml-4 break-words">
                    {log.details}
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
