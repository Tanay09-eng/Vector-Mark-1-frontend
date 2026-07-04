import React, { useEffect, useState } from "react";
import { TrendingUp, Plus, Loader } from "lucide-react";
import { progressAPI } from "../../services/api";
import { useVector } from "../../store/VectorContext";

export default function ProgressPanel() {
  const { state, dispatch, notify } = useVector();
  const [showAdd, setShowAdd] = useState(false);
  const [project, setProject] = useState("");
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await progressAPI.getAll();
        dispatch({ type: "SET_PROGRESS", payload: data });
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [dispatch]);

  const handleLog = async () => {
    if (!project.trim() || !entry.trim()) return;
    try {
      const logged = await progressAPI.log({ project: project.trim(), entry: entry.trim() });
      dispatch({ type: "SET_PROGRESS", payload: [logged, ...state.progress] });
      notify(`Progress logged for ${project}`, "success");
      setProject(""); setEntry(""); setShowAdd(false);
    } catch (err) {
      notify(err.message, "error");
    }
  };

  // Group entries by project
  const grouped = state.progress.reduce((acc, e) => {
    if (!acc[e.project]) acc[e.project] = [];
    acc[e.project].push(e);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b shrink-0"
        style={{ borderColor: "rgba(0,212,255,0.1)" }}
      >
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "#00ff9d" }}>
          PROGRESS
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-5 h-5 rounded flex items-center justify-center transition-all"
          style={{ border: "1px solid rgba(0,255,157,0.2)", color: "#3a6080" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#00ff9d"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#3a6080"; }}
        >
          <Plus size={10} />
        </button>
      </div>

      {showAdd && (
        <div className="p-2.5 border-b" style={{ borderColor: "rgba(0,255,157,0.1)", background: "rgba(0,255,157,0.02)" }}>
          <input
            autoFocus
            value={project}
            onChange={e => setProject(e.target.value)}
            placeholder="Project (e.g. McKinsey Forward)"
            className="w-full text-xs px-2 py-1.5 rounded mb-1.5 outline-none"
            style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.2)", color: "#c8e8ff" }}
          />
          <textarea
            value={entry}
            onChange={e => setEntry(e.target.value)}
            placeholder="What did you do today?"
            rows={2}
            className="w-full text-xs px-2 py-1.5 rounded mb-1.5 outline-none resize-none"
            style={{ background: "rgba(0,255,157,0.04)", border: "1px solid rgba(0,255,157,0.12)", color: "#c8e8ff" }}
          />
          <div className="flex gap-1.5">
            <button onClick={handleLog} className="flex-1 text-[10px] font-mono py-1 rounded tracking-widest"
              style={{ background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)", color: "#00ff9d" }}>
              LOG
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 text-[10px] font-mono py-1 rounded tracking-widest"
              style={{ border: "1px solid rgba(0,212,255,0.1)", color: "#3a6080" }}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {loading && <div className="flex justify-center py-8"><Loader size={14} className="animate-spin" style={{ color: "#3a6080" }} /></div>}
        {!loading && Object.keys(grouped).length === 0 && (
          <div className="text-center py-8 font-mono text-[10px] tracking-widest" style={{ color: "#1a3050" }}>NO ENTRIES</div>
        )}
        {Object.entries(grouped).map(([proj, entries]) => (
          <div key={proj} className="mb-3">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <TrendingUp size={9} style={{ color: "#00ff9d" }} />
              <span className="font-mono text-[9px] tracking-widest" style={{ color: "#00ff9d" }}>
                {proj.toUpperCase()}
              </span>
              <span className="font-mono text-[9px]" style={{ color: "#1a3050" }}>
                {entries.length}
              </span>
            </div>
            {entries.slice(0, 3).map(e => (
              <div key={e.id} className="px-2 py-1.5 mb-1 rounded" style={{ background: "rgba(0,255,157,0.03)", border: "1px solid rgba(0,255,157,0.06)" }}>
                <p className="text-xs leading-snug" style={{ color: "#a0c8b0" }}>{e.entry}</p>
                <p className="font-mono text-[9px] mt-0.5" style={{ color: "#2a4a3a" }}>
                  {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
