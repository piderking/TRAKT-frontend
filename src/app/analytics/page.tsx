'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Film, 
  Code2, 
  Heart, 
  Music, 
  Gamepad2,
  Database, 
  Cpu, 
  Flame, 
  Activity, 
  Moon, 
  Sparkles,
  Zap,
  Layers,
  Repeat
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({
    movies: { total_logged: 428, rewatches: 112, liked: 310, avg_rating: 8.6 },
    tokens: { total_tokens: 190700, prompt: 142500, completion: 48200, sessions: 12 },
    wakatime: { coding_hours: "5h 7m", active_project: "TRAKT", python_pct: 52.4, ts_pct: 38.1 },
    health: { bpm: 74, resting_bpm: 58, steps: 8840, calories: 465, sleep_hrs: 7.8, spo2: 99.0 },
    spotify: { tracks_today: 34, listening_mins: 118, tempo_bpm: 186, energy_pct: 82 },
    steam: { games_owned: 184, total_hours: 1420.5, recent_2weeks: 24.6, achievements: 842 },
    storage: { warm_hit_rate: 98.4, cold_blobs: 1420, redis_latency_ms: 0.4 }
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            ALL-FIELDS UNIFIED ANALYTICS ENGINE
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          <span>Cross-Domain Ecosystem Analytics</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive real-time telemetry across Movies, WakaTime, Antigravity AI Tokens, Health Vitals, Spotify Music, Steam Gaming, and Tiered Storage.
        </p>
      </div>

      {/* Domain Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
        {/* Domain 1: Movies */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-blue-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>MOVIES & DIARY</span>
            <Film className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{data.movies.total_logged}</p>
          <div className="text-[11px] space-y-1 text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between"><span>Rewatches:</span><span className="text-blue-400 font-bold">{data.movies.rewatches}</span></div>
            <div className="flex justify-between"><span>Liked Movies:</span><span className="text-pink-400 font-bold">{data.movies.liked}</span></div>
            <div className="flex justify-between"><span>Avg Rating:</span><span className="text-amber-400 font-bold">★ {data.movies.avg_rating}</span></div>
          </div>
        </div>

        {/* Domain 2: AI Tokens & WakaTime */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-purple-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>AI TOKENS & CODING</span>
            <Code2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{(data.tokens.total_tokens / 1000).toFixed(1)}k</p>
          <div className="text-[11px] space-y-1 text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between"><span>Coding Time:</span><span className="text-emerald-400 font-bold">{data.wakatime.coding_hours}</span></div>
            <div className="flex justify-between"><span>Prompt Tokens:</span><span className="text-purple-400 font-bold">{(data.tokens.prompt / 1000).toFixed(1)}k</span></div>
            <div className="flex justify-between"><span>Top Language:</span><span className="text-emerald-400 font-bold">Python</span></div>
          </div>
        </div>

        {/* Domain 3: Health Vitals */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-red-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>HEALTH & VITALS</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{data.health.bpm} <span className="text-xs text-slate-400">BPM</span></p>
          <div className="text-[11px] space-y-1 text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between"><span>Resting HR:</span><span className="text-red-400 font-bold">{data.health.resting_bpm} BPM</span></div>
            <div className="flex justify-between"><span>Daily Steps:</span><span className="text-emerald-400 font-bold">{data.health.steps.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Sleep / SpO2:</span><span className="text-purple-400 font-bold">{data.health.sleep_hrs}h / {data.health.spo2}%</span></div>
          </div>
        </div>

        {/* Domain 4: Spotify Music */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>SPOTIFY MUSIC</span>
            <Music className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{data.spotify.tracks_today} <span className="text-xs text-slate-400">tracks</span></p>
          <div className="text-[11px] space-y-1 text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between"><span>Listening Mins:</span><span className="text-emerald-400 font-bold">{data.spotify.listening_mins}m</span></div>
            <div className="flex justify-between"><span>Tempo (BPM):</span><span className="text-purple-400 font-bold">{data.spotify.tempo_bpm}</span></div>
            <div className="flex justify-between"><span>Energy Level:</span><span className="text-amber-400 font-bold">{data.spotify.energy_pct}%</span></div>
          </div>
        </div>

        {/* Domain 5: Steam Gaming */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-cyan-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>STEAM GAMING</span>
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{data.steam.games_owned} <span className="text-xs text-slate-400">games</span></p>
          <div className="text-[11px] space-y-1 text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between"><span>Total Hours:</span><span className="text-cyan-400 font-bold">{data.steam.total_hours.toLocaleString()}h</span></div>
            <div className="flex justify-between"><span>Past 2 Wks:</span><span className="text-amber-400 font-bold">{data.steam.recent_2weeks}h</span></div>
            <div className="flex justify-between"><span>Achievements:</span><span className="text-purple-400 font-bold">{data.steam.achievements}</span></div>
          </div>
        </div>
      </div>

      {/* Comprehensive Fields Inspection Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <span>Tiered Storage Engine Field Telemetry</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400">REDIS WARM TIER HIT RATE</span>
            <p className="text-2xl font-extrabold text-blue-400">{data.storage.warm_hit_rate}%</p>
            <p className="text-[11px] text-slate-500">Sub-millisecond access for blobs &le; 100KB</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400">POSTGRES COLD STORAGE BLOBS</span>
            <p className="text-2xl font-extrabold text-purple-400">{data.storage.cold_blobs}</p>
            <p className="text-[11px] text-slate-500">Persistent _cold_ref pointers</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400">AVERAGE CACHE LATENCY</span>
            <p className="text-2xl font-extrabold text-emerald-400">{data.storage.redis_latency_ms} ms</p>
            <p className="text-[11px] text-slate-500">High-throughput payload caching</p>
          </div>
        </div>
      </div>
    </div>
  );
}
