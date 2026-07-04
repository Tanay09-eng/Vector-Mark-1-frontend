/**
 * Vector AI — API Service Layer
 * All communication with the FastAPI backend goes through here.
 * Never call fetch/axios directly from components.
 */

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ── Interceptors ──────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || err.message || "Unknown error";
    console.error("[API Error]", msg);
    return Promise.reject(new Error(msg));
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// CHAT
// ═══════════════════════════════════════════════════════════════════════════════

export const chatAPI = {
  send: async (message, sessionId = "default") => {
    const res = await api.post("/chat", { message, session_id: sessionId });
    return res.data;
    // Returns: { reply, intent, tool_used, session_id, timestamp }
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════════════════════

export const tasksAPI = {
  getAll: async (status = "pending") => {
    const res = await api.get("/tasks", { params: { status } });
    return res.data;
  },

  create: async (task) => {
    const res = await api.post("/tasks", task);
    return res.data;
  },

  update: async (id, updates) => {
    const res = await api.patch(`/tasks/${id}`, updates);
    return res.data;
  },

  complete: async (id) => {
    const res = await api.patch(`/tasks/${id}`, { status: "done" });
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// REMINDERS
// ═══════════════════════════════════════════════════════════════════════════════

export const remindersAPI = {
  getAll: async () => {
    const res = await api.get("/reminders");
    return res.data;
  },

  create: async (reminder) => {
    const res = await api.post("/reminders", reminder);
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/reminders/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════════════════

export const progressAPI = {
  getAll: async (project = null) => {
    const params = project ? { project } : {};
    const res = await api.get("/progress", { params });
    return res.data;
  },

  log: async (entry) => {
    const res = await api.post("/progress", entry);
    return res.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY
// ═══════════════════════════════════════════════════════════════════════════════

export const memoryAPI = {
  getAll: async () => {
    const res = await api.get("/memory");
    return res.data;
  },

  delete: async (id) => {
    await api.delete(`/memory/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS
// ═══════════════════════════════════════════════════════════════════════════════

export const newsAPI = {
  getHeadlines: async (country = "in") => {
    const res = await api.get("/news", { params: { country } });
    return res.data;
  },

  search: async (query) => {
    const res = await api.get("/news", { params: { query } });
    return res.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════════════════════════

export const calendarAPI = {
  today: async () => {
    const res = await api.get("/calendar/today");
    return res.data;
  },

  upcoming: async (days = 7) => {
    const res = await api.get("/calendar/upcoming", { params: { days } });
    return res.data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE
// ═══════════════════════════════════════════════════════════════════════════════

export const voiceAPI = {
  /**
   * Get TTS audio from backend as a blob URL.
   * The browser plays it via Audio().
   */
  speak: async (text, voice = "en-GB-RyanNeural") => {
    const res = await api.post(
      "/voice/speak",
      null,
      { params: { text, voice }, responseType: "blob" }
    );
    return URL.createObjectURL(res.data);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export const systemAPI = {
  status: async () => {
    const res = await api.get("/status");
    return res.data;
  },

  config: async () => {
    const res = await api.get("/config");
    return res.data;
  },
};

export default api;
