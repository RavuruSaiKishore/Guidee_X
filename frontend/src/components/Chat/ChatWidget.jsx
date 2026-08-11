import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I am your GuideX Assistant. Ask me anything about GuideX login, features, or navigation!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const updatedMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Format chat history for Gemini multi-turn structure
      const history = updatedMessages.slice(0, -1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to communicate with AI");

      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I am having trouble connecting to the GuideX server right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-1.5">
              GuideX Assistant{" "}
              <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
            </h3>
            <p className="text-xs text-blue-100">Ask about GuideX features</p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs italic pl-2">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce [animation-delay:0.2s]">●</div>
            <div className="animate-bounce [animation-delay:0.4s]">●</div>
            <span>GuideX AI is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about login, OTP, or features..."
          className="flex-1 h-12 px-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-500/20"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
