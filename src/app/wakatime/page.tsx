'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Cpu, 
  Clock, 
  Flame, 
  Sparkles, 
  RefreshCw,
  Terminal,
  Activity
} from 'lucide-react';
import { PluginHelpGuide } from '../../components/PluginHelpGuide';

export default function WakaTimePluginPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/telemetry/summary`);
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to fetch WakaTime telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTelemetry();
  };

  const tokens = telemetry?.token_metrics || {
    prompt_tokens: 142500,
    completion_tokens: 48200,
    total_tokens: 190700,
    models_breakdown: {
      "gemini-3.6-flash": { prompt: 110000, completion: 35000 },
      "gemini-3.6-pro": { prompt: 32500, completion: 13200 }
    },
    sessions_count: 12
  };

  const wakatime = telemetry?.wakatime_metrics || {
    today_seconds: 18420,
    today_formatted: "5h 7m",
    active_project: "TRAKT",
    top_languages: [
      { name: "Python", pct: 52.4 },
      { name: "TypeScript", pct: 38.1 },
      { name: "CSS/HTML", pct: 9.5 }
    ]
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                DEDICATED PLUGIN TAB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              WakaTime & Antigravity Token Telemetry
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live AI model token usage and WakaTime scrobbler stats
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 font-mono text-xs flex items-center space-x-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-purple-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">TOTAL AI TOKENS</span>
          <p className="text-3xl font-extrabold text-white">{(tokens.total_tokens / 1000).toFixed(1)}K</p>
          <p className="text-[11px] text-purple-400 mt-2 font-semibold">Antigravity CLI Session</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">ACTIVE CODING TIME</span>
          <p className="text-3xl font-extrabold text-white">{wakatime.today_formatted}</p>
          <p className="text-[11px] text-emerald-400 mt-2 font-semibold">Active Today</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">ACTIVE PROJECT</span>
          <p className="text-3xl font-extrabold text-white">{wakatime.active_project}</p>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">Monorepo Development</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">CLI SESSIONS</span>
          <p className="text-3xl font-extrabold text-white">{tokens.sessions_count}</p>
          <p className="text-[11px] text-blue-400 mt-2 font-semibold">Completed Runs</p>
        </div>
      </div>

      {/* Model Breakdown + Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Token Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>AI Model Token Consumption</span>
          </h2>

          <div className="space-y-4 font-mono text-xs">
            {Object.entries(tokens.models_breakdown || {}).map(([model, data]: [string, any]) => {
              const total = data.prompt + data.completion;
              const pct = Math.round((total / tokens.total_tokens) * 100);
              return (
                <div key={model} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{model}</span>
                    <span className="text-purple-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Prompt: {(data.prompt / 1000).toFixed(1)}k</span>
                    <span>Completion: {(data.completion / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Ratio */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <span>Programming Languages Ratio</span>
          </h2>

          <div className="space-y-4 font-mono text-xs">
            {wakatime.top_languages.map((lang: any) => (
              <div key={lang.name} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{lang.name}</span>
                  <span className="text-emerald-400 font-bold">{lang.pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full" style={{ width: `${lang.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
