import React, { useState } from "react";
import { MessageSquare, X, Sparkles } from "lucide-react";
import ChatWidget from "./ChatWidget";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Modal Window */}
      {isOpen && (
        <div className="mb-4 w-[380px] sm:w-[400px] shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <ChatWidget />
        </div>
      )}

      {/* Floating Toggle Button Container with Tooltip */}
      <div className="flex items-center gap-3 group">
        {/* Helper text bubble (hidden when chat is open) */}
        {!isOpen && (
          <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-1.5 animate-bounce transition-all duration-300">
            <Sparkles size={13} className="text-blue-600 fill-blue-600" />
            <span>Chat with AI</span>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
          aria-label="Toggle chat"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </div>
  );
}
