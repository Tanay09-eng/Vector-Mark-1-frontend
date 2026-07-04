import React from "react";
import { CheckSquare, Bell, TrendingUp, Brain } from "lucide-react";
import { useVector } from "../../store/VectorContext";
import TaskPanel from "./TaskPanel";
import ProgressPanel from "./ProgressPanel";
import RemindersPanel from "./RemindersPanel";
import MemoryPanel from "./MemoryPanel";

const TABS = [
  { id: "tasks",     icon: CheckSquare, label: "TASKS",    color: "#00d4ff" },
  { id: "reminders", icon: Bell,        label: "REMIND",   color: "#ff6b35" },
  { id: "progress",  icon: TrendingUp,  label: "PROGRESS", color: "#00ff9d" },
  { id: "memory",    icon: Brain,       label: "MEMORY",   color: "#9b59b6" },
];

export default function Sidebar() {
  const { state, dispatch } = useVector();

  const activeTab = TABS.find(t => t.id === state.sidebarTab);

  return (
    <div
      className="flex flex-col w-64 shrink-0 border-l h-full"
      style={{
        borderColor: "rgba(0,212,255,0.08)",
        background: "rgba(2,6,14,0.95)",
      }}
    >
      {/* Tab bar */}
      <div
        className="flex border-b shrink-0"
        style={{ borderColor: "rgba(0,212,255,0.08)" }}
      >
        {TABS.map(({ id, icon: Icon, label, color }) => {
          const active = state.sidebarTab === id;
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: "SET_SIDEBAR_TAB", payload: id })}
              className="flex-1 flex flex-col items-center py-2.5 gap-1 transition-all duration-150"
              style={{
                borderBottom: active ? `1px solid ${color}` : "1px solid transparent",
                background: active ? `${color}0a` : "transparent",
                marginBottom: "-1px",
              }}
            >
              <Icon
                size={12}
                style={{ color: active ? color : "#2a4a5e" }}
              />
              <span
                className="font-mono text-[8px] tracking-widest"
                style={{ color: active ? color : "#2a4a5e" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {state.sidebarTab === "tasks"     && <TaskPanel />}
        {state.sidebarTab === "reminders" && <RemindersPanel />}
        {state.sidebarTab === "progress"  && <ProgressPanel />}
        {state.sidebarTab === "memory"    && <MemoryPanel />}
      </div>

      {/* Bottom system info */}
      <div
        className="px-3 py-2 border-t shrink-0"
        style={{ borderColor: "rgba(0,212,255,0.08)" }}
      >
        {state.systemStatus && (
          <div className="flex flex-col gap-1">
            {Object.entries(state.systemStatus.tools || {}).map(([tool, enabled]) => (
              <div key={tool} className="flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-widest" style={{ color: "#2a4a5e" }}>
                  {tool.toUpperCase()}
                </span>
                <div
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: enabled ? "#00ff9d" : "#3a6080",
                    boxShadow: enabled ? "0 0 4px #00ff9d" : "none",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
