
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Command, Terminal, Cpu, Activity, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from "sonner";

const systemStatus = {
  audienceAnalyzer: { status: "active", uptime: "99.2%", lastRun: "2 min ago" },
  contentGenerator: { status: "active", uptime: "98.7%", lastRun: "5 min ago" },
  competitorTracker: { status: "active", uptime: "99.8%", lastRun: "1 min ago" },
  engagementPredictor: { status: "idle", uptime: "97.3%", lastRun: "1 hour ago" },
  hashtagOptimizer: { status: "active", uptime: "99.1%", lastRun: "3 min ago" },
};

const missions = [
  { 
    id: 1, 
    name: "Daily Audience Scan", 
    status: "running", 
    progress: 78, 
    eta: "5 min",
    description: "Analyzing follower behavior patterns"
  },
  { 
    id: 2, 
    name: "Competitor Intel Gathering", 
    status: "scheduled", 
    progress: 0, 
    eta: "2 hours",
    description: "Next scan at 8:00 PM"
  },
  { 
    id: 3, 
    name: "Content Optimization", 
    status: "completed", 
    progress: 100, 
    eta: "Complete",
    description: "Generated 12 post ideas"
  },
  { 
    id: 4, 
    name: "Hashtag Research", 
    status: "paused", 
    progress: 45, 
    eta: "Paused",
    description: "Manual review required"
  },
];

const logs = [
  { time: "14:32", level: "INFO", message: "Audience analyzer detected 127 new potential followers" },
  { time: "14:31", level: "SUCCESS", message: "Content generator created 3 high-engagement post ideas" },
  { time: "14:29", level: "INFO", message: "Competitor @techguru_mike posted new content - analyzing" },
  { time: "14:27", level: "WARNING", message: "Engagement predictor confidence below 85%" },
  { time: "14:25", level: "INFO", message: "Hashtag optimizer found 5 trending tags in your niche" },
];

export const MissionControl = () => {
  const [autoMode, setAutoMode] = useState(true);
  const [customPrompt, setCustomPrompt] = useState("");

  const executeCustomCommand = () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter a command");
      return;
    }
    toast.success(`Executing: ${customPrompt}`);
    setCustomPrompt("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "running": return "bg-blue-500";
      case "completed": return "bg-purple-500";
      case "scheduled": return "bg-yellow-500";
      case "paused": return "bg-orange-500";
      case "idle": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "SUCCESS": return "text-green-400";
      case "WARNING": return "text-yellow-400";
      case "ERROR": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="grid gap-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(systemStatus).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(value.status)}`}></div>
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{value.uptime}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Processing Power</span>
                <span>84%</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Accuracy Rate</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Learning Speed</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-mode" className="text-sm">Auto Mode</Label>
              <Switch
                id="auto-mode"
                checked={autoMode}
                onCheckedChange={setAutoMode}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Quick Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  Start All
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Pause className="h-3 w-3 mr-1" />
                  Pause All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Missions */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Active Missions
          </CardTitle>
          <CardDescription>Real-time AI operations and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{mission.name}</h4>
                      <Badge className={getStatusColor(mission.status)}>
                        {mission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{mission.eta}</div>
                    <div className="text-xs text-muted-foreground">ETA</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Command Interface */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            AI Command Interface
          </CardTitle>
          <CardDescription>Execute custom AI operations and analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-command">Custom Command</Label>
            <div className="flex gap-2">
              <Input
                id="custom-command"
                placeholder="e.g., 'Analyze competitor @username's last 10 posts'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
              <Button onClick={executeCustomCommand} className="bg-purple-600 hover:bg-purple-700">
                Execute
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Quick Commands</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Scanning audience...")}>
                Scan Audience
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Generating content...")}>
                Generate Content
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Analyzing competitors...")}>
                Analyze Competitors
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Optimizing hashtags...")}>
                Optimize Tags
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>Real-time AI activity and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-slate-700/30 rounded text-sm">
                <span className="text-muted-foreground min-w-12">{log.time}</span>
                <span className={`min-w-16 font-medium ${getLevelColor(log.level)}`}>{log.level}</span>
                <span className="flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
