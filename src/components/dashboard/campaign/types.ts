
export interface Campaign {
  id: string;
  name: string;
  codename: string;
  status: 'active' | 'completed' | 'scheduled' | 'failed' | 'archived' | 'paused';
  progress: number;
  timeRemaining: string;
  target: number;
  current: number;
  description: string;
  completedAt?: string;
  verdict?: string;
}
