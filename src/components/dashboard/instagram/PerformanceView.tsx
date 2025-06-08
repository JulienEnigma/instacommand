
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
}

interface PerformanceViewProps {
  performanceMetrics: PerformanceMetric[];
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ performanceMetrics }) => {
  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-bold mb-3">Performance Metrics</div>
      {performanceMetrics.map((metric, index) => (
        <div key={index} className="p-3 bg-black/40 border border-red-800/20 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-red-300">{metric.label}</span>
            <span className={`text-xs ${getChangeColor(metric.change)}`}>
              {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}{metric.unit}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-red-400">
              {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}{metric.unit}
            </span>
            <div className="flex-1">
              <Progress 
                value={Math.min(100, (metric.value / (metric.value + Math.abs(metric.change))) * 100)} 
                className="h-1 bg-red-950/50"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
