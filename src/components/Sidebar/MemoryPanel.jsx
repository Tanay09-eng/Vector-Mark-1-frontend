import React, { useEffect, useState } from "react";
import { Brain, Trash2, Loader } from "lucide-react";
import { memoryAPI } from "../../services/api";
import { useVector } from "../../store/VectorContext";

export default function MemoryPanel() {
  const { state, dispatch, notify } = useVector();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await memoryAPI.getAll();
        dispatch({ type: "SET_MEMORIES", payload: data });
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await memoryAPI.delete(id);
      dispatch({ type: "SET_MEMORIES", payload: state.memories.filter(m => m.id !== id) });
    } catch (err) { notify(err.message, "error"); }
  };

  const importanceBar = (importance) => {
    const pct = Math.min((importance / 5) * 100, 100);
    return (
      <div className="w-full h-0.5 rounded-full mt-1" style={{ background: "rgba(155,89,182,0.15)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "#9b59b6" }} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b shrink-0"
        style={{ borderColor: "rgba(0,212,255,0.1)" }}>
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "#9b59b6" }}>MEMORY</span>
        <span className="font-mono text-[9px]" style={{ color: "#3a6080" }}>{state.memories.length} chunks</span>
      </div>

      <div className="flex-1 overflow-y-auto p-1">
        {loading && <div className="flex justify-center py-8"><Loader size={14} className="animate-spin" style={{ color: "#3a6080" }} /></div>}
        {!loading && state.memories.length === 0 && (
          <div className="text-center py-8 font-mono text-[10px] tracking-widest" style={{ color: "#1a3050" }}>NO MEMORIES YET</div>
        )}
        {state.memories.map(m => (
          <div key={m.id} className="group p-2.5 rounded mb-1 transition-all"
            style={{ border: "1px solid rgba(155,89,182,0.1)", background: "rgba(155,89,182,0.03)" }}>
            <div className="flex items-start gap-2">
              <Brain size={9} className="shrink-0 mt-1" style={{ color: "#9b59b6" }} />
              <p className="text-[11px] flex-1 leading-relaxed" style={{ color: "#a090c0" }}>{m.content}</p>
              <button onClick={() => handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 shrink-0"
                style={{ color: "#3a6080" }}
                onMouseEnter={e => e.currentTarget.style.color = "#ff4444"}
                onMouseLeave={e => e.currentTarget.style.color = "#3a6080"}>
                <Trash2 size={10} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[8px]" style={{ color: "#4a3060" }}>{m.source}</span>
            </div>
            {importanceBar(m.importance)}
          </div>
        ))}
      </div>

      <div className="px-3 py-2 border-t font-mono text-[9px] shrink-0"
        style={{ borderColor: "rgba(155,89,182,0.1)", color: "#4a3060" }}>
        SEMANTIC RECALL ACTIVE
      </div>
    </div>
  );
}
