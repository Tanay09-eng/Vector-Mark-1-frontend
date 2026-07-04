import React from "react";
import TitleBar from "./components/Layout/TitleBar";
import ChatWindow from "./components/Chat/ChatWindow";
import ChatInput from "./components/Chat/ChatInput";
import QuickCommands from "./components/Chat/QuickCommands";
import Sidebar from "./components/Sidebar/Sidebar";
import Notifications from "./components/UI/Notifications";
import { VectorProvider } from "./store/VectorContext";
import "./styles/globals.css";

function AppLayout() {
  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      style={{ background: "#020810" }}
    >
      {/* Scan line */}
      <div className="scan-line" />

      {/* HUD corner decorations */}
      <div className="hud-corner hud-tl" style={{ top: "10px", left: "10px", position: "fixed", zIndex: 50 }} />
      <div className="hud-corner hud-tr" style={{ top: "10px", right: "10px", position: "fixed", zIndex: 50 }} />
      <div className="hud-corner hud-bl" style={{ bottom: "10px", left: "10px", position: "fixed", zIndex: 50 }} />
      <div className="hud-corner hud-br" style={{ bottom: "10px", right: "10px", position: "fixed", zIndex: 50 }} />

      {/* Grid background */}
      <div className="grid-bg fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Radial glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-30%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.035) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* App shell */}
      <div className="relative flex flex-col w-full h-full" style={{ zIndex: 1 }}>
        {/* Title bar */}
        <TitleBar />

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">

          {/* Chat column */}
          <div
            className="flex flex-col flex-1 overflow-hidden"
            style={{ borderRight: "1px solid rgba(0,212,255,0.08)" }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
              style={{ borderColor: "rgba(0,212,255,0.08)", background: "rgba(2,8,16,0.8)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[10px] tracking-[0.25em]"
                  style={{ color: "#3a6080" }}
                >
                  INTERFACE
                </span>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-0.5 h-3 rounded-full"
                      style={{
                        background: "rgba(0,212,255,0.3)",
                        animation: `typingBounce ${0.8 + i * 0.2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="font-mono text-[9px]" style={{ color: "#1a3050" }}>
                SESSION ACTIVE
              </span>
            </div>

            {/* Quick commands */}
            <QuickCommands />

            {/* Messages */}
            <ChatWindow />

            {/* Input */}
            <ChatInput />
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>

      {/* Notifications */}
      <Notifications />
    </div>
  );
}

export default function App() {
  return (
    <VectorProvider>
      <AppLayout />
    </VectorProvider>
  );
}
