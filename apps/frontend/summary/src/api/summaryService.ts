import axios from "axios";
import { ChatRequest, ChatResponse, SummaryData } from "../types/summary";

const API_URL = "/api";

export const summaryService = {
  /**
   * Get summary dashboard data
   */
  async getSummaryData(): Promise<SummaryData> {
    try {
      const response = await axios.get<SummaryData>(`${API_URL}/summary`);
      return response.data;
    } catch (error) {
      console.error("Error fetching summary data:", error);
      throw error;
    }
  },

  /**
   * Send a question to the chat API
   * @param sessionId The unique session ID for the conversation
   * @param question The user's question
   * @returns The response from the assistant
   */
  async sendMessage(
    sessionId: string,
    question: string
  ): Promise<ChatResponse> {
    try {
      const payload: ChatRequest = {
        sessionId,
        question,
      };

      const response = await axios.post<ChatResponse>(
        `${API_URL}/chat`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },

  /**
   * Generate a new session ID
   * @returns A unique session ID
   */
  generateSessionId(): string {
    return crypto.randomUUID();
  },
};
