import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://sasquatch-hence-ferment.ngrok-free.dev/api/logs/recent";

const LEVEL_COLORS = {
  ERROR: { bg: "#3d1a1a", text: "#ff6b6b", badge: "#c0392b" },
  WARN:  { bg: "#3d2e0a", text: "#f0a500", badge: "#e67e22" },
  INFO:  { bg: "#0d1f2d", text: "#4fc3f7", badge: "#1976d2" },
  DEBUG: { bg: "#1a1a2e", text: "#a0aec0", badge: "#4a5568" },
};

const CATEGORY_ICONS = {
  KARIX:   "📡",
  SESSION: "🔄",
  LEAD:    "🎯",
  BOT:     "🤖",
  SYSTEM:  "⚙️",
};

export default function LogsPage() {
  const [logs, setLogs]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false); 
  const [filterLevel, setFilterLevel] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [keyword, setKeyword]       = useState("");
  const [lineCount, setLineCount]   = useState(200);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError]           = useState(null);
  const [total, setTotal]           = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lines: lineCount,
        level: filterLevel,
        keyword: keyword,
      });

      const res = await fetch(`${API_BASE}/api/logs/recent?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log(data , "here all data");
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [lineCount, filterLevel, keyword]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 5000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchLogs]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const displayedLogs = logs.filter((l) => {
    if (filterCategory && l.category !== filterCategory) return false;
    return true;
  });

  const counts = logs.reduce((acc, l) => {
    acc[l.level] = (acc[l.level] || 0) + 1;
    return acc;
  }, {});

  const catCounts = logs.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ background: "#0a0e1a", minHeight: "100vh", color: "#e2e8f0", fontFamily: "monospace" }}>

      {/* Header */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1e3a5f", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>Production Logs</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Titan Watch Bot — VM 40.80.81.142</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: "#4fc3f7" }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          {/* Auto refresh toggle */}
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: autoRefresh ? "#16a34a" : "#1e293b",
              color: autoRefresh ? "#fff" : "#94a3b8",
            }}
          >
            {autoRefresh ? "⏸ Auto ON" : "▶ Auto OFF"}
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #1e3a5f", background: "#1e293b", color: "#4fc3f7", cursor: "pointer", fontSize: 12 }}
          >
            {loading ? "⏳" : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "flex", gap: 8, padding: "12px 24px", flexWrap: "wrap", borderBottom: "1px solid #1e2d3d" }}>
        {["ERROR", "WARN", "INFO", "DEBUG"].map((lvl) => (
          <div
            key={lvl}
            onClick={() => setFilterLevel(filterLevel === lvl ? "" : lvl)}
            style={{
              padding: "4px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: filterLevel === lvl ? LEVEL_COLORS[lvl].badge : "#1e293b",
              color: filterLevel === lvl ? "#fff" : LEVEL_COLORS[lvl].text,
              border: `1px solid ${LEVEL_COLORS[lvl].badge}`,
              transition: "all 0.15s",
            }}
          >
            {lvl} {counts[lvl] ? `(${counts[lvl]})` : "(0)"}
          </div>
        ))}

        <div style={{ width: 1, background: "#1e3a5f", margin: "0 4px" }} />

        {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
          <div
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? "" : cat)}
            style={{
              padding: "4px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12,
              background: filterCategory === cat ? "#1e3a5f" : "#111827",
              color: filterCategory === cat ? "#fff" : "#64748b",
              border: `1px solid ${filterCategory === cat ? "#4fc3f7" : "#1e293b"}`,
            }}
          >
            {icon} {cat} {catCounts[cat] ? `(${catCounts[cat]})` : ""}
          </div>
        ))}

        <div style={{ marginLeft: "auto", fontSize: 12, color: "#475569", alignSelf: "center" }}>
          Showing {displayedLogs.length} / {total} logs
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, padding: "10px 24px", borderBottom: "1px solid #1e2d3d", alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search in logs (phone, templateId, payload...)"
          style={{
            flex: 1, minWidth: 220, padding: "7px 12px", borderRadius: 6,
            background: "#1e293b", border: "1px solid #1e3a5f", color: "#e2e8f0",
            fontSize: 12, outline: "none",
          }}
        />

        <select
          value={lineCount}
          onChange={(e) => setLineCount(Number(e.target.value))}
          style={{ padding: "7px 10px", borderRadius: 6, background: "#1e293b", border: "1px solid #1e3a5f", color: "#94a3b8", fontSize: 12 }}
        >
          <option value={100}>Last 100 lines</option>
          <option value={200}>Last 200 lines</option>
          <option value={500}>Last 500 lines</option>
          <option value={1000}>Last 1000 lines</option>
        </select>

        <button
          onClick={() => { setFilterLevel(""); setFilterCategory(""); setKeyword(""); }}
          style={{ padding: "7px 12px", borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}
        >
          Clear filters
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Auto scroll
        </label>
      </div>

      {/* Error */}
      {error && (
        <div style={{ margin: "12px 24px", padding: "10px 16px", background: "#3d1a1a", borderRadius: 8, border: "1px solid #c0392b", color: "#ff6b6b", fontSize: 13 }}>
          ❌ Could not fetch logs: {error} — Check if backend is running and CORS allows this origin.
        </div>
      )}

      {/* Log Lines */}
      <div style={{ padding: "12px 24px", overflowY: "auto", maxHeight: "calc(100vh - 260px)" }}>
        {displayedLogs.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#334155" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div>No logs found. Try changing filters or refresh.</div>
          </div>
        )}

        {displayedLogs.map((log, i) => {
          const colors = LEVEL_COLORS[log.level] || LEVEL_COLORS.INFO;
          const isError = log.level === "ERROR";
          const isWarn  = log.level === "WARN";

          return (
            <div
              key={i}
              style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: "5px 10px", borderRadius: 6, marginBottom: 2,
                background: isError ? "#1a0a0a" : isWarn ? "#1a140a" : "transparent",
                borderLeft: `3px solid ${isError ? "#c0392b" : isWarn ? "#e67e22" : "transparent"}`,
                fontFamily: "monospace", fontSize: 12, lineHeight: 1.6,
              }}
            >
              {/* Timestamp */}
              <span style={{ color: "#334155", minWidth: 150, flexShrink: 0, fontSize: 11 }}>
                {log.timestamp || "—"}
              </span>

              {/* Level badge */}
              <span style={{
                padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                background: colors.badge, color: "#fff", minWidth: 44, textAlign: "center", flexShrink: 0,
              }}>
                {log.level}
              </span>

              {/* Category */}
              <span style={{ fontSize: 11, minWidth: 24, flexShrink: 0 }}>
                {CATEGORY_ICONS[log.category] || "⚙️"}
              </span>

              {/* Message */}
              <span style={{ color: isError ? "#ff6b6b" : isWarn ? "#f0a500" : "#cbd5e1", wordBreak: "break-all" }}>
                {log.message || log.raw}
              </span>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#111827", borderTop: "1px solid #1e3a5f",
        padding: "6px 24px", display: "flex", gap: 20, alignItems: "center",
        fontSize: 11, color: "#475569",
      }}>
        <span>🟢 Log file: <code style={{ color: "#4fc3f7" }}>logs/titan-bot.log</code></span>
        <span>Total shown: <strong style={{ color: "#fff" }}>{displayedLogs.length}</strong></span>
        {autoRefresh && <span style={{ color: "#16a34a" }}>● Auto-refreshing every 5s</span>}
        <span style={{ marginLeft: "auto" }}>
          ERROR: <span style={{ color: "#ff6b6b" }}>{counts.ERROR || 0}</span>
          &nbsp;| WARN: <span style={{ color: "#f0a500" }}>{counts.WARN || 0}</span>
          &nbsp;| INFO: <span style={{ color: "#4fc3f7" }}>{counts.INFO || 0}</span>
        </span>
      </div>
    </div>
  );
}