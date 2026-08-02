'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Film, 
  Tv, 
  Star, 
  TrendingUp, 
  Calendar, 
  PieChart as PieIcon, 
  Filter 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const watchTimeData = [
  { month: 'Jan', moviesHours: 42, showHours: 68, total: 110 },
  { month: 'Feb', moviesHours: 35, showHours: 72, total: 107 },
  { month: 'Mar', moviesHours: 50, showHours: 85, total: 135 },
  { month: 'Apr', moviesHours: 45, showHours: 90, total: 135 },
  { month: 'May', moviesHours: 60, showHours: 110, total: 170 },
  { month: 'Jun', moviesHours: 55, showHours: 95, total: 150 },
  { month: 'Jul', moviesHours: 68, showHours: 120, total: 188 },
];

const genreData = [
  { name: 'Sci-Fi', count: 184, color: '#3B82F6' },
  { name: 'Drama', count: 142, color: '#8B5CF6' },
  { name: 'Action', count: 110, color: '#E50914' },
  { name: 'Comedy', count: 95, color: '#10B981' },
  { name: 'Thriller', count: 78, color: '#F59E0B' },
  { name: 'Animation', count: 52, color: '#EC4899' },
];

const activityHeatmap = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  intensity: Math.floor(Math.random() * 5)
}));

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '1y'>('1y');

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Analytics & Viewing Intelligence
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Aggregated scrobble metrics, watch patterns, and genre breakdown
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-gray-900 p-1 rounded-lg border border-gray-800 font-mono text-xs">
          {(['7d', '30d', '1y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeframe === t 
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Watch Time */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Watch Time</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">995 hrs</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 font-mono">Equivalent to 41.4 days of media</p>
        </div>

        {/* Card 2: Movies Finished */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Movies Completed</span>
            <Film className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">142</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8.5%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 font-mono">Avg runtime: 114 mins / movie</p>
        </div>

        {/* Card 3: Episodes Scrobbled */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Episodes Scrobbled</span>
            <Tv className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">1,280</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +21.0%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 font-mono">48 active TV series tracked</p>
        </div>

        {/* Card 4: Mean User Rating */}
        <div className="glass-card p-5 rounded-xl border border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Mean User Rating</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">8.4 / 10</span>
            <span className="text-xs font-mono text-amber-400">★ Top 10%</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 font-mono">Based on 310 explicit ratings</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watch Time Trend Area Chart (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Monthly Watch Volume (Hours)</h2>
              <p className="text-xs text-gray-400 font-mono">Breakdown between Movies and TV Shows</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                <span className="text-gray-300">TV Shows</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="text-gray-300">Movies</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={watchTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorShows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorMovies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12161F', borderColor: '#1F2937', borderRadius: '8px', color: '#FFF' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="showHours" name="TV Shows (hrs)" stroke="#3B82F6" fillOpacity={1} fill="url(#colorShows)" strokeWidth={2} />
                <Area type="monotone" dataKey="moviesHours" name="Movies (hrs)" stroke="#E50914" fillOpacity={1} fill="url(#colorMovies)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Breakdown Bar Chart (1 col) */}
        <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Top Genre Affinity</h2>
              <p className="text-xs text-gray-400 font-mono">Title count distribution</p>
            </div>
            <PieIcon className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#6B7280" tick={{ fill: '#D1D5DB', fontSize: 11 }} width={65} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#12161F', borderColor: '#1F2937', borderRadius: '8px', color: '#FFF' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Heatmap Section */}
      <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Viewing Velocity Heatmap (Last 28 Days)
            </h2>
            <p className="text-xs text-gray-400 font-mono">Daily scrobble frequency score</p>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded bg-gray-900 border border-gray-800" />
              <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
              <div className="w-3 h-3 rounded bg-emerald-800 border border-emerald-700" />
              <div className="w-3 h-3 rounded bg-emerald-600" />
              <div className="w-3 h-3 rounded bg-emerald-400" />
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-2 pt-2">
          {activityHeatmap.map((item) => (
            <div
              key={item.day}
              className={`h-9 rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                item.intensity === 0 ? 'bg-gray-900/60 border-gray-800 text-gray-600' :
                item.intensity === 1 ? 'bg-emerald-950 border-emerald-800/80 text-emerald-400' :
                item.intensity === 2 ? 'bg-emerald-900 border-emerald-700 text-emerald-300' :
                item.intensity === 3 ? 'bg-emerald-700 border-emerald-600 text-white font-bold' :
                'bg-emerald-500 border-emerald-400 text-gray-950 font-bold shadow-lg shadow-emerald-500/20'
              }`}
              title={`Day ${item.day}: Level ${item.intensity} activity`}
            >
              <span className="text-[10px] font-mono">D{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
