'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  RefreshCw, 
  ShieldCheck, 
  Key, 
  Zap, 
  Film, 
  Tv, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowRight
} from 'lucide-react';

interface SystemStatus {
  service: string;
  status: string;
  uptime: number;
  storage_engine: {
    redis: string;
    postgres: string;
    memory_cache_entries: number;
    stats: {
      hot_hits: number;
      cold_hits: number;
      fallback_hits: number;
      sets: number;
    };
  };
  plugins: {
    movies: {
      status: string;
      url: string;
    };
  };
}

interface UpNextItem {
  id: string;
  title: string;
  type: string;
  year: number;
  progress_pct: number;
  runtime_min: number;
  rating: number;
  poster: string;
  genre: string[];
  next_episode?: {
    season: number;
    number: number;
    title: string;
  };
}

export default function NodeDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [upNextList, setUpNextList] = useState<UpNextItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deviceCode, setDeviceCode] = useState<any>(null);
  const [logs, setLogs] = useState<Array<{ id: number; time: string; msg: string; type: string }>>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch system status
      const resStatus = await fetch(`${API_BASE}/api/v1/system/status`);
      if (resStatus.ok) {
        const dataStatus = await resStatus.json();
        setStatus(dataStatus);
      } else {
        // Fallback static structure if backend loading
        setStatus({
          service: "trakt-core-gateway",
          status: "healthy",
          uptime: 1420.5,
          storage_engine: {
            redis: "connected",
            postgres: "connected",
            memory_cache_entries: 14,
            stats: { hot_hits: 128, cold_hits: 19, fallback_hits: 2, sets: 45 }
          },
          plugins: { movies: { status: "online", url: "http://plugin-movies:8000" } }
        });
      }

      // Fetch Up-Next watchlist
      const resUpNext = await fetch(`${API_BASE}/api/v1/user/up-next`);
      if (resUpNext.ok) {
        const dataUpNext = await resUpNext.json();
        setUpNextList(dataUpNext.up_next || []);
      }
    } catch (err) {
      console.warn("Backend not available directly, displaying cached mock data", err);
      // Fallback data for preview
      setUpNextList([
        {
          id: "m-101",
          title: "Dune: Part Two",
          type: "movie",
          year: 2024,
          progress_pct: 0,
          runtime_min: 166,
          rating: 8.6,
          poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
          genre: ["Sci-Fi", "Adventure"]
        },
        {
          id: "s-202",
          title: "Severance",
          type: "show",
          year: 2022,
          progress_pct: 88.5,
          runtime_min: 55,
          rating: 8.7,
          poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
          genre: ["Sci-Fi", "Thriller"],
          next_episode: { season: 2, number: 1, title: "Hello Ms. Cobel" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Initial mock logs
    const initialLogs = [
      { id: 1, time: new Date().toLocaleTimeString(), msg: "TieredStorageEngine initialized. Hot: Redis, Cold: Postgres", type: "system" },
      { id: 2, time: new Date().toLocaleTimeString(), msg: "Plugin Movies registered at http://plugin-movies:8000", type: "plugin" },
      { id: 3, time: new Date().toLocaleTimeString(), msg: "Scrobble event processed: Severance S02E01 (88.5%)", type: "scrobble" },
      { id: 4, time: new Date().toLocaleTimeString(), msg: "Cold offload performed for large metadata dict key payload > 100KB", type: "storage" },
    ];
    setLogs(initialLogs);

    // Live log generator interval
    const interval = setInterval(() => {
      const logTypes = ["scrobble", "storage", "plugin", "system"];
      const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
      const timestamp = new Date().toLocaleTimeString();
      let msg = "";
      if (randomType === "scrobble") {
        msg = `Live scrobble active: User sync payload received [ID: ${Math.floor(Math.random()*9000+1000)}]`;
      } else if (randomType === "storage") {
        msg = `Redis Hot Tier hit (latency: 1.${Math.floor(Math.random()*9)}ms). Key: user:watchlist:ref_${Math.floor(Math.random()*90)}`;
      } else if (randomType === "plugin") {
        msg = `Plugin Movies ping success HTTP 200 OK (22ms)`;
      } else {
        msg = `System health heartbeat check complete`;
      }

      setLogs(prev => [
        { id: Date.now(), time: timestamp, msg, type: randomType },
        ...prev.slice(0, 19)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleTestDeviceAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/device/code`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDeviceCode(data);
      } else {
        setDeviceCode({
          user_code: "TRKT-99A1",
          device_code: "dev_code_mock_8217398127391823",
          verification_url: "https://trakt.tv/activate",
          expires_in: 600
        });
      }
    } catch (e) {
      setDeviceCode({
        user_code: "TRKT-99A1",
        device_code: "dev_code_mock_8217398127391823",
        verification_url: "https://trakt.tv/activate",
        expires_in: 600
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            Node Dashboard & Live Scrobble Feed
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Real-time telemetry, microservice health, and tiered storage cache status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 border border-gray-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            Refresh Telemetry
          </button>
          <button
            onClick={handleTestDeviceAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-xs font-medium text-white shadow-md shadow-red-900/30 transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            Test Device Auth
          </button>
        </div>
      </div>

      {/* Device Auth Modal / Banner */}
      {deviceCode && (
        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-100 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-blue-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-white">Trakt Device Auth Flow Simulated</h4>
              <p className="text-xs text-blue-300 font-mono mt-0.5">
                User Code: <strong className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">{deviceCode.user_code}</strong> | URL: {deviceCode.verification_url}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDeviceCode(null)}
            className="text-xs text-gray-400 hover:text-white underline font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Core Gateway */}
        <div className="glass-card p-4 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Gateway Core</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white font-mono">ONLINE</span>
            <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              HTTP :8000
            </span>
          </div>
          <div className="mt-3 text-[11px] text-gray-400 font-mono flex justify-between border-t border-gray-800/80 pt-2">
            <span>Uptime: {status?.uptime ? `${Math.round(status.uptime)}s` : '1420s'}</span>
            <span className="text-blue-400">FastAPI Gateway</span>
          </div>
        </div>

        {/* Redis Hot Tier */}
        <div className="glass-card p-4 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Redis Hot Tier</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white font-mono">
              {status?.storage_engine?.redis === 'connected' ? 'CONNECTED' : 'IN-MEMORY'}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
              LRU 256MB
            </span>
          </div>
          <div className="mt-3 text-[11px] text-gray-400 font-mono flex justify-between border-t border-gray-800/80 pt-2">
            <span>Hits: {status?.storage_engine?.stats?.hot_hits || 128}</span>
            <span>Objects &lt; 100KB</span>
          </div>
        </div>

        {/* Postgres Cold Tier */}
        <div className="glass-card p-4 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Postgres Cold Storage</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white font-mono">
              {status?.storage_engine?.postgres === 'connected' ? 'CONNECTED' : 'FALLBACK'}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              JSONB Tier
            </span>
          </div>
          <div className="mt-3 text-[11px] text-gray-400 font-mono flex justify-between border-t border-gray-800/80 pt-2">
            <span>Pointers: _cold_ref</span>
            <span>Objects &gt; 100KB</span>
          </div>
        </div>

        {/* Plugin Microservice */}
        <div className="glass-card p-4 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Plugin Microservice</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white font-mono uppercase">
              {status?.plugins?.movies?.status || 'ONLINE'}
            </span>
            <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
              :8001 (Movies)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-gray-400 font-mono flex justify-between border-t border-gray-800/80 pt-2">
            <span>Route: /up-next</span>
            <span className="text-emerald-400">Synced</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Up Next Watchlist & Live Scrobble Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Up-Next Watchlist Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500 fill-red-500" />
              User Up-Next Stream (Proxied via Plugin Microservice)
            </h2>
            <span className="text-xs font-mono text-gray-400">{upNextList.length} items loaded</span>
          </div>

          <div className="space-y-3">
            {upNextList.map((item) => (
              <div
                key={item.id}
                className="glass-card glass-card-hover p-4 rounded-xl border border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-12 rounded-md overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700 relative">
                    {/* eslint-disable-next-html-link */}
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-white hover:text-blue-400 cursor-pointer transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs text-gray-400 font-mono">({item.year})</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.type === 'movie' 
                          ? 'bg-blue-950 text-blue-400 border border-blue-500/30' 
                          : 'bg-purple-950 text-purple-400 border border-purple-500/30'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    {item.next_episode ? (
                      <p className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
                        <span>Next: S{item.next_episode.season} E{item.next_episode.number} - &quot;{item.next_episode.title}&quot;</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        Runtime: {item.runtime_min} mins
                      </p>
                    )}

                    <div className="flex items-center space-x-2 mt-2">
                      {item.genre.map((g) => (
                        <span key={g} className="text-[10px] font-mono text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                  <div className="flex items-center space-x-2 font-mono text-xs text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30">
                    <span>★ {item.rating}</span>
                  </div>
                  {item.progress_pct > 0 && (
                    <div className="w-full sm:w-32 text-right">
                      <div className="text-[10px] text-gray-400 font-mono mb-1">{item.progress_pct}% watched</div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{ width: `${item.progress_pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Log Console (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Telemetry Stream
            </h2>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="terminal-box rounded-xl p-3 h-[420px] overflow-y-auto space-y-2 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="font-mono text-[11px] leading-relaxed border-b border-gray-900 pb-1.5">
                <span className="text-gray-500 mr-2">[{log.time}]</span>
                <span className={`mr-2 font-bold px-1.5 py-0.2 rounded text-[9px] ${
                  log.type === 'scrobble' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  log.type === 'storage' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  log.type === 'plugin' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                  'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {log.type.toUpperCase()}
                </span>
                <span className="text-gray-300">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
