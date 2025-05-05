import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, BarChart2, HelpCircle } from "lucide-react";
import "../../index.css"; // Import Tailwind CSS

// Define message type for better type safety
interface ChatMessage {
  id: number;
  role: "system" | "user" | "assistant";
  content: string;
}

export const ChatPanel = () => {
  // State for chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "system",
      content:
        "Welcome to Vista AI Assistant. Ask me anything about your organization's compliance, infrastructure, or risk metrics.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sample suggested questions
  const suggestedQuestions = [
    "What are our top compliance risks this quarter?",
    "Show me servers with critical alerts",
    "Summarize our compliance status for the board meeting",
    "Which systems need immediate security patches?",
    "What's our overall risk posture?",
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    // Only scroll if we have more than the initial message
    if (messages.length > 1) {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // Auto resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "46px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, [input]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Add a custom CSS class for the messages area
  useEffect(() => {
    // Add CSS to hide default scrollbar and add custom styling
    const style = document.createElement("style");
    style.innerHTML = `
      .chat-messages-container {
        scroll-behavior: smooth;
      }
      .chat-messages-container::-webkit-scrollbar {
        width: 6px;
      }
      .chat-messages-container::-webkit-scrollbar-track {
        background: transparent;
      }
      .chat-messages-container::-webkit-scrollbar-thumb {
        background-color: rgba(30, 58, 138, 0.5); /* Dark blue scrollbar */
        border-radius: 20px;
      }
      body {
        overflow: hidden;
      }
      .text-blue-900 {
        color: #1e3a8a;
      }
      .text-blue-700 {
        color: #1d4ed8;
      }
      .chat-input {
        color: #1e3a8a;
        caret-color: #1e3a8a;
      }
      .chat-input::placeholder {
        color: #93c5fd;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle chat submission
  const handleSubmit = () => {
    if (input.trim() === "") return;

    // Add user message
    setMessages([
      ...messages,
      { id: messages.length + 1, role: "user", content: input },
    ]);
    setInput("");
    setLoading(true);

    // Focus textarea and ensure it's in view
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Simulate AI response
    timeoutRef.current = setTimeout(() => {
      let aiResponse;

      // Generate different responses based on the query to simulate context awareness
      if (
        input.toLowerCase().includes("compliance") ||
        input.toLowerCase().includes("risk")
      ) {
        aiResponse =
          "Based on your compliance data, we have 3 high-risk documents that need immediate attention. These are related to KYC requirements and Basel III capital standards. Overall risk level is moderate, with a 12% improvement from last quarter.";
      } else if (
        input.toLowerCase().includes("server") ||
        input.toLowerCase().includes("infrastructure")
      ) {
        aiResponse =
          "Your infrastructure has 1 critical alert on the auth-prod-03 server. Memory utilization is at 92%, which exceeds the 90% threshold. There are also 5 servers with elevated CPU usage that should be monitored. Overall system health is at 87%.";
      } else if (
        input.toLowerCase().includes("board") ||
        input.toLowerCase().includes("meeting")
      ) {
        aiResponse =
          "For your board meeting, I recommend highlighting: 1) Reduced high-risk compliance issues by 42% QoQ, 2) Infrastructure uptime improved to 99.96%, 3) Successful remediation of the SEC audit findings from Q1, and 4) New AI-based monitoring deployed to 78% of critical systems.";
      } else if (
        input.toLowerCase().includes("summary") ||
        input.toLowerCase().includes("overview")
      ) {
        aiResponse =
          "Executive Summary: Compliance posture is strong with 42 low-risk, 7 medium-risk, and 3 high-risk items. Infrastructure shows 1 critical alert requiring immediate attention. Overall system health is at 87%. Risk trend is declining month-over-month by approximately 8%.";
      } else {
        aiResponse =
          "I've analyzed your question across our data sources. Your organization currently has 3 high-priority compliance items and 1 critical infrastructure alert. Would you like more specific details about either of these areas?";
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 2, role: "assistant", content: aiResponse },
      ]);
      setLoading(false);
    }, 1500);
  };

  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    // Focus the textarea after setting input
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle pressing Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Inline styles as a fallback
  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: "white",
      boxShadow: "none",
      border: "none",
      display: "flex",
      flexDirection: "column",
      height: "100%", // Fill parent container height
      width: "100%",
      position: "absolute", // Fix positioning
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      overflow: "hidden", // Prevent container scrolling
    },
    header: {
      padding: "1rem 1.5rem",
      background: "linear-gradient(to right, #2563eb, #1d4ed8)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      zIndex: 10,
    },
    chatArea: {
      flex: 1,
      padding: "1.25rem",
      overflowY: "auto",
      overflowX: "hidden",
      background: "linear-gradient(to bottom, rgba(239, 246, 255, 0.5), white)",
      msOverflowStyle: "none", // Hide scrollbar in IE/Edge
      scrollbarWidth: "none", // Hide scrollbar in Firefox
    },
    messageUser: {
      backgroundColor: "#2563eb",
      color: "white",
      borderRadius: "1rem",
      borderTopRightRadius: "0",
      padding: "0.75rem 1rem",
      maxWidth: "80%",
      boxShadow: "0 1px 2px 0 rgba(37, 99, 235, 0.1)",
    },
    messageAssistant: {
      backgroundColor: "white",
      color: "#1e3a8a",
      borderRadius: "1rem",
      borderTopLeftRadius: "0",
      padding: "0.75rem 1rem",
      maxWidth: "80%",
      border: "1px solid #dbeafe",
      boxShadow: "0 1px 2px 0 rgba(219, 234, 254, 0.1)",
    },
    messageSystem: {
      backgroundColor: "#dbeafe",
      color: "#1e3a8a",
      borderRadius: "1rem",
      padding: "0.75rem 1rem",
      maxWidth: "80%",
      border: "1px solid #bfdbfe",
    },
  };

  return (
    <div
      className="flex flex-col h-full w-full bg-white overflow-hidden"
      style={styles.container}
    >
      {/* Chat Header */}
      <div
        className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between"
        style={styles.header}
      >
        <div className="flex items-center">
          <div className="bg-white/20 p-2 rounded-lg mr-3">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Vista AI Assistant</h2>
            <p className="text-xs text-blue-100">
              Executive insights from your data
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Help"
          >
            <HelpCircle size={16} />
          </button>
          <button
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Charts"
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </div>

      {/* Chat Messages - Flex-grow to fill available space */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-blue-50/50 to-white chat-messages-container"
        style={styles.chatArea}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              role={message.role === "user" ? "complementary" : "article"}
            >
              {message.role !== "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                  {message.role === "system" ? (
                    <HelpCircle size={16} className="text-blue-600" />
                  ) : (
                    <MessageSquare size={16} className="text-blue-600" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-200"
                    : message.role === "system"
                    ? "bg-blue-100 text-blue-900 border border-blue-200"
                    : "bg-white text-blue-900 rounded-tl-none border border-blue-100 shadow-blue-100"
                }`}
                style={
                  message.role === "user"
                    ? styles.messageUser
                    : message.role === "system"
                    ? styles.messageSystem
                    : styles.messageAssistant
                }
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0">
                  <div className="text-white font-semibold text-sm">ME</div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div
              className="flex justify-start"
              role="status"
              aria-label="Assistant is typing"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                <MessageSquare size={16} className="text-blue-600" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-gray-800 rounded-tl-none border border-blue-100 shadow-sm shadow-blue-100">
                <div className="flex space-x-2 items-center">
                  <div
                    className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length < 3 && (
        <div className="px-6 py-3 border-t border-blue-100 bg-blue-50/50 flex-shrink-0">
          <p className="text-xs text-blue-600 font-medium mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="px-3 py-1.5 text-xs bg-white text-blue-700 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-blue-100 bg-white flex-shrink-0">
        {/* make input text color blue */}

        <div className="flex items-center bg-blue-50 text-blue-900 rounded-full shadow-inner border border-blue-100 overflow-hidden">
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-grow py-3 px-4 bg-transparent focus:outline-none resize-none chat-input"
            placeholder="Ask me anything about your organization's data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ overflowY: "auto" }}
            aria-label="Chat input"
          />
          <button
            className={`p-3 m-1 rounded-full flex-shrink-0 transition-colors ${
              loading || input.trim() === ""
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleSubmit}
            disabled={loading || input.trim() === ""}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-xs text-grey-500 mt-2 text-center">
          Vista AI combines your data from compliance systems, infrastructure
          monitoring, and risk reports.
        </div>
      </div>
    </div>
  );
};
