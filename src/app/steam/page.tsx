'use client';

import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Flame,
  ExternalLink,
  Zap,
  Play
} from 'lucide-react';
import { PluginHelpGuide } from '../../components/PluginHelpGuide';

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
    player_name: "muncher",
    game_title: "Offline / Not in-game",
    app_id: 0,
    is_playing: false,
    header_image: ""
  };

  const stats = telemetry?.stats || {
    games_owned: 0,
    total_hours_played: 0.0,
    recent_2weeks_hours: 0.0,
    top_games: []
  };

  const recentGames = telemetry?.recent_games || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          {np.avatar_url ? (
            <img src={np.avatar_url} alt="Steam Avatar" className="w-12 h-12 rounded-2xl border-2 border-cyan-400 shadow-lg shadow-cyan-500/20" />
          ) : (
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <Gamepad2 className="w-7 h-7" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                STEAM WEB API ACTIVE
              </span>
              {np.player_name && (
                <span className="text-xs font-mono text-slate-300">
                  Profile: <strong className="text-white">{np.player_name}</strong>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              Steam Gaming Telemetry
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live Steam Web API integration with real-time playtime and library stats
            </p>
          </div>
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchSteam(); }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 font-mono text-xs flex items-center space-x-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Steam API</span>
        </button>
      </div>

      {/* Currently Playing Game Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-center gap-6">
        {np.header_image ? (
          <img
            src={np.header_image}
            alt="Game Cover"
            className="w-48 h-28 object-cover rounded-2xl shadow-xl border border-slate-800 flex-shrink-0"
          />
        ) : (
          <div className="w-48 h-28 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 font-mono text-xs">
            No Active Banner
          </div>
        )}

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${np.is_playing ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {np.is_playing ? 'CURRENTLY IN-GAME ON STEAM' : 'OFFLINE / NOT IN-GAME'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">{np.game_title}</h2>
          {np.app_id > 0 && (
            <p className="text-xs text-slate-400 font-mono">App ID: {np.app_id} • Session: {np.session_playtime_mins || 0} mins</p>
          )}
          <a
            href="https://steamcommunity.com/profiles/76561199053737486/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            <span>View Steam Profile (76561199053737486)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Gaming Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">GAMES OWNED</span>
          <p className="text-3xl font-extrabold text-white">{stats.games_owned}</p>
          <p className="text-[11px] text-cyan-400 mt-2 font-semibold">Steam Library Count</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TOTAL LIBRARY HOURS</span>
          <p className="text-3xl font-extrabold text-white">{stats.total_hours_played.toLocaleString()}h</p>
          <p className="text-[11px] text-cyan-400 mt-2 font-semibold">Lifetime Playtime</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">PAST 2 WEEKS PLAYTIME</span>
          <p className="text-3xl font-extrabold text-white">{stats.recent_2weeks_hours}h</p>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">Active Gaming Telemetry</p>
        </div>
      </div>

      {/* Top Games Played */}
      {stats.top_games && stats.top_games.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Top Played Games in Library</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {stats.top_games.map((g: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <img src={g.header_image} alt={g.game_title} className="w-20 h-12 object-cover rounded-lg border border-slate-800 flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-sm truncate">{g.game_title}</p>
                  <p className="text-cyan-400 font-semibold mt-0.5">{g.hours} Hours Played</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Games Log */}
      {recentGames.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Recently Played Steam Games (Past 2 Weeks)</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {recentGames.map((g: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={g.header_image} alt={g.game_title} className="w-16 h-10 object-cover rounded-lg border border-slate-800" />
                  <div>
                    <p className="font-bold text-white text-sm">🎮 {g.game_title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{g.last_played}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-semibold block">{g.playtime_2weeks_hours}h (past 2 wks)</span>
                  <span className="text-slate-400 text-[11px]">{g.total_hours}h total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
