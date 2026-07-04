import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { useVector } from "../../store/VectorContext";
import { Cpu } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex gap-3 msg-enter">
      <div
        className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-1"
        style={{
          background: "rgba(0,255,157,0.08)",
          border: "1px solid rgba(0,255,157,0.2)",
        }}
      >
        <Cpu size={13} style={{ color: "#00ff9d" }} />
      </div>
      <div
        className="px-4 py-3 rounded flex items-center gap-1.5"
        style={{
          background: "rgba(4,15,30,0.9)",
          border: "1px solid rgba(0,212,255,0.1)",
          borderRadius: "0 4px 4px 4px",
        }}
      >
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 opacity-60">
      {/* Animated hex */}
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 border-2 rotate-45 animate-spin-slow"
          style={{ borderColor: "rgba(0,212,255,0.4)" }}
        />
        <div
          className="absolute inset-2 border rotate-12 animate-pulse"
          style={{ borderColor: "rgba(0,255,157,0.3)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu size={18} style={{ color: "#00d4ff" }} />
        </div>
      </div>

      <div className="text-center">
        <p
          className="font-display text-lg tracking-[0.3em] mb-2"
          style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}
        >
          VECTOR ONLINE
        </p>
        <p className="font-mono text-xs tracking-widest" style={{ color: "#3a6080" }}>
          AWAITING YOUR COMMAND
        </p>
      </div>

      <div
        className="font-mono text-xs text-center leading-relaxed max-w-xs"
        style={{ color: "#1a3050" }}
      >
        <p>Type or speak to begin.</p>
        <p className="mt-1">Try: "What are my tasks?" or "Top news today"</p>
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { state } = useVector();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isThinking]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
      style={{ scrollbarGutter: "stable" }}
    >
      {state.messages.length === 0 && !state.isThinking && <WelcomeMessage />}

      {state.messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {state.isThinking && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
