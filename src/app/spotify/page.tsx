'use client';

import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Radio, 
  Disc, 
  Flame, 
  RefreshCw,
  Zap,
  Volume2,
  Play,
  Plus,
  Check,
  ExternalLink
} from 'lucide-react';

export default function SpotifyPluginPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Manual Scrobble Form State
  const [scrobbleTrack, setScrobbleTrack] = useState('');
  const [scrobbleArtist, setScrobbleArtist] = useState('');
  const [scrobbleAlbum, setScrobbleAlbum] = useState('');
  const [scrobbledSuccess, setScrobbledSuccess] = useState(false);
  const [scrobbling, setScrobbling] = useState(false);

  const originUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app';

  const fetchSpotify = async () => {
    try {
      const res = await fetch(`${originUrl}/api/v1/spotify/summary`);
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

  const handleManualScrobble = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrobbleTrack || !scrobbleArtist) return;

    setScrobbling(true);
    try {
      const payload = {
        track_name: scrobbleTrack,
        artist_name: scrobbleArtist,
        album_name: scrobbleAlbum || "Single",
        duration_ms: 210000,
        progress_ms: 145000,
        is_playing: true,
        album_art_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"
      };

      const res = await fetch(`${originUrl}/api/v1/spotify/scrobble`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setScrobbledSuccess(true);
        setTimeout(() => {
          setScrobbledSuccess(false);
          setScrobbleTrack('');
          setScrobbleArtist('');
          setScrobbleAlbum('');
        }, 1500);
        fetchSpotify();
      }
    } catch (err) {
      console.error('Failed to scrobble track:', err);
    } finally {
      setScrobbling(false);
    }
  };

  const np = telemetry?.now_playing || {
    track_name: "No Track Playing",
    artist_name: "",
    album_name: "",
    duration_ms: 0,
    progress_ms: 0,
    is_playing: false,
    album_art_url: "",
    audio_features: { bpm: 0, energy: 0.0, danceability: 0.0 }
  };

  const stats = telemetry?.stats || {
    tracks_played_today: 0,
    total_listening_minutes: 0,
    top_artists: []
  };

  const history = telemetry?.history || [];

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
                SPOTIFY WEB API ACTIVE
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
          <span>Sync Spotify API</span>
        </button>
      </div>

      {/* Now Playing Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center gap-6">
        {np.album_art_url ? (
          <img
            src={np.album_art_url}
            alt="Album Art"
            className="w-28 h-28 object-cover rounded-2xl shadow-xl border border-slate-800 flex-shrink-0"
          />
        ) : (
          <div className="w-28 h-28 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-600 font-mono text-xs">
            <Disc className="w-10 h-10 text-slate-700 animate-spin" />
          </div>
        )}

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${np.is_playing ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              {np.is_playing ? 'NOW PLAYING ON SPOTIFY' : 'NO MUSIC CURRENTLY PLAYING'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">{np.track_name}</h2>
          {np.artist_name && (
            <p className="text-sm font-semibold text-emerald-400 font-mono">{np.artist_name} — {np.album_name}</p>
          )}

          {/* Audio Features Badges */}
          {np.audio_features && np.audio_features.bpm > 0 && (
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                BPM: {np.audio_features.bpm}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Energy: {Math.round((np.audio_features.energy || 0.7) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Track Scrobbler Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-sans">
          <Radio className="w-5 h-5 text-emerald-400" />
          <span>Manual Spotify Track Scrobbler & Test Generator</span>
        </h2>

        <form onSubmit={handleManualScrobble} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={scrobbleTrack}
            onChange={e => setScrobbleTrack(e.target.value)}
            placeholder="Track Title (e.g. Starboy)"
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            required
            value={scrobbleArtist}
            onChange={e => setScrobbleArtist(e.target.value)}
            placeholder="Artist Name (e.g. The Weeknd)"
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={scrobbleAlbum}
            onChange={e => setScrobbleAlbum(e.target.value)}
            placeholder="Album (Optional)"
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={scrobbling}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-1.5"
          >
            {scrobbledSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{scrobbledSuccess ? 'Scrobbled!' : scrobbling ? 'Sending...' : 'Scrobble Track'}</span>
          </button>
        </form>
      </div>

      {/* Listening Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TRACKS PLAYED TODAY</span>
          <p className="text-3xl font-extrabold text-white">{stats.tracks_played_today}</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Live Scrobble Counter</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">LISTENING MINUTES</span>
          <p className="text-3xl font-extrabold text-white">{stats.total_listening_minutes}m</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Total Time Streaming</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TOP GENRE</span>
          <p className="text-2xl font-extrabold text-white truncate">Alternative / R&B</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Audio Classifier</p>
        </div>
      </div>

      {/* Listening History Feed */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Disc className="w-5 h-5 text-emerald-400" />
          <span>Recent Spotify Listening History</span>
        </h2>

        {history.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-500">
            No Spotify listening history recorded yet. Connect Spotify API in /plugins or test scrobble above!
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {history.map((h: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {h.album_art_url ? (
                    <img src={h.album_art_url} alt="Album Art" className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-bold">
                      ♫
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">🎵 {h.track_name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{h.artist_name} — {h.album_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-semibold block">{h.duration_formatted}</span>
                  <span className="text-slate-400 text-[11px]">{h.played_at || 'Recent'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
