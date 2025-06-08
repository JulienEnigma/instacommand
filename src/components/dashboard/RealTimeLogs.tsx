import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Activity } from 'lucide-react';
import api, { LogEntry } from '@/lib/api';



export const RealTimeLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'follow' | 'dm' | 'error' | 'stanley'>('all');
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const loadInitialLogs = async () => {
      try {
        const initialLogs = await api.getLogs(50);
        setLogs(initialLogs);
      } catch (error) {
        console.error('Failed to load initial logs:', error);
        const mockLogs: LogEntry[] = [
          { timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }), action: 'System', details: 'Backend connection failed - using mock data', type: 'system', outcome: 'warning' }
        ];
        setLogs(mockLogs);
      }
    };

    const connectWebSocket = () => {
      try {
        wsRef.current = api.createLogWebSocket(
          (newLog: LogEntry) => {
            setLogs(prev => [...prev.slice(-49), newLog]);
          },
          (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
            setTimeout(connectWebSocket, 5000);
          }
        );

        wsRef.current.onopen = () => {
          setIsConnected(true);
        };

        wsRef.current.onclose = () => {
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setIsConnected(false);
      }
    };

    loadInitialLogs();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
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
            <span className={`w-2 h-2 rounded-full animate-pulse mr-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            LIVE OPERATIONS LOG
            <span className={`ml-2 text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '● CONNECTED' : '● DISCONNECTED'}
            </span>
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
              <div key={index} className="flex items-start space-x-3 py-1 animate-fade-in">
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
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
