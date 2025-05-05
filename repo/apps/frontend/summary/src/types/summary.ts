export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  sessionId: string;
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources?: {
    docId: string;
    filename: string;
    content: string;
  }[];
}

export interface DataPoint {
  id: string;
  name: string;
  value: number;
  category: string;
  date: string;
  status: "HIGH" | "MEDIUM" | "LOW";
  tags: string[];
}

export interface MetricsSummary {
  totalItems: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  recentItems: number;
  byCategory: Record<string, number>;
}

export interface TabData {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface SummaryData {
  metrics: MetricsSummary;
  dataPoints: DataPoint[];
}
