'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  FolderPlus, 
  Sliders, 
  RefreshCw, 
  Check, 
  X, 
  Key, 
  Activity, 
  Sparkles, 
  HardDrive, 
  Layers,
  Terminal,
  Play,
  Pause,
  Plus,
  ChevronRight
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'core' | 'plugins' | 'register'>('plugins');

  // Core System State
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [flushing, setFlushing] = useState(false);
  const [flushSuccess, setFlushSuccess] = useState(false);

  // Dynamic Plugins State
  const [discoveredPlugins, setDiscoveredPlugins] = useState<any[]>([]);
  const [fetcherRunning, setFetcherRunning] = useState(true);

  // Token Credentials Input State
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamProfileId, setSteamProfileId] = useState('');
  const [spotifyClientId, setSpotifyClientId] = useState('');
  const [spotifyClientSecret, setSpotifyClientSecret] = useState('');
  const [savedTokenPlugin, setSavedTokenPlugin] = useState<string | null>(null);

  // Historical Data Fetcher State
  const [historicalDays, setHistoricalDays] = useState<number>(1);
  const [fetchingHistorical, setFetchingHistorical] = useState(false);
  const [historicalSuccess, setHistoricalSuccess] = useState(false);
  const [historicalResult, setHistoricalResult] = useState<any>(null);

  // Custom Plugin Registration Form
  const [regPluginId, setRegPluginId] = useState('');
  const [regName, setRegName] = useState('');
  const [regDomain, setRegDomain] = useState('custom');
  const [regFetchUrl, setRegFetchUrl] = useState('');
  const [regSchemaInput, setRegSchemaInput] = useState('{"title": "string", "rating": "number"}');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const originUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app';

  const fetchSystemData = async () => {
    try {
      // 1. Fetch DB Status
      const dbRes = await fetch(`${originUrl}/health`);
      const dbData = await dbRes.json();
      setDbStatus(dbData);

      // 2. Fetch Discovered Plugins from Engine
      const plugRes = await fetch(`${originUrl}/api/v1/plugins/discovered`);
      const plugData = await plugRes.json();
      if (plugData.plugins) {
        setDiscoveredPlugins(plugData.plugins);
        setFetcherRunning(plugData.fetcher_loop_running ?? true);
      }

      // 3. Fetch Stored Plugin Tokens
      const steamCfgRes = await fetch(`${originUrl}/api/v1/plugins/config/steam`);
      if (steamCfgRes.ok) {
        const cData = await steamCfgRes.json();
        if (cData.config) {
          if (cData.config.steam_api_key) setSteamApiKey(cData.config.steam_api_key);
          if (cData.config.steam_profile_id) setSteamProfileId(cData.config.steam_profile_id);
        }
      }

      const spotifyCfgRes = await fetch(`${originUrl}/api/v1/plugins/config/spotify`);
      if (spotifyCfgRes.ok) {
        const sData = await spotifyCfgRes.json();
        if (sData.config) {
          if (sData.config.spotify_client_id) setSpotifyClientId(sData.config.spotify_client_id);
          if (sData.config.spotify_client_secret) setSpotifyClientSecret(sData.config.spotify_client_secret);
        }
      }
    } catch (err) {
      console.error('Failed to fetch system settings:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSystemData();
    }
  }, [isOpen]);

  const handleSavePluginTokens = async (pluginId: string, payload: Record<string, any>) => {
    try {
      const res = await fetch(`${originUrl}/api/v1/plugins/config/${pluginId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSavedTokenPlugin(pluginId);
        setTimeout(() => setSavedTokenPlugin(null), 2000);
        fetchSystemData();
      }
    } catch (err) {
      console.error(`Failed to save ${pluginId} tokens:`, err);
    }
  };

  const handleFlushDb = async () => {
    setFlushing(true);
    try {
      await fetch(`${originUrl}/api/v1/system/flush`, { method: 'POST' });
      setFlushSuccess(true);
      setTimeout(() => setFlushSuccess(false), 2000);
      fetchSystemData();
    } catch (err) {
      console.error('Failed to flush database:', err);
    } finally {
      setFlushing(false);
    }
  };

  const handleToggleFetcher = async (pluginId: string) => {
    try {
      await fetch(`${originUrl}/api/v1/plugins/toggle/${pluginId}`, { method: 'POST' });
      fetchSystemData();
    } catch (err) {
      console.error('Failed to toggle fetcher:', err);
    }
  };

  const handleTriggerHistoricalBackfill = async () => {
    setFetchingHistorical(true);
    try {
      const res = await fetch(`${originUrl}/api/v1/plugins/fetchers/historical?days=${historicalDays}`, {
        method: 'POST'
      });
      const data = await res.json();
      setHistoricalResult(data);
      setHistoricalSuccess(true);
      setTimeout(() => setHistoricalSuccess(false), 2500);
      fetchSystemData();
    } catch (err) {
      console.error('Failed to trigger historical backfill:', err);
    } finally {
      setFetchingHistorical(false);
    }
  };

  const handleRegisterPlugin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPluginId || !regFetchUrl) return;

    try {
      let schemaObj = {};
      try {
        schemaObj = JSON.parse(regSchemaInput);
      } catch (e) {
        schemaObj = { title: "string" };
      }

      const payload = {
        plugin_id: regPluginId,
        name: regName || regPluginId,
        domain: regDomain,
        fetch_url: regFetchUrl,
        schema_fields: schemaObj
      };

      const res = await fetch(`${originUrl}/api/v1/plugins/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setRegisterSuccess(true);
        setTimeout(() => {
          setRegisterSuccess(false);
          setActiveTab('plugins');
          setRegPluginId('');
          setRegName('');
          setRegFetchUrl('');
        }, 1200);
        fetchSystemData();
      }
    } catch (err) {
      console.error('Failed to register plugin:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl border border-slate-800 max-w-4xl w-full h-[80vh] shadow-2xl font-sans flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">TRAKT Core Settings & Plugin Engine</h2>
              <p className="text-xs text-slate-400 font-mono">Persistent Database, API Token Storage & Dynamic Background Fetchers</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body with LEFT VERTICAL SIDEBAR TABS */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Vertical Tabs Sidebar */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 space-y-2 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-500 font-bold px-3 py-1 uppercase">SETTINGS NAVIGATION</div>
              
              <button
                onClick={() => setActiveTab('plugins')}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border ${
                  activeTab === 'plugins'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Dynamic Plugins & Tokens</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 text-[10px] font-bold">
                  {discoveredPlugins.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('core')}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border ${
                  activeTab === 'core'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Persistent DB & System</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                onClick={() => setActiveTab('register')}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border ${
                  activeTab === 'register'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FolderPlus className="w-4 h-4 text-purple-400" />
                  <span>Add Plugin Directory</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
              <span className="font-bold text-white block">Engine Status:</span>
              <div>SSE Stream: <span className="text-emerald-400 font-bold">Connected</span></div>
              <div>Fetch Loop: <span className="text-indigo-400 font-bold">Active (30s)</span></div>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* TAB 1: Core System & Database */}
            {activeTab === 'core' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">DATABASE STATUS</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1">PERSISTENT ONLINE</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">SQLite & JSON Disk Tier</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">BACKGROUND FETCHERS</span>
                    <p className="text-lg font-bold text-indigo-400 mt-1">{fetcherRunning ? 'ACTIVE (30s)' : 'STOPPED'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Auto-Plugs into Database</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">DISCOVERED PLUGINS</span>
                    <p className="text-lg font-bold text-white mt-1">{discoveredPlugins.length} Loaded</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">From /plugins folder</p>
                  </div>
                </div>

                {/* Cache & DB Flush Panel */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                    <span>Database & Cache Management</span>
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Flush warm in-memory cache tier while retaining persistent credentials in disk storage.
                  </p>

                  <button
                    onClick={handleFlushDb}
                    disabled={flushing}
                    className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 font-bold transition-all flex items-center space-x-2"
                  >
                    {flushSuccess ? <Check className="w-4 h-4" /> : <RefreshCw className={`w-4 h-4 ${flushing ? 'animate-spin' : ''}`} />}
                    <span>{flushSuccess ? 'Flushed Warm Cache!' : flushing ? 'Flushing...' : 'Flush Warm Cache Tier'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Dynamic Plugin Directories & Tokens */}
            {activeTab === 'plugins' && (
              <div className="space-y-4 font-mono text-xs">
                {/* HISTORICAL TELEMETRY BACKFILL ENGINE PANEL */}
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span>Historical Telemetry Backfill Engine</span>
                      </h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Fetch and backfill historical activity records into persistent database tier.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={historicalDays}
                        onChange={e => setHistoricalDays(parseInt(e.target.value))}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-[11px]"
                      >
                        <option value={1}>1 Day (Default)</option>
                        <option value={7}>7 Days</option>
                        <option value={30}>30 Days</option>
                        <option value={90}>90 Days</option>
                        <option value={365}>1 Year (365 Days)</option>
                      </select>

                      <button
                        onClick={handleTriggerHistoricalBackfill}
                        disabled={fetchingHistorical}
                        className="px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[11px] shadow-lg transition-all flex items-center space-x-1.5"
                      >
                        {historicalSuccess ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className={`w-3.5 h-3.5 ${fetchingHistorical ? 'animate-spin' : ''}`} />}
                        <span>{historicalSuccess ? 'Historical Data Synced!' : fetchingHistorical ? 'Syncing...' : 'Trigger Backfill'}</span>
                      </button>
                    </div>
                  </div>

                  {historicalResult && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-[11px] text-slate-300">
                      Total Historical Records Backfilled: <strong className="text-emerald-400">{historicalResult.total_records_backfilled || 0}</strong>
                    </div>
                  )}
                </div>
                {discoveredPlugins.map((plugin) => (
                  <div key={plugin.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase">
                            {plugin.domain}
                          </span>
                          <h4 className="font-bold text-white text-base font-sans">{plugin.name}</h4>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Fetcher URL: <code className="text-emerald-400">{plugin.fetch_url}</code> • Interval: {plugin.fetch_interval_seconds}s
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleFetcher(plugin.id)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
                          plugin.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {plugin.enabled ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        <span>{plugin.enabled ? 'Fetcher Active' : 'Fetcher Paused'}</span>
                      </button>
                    </div>

                    {/* Plugin Credentials Persistence Form */}
                    {plugin.id === 'steam' && (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          <span>PERSISTENT STEAM API CREDENTIALS</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={steamApiKey}
                            onChange={e => setSteamApiKey(e.target.value)}
                            placeholder="Steam Web API Key (32 hex)"
                            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={steamProfileId}
                            onChange={e => setSteamProfileId(e.target.value)}
                            placeholder="SteamID64 (17 digits)"
                            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-indigo-500"
                          />
                        </div>
                        <button
                          onClick={() => handleSavePluginTokens('steam', { steam_api_key: steamApiKey, steam_profile_id: steamProfileId })}
                          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[11px] flex items-center space-x-1.5 transition-all shadow-md"
                        >
                          {savedTokenPlugin === 'steam' ? <Check className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
                          <span>{savedTokenPlugin === 'steam' ? 'Saved & Synced to Database!' : 'Save Steam Credentials to DB'}</span>
                        </button>
                      </div>
                    )}

                    {plugin.id === 'spotify' && (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          <span>PERSISTENT SPOTIFY CREDENTIALS</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={spotifyClientId}
                            onChange={e => setSpotifyClientId(e.target.value)}
                            placeholder="Spotify Client ID"
                            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                          />
                          <input
                            type="password"
                            value={spotifyClientSecret}
                            onChange={e => setSpotifyClientSecret(e.target.value)}
                            placeholder="Spotify Client Secret"
                            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-emerald-500"
                          />
                        </div>
                        <button
                          onClick={() => handleSavePluginTokens('spotify', { spotify_client_id: spotifyClientId, spotify_client_secret: spotifyClientSecret })}
                          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1.5 transition-all shadow-md"
                        >
                          {savedTokenPlugin === 'spotify' ? <Check className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
                          <span>{savedTokenPlugin === 'spotify' ? 'Saved & Synced to Database!' : 'Save Spotify Credentials to DB'}</span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Items Fetched: {plugin.items_fetched_count || 0}</span>
                      <span>Last Fetch Status: <code className={`font-bold ${plugin.last_fetch_status === 'success' ? 'text-emerald-400' : 'text-amber-400'}`}>{plugin.last_fetch_status}</code></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Register Custom Plugin Directory */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterPlugin} className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Dynamic Microservice Plugin Directory Creator</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Define a new plugin folder under <code className="text-white">/plugins</code>. The Plugin Engine will generate schema manifests and run background fetcher tasks.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">PLUGIN FOLDER ID</label>
                    <input
                      type="text"
                      required
                      value={regPluginId}
                      onChange={e => setRegPluginId(e.target.value)}
                      placeholder="e.g. strava / weather / goodreads"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">PLUGIN DISPLAY NAME</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Strava Fitness Fetcher"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">BACKGROUND FETCHER URL</label>
                  <input
                    type="text"
                    required
                    value={regFetchUrl}
                    onChange={e => setRegFetchUrl(e.target.value)}
                    placeholder="/api/v1/fitness/summary"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">DATABASE ENTITY JSON SCHEMA</label>
                  <textarea
                    rows={3}
                    value={regSchemaInput}
                    onChange={e => setRegSchemaInput(e.target.value)}
                    placeholder='{"title": "string", "rating": "number"}'
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  {registerSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{registerSuccess ? 'Plugin Registered!' : 'Register Plugin Directory'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
