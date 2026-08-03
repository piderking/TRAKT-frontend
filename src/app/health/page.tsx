'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Flame, 
  Moon, 
  RefreshCw, 
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function HealthPluginPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/health/summary`);
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to fetch Health telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const bio = telemetry?.biometrics || {
    heart_rate: { current_bpm: 74, resting_bpm: 58 },
    activity: { steps_today: 8840, step_goal: 10000, goal_pct: 88.4, calories_active_kcal: 465, distance_km: 6.4 },
    recovery: { sleep_hours: 7.8, spo2_percentage: 99.0 }
  };

  const syncs = telemetry?.recent_syncs || [
    { device: "Pixel 8 Pro (Health Connect)", timestamp: "2026-08-03T11:20:00Z", hr: 74, steps: 8840, status: "synced" }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10">
            <Heart className="w-7 h-7 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                ANDROID HEALTH CONNECT TAB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              Health & Biometrics Telemetry
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Real-time heart rate, daily steps, active calories, and recovery telemetry
            </p>
          </div>
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchHealth(); }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 font-mono text-xs flex items-center space-x-2 transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 text-red-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Vitals</span>
        </button>
      </div>

      {/* Vitals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="glass-panel-glow p-5 rounded-2xl border border-red-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>CURRENT HEART RATE</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-white">{bio.heart_rate.current_bpm} <span className="text-xs text-slate-400">BPM</span></p>
          <p className="text-[11px] text-red-400 mt-2 font-semibold">Resting: {bio.heart_rate.resting_bpm} BPM</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>DAILY STEP COUNT</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{bio.activity.steps_today.toLocaleString()}</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full" style={{ width: `${bio.activity.goal_pct}%` }} />
          </div>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-amber-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>ACTIVE CALORIES</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{bio.activity.calories_active_kcal} <span className="text-xs text-slate-400">kcal</span></p>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">Target: 500 kcal</p>
        </div>

        <div className="glass-panel-glow p-5 rounded-2xl border border-purple-500/30">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>SLEEP & SpO2</span>
            <Moon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{bio.recovery.sleep_hours} <span className="text-xs text-slate-400">hrs</span></p>
          <p className="text-[11px] text-purple-400 mt-2 font-semibold">SpO2: {bio.recovery.spo2_percentage}%</p>
        </div>
      </div>

      {/* Sync Log */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-red-400" />
          <span>Android Daemon Health Connect Sync Log</span>
        </h2>

        <div className="space-y-3 font-mono text-xs">
          {syncs.map((s: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{s.device}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.timestamp} • {s.hr} BPM • {s.steps.toLocaleString()} steps</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30">
                ● SYNCED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
