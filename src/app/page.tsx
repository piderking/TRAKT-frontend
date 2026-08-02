'use client';

import React, { useState, useEffect } from 'react';
import { usePlugins } from '../context/PluginContext';
import { 
  Radio, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Code2, 
  Tv, 
  Gamepad2, 
  BookOpen, 
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function NodeDashboardPage() {
  const { plugins, activePluginId, activePlugin, setActivePluginId } = usePlugins();
  const [deviceCodeData, setDeviceCodeData] = useState<{ user_code: string; verification_url: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRequestDeviceCode = async () => {
    setLoadingAuth(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/auth/device/code`, {
        method: 'POST'
      });
      const data = await res.json();
      setDeviceCodeData(data);
    } catch (err) {
      console.error('Device code request failed:', err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleRefreshFeed = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner with Plugin Theme Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
              CLUSTER TELEMETRY
            </span>
            <span className="text-xs text-slate-400 font-mono">Headless Micro-Kernel v1.2</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Node Dashboard & Scrobble Feed</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time microservice status, tiered storage hits, and customizable plugin widgets.
          </p>
        </div>

        {/* Plugin Theme & Customizer Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-lg">
          <span className="text-[11px] font-mono font-semibold text-slate-400 px-3 uppercase tracking-wider hidden sm:inline">
            Active Theme:
          </span>
          <div className="flex space-x-1">
            {plugins.map(plugin => {
              const isActive = plugin.id === activePluginId;
              return (
                <button
                  key={plugin.id}
                  onClick={() => setActivePluginId(plugin.id)}
                  style={{
                    backgroundColor: isActive ? plugin.theme.primaryColor : 'transparent',
                    boxShadow: isActive ? `0 0 15px ${plugin.theme.glowColor}` : 'none'
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                    isActive ? 'text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: plugin.theme.primaryColor }} />
                  <span>{plugin.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>WARM TIER HITS</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">98.4%</p>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-blue-400 font-semibold">Redis Sub-millisecond</span>
            <span className="text-slate-500 font-mono">&le; 100KB Blobs</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>COLD DB PAYLOADS</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">1,420</p>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-purple-400 font-semibold">PostgreSQL Blobs</span>
            <span className="text-slate-500 font-mono">_cold_ref Pointers</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>AI MODEL TOKENS</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">190.7K</p>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-emerald-400 font-semibold">Antigravity CLI</span>
            <span className="text-slate-500 font-mono">12 Active Sessions</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>WAKATIME TIME</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">5h 07m</p>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-amber-400 font-semibold">Scrobbler Active</span>
            <span className="text-slate-500 font-mono">Top: Python 52%</span>
          </div>
        </div>
      </div>

      {/* Active Plugin Custom Widget Section */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-xl text-white font-bold"
              style={{ backgroundColor: activePlugin.theme.primaryColor }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">{activePlugin.widget.title}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${activePlugin.theme.badgeBg}`}>
                  {activePlugin.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activePlugin.widget.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right font-mono">
              <p className="text-sm font-bold text-white">{activePlugin.widget.metricValue}</p>
              <p className="text-[10px] text-slate-400">{activePlugin.widget.metricLabel}</p>
            </div>
            <button
              onClick={handleRefreshFeed}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Plugin Custom Card Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePlugin.widget.items.map(item => (
            <div
              key={item.id}
              className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    {item.tag}
                  </span>
                  {item.rating && (
                    <span className="text-xs font-semibold font-mono text-amber-400">
                      ★ {item.rating}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">{item.subtitle}</p>
              </div>

              {item.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: activePlugin.theme.primaryColor
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Device Auth Testing + Live Scrobble Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Headless Node Device Auth Tool */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center space-x-2 text-slate-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">Headless Node Device Auth</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test the Trakt OAuth Device Code Flow used by Android Background Scrobblers and headless CLI clients.
          </p>

          <button
            onClick={handleRequestDeviceCode}
            disabled={loadingAuth}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2"
          >
            <Radio className="w-4 h-4" />
            <span>{loadingAuth ? 'Requesting Device Code...' : 'Request OAuth Device Code'}</span>
          </button>

          {deviceCodeData && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">USER CODE:</span>
                <span className="text-emerald-400 font-extrabold text-sm tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {deviceCodeData.user_code}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px]">VERIFICATION URL:</span>
                <a
                  href={deviceCodeData.verification_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center space-x-1 text-[11px] truncate"
                >
                  <span>{deviceCodeData.verification_url}</span>
                  <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Column 2 & 3: Live System Scrobble Stream */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-slate-200">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-base">Live Ecosystem Telemetry Log</h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              ● Streaming
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs max-h-72 overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">[00:38:55]</span>
                <span className="text-emerald-400">POST /api/v1/telemetry/token</span>
                <span className="text-slate-400 text-[11px]">Antigravity CLI • +1,850 tokens</span>
              </div>
              <span className="text-slate-500 text-[10px]">200 OK</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">[00:38:10]</span>
                <span className="text-purple-400">GET /api/v1/user/up-next</span>
                <span className="text-slate-400 text-[11px]">Movies Microservice Proxy</span>
              </div>
              <span className="text-slate-500 text-[10px]">200 OK</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">[00:37:34]</span>
                <span className="text-amber-400">SET TieredStorageEngine</span>
                <span className="text-slate-400 text-[11px]">Key: user:up_next_feed (Warm Cache Hit)</span>
              </div>
              <span className="text-slate-500 text-[10px]">Redis 0.4ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
