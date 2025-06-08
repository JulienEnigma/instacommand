
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, Zap, Activity, AlertTriangle, CheckCircle, Settings, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  status: 'optimal' | 'warning' | 'critical';
  unit: string;
  icon: React.ReactNode;
}

interface OptimizationTask {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  estimated: string;
  status: 'pending' | 'running' | 'completed';
}

export const SystemOptimization = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      value: 23,
      max: 100,
      status: 'optimal',
      unit: '%',
      icon: <Cpu className="h-4 w-4" />
    },
    {
      name: 'Memory',
      value: 67,
      max: 100,
      status: 'warning',
      unit: '%',
      icon: <HardDrive className="h-4 w-4" />
    },
    {
      name: 'Network',
      value: 45,
      max: 100,
      status: 'optimal',
      unit: '%',
      icon: <Activity className="h-4 w-4" />
    },
    {
      name: 'Bot Efficiency',
      value: 89,
      max: 100,
      status: 'optimal',
      unit: '%',
      icon: <Zap className="h-4 w-4" />
    }
  ]);

  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Memory Cleanup',
      description: 'Clear unused cache and temporary data',
      impact: 'medium',
      estimated: '2min',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Neural Path Optimization',
      description: 'Optimize Stanley\'s decision algorithms',
      impact: 'high',
      estimated: '5min',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Database Indexing',
      description: 'Rebuild target intelligence indexes',
      impact: 'low',
      estimated: '1min',
      status: 'pending'
    }
  ]);

  const [autoOptimize, setAutoOptimize] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(metric.max, metric.value + (Math.random() - 0.5) * 10)),
        status: metric.value > 80 ? 'critical' : metric.value > 60 ? 'warning' : 'optimal'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle className="h-3 w-3" />;
      case 'warning': return <AlertTriangle className="h-3 w-3" />;
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const runOptimization = (taskId: string) => {
    setOptimizationTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'running' } : task
    ));

    setTimeout(() => {
      setOptimizationTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      ));
      
      // Improve relevant metrics
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value - Math.random() * 20)
      })));

      toast({
        title: "Optimization Complete",
        description: `Task completed successfully`,
      });
    }, 3000);
  };

  const runAllOptimizations = () => {
    optimizationTasks
      .filter(task => task.status === 'pending')
      .forEach((task, index) => {
        setTimeout(() => runOptimization(task.id), index * 1000);
      });
  };

  return (
    <Card className="bg-black/60 border-red-800/30 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-wider flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
            SYSTEM OPTIMIZATION
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => setAutoOptimize(!autoOptimize)}
              variant={autoOptimize ? "default" : "outline"}
              className={`text-xs ${
                autoOptimize 
                  ? 'bg-green-700 text-white' 
                  : 'bg-black/40 border-red-800/30 text-red-400 hover:bg-red-900/30'
              }`}
            >
              <Settings className="mr-1 h-3 w-3" />
              AUTO
            </Button>
            <Button
              size="sm"
              onClick={runAllOptimizations}
              className="bg-blue-700/50 hover:bg-blue-600 border-blue-600 text-xs"
            >
              OPTIMIZE ALL
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* System Metrics */}
        <div className="space-y-3">
          <div className="text-sm font-bold text-red-300">System Metrics</div>
          {metrics.map((metric, index) => (
            <div key={index} className="p-3 bg-red-950/20 border border-red-800/30 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={getStatusColor(metric.status)}>{metric.icon}</span>
                  <span className="text-sm text-red-300">{metric.name}</span>
                  <span className={getStatusColor(metric.status)}>
                    {getStatusIcon(metric.status)}
                  </span>
                </div>
                <span className="text-xs font-mono">
                  {metric.value.toFixed(0)}{metric.unit}
                </span>
              </div>
              <Progress 
                value={(metric.value / metric.max) * 100} 
                className="h-2 bg-red-950/50"
              />
            </div>
          ))}
        </div>

        {/* Optimization Tasks */}
        <div className="space-y-3">
          <div className="text-sm font-bold text-red-300">Optimization Queue</div>
          {optimizationTasks.map((task) => (
            <div key={task.id} className="p-3 bg-black/40 border border-red-800/20 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-red-300">{task.name}</span>
                  <Badge className={`${getImpactColor(task.impact)} text-xs text-white`}>
                    {task.impact.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{task.estimated}</span>
                  {task.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => runOptimization(task.id)}
                      className="bg-green-700/50 hover:bg-green-600 border-green-600 text-xs"
                    >
                      RUN
                    </Button>
                  )}
                  {task.status === 'running' && (
                    <Badge className="bg-yellow-600 text-xs text-white animate-pulse">
                      RUNNING
                    </Badge>
                  )}
                  {task.status === 'completed' && (
                    <Badge className="bg-green-600 text-xs text-white">
                      DONE
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">{task.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
