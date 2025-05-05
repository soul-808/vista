// Example shared models for the application
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  details?: Record<string, any>;
} 