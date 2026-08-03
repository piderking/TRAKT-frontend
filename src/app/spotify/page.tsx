'use client';

import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Radio, 
  Disc, 
  Flame, 
  RefreshCw,
  Zap,
  Volume2
} from 'lucide-react';

export default function SpotifyPluginPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSpotify = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/spotify/summary`);
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to fetch Spotify telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSpotify();
  }, []);

  const np = telemetry?.now_playing || {
    track_name: "Starboy",
    artist_name: "The Weeknd ft. Daft Punk",
    album_name: "Starboy",
    duration_ms: 230400,
    progress_ms: 142000,
    is_playing: true,
    album_art_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80",
    audio_features: { bpm: 186, energy: 0.82, danceability: 0.68 }
  };

  const stats = telemetry?.stats || {
    tracks_played_today: 34,
    total_listening_minutes: 118,
    top_artists: [
      { name: "The Weeknd", play_count: 14 },
      { name: "Daft Punk", play_count: 8 },
      { name: "Kendrick Lamar", play_count: 6 }
    ]
  };

  const history = telemetry?.history || [
    { track_name: "Blinding Lights", artist_name: "The Weeknd", album_name: "After Hours", played_at: "11:05 AM", duration_formatted: "3:20" },
    { track_name: "Get Lucky", artist_name: "Daft Punk", album_name: "Random Access Memories", played_at: "10:42 AM", duration_formatted: "4:08" }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <Music className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                SPOTIFY WEB API TAB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              Spotify Music Scrobbler
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live playback status, audio feature analysis, and scrobble history
            </p>
          </div>
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchSpotify(); }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 font-mono text-xs flex items-center space-x-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Playback</span>
        </button>
      </div>

      {/* Now Playing Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center gap-6">
        <img
          src={np.album_art_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"}
          alt="Album Art"
          className="w-28 h-28 object-cover rounded-2xl shadow-xl border border-slate-800 flex-shrink-0"
        />

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              {np.is_playing ? 'NOW PLAYING ON SPOTIFY' : 'PAUSED'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">{np.track_name}</h2>
          <p className="text-sm font-semibold text-slate-300">{np.artist_name}</p>
          <p className="text-xs text-slate-400 font-mono">Album • {np.album_name}</p>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((np.progress_ms / np.duration_ms) * 100))}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TRACKS PLAYED TODAY</span>
          <p className="text-3xl font-extrabold text-white">{stats.tracks_played_today}</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Scrobbler Active</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">LISTENING MINUTES</span>
          <p className="text-3xl font-extrabold text-white">{stats.total_listening_minutes}m</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Today</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TEMPO (BPM)</span>
          <p className="text-3xl font-extrabold text-white">{np.audio_features?.bpm || 186}</p>
          <p className="text-[11px] text-purple-400 mt-2 font-semibold">Audio Feature</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">ENERGY LEVEL</span>
          <p className="text-3xl font-extrabold text-white">{Math.round((np.audio_features?.energy || 0.82) * 100)}%</p>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">High Intensity</p>
        </div>
      </div>

      {/* Scrobble History */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-emerald-400" />
          <span>Recent Spotify Scrobble Log</span>
        </h2>

        <div className="space-y-3 font-mono text-xs">
          {history.map((h: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">♬ {h.track_name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{h.artist_name} • {h.album_name}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">{h.played_at}</span>
                <span className="text-emerald-400 font-semibold">{h.duration_formatted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
