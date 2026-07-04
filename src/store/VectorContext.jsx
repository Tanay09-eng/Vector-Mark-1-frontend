/**
 * Vector AI — Global State Store
 * React Context + useReducer. No Redux needed.
 */

import React, { createContext, useContext, useReducer, useCallback } from "react";

const initialState = {
  // Chat
  messages: [],
  isThinking: false,
  sessionId: `session_${Date.now()}`,

  // Sidebar tab
  sidebarTab: "tasks", // "tasks" | "reminders" | "progress" | "memory"

  // Tasks
  tasks: [],
  tasksLoading: false,

  // Reminders
  reminders: [],

  // Progress
  progress: [],

  // Memory
  memories: [],

  // Voice
  voiceEnabled: false,
  isListening: false,
  isSpeaking: false,
  voiceOutputEnabled: true,

  // System
  systemStatus: null,
  backendOnline: false,

  // UI
  notifications: [],
};

function reducer(state, action) {
  switch (action.type) {
    // ── Chat ──────────────────────────────────────────────────────────────────
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_THINKING":
      return { ...state, isThinking: action.payload };
    case "CLEAR_CHAT":
      return { ...state, messages: [], sessionId: `session_${Date.now()}` };

    // ── Sidebar ───────────────────────────────────────────────────────────────
    case "SET_SIDEBAR_TAB":
      return { ...state, sidebarTab: action.payload };

    // ── Tasks ─────────────────────────────────────────────────────────────────
    case "SET_TASKS":
      return { ...state, tasks: action.payload, tasksLoading: false };
    case "SET_TASKS_LOADING":
      return { ...state, tasksLoading: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "REMOVE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };

    // ── Reminders ─────────────────────────────────────────────────────────────
    case "SET_REMINDERS":
      return { ...state, reminders: action.payload };
    case "ADD_REMINDER":
      return { ...state, reminders: [action.payload, ...state.reminders] };
    case "REMOVE_REMINDER":
      return { ...state, reminders: state.reminders.filter((r) => r.id !== action.payload) };

    // ── Progress ──────────────────────────────────────────────────────────────
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };

    // ── Memory ────────────────────────────────────────────────────────────────
    case "SET_MEMORIES":
      return { ...state, memories: action.payload };

    // ── Voice ─────────────────────────────────────────────────────────────────
    case "SET_VOICE_ENABLED":
      return { ...state, voiceEnabled: action.payload };
    case "SET_LISTENING":
      return { ...state, isListening: action.payload };
    case "SET_SPEAKING":
      return { ...state, isSpeaking: action.payload };
    case "SET_VOICE_OUTPUT":
      return { ...state, voiceOutputEnabled: action.payload };

    // ── System ────────────────────────────────────────────────────────────────
    case "SET_SYSTEM_STATUS":
      return { ...state, systemStatus: action.payload, backendOnline: true };
    case "SET_BACKEND_OFFLINE":
      return { ...state, backendOnline: false };

    // ── Notifications ─────────────────────────────────────────────────────────
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { id: Date.now(), ...action.payload },
        ],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    default:
      return state;
  }
}

const VectorContext = createContext(null);

export function VectorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addMessage = useCallback((role, content, meta = {}) => {
    dispatch({
      type: "ADD_MESSAGE",
      payload: { id: Date.now(), role, content, timestamp: new Date(), ...meta },
    });
  }, []);

  const notify = useCallback((message, type = "info") => {
    const id = Date.now();
    dispatch({ type: "ADD_NOTIFICATION", payload: { message, type } });
    setTimeout(() => dispatch({ type: "REMOVE_NOTIFICATION", payload: id }), 4000);
  }, []);

  return (
    <VectorContext.Provider value={{ state, dispatch, addMessage, notify }}>
      {children}
    </VectorContext.Provider>
  );
}

export function useVector() {
  const ctx = useContext(VectorContext);
  if (!ctx) throw new Error("useVector must be used inside VectorProvider");
  return ctx;
}
