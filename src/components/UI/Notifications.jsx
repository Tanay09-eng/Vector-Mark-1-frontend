import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useVector } from "../../store/VectorContext";

const STYLES = {
  success: { icon: CheckCircle, color: "#00ff9d", bg: "rgba(0,255,157,0.08)", border: "rgba(0,255,157,0.25)" },
  error:   { icon: AlertCircle, color: "#ff4444", bg: "rgba(255,68,68,0.08)",  border: "rgba(255,68,68,0.3)" },
  info:    { icon: Info,        color: "#00d4ff", bg: "rgba(0,212,255,0.06)",  border: "rgba(0,212,255,0.2)" },
};

export default function Notifications() {
  const { state, dispatch } = useVector();

  if (!state.notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {state.notifications.map((n) => {
        const style = STYLES[n.type] || STYLES.info;
        const Icon = style.icon;
        return (
          <div
            key={n.id}
            className="msg-enter flex items-center gap-2.5 px-3 py-2.5 rounded pointer-events-auto"
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              backdropFilter: "blur(8px)",
              minWidth: "220px",
              maxWidth: "300px",
            }}
          >
            <Icon size={12} style={{ color: style.color, flexShrink: 0 }} />
            <span className="text-xs flex-1" style={{ color: "#c8e8ff" }}>{n.message}</span>
            <button
              onClick={() => dispatch({ type: "REMOVE_NOTIFICATION", payload: n.id })}
              style={{ color: "#3a6080" }}
              onMouseEnter={e => e.currentTarget.style.color = "#c8e8ff"}
              onMouseLeave={e => e.currentTarget.style.color = "#3a6080"}
            >
              <X size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
