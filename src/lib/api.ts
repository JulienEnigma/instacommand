const API_BASE_URL = 'http://localhost:8000';

export interface LogEntry {
  timestamp: string;
  action: string;
  target?: string;
  details: string;
  type: 'follow' | 'story' | 'dm' | 'engage' | 'scan' | 'system' | 'stanley';
  outcome: 'success' | 'warning' | 'error';
  probability?: number;
  followbackChance?: number;
}

export interface Command {
  input: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export interface StanleyMessage {
  type: 'insight' | 'recommendation' | 'alert' | 'analysis' | 'status';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  data?: any;
}

export interface ProfileStats {
  followers: number;
  following: number;
  posts: number;
  refreshInterval: number;
}

class SocialCommanderAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }

  async logout() {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST'
    });
    return response.json();
  }

  async getAuthStatus() {
    const response = await fetch(`${this.baseUrl}/auth/status`);
    return response.json();
  }

  async scanHashtag(hashtag: string, limit: number = 20) {
    const response = await fetch(`${this.baseUrl}/instagram/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hashtag, limit })
    });
    return response.json();
  }

  async followUser(username: string) {
    const response = await fetch(`${this.baseUrl}/instagram/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    return response.json();
  }

  async sendDM(username: string, message: string) {
    const response = await fetch(`${this.baseUrl}/instagram/dm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message })
    });
    return response.json();
  }

  async getProfileStats(): Promise<ProfileStats> {
    const response = await fetch(`${this.baseUrl}/instagram/profile/stats`);
    return response.json();
  }

  async getScreenshot() {
    const response = await fetch(`${this.baseUrl}/instagram/mirror/screenshot`);
    return response.json();
  }

  async pauseOperations() {
    const response = await fetch(`${this.baseUrl}/instagram/operations/pause`, {
      method: 'POST'
    });
    return response.json();
  }

  async resumeOperations() {
    const response = await fetch(`${this.baseUrl}/instagram/operations/resume`, {
      method: 'POST'
    });
    return response.json();
  }

  async getLogs(limit: number = 100, logType?: string): Promise<LogEntry[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (logType) params.append('log_type', logType);
    
    const response = await fetch(`${this.baseUrl}/logs/?${params}`);
    return response.json();
  }

  async generateText(prompt: string, maxLength: number = 150, temperature: number = 0.7) {
    const response = await fetch(`${this.baseUrl}/llm/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_length: maxLength, temperature })
    });
    return response.json();
  }

  async stanleyInsight(context: any): Promise<StanleyMessage> {
    const response = await fetch(`${this.baseUrl}/llm/stanley/insight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async stanleyRecommendation(data: any): Promise<StanleyMessage> {
    const response = await fetch(`${this.baseUrl}/llm/stanley/recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getSystemStatus() {
    const response = await fetch(`${this.baseUrl}/status/`);
    return response.json();
  }

  async getMetrics() {
    const response = await fetch(`${this.baseUrl}/status/metrics`);
    return response.json();
  }

  createLogWebSocket(onMessage: (log: LogEntry) => void, onError?: (error: Event) => void) {
    const ws = new WebSocket(`ws://localhost:8000/logs/stream`);
    
    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        onMessage(log);
      } catch (error) {
        console.error('Error parsing log message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    return ws;
  }
}

export const api = new SocialCommanderAPI();
export default api;
