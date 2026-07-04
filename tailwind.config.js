/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vector: {
          bg:      "#020810",
          panel:   "#040f1e",
          border:  "#0a2540",
          accent:  "#00d4ff",
          accent2: "#00ff9d",
          accent3: "#ff6b35",
          text:    "#c8e8ff",
          dim:     "#3a6080",
          muted:   "#1a3050",
        }
      },
      fontFamily: {
        mono:    ["'Share Tech Mono'", "monospace"],
        display: ["'Orbitron'", "monospace"],
        body:    ["'Exo 2'", "sans-serif"],
      },
      animation: {
        "pulse-glow":  "pulseGlow 3s ease-in-out infinite",
        "scan":        "scan 4s linear infinite",
        "blink":       "blink 2s step-end infinite",
        "fade-in-up":  "fadeInUp 0.3s ease forwards",
        "spin-slow":   "spin 8s linear infinite",
        "hud-in":      "hudIn 0.5s ease forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { textShadow: "0 0 20px rgba(0,212,255,0.5)" },
          "50%":     { textShadow: "0 0 60px rgba(0,212,255,0.9), 0 0 120px rgba(0,212,255,0.3)" },
        },
        scan: {
          "0%":   { top: "0%" },
          "100%": { top: "100%" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.2" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        hudIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        "glow":        "0 0 20px rgba(0,212,255,0.15)",
        "glow-strong": "0 0 40px rgba(0,212,255,0.3)",
        "glow-green":  "0 0 20px rgba(0,255,157,0.2)",
        "inner-glow":  "inset 0 0 30px rgba(0,212,255,0.05)",
      },
    },
  },
  plugins: [],
};
