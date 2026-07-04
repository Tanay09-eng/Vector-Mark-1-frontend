# Vector AI — Frontend
### React + Tailwind + Electron

---

## Folder Structure

```
frontend/
├── electron/
│   ├── main.js          ← Electron main process
│   └── preload.js       ← Secure IPC bridge
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                        ← Root component
│   ├── index.js                       ← Entry point
│   ├── styles/
│   │   └── globals.css                ← Tailwind + custom CSS
│   ├── services/
│   │   └── api.js                     ← ALL backend calls (axios)
│   ├── store/
│   │   └── VectorContext.jsx          ← Global state (Context + useReducer)
│   ├── hooks/
│   │   ├── useChat.js                 ← Chat send/receive logic
│   │   ├── useVoice.js                ← Web Speech API (STT)
│   │   └── useTasks.js                ← Task CRUD logic
│   └── components/
│       ├── Layout/
│       │   └── TitleBar.jsx           ← Custom titlebar + window controls
│       ├── Chat/
│       │   ├── ChatWindow.jsx         ← Message list
│       │   ├── ChatMessage.jsx        ← Single message bubble
│       │   ├── ChatInput.jsx          ← Text input + voice button
│       │   └── QuickCommands.jsx      ← Quick command buttons
│       ├── Sidebar/
│       │   ├── Sidebar.jsx            ← Tab navigation
│       │   ├── TaskPanel.jsx          ← Tasks CRUD
│       │   ├── RemindersPanel.jsx     ← Reminders
│       │   ├── ProgressPanel.jsx      ← Progress log
│       │   └── MemoryPanel.jsx        ← Semantic memory viewer
│       └── UI/
│           └── Notifications.jsx      ← Toast notifications
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

---

## Setup

### 1. Make sure backend is running first
```bash
# Terminal 1
ollama serve

# Terminal 2
cd backend
uvicorn main:app --reload --port 8000
```

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

### 3A. Run as web app (browser)
```bash
npm start
```
Opens at http://localhost:3000

### 3B. Run as Electron desktop app
```bash
npm run electron:dev
```
This starts React AND Electron together.

### 4. Build for production (creates .exe installer)
```bash
npm run electron:build
```
Output is in `frontend/dist/`

---

## Notes

- Voice input uses browser Web Speech API — works in both Chrome and Electron
- Voice output calls the FastAPI `/voice/speak` endpoint (Edge TTS)
- All data stays local — nothing goes to any cloud
- The sidebar shows live data from the backend (tasks, reminders, progress, memory)
