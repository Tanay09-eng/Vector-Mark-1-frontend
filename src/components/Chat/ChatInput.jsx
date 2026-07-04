import React, { useState, useRef, useCallback } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Loader } from "lucide-react";
import { useVector } from "../../store/VectorContext";
import { useChat } from "../../hooks/useChat";
import { useVoice } from "../../hooks/useVoice";

export default function ChatInput() {
  const { state, dispatch } = useVector();
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleTranscript = useCallback((transcript) => {
    setText(transcript);
    // Auto-send after voice input
    setTimeout(() => {
      sendMessage(transcript);
      setText("");
    }, 300);
  }, [sendMessage]);

  const { toggleListening } = useVoice(handleTranscript);

  const handleSend = () => {
    if (!text.trim() || state.isThinking) return;
    sendMessage(text.trim());
    setText("");
    textareaRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div
      className="shrink-0 border-t"
      style={{ borderColor: "rgba(0,212,255,0.1)", background: "rgba(2,8,16,0.95)" }}
    >
      {/* Voice status bar */}
      {state.isListening && (
        <div
          className="flex items-center gap-2 px-4 py-2 border-b font-mono text-xs"
          style={{
            borderColor: "rgba(0,212,255,0.1)",
            background: "rgba(0,212,255,0.04)",
            color: "#00d4ff",
          }}
        >
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  height: `${8 + Math.random() * 16}px`,
                  background: "#00d4ff",
                  animation: `typingBounce ${0.6 + i * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="tracking-widest animate-pulse">LISTENING...</span>
        </div>
      )}

      {state.isSpeaking && (
        <div
          className="flex items-center gap-2 px-4 py-2 border-b font-mono text-xs"
          style={{
            borderColor: "rgba(0,255,157,0.1)",
            background: "rgba(0,255,157,0.03)",
            color: "#00ff9d",
          }}
        >
          <Volume2 size={11} className="animate-pulse" />
          <span className="tracking-widest">VECTOR SPEAKING...</span>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 p-3">

        {/* Voice toggle */}
        <button
          onClick={toggleListening}
          className={`shrink-0 w-9 h-9 rounded flex items-center justify-center transition-all duration-200 ${
            state.isListening ? "glow-ring" : ""
          }`}
          style={state.isListening ? {
            background: "rgba(0,212,255,0.15)",
            border: "1px solid rgba(0,212,255,0.6)",
            color: "#00d4ff",
          } : {
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)",
            color: "#3a6080",
          }}
          title={state.isListening ? "Stop listening" : "Start voice input"}
        >
          {state.isListening ? <MicOff size={14} /> : <Mic size={14} />}
        </button>

        {/* Text area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); autoResize(e); }}
            onKeyDown={handleKey}
            placeholder="Speak to Vector..."
            rows={1}
            disabled={state.isThinking}
            className="w-full resize-none rounded px-3 py-2 text-sm outline-none transition-all duration-200 font-body"
            style={{
              background: "rgba(0,212,255,0.04)",
              border: `1px solid ${text ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.1)"}`,
              color: "#c8e8ff",
              caretColor: "#00d4ff",
              minHeight: "36px",
              maxHeight: "120px",
              lineHeight: "1.5",
            }}
          />
        </div>

        {/* Voice output toggle */}
        <button
          onClick={() => dispatch({ type: "SET_VOICE_OUTPUT", payload: !state.voiceOutputEnabled })}
          className="shrink-0 w-9 h-9 rounded flex items-center justify-center transition-all duration-200"
          style={{
            background: "transparent",
            border: `1px solid ${state.voiceOutputEnabled ? "rgba(0,255,157,0.3)" : "rgba(0,212,255,0.1)"}`,
            color: state.voiceOutputEnabled ? "#00ff9d" : "#3a6080",
          }}
          title={state.voiceOutputEnabled ? "Mute Vector" : "Unmute Vector"}
        >
          {state.voiceOutputEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || state.isThinking}
          className="shrink-0 w-9 h-9 rounded flex items-center justify-center transition-all duration-200"
          style={text.trim() && !state.isThinking ? {
            background: "rgba(0,212,255,0.15)",
            border: "1px solid rgba(0,212,255,0.4)",
            color: "#00d4ff",
          } : {
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.08)",
            color: "#1a3050",
            cursor: "not-allowed",
          }}
        >
          {state.isThinking
            ? <Loader size={14} className="animate-spin" />
            : <Send size={14} />
          }
        </button>
      </div>
    </div>
  );
}
