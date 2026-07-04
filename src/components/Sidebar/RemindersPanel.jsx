import React, { useEffect, useState } from "react";
import { Bell, Plus, Trash2, Loader } from "lucide-react";
import { remindersAPI } from "../../services/api";
import { useVector } from "../../store/VectorContext";

export default function RemindersPanel() {
  const { state, dispatch, notify } = useVector();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await remindersAPI.getAll();
        dispatch({ type: "SET_REMINDERS", payload: data });
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [dispatch]);

  const handleAdd = async () => {
    if (!title.trim() || !remindAt) return;
    try {
      const r = await remindersAPI.create({ title: title.trim(), remind_at: new Date(remindAt).toISOString() });
      dispatch({ type: "ADD_REMINDER", payload: r });
      notify(`Reminder set: ${r.title}`, "success");
      setTitle(""); setRemindAt(""); setShowAdd(false);
    } catch (err) { notify(err.message, "error"); }
  };

  const handleDelete = async (id) => {
    try {
      await remindersAPI.delete(id);
      dispatch({ type: "REMOVE_REMINDER", payload: id });
    } catch (err) { notify(err.message, "error"); }
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b shrink-0"
        style={{ borderColor: "rgba(0,212,255,0.1)" }}>
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "#ff6b35" }}>REMINDERS</span>
        <button onClick={() => setShowAdd(!showAdd)} className="w-5 h-5 rounded flex items-center justify-center"
          style={{ border: "1px solid rgba(255,107,53,0.2)", color: "#3a6080" }}
          onMouseEnter={e => e.currentTarget.style.color = "#ff6b35"}
          onMouseLeave={e => e.currentTarget.style.color = "#3a6080"}>
          <Plus size={10} />
        </button>
      </div>

      {showAdd && (
        <div className="p-2.5 border-b" style={{ borderColor: "rgba(255,107,53,0.1)", background: "rgba(255,107,53,0.02)" }}>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Reminder title..." className="w-full text-xs px-2 py-1.5 rounded mb-1.5 outline-none"
            style={{ background: "rgba(255,107,53,0.05)", border: "1px solid rgba(255,107,53,0.2)", color: "#c8e8ff" }} />
          <input type="datetime-local" value={remindAt} onChange={e => setRemindAt(e.target.value)}
            className="w-full text-xs px-2 py-1.5 rounded mb-1.5 outline-none"
            style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)", color: "#c8e8ff",
              colorScheme: "dark" }} />
          <div className="flex gap-1.5">
            <button onClick={handleAdd} className="flex-1 text-[10px] font-mono py-1 rounded tracking-widest"
              style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", color: "#ff6b35" }}>SET</button>
            <button onClick={() => setShowAdd(false)} className="flex-1 text-[10px] font-mono py-1 rounded tracking-widest"
              style={{ border: "1px solid rgba(0,212,255,0.1)", color: "#3a6080" }}>CANCEL</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-1">
        {loading && <div className="flex justify-center py-8"><Loader size={14} className="animate-spin" style={{ color: "#3a6080" }} /></div>}
        {!loading && state.reminders.length === 0 && (
          <div className="text-center py-8 font-mono text-[10px] tracking-widest" style={{ color: "#1a3050" }}>NO REMINDERS</div>
        )}
        {state.reminders.map(r => (
          <div key={r.id} className="group flex items-start gap-2 p-2.5 rounded mb-1 transition-all"
            style={{ border: "1px solid transparent" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,107,53,0.15)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}>
            <Bell size={11} className="shrink-0 mt-0.5" style={{ color: "#ff6b35" }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: "#c8e8ff" }}>{r.title}</p>
              <p className="font-mono text-[9px] mt-0.5" style={{ color: "#3a6080" }}>{formatTime(r.remind_at)}</p>
              {r.repeat !== "none" && (
                <p className="font-mono text-[8px]" style={{ color: "#ff6b35" }}>↻ {r.repeat}</p>
              )}
            </div>
            <button onClick={() => handleDelete(r.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "#3a6080" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ff4444"}
              onMouseLeave={e => e.currentTarget.style.color = "#3a6080"}>
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
