'use client';

import React, { useState } from 'react';
import { usePlugins } from '../../context/PluginContext';
import { 
  Cpu, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  Palette, 
  Sparkles, 
  Radio, 
  Zap, 
  Terminal, 
  Check, 
  Eye
} from 'lucide-react';

export default function PluginsTopologyPage() {
  const { plugins, activePluginId, setActivePluginId, updatePluginTheme, togglePlugin } = usePlugins();
  const [selectedPluginId, setSelectedPluginId] = useState<string>('movies');
  const [customColor, setCustomColor] = useState<string>('#8B5CF6');
  const [flushingCache, setFlushingCache] = useState(false);

  const selectedPlugin = plugins.find(p => p.id === selectedPluginId) || plugins[0];

  const handleColorChange = (newColor: string) => {
    setCustomColor(newColor);
    updatePluginTheme(selectedPluginId, {
      primaryColor: newColor,
      glowColor: `${newColor}55`,
      badgeBg: `bg-opacity-10 text-white border-opacity-30`
    });
  };

  const handleFlushCache = () => {
    setFlushingCache(true);
    setTimeout(() => setFlushingCache(false), 1200);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
              PLUGIN STUDIO & SYSTEM TOPOLOGY
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Microservice Plugins & Theme Customizer</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize plugin themes, inspect microservice ping latencies, and test embedded plugin UIs.
          </p>
        </div>

        <button
          onClick={handleFlushCache}
          disabled={flushingCache}
          className="px-4 py-2.5 rounded-xl bg-slate-900/80 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 font-mono text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-purple-400 ${flushingCache ? 'animate-spin' : ''}`} />
          <span>{flushingCache ? 'Flushing Redis Warm Tier...' : 'Flush Warm Cache Tier'}</span>
        </button>
      </div>

      {/* Grid: Plugin Selector Cards & Customization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Registered Microservice Plugins List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold font-mono text-slate-400 uppercase tracking-wider">
            Registered Microservices ({plugins.length})
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

        {/* Middle & Right Column: Theme Customizer Studio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customizer Studio Card */}
          <div className="glass-panel-glow p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2.5 rounded-xl text-white font-bold"
                  style={{ backgroundColor: selectedPlugin.theme.primaryColor }}
                >
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{selectedPlugin.name} Studio</h3>
                  <p className="text-xs text-slate-400 font-mono">Customizing Theme & UI Accents</p>
                </div>
              </div>

              <button
                onClick={() => setActivePluginId(selectedPlugin.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/20 flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Theme Globally</span>
              </button>
            </div>

            {/* Accent Color Palette Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider block">
                Primary Theme Accent Color:
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-xl transition-all border-2 ${
                      selectedPlugin.theme.primaryColor === color
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}

                <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
                  <span className="text-xs font-mono text-slate-400">Custom Hex:</span>
                  <input
                    type="color"
                    value={selectedPlugin.theme.primaryColor}
                    onChange={e => handleColorChange(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            </div>

            {/* Custom Widget Preview Panel */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider block">
                Live Widget Theme Preview:
              </span>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedPlugin.theme.primaryColor }}
                    />
                    <span className="font-bold text-white text-sm">{selectedPlugin.widget.title}</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold"
                    style={{
                      backgroundColor: `${selectedPlugin.theme.primaryColor}22`,
                      color: selectedPlugin.theme.primaryColor,
                      border: `1px solid ${selectedPlugin.theme.primaryColor}44`
                    }}
                  >
                    PREVIEW
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPlugin.widget.items.slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white">{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                      </div>
                      {item.progress !== undefined && (
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.progress}%`,
                              backgroundColor: selectedPlugin.theme.primaryColor
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Microservice UI Preview Link */}
            {selectedPlugin.uiEndpointUrl && (
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Embedded Microservice UI Available</span>
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/static/plugins/${selectedPlugin.id}/ui`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono font-semibold flex items-center space-x-1 underline"
                >
                  <span>Open Standalone UI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
