import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiChatService } from "../api/aiChatService";

// Types for chat messages
export interface ChatMessage {
  id: number;
  role: "system" | "user" | "assistant";
  content: string;
}

export interface UseChatMessagesResult {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  sessionId: string;
}

/**
 * Hook for managing chat interactions with the AI assistant
 * using TanStack Query and aiChatService
 */
export const useAiChat = (
  initialSystemMessage?: string
): UseChatMessagesResult => {
  // Initialize with session ID
  const [sessionId] = useState<string>(() => {
    // Generate a new session ID if one doesn't exist
    return aiChatService.generateSessionId();
  });

  // State for chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Start with system message if provided
    return initialSystemMessage
      ? [
          {
            id: 1,
            role: "system",
            content: initialSystemMessage,
          },
        ]
      : [];
  });

  // Initialize error state
  const [error, setError] = useState<Error | null>(null);

  // Get query client for cache management
  const queryClient = useQueryClient();

  // Create mutation for sending messages
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      // Call the chat endpoint from aiChatService
      return aiChatService.sendMessage(sessionId, content);
    },
    onSuccess: (response) => {
      // Add the AI's response to the messages
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2, // +2 because we already added the user message
          role: "assistant",
          content: response.answer,
        },
      ]);

      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ["chatHistory", sessionId] });
    },
    onError: (err: Error) => {
      setError(err);
      console.error("Chat error:", err);

      // Add an error message
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2, // +2 because we already added the user message
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    },
  });

  // Function to send a new message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message to the list
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "user",
          content,
        },
      ]);

      // Send to backend
      await mutation.mutateAsync(content);
    },
    [mutation]
  );

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
    error,
    sessionId,
  };
};
