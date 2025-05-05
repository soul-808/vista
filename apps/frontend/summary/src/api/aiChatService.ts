import api from "./summaryApi";
import { ChatRequest, ChatResponse } from "../types/summary";

/**
 * Service for handling AI assistant chat interactions
 */
export const aiChatService = {
  /**
   * Send a message to the chat API endpoint
   * @param sessionId The unique session ID for the conversation
   * @param question The user's question/message
   * @returns The response from the assistant
   */
  async sendMessage(
    sessionId: string,
    question: string
  ): Promise<ChatResponse> {
    try {
      const payload: ChatRequest = { sessionId, question };
      const { data } = await api.post<ChatResponse>("/chat", payload);
      return data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },

  /**
   * Generate a new session ID using crypto.randomUUID()
   * @returns A unique session ID
   */
  generateSessionId(): string {
    return crypto.randomUUID();
  },
};
