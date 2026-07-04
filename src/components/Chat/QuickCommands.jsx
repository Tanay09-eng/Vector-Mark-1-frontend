import React from "react";
import { useChat } from "../../hooks/useChat";

const COMMANDS = [
  { label: "STATUS",    cmd: "system status" },
  { label: "HEADLINES", cmd: "top headlines" },
  { label: "TASKS",     cmd: "list my tasks" },
  { label: "PROGRESS",  cmd: "show my progress" },
  { label: "CALENDAR",  cmd: "what's on my calendar today" },
  { label: "HELP",      cmd: "what can you do" },
];

export default function QuickCommands() {
  const { sendMessage } = useChat();

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 border-b flex-wrap shrink-0"
      style={{ borderColor: "rgba(0,212,255,0.08)", background: "rgba(2,8,16,0.6)" }}
    >
      {COMMANDS.map(({ label, cmd }) => (
        <button
          key={label}
          onClick={() => sendMessage(cmd)}
          className="font-mono text-[9px] tracking-[0.15em] px-2.5 py-1 rounded transition-all duration-150"
          style={{
            border: "1px solid rgba(0,212,255,0.12)",
            color: "#3a6080",
            background: "transparent",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
            e.currentTarget.style.color = "#00d4ff";
            e.currentTarget.style.background = "rgba(0,212,255,0.06)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)";
            e.currentTarget.style.color = "#3a6080";
            e.currentTarget.style.background = "transparent";
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
