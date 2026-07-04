/**
 * Vector AI — useVoice Hook
 * Browser Web Speech API for STT (microphone → text).
 * Works in Electron's Chromium without any extra packages.
 */

import { useCallback, useRef } from "react";
import { useVector } from "../store/VectorContext";

export function useVoice(onTranscript) {
  const { state, dispatch, notify } = useVector();
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      notify("Speech recognition not supported in this browser.", "error");
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      dispatch({ type: "SET_LISTENING", payload: true });
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      if (transcript && onTranscript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "no-speech") {
        notify(`Voice error: ${e.error}`, "error");
      }
      dispatch({ type: "SET_LISTENING", payload: false });
    };

    recognition.onend = () => {
      dispatch({ type: "SET_LISTENING", payload: false });
    };

    recognition.start();
  }, [dispatch, notify, onTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    dispatch({ type: "SET_LISTENING", payload: false });
  }, [dispatch]);

  const toggleListening = useCallback(() => {
    if (state.isListening) stopListening();
    else startListening();
  }, [state.isListening, startListening, stopListening]);

  return { toggleListening, startListening, stopListening };
}
