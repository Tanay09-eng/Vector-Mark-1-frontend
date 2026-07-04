/**
 * Vector AI — useChat Hook
 * Handles sending messages, receiving replies, voice output.
 */

import { useCallback } from "react";
import { useVector } from "../store/VectorContext";
import { chatAPI, voiceAPI } from "../services/api";

export function useChat() {
  const { state, dispatch, addMessage, notify } = useVector();

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message
    addMessage("user", text);
    dispatch({ type: "SET_THINKING", payload: true });

    try {
      const data = await chatAPI.send(text, state.sessionId);

      // Add Vector's reply
      addMessage("assistant", data.reply, {
        intent: data.intent,
        toolUsed: data.tool_used,
      });

      // Voice output
      if (state.voiceOutputEnabled) {
        dispatch({ type: "SET_SPEAKING", payload: true });
        try {
          const audioUrl = await voiceAPI.speak(data.reply);
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            dispatch({ type: "SET_SPEAKING", payload: false });
            URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = () => dispatch({ type: "SET_SPEAKING", payload: false });
          await audio.play();
        } catch {
          dispatch({ type: "SET_SPEAKING", payload: false });
        }
      }
    } catch (err) {
      addMessage("assistant", `I'm unable to reach the backend. Is Vector server running?\n\nError: ${err.message}`);
      notify("Backend connection failed", "error");
    } finally {
      dispatch({ type: "SET_THINKING", payload: false });
    }
  }, [state.sessionId, state.voiceOutputEnabled, addMessage, dispatch, notify]);

  const clearChat = useCallback(() => {
    dispatch({ type: "CLEAR_CHAT" });
  }, [dispatch]);

  return { sendMessage, clearChat };
}
