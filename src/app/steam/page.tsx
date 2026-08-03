'use client';

import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Flame,
  Zap,
  Play
} from 'lucide-react';

export default function SteamPluginPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSteam = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/steam/summary`);
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to fetch Steam telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSteam();
  }, []);

  const np = telemetry?.now_playing || {
    game_title: "Cyberpunk 2077",
    app_id: 1091500,
    is_playing: true,
    session_playtime_mins: 85,
    total_playtime_hours: 142.8,
    header_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"
  };

  const stats = telemetry?.stats || {
    games_owned: 184,
    total_hours_played: 1420.5,
    recent_2weeks_hours: 24.6,
    total_achievements: 842
  };

  const recentGames = telemetry?.recent_games || [
    { game_title: "Cyberpunk 2077", playtime_2weeks_hours: 12.4, total_hours: 142.8, last_played: "Today at 11:20 AM" },
    { game_title: "Elden Ring", playtime_2weeks_hours: 8.2, total_hours: 210.4, last_played: "Yesterday" }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                STEAM WEB API TAB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              Steam Gaming Telemetry
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live game playback status, library stats, and achievements telemetry
            </p>
          </div>
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchSteam(); }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 font-mono text-xs flex items-center space-x-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Steam</span>
        </button>
      </div>

      {/* Currently Playing Game Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center gap-6">
        <img
          src={np.header_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"}
          alt="Game Cover"
          className="w-48 h-28 object-cover rounded-2xl shadow-xl border border-slate-800 flex-shrink-0"
        />

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {np.is_playing ? 'CURRENTLY IN-GAME ON STEAM' : 'OFFLINE'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">{np.game_title}</h2>
          <p className="text-xs text-slate-400 font-mono">App ID: {np.app_id} • Session: {np.session_playtime_mins} mins</p>
          <p className="text-sm font-semibold text-cyan-400 font-mono">Lifetime Playtime: {np.total_playtime_hours} Hours</p>
        </div>
      </div>

      {/* Gaming Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">GAMES OWNED</span>
          <p className="text-3xl font-extrabold text-white">{stats.games_owned}</p>
          <p className="text-[11px] text-cyan-400 mt-2 font-semibold">Steam Library</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TOTAL HOURS</span>
          <p className="text-3xl font-extrabold text-white">{stats.total_hours_played.toLocaleString()}h</p>
          <p className="text-[11px] text-cyan-400 mt-2 font-semibold">Lifetime Playtime</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">RECENT 2 WEEKS</span>
          <p className="text-3xl font-extrabold text-white">{stats.recent_2weeks_hours}h</p>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">Active Gaming</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">ACHIEVEMENTS</span>
          <p className="text-3xl font-extrabold text-white">{stats.total_achievements}</p>
          <p className="text-[11px] text-purple-400 mt-2 font-semibold">Unlocked Badges</p>
        </div>
      </div>

      {/* Recent Games Log */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Recently Played Steam Games</span>
        </h2>

        <div className="space-y-3 font-mono text-xs">
          {recentGames.map((g: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">🎮 {g.game_title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Last Played: {g.last_played}</p>
              </div>
              <div className="text-right">
                <span className="text-cyan-400 font-semibold block">{g.playtime_2weeks_hours}h (past 2 wks)</span>
                <span className="text-slate-400 text-[11px]">{g.total_hours}h total</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
