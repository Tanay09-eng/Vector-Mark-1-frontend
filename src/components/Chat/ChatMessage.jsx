import React from "react";
import { Cpu, User, Wrench } from "lucide-react";

const TOOL_LABELS = {
  task_tool:     "TASK",
  reminder_tool: "REMINDER",
  news_tool:     "NEWS",
  search_tool:   "SEARCH",
  calendar_tool: "CALENDAR",
  progress_tool: "PROGRESS",
  memory:        "MEMORY",
  llm:           "LLM",
  system:        "SYSTEM",
};

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const time   = new Date(message.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  return (
    <div className={`msg-enter flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* Avatar */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center mt-1"
        style={{
          background: isUser
            ? "rgba(0,212,255,0.1)"
            : "rgba(0,255,157,0.08)",
          border: `1px solid ${isUser ? "rgba(0,212,255,0.25)" : "rgba(0,255,157,0.2)"}`,
        }}
      >
        {isUser
          ? <User size={13} style={{ color: "#00d4ff" }} />
          : <Cpu  size={13} style={{ color: "#00ff9d" }} />
        }
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>

        {/* Label row */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[9px] tracking-[0.2em]"
            style={{ color: isUser ? "#00d4ff" : "#3a6080" }}
          >
            {isUser ? "YOU" : "VECTOR"}
          </span>
          <span className="font-mono text-[9px]" style={{ color: "#1a3050" }}>
            {time}
          </span>
          {message.toolUsed && message.toolUsed !== "llm" && (
            <span
              className="font-mono text-[8px] px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "#00d4ff",
                letterSpacing: "0.15em",
              }}
            >
              {TOOL_LABELS[message.toolUsed] || message.toolUsed.toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className="px-4 py-3 rounded text-sm leading-relaxed whitespace-pre-wrap"
          style={isUser ? {
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "#c8e8ff",
            borderRadius: "4px 0px 4px 4px",
          } : {
            background: "rgba(4,15,30,0.9)",
            border: "1px solid rgba(0,212,255,0.1)",
            color: "#c8e8ff",
            borderRadius: "0px 4px 4px 4px",
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
