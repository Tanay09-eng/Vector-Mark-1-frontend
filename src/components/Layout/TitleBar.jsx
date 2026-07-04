import React, { useState, useEffect } from "react";
import { Minus, Square, X, Wifi, WifiOff } from "lucide-react";
import { useVector } from "../../store/VectorContext";
import { systemAPI } from "../../services/api";

export default function TitleBar() {
  const { state, dispatch } = useVector();
  const [time, setTime] = useState(new Date());

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Poll system status
  useEffect(() => {
    const check = async () => {
      try {
        const status = await systemAPI.status();
        dispatch({ type: "SET_SYSTEM_STATUS", payload: status });
      } catch {
        dispatch({ type: "SET_BACKEND_OFFLINE" });
      }
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const isElectron = window.electron?.isElectron;

  return (
    <div
      className="flex items-center justify-between px-4 h-10 border-b shrink-0"
      style={{
        borderColor: "rgba(0,212,255,0.1)",
        background: "rgba(2,8,16,0.95)",
        WebkitAppRegion: "drag",
      }}
    >
      {/* Left — Logo */}
      <div className="flex items-center gap-3" style={{ WebkitAppRegion: "no-drag" }}>
        <div className="flex items-center gap-2">
          {/* Animated hex logo */}
          <div className="relative w-5 h-5">
            <div
              className="absolute inset-0 border rotate-45 animate-pulse"
              style={{ borderColor: "rgba(0,212,255,0.6)", animationDuration: "2s" }}
            />
            <div
              className="absolute inset-1 border rotate-12"
              style={{ borderColor: "rgba(0,255,157,0.4)" }}
            />
          </div>
          <span
            className="font-display text-xs tracking-[0.25em] font-semibold"
            style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.6)" }}
          >
            VECTOR
          </span>
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: "#3a6080" }}
          >
            AI v2.0
          </span>
        </div>
      </div>

      {/* Center — Status + Clock */}
      <div className="flex items-center gap-5 font-mono text-xs" style={{ color: "#3a6080" }}>
        <div className="flex items-center gap-1.5">
          {state.backendOnline ? (
            <>
              <div
                className="w-1.5 h-1.5 rounded-full animate-blink"
                style={{ background: "#00ff9d", boxShadow: "0 0 6px #00ff9d" }}
              />
              <span style={{ color: "#00ff9d" }}>ONLINE</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff4444" }} />
              <span style={{ color: "#ff4444" }}>OFFLINE</span>
            </>
          )}
        </div>

        {state.systemStatus?.ollama_online && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full animate-blink"
              style={{ background: "#00d4ff", boxShadow: "0 0 6px #00d4ff", animationDelay: "0.5s" }}
            />
            <span style={{ color: "#00d4ff" }}>LLM</span>
          </div>
        )}

        <span style={{ color: "#2a4a5e", letterSpacing: "0.1em" }}>
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>

      {/* Right — Window Controls */}
      {isElectron && (
        <div className="flex items-center gap-1" style={{ WebkitAppRegion: "no-drag" }}>
          {[
            { icon: Minus,  action: () => window.electron.minimize(), label: "min", color: "#3a6080" },
            { icon: Square, action: () => window.electron.maximize(), label: "max", color: "#3a6080" },
            { icon: X,      action: () => window.electron.close(),    label: "close", color: "#ff4444", hoverBg: "rgba(255,68,68,0.15)" },
          ].map(({ icon: Icon, action, label, color, hoverBg }) => (
            <button
              key={label}
              onClick={action}
              className="w-7 h-7 flex items-center justify-center rounded transition-all duration-150"
              style={{ color }}
              onMouseEnter={e => { e.currentTarget.style.background = hoverBg || "rgba(0,212,255,0.1)"; e.currentTarget.style.color = hoverBg ? "#ff4444" : "#00d4ff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; }}
            >
              <Icon size={11} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
