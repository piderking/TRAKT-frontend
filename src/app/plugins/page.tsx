'use client';

import React, { useState, useEffect } from 'react';
import { usePlugins } from '../../context/PluginContext';
import { 
  Cpu, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  Lock, 
  Check, 
  Eye, 
  Plus, 
  Copy, 
  Server, 
  Terminal,
  Save,
  Globe
} from 'lucide-react';

interface OAuthClientData {
  client_id: string;
  client_secret: string;
  client_name: string;
  redirect_uris: string[];
  scopes: string[];
}

export default function PluginsTopologyPage() {
  const { plugins, activePluginId, setActivePluginId, updatePluginTheme } = usePlugins();
  const [selectedPluginId, setSelectedPluginId] = useState<string>('wakatime');
  const [flushingCache, setFlushingCache] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Plugin Credentials State
  const [wakaApiKey, setWakaApiKey] = useState('waka_sec_demo_key_99812');
  const [traktClientId, setTraktClientId] = useState('demo_trakt_id_7781');
  const [traktClientSecret, setTraktClientSecret] = useState('demo_trakt_secret_9981');
  const [healthSyncToken, setHealthSyncToken] = useState('hc_token_demo_3341');

  // OAuth Server State
  const [oauthClients, setOauthClients] = useState<OAuthClientData[]>([
    {
      client_id: 'android_daemon_default',
      client_secret: 'sec_8f99a1b2c3d4e5f6',
      client_name: 'Trakt Android Daemon',
      redirect_uris: ['https://trakt.tv/activate', 'trakt://oauth/callback'],
      scopes: ['read', 'write', 'scrobble', 'health']
    }
  ]);
  const [newClientName, setNewClientName] = useState('');
  const [newRedirectUri, setNewRedirectUri] = useState('');
  const [registeringClient, setRegisteringClient] = useState(false);

  const selectedPlugin = plugins.find(p => p.id === selectedPluginId) || plugins[0];

  const handleColorChange = (newColor: string) => {
    updatePluginTheme(selectedPluginId, {
      primaryColor: newColor,
      glowColor: `${newColor}55`
    });
  };

  const handleFlushCache = () => {
    setFlushingCache(true);
    setTimeout(() => setFlushingCache(false), 1200);
  };

  const handleSavePluginConfig = async () => {
    setSavingConfig(true);
    try {
      let configPayload: Record<string, string> = {};
      if (selectedPluginId === 'wakatime') {
        configPayload = { wakatime_api_key: wakaApiKey, sync_interval_mins: '15' };
      } else if (selectedPluginId === 'movies') {
        configPayload = { trakt_client_id: traktClientId, trakt_client_secret: traktClientSecret };
      } else if (selectedPluginId === 'health') {
        configPayload = { health_connect_sync_token: healthSyncToken };
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/plugins/config?plugin_id=${selectedPluginId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configPayload)
      });

      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save plugin config:', err);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleRegisterOAuthClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newRedirectUri) return;
    setRegisteringClient(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/oauth/clients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: newClientName,
          redirect_uris: [newRedirectUri],
          scopes: ['read', 'write', 'scrobble']
        })
      });
      const data = await res.json();
      setOauthClients(prev => [data, ...prev]);
      setNewClientName('');
      setNewRedirectUri('');
    } catch (err) {
      console.error('Failed to register OAuth client:', err);
    } finally {
      setRegisteringClient(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
              PLUGIN STUDIO & OAUTH 2.0 SERVER
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Plugin Configuration & OAuth Manager</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure WakaTime API tokens, client secrets, theme accents, and OAuth 2.0 authorization servers.
          </p>
        </div>

        <button
          onClick={handleFlushCache}
          disabled={flushingCache}
          className="px-4 py-2.5 rounded-xl bg-slate-900/80 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 font-mono text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-purple-400 ${flushingCache ? 'animate-spin' : ''}`} />
          <span>{flushingCache ? 'Flushing Warm Tier Cache...' : 'Flush Warm Cache Tier'}</span>
        </button>
      </div>

      {/* Grid: Plugin Selector Cards & Customization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Registered Microservice Plugins List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold font-mono text-slate-400 uppercase tracking-wider">
            Active Microservices ({plugins.length})
          </h2>

          <div className="space-y-3">
            {plugins.map(p => {
              const isSelected = p.id === selectedPluginId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPluginId(p.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900/90 border-purple-500/60 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.theme.primaryColor }}
                      />
                      <span className="font-bold text-white text-sm">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/20">
                      {p.pingMs ? `${p.pingMs}ms` : 'Online'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/60 pt-2">
                    <span>v{p.version} • {p.author}</span>
                    <span className="text-purple-400 font-semibold">{p.category.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Plugin Credentials & Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Plugin API Key & Credentials Configuration */}
          <div className="glass-panel-glow p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2.5 rounded-xl text-white font-bold"
                  style={{ backgroundColor: selectedPlugin.theme.primaryColor }}
                >
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{selectedPlugin.name} Credentials</h3>
                  <p className="text-xs text-slate-400 font-mono">Set API Keys & Service Tokens</p>
                </div>
              </div>

              <button
                onClick={handleSavePluginConfig}
                disabled={savingConfig}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/20 flex items-center space-x-1.5 transition-all hover:from-purple-500 hover:to-indigo-500"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{configSaved ? 'Saved to Gateway!' : savingConfig ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>

            {/* Plugin Specific Credentials Forms */}
            {selectedPluginId === 'wakatime' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>WAKATIME API TOKEN (wakatime.com/settings/api-key)</span>
                    <span className="text-purple-400 text-[10px]">WAKATIME_API_KEY</span>
                  </label>
                  <input
                    type="password"
                    value={wakaApiKey}
                    onChange={e => setWakaApiKey(e.target.value)}
                    placeholder="sec_wakatime_key_..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[11px] text-slate-500 font-sans">
                    Used by the WakaTime & Token Telemetry microservice to fetch coding statistics and active language breakdown.
                  </p>
                </div>
              </div>
            )}

            {selectedPluginId === 'movies' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">TRAKT OAUTH CLIENT ID</label>
                  <input
                    type="text"
                    value={traktClientId}
                    onChange={e => setTraktClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">TRAKT OAUTH CLIENT SECRET</label>
                  <input
                    type="password"
                    value={traktClientSecret}
                    onChange={e => setTraktClientSecret(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedPluginId === 'health' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">ANDROID HEALTH CONNECT SYNC TOKEN</label>
                  <input
                    type="password"
                    value={healthSyncToken}
                    onChange={e => setHealthSyncToken(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {/* Accent Palette Customizer */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Primary Theme Accent:
              </span>
              <div className="flex gap-2.5 items-center">
                {['#8B5CF6', '#3B82F6', '#EC4899', '#10B981', '#EF4444', '#F59E0B'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${
                      selectedPlugin.theme.primaryColor === color ? 'border-white scale-110' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: OAuth 2.0 Authorization Server Suite */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">OAuth 2.0 Authorization Server</h2>
              <p className="text-xs text-slate-400 font-mono">Issued Tokens, Grant Scopes & Client App Registry</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            ● SERVER ACTIVE
          </span>
        </div>

        {/* OAuth Endpoints Reference Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500">AUTHORIZATION ENDPOINT</span>
            <p className="text-blue-400 font-semibold truncate">/oauth/authorize/code</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500">TOKEN ISSUANCE ENDPOINT</span>
            <p className="text-emerald-400 font-semibold truncate">/oauth/token</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500">USERINFO & VALIDATION</span>
            <p className="text-purple-400 font-semibold truncate">/oauth/userinfo</p>
          </div>
        </div>

        {/* Register New OAuth Client Form */}
        <form onSubmit={handleRegisterOAuthClient} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Register New OAuth 2.0 Client Application</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">APPLICATION NAME</label>
              <input
                type="text"
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                placeholder="e.g. My Custom Scrobbler"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">REDIRECT URI</label>
              <input
                type="text"
                value={newRedirectUri}
                onChange={e => setNewRedirectUri(e.target.value)}
                placeholder="https://myapp.com/oauth/callback"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registeringClient || !newClientName}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition-all flex items-center space-x-1.5"
          >
            <span>{registeringClient ? 'Registering...' : 'Register OAuth Client'}</span>
          </button>
        </form>

        {/* OAuth Clients Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold font-mono text-slate-400 uppercase tracking-wider">
            Active OAuth Clients ({oauthClients.length})
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {oauthClients.map(c => (
              <div key={c.client_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{c.client_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/20">
                      CLIENT ID: {c.client_id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Redirect URIs: {c.redirect_uris.join(', ')}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">CLIENT SECRET</span>
                  <span className="text-xs text-purple-400 font-semibold tracking-wider">{c.client_secret}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
