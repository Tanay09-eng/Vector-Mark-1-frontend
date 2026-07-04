import React, { useState } from "react";
import { CheckCircle2, Circle, Trash2, Plus, Loader } from "lucide-react";
import { useTasks } from "../../hooks/useTasks";

const PRIORITY_COLORS = {
  urgent: "#ff4444",
  high:   "#ff6b35",
  normal: "#00d4ff",
  low:    "#3a6080",
};

function TaskItem({ task, onComplete, onDelete }) {
  return (
    <div
      className="group flex items-start gap-2 p-2.5 rounded transition-all duration-150 panel-hover"
      style={{ border: "1px solid transparent" }}
    >
      <button
        onClick={() => onComplete(task.id)}
        className="shrink-0 mt-0.5 transition-colors duration-150"
        style={{ color: PRIORITY_COLORS[task.priority] || "#00d4ff" }}
      >
        <Circle size={13} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-xs leading-snug truncate" style={{ color: "#c8e8ff" }}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[9px]" style={{ color: "#3a6080" }}>
            {task.project}
          </span>
          {task.priority !== "normal" && (
            <span
              className="font-mono text-[8px] tracking-widest"
              style={{ color: PRIORITY_COLORS[task.priority] }}
            >
              {task.priority.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ color: "#3a6080" }}
        onMouseEnter={e => e.currentTarget.style.color = "#ff4444"}
        onMouseLeave={e => e.currentTarget.style.color = "#3a6080"}
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

export default function TaskPanel() {
  const { tasks, loading, addTask, completeTask, deleteTask } = useTasks();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState("General");

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addTask({ title: newTitle.trim(), project: newProject || "General", priority: "normal" });
    setNewTitle("");
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b shrink-0"
        style={{ borderColor: "rgba(0,212,255,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "#00d4ff" }}>
            TASKS
          </span>
          <span
            className="font-mono text-[9px] px-1.5 py-0.5 rounded"
            style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-5 h-5 rounded flex items-center justify-center transition-all"
          style={{ border: "1px solid rgba(0,212,255,0.2)", color: "#3a6080" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#3a6080"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)"; }}
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div
          className="p-2.5 border-b"
          style={{ borderColor: "rgba(0,212,255,0.1)", background: "rgba(0,212,255,0.03)" }}
        >
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Task title..."
            className="w-full text-xs px-2 py-1.5 rounded mb-1.5 outline-none"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#c8e8ff",
            }}
          />
          <input
            value={newProject}
            onChange={e => setNewProject(e.target.value)}
            placeholder="Project (General)"
            className="w-full text-xs px-2 py-1.5 rounded mb-1.5 outline-none"
            style={{
              background: "rgba(0,212,255,0.04)",
              border: "1px solid rgba(0,212,255,0.12)",
              color: "#c8e8ff",
            }}
          />
          <div className="flex gap-1.5">
            <button
              onClick={handleAdd}
              className="flex-1 text-[10px] font-mono py-1 rounded tracking-widest transition-all"
              style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}
            >
              ADD
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 text-[10px] font-mono py-1 rounded tracking-widest transition-all"
              style={{ border: "1px solid rgba(0,212,255,0.1)", color: "#3a6080" }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-1">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader size={14} className="animate-spin" style={{ color: "#3a6080" }} />
          </div>
        )}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-8 font-mono text-[10px] tracking-widest" style={{ color: "#1a3050" }}>
            CLEAR SLATE
          </div>
        )}
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={completeTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
