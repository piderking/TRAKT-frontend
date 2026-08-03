'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PluginManifest, PluginTheme } from '../types/plugin';

const DEFAULT_PLUGINS: PluginManifest[] = [
  {
    id: 'movies',
    name: 'Movies & TV Scrobbler',
    description: 'Tracks watch history, episode progress, and up-next recommendations.',
    version: '1.0.0',
    author: 'Trakt Core Team',
    category: 'movies',
    endpointUrl: '/api/v1/user/up-next',
    uiEndpointUrl: '/static/plugins/movies/ui',
    enabled: true,
    isCustomizable: true,
    pingMs: 14,
    theme: {
      primaryColor: '#3B82F6',
      glowColor: 'rgba(59, 130, 246, 0.35)',
      gradient: 'from-blue-600 to-cyan-500',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      cardBorder: 'hover:border-blue-500/50'
    },
    widget: {
      title: 'UP NEXT WATCHLIST',
      subtitle: 'Proxied from Movies Microservice',
      metricValue: '5 items',
      metricLabel: 'Pending Episodes',
      items: [
        { id: 'm1', title: 'Dune: Part Two', subtitle: 'Movie • 2024', tag: 'Sci-Fi', rating: 8.6, progress: 0 },
        { id: 's1', title: 'Severance', subtitle: 'S2 E1 • Hello Ms. Cobel', tag: 'Thriller', rating: 8.7, progress: 75 },
        { id: 's2', title: 'The Bear', subtitle: 'S3 E4 • Violet', tag: 'Drama', rating: 8.6, progress: 40 }
      ]
    }
  },
  {
    id: 'wakatime',
    name: 'WakaTime & Token Telemetry',
    description: 'Tracks Antigravity CLI AI model token usage and WakaTime scrobbler stats.',
    version: '1.0.0',
    author: 'Telemetry Team',
    category: 'telemetry',
    endpointUrl: '/api/v1/telemetry/summary',
    uiEndpointUrl: '/static/plugins/wakatime/ui',
    enabled: true,
    isCustomizable: true,
    pingMs: 8,
    theme: {
      primaryColor: '#8B5CF6',
      glowColor: 'rgba(139, 92, 246, 0.35)',
      gradient: 'from-purple-600 to-indigo-500',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      cardBorder: 'hover:border-purple-500/50'
    },
    widget: {
      title: 'MODEL TOKEN & CODING STATS',
      subtitle: 'Antigravity CLI & WakaTime API',
      metricValue: '190.7K tokens',
      metricLabel: '5h 7m Active Today',
      items: [
        { id: 't1', title: 'Gemini 3.6 Flash', subtitle: '110K Prompt • 35K Completion', tag: 'AI Model', progress: 76 },
        { id: 't2', title: 'Gemini 3.6 Pro', subtitle: '32.5K Prompt • 13.2K Completion', tag: 'AI Model', progress: 24 },
        { id: 't3', title: 'TRAKT Monorepo', subtitle: 'Python (52.4%) • TypeScript (38.1%)', tag: 'Coding', progress: 91 }
      ]
    }
  },
  {
    id: 'anime',
    name: 'Anime & Manga Plugin',
    description: 'Seasonal anime tracker and episode release calendar.',
    version: '0.9.2',
    author: 'Community',
    category: 'anime',
    endpointUrl: '/api/v1/plugins/anime',
    enabled: true,
    isCustomizable: true,
    pingMs: 22,
    theme: {
      primaryColor: '#EC4899',
      glowColor: 'rgba(236, 72, 153, 0.35)',
      gradient: 'from-pink-600 to-rose-500',
      badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      cardBorder: 'hover:border-pink-500/50'
    },
    widget: {
      title: 'SEASONAL ANIME WATCHLIST',
      subtitle: 'Simulcast Release Feed',
      metricValue: '3 shows',
      metricLabel: 'Airing This Week',
      items: [
        { id: 'a1', title: 'Jujutsu Kaisen S2', subtitle: 'Shibuya Incident', tag: 'Action', rating: 8.8, progress: 100 },
        { id: 'a2', title: 'Frieren: Beyond Journey\'s End', subtitle: 'E28 • Realization', tag: 'Fantasy', rating: 9.1, progress: 95 }
      ]
    }
  },
  {
    id: 'gaming',
    name: 'Steam & Gaming Scrobbler',
    description: 'Tracks playtime, achievement unlocks, and active game sessions.',
    version: '1.1.0',
    author: 'Gamer Subsystem',
    category: 'gaming',
    endpointUrl: '/api/v1/plugins/gaming',
    enabled: true,
    isCustomizable: true,
    pingMs: 18,
    theme: {
      primaryColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      gradient: 'from-emerald-600 to-teal-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cardBorder: 'hover:border-emerald-500/50'
    },
    widget: {
      title: 'GAMING SESSIONS',
      subtitle: 'Steam Scrobbler Telemetry',
      metricValue: '34.2 hrs',
      metricLabel: 'Played This Month',
      items: [
        { id: 'g1', title: 'Elden Ring', subtitle: 'Shadow of the Erdtree • 84% Achievements', tag: 'RPG', rating: 9.5, progress: 84 },
        { id: 'g2', title: 'Cyberpunk 2077', subtitle: 'Phantom Liberty • 12.4 hrs', tag: 'Sci-Fi', rating: 8.9, progress: 60 }
      ]
    }
  },
  {
    id: 'health',
    name: 'Health & Biometrics Telemetry',
    description: 'Tracks heart rate (BPM), daily steps, active calories, sleep duration, and SpO2 from Android Health Connect.',
    version: '1.0.0',
    author: 'Android Health Subsystem',
    category: 'telemetry',
    endpointUrl: '/api/v1/health/summary',
    uiEndpointUrl: '/static/plugins/health/ui',
    enabled: true,
    isCustomizable: true,
    pingMs: 12,
    theme: {
      primaryColor: '#EF4444',
      glowColor: 'rgba(239, 68, 68, 0.35)',
      gradient: 'from-red-600 to-rose-500',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      cardBorder: 'hover:border-red-500/50'
    },
    widget: {
      title: 'BIOMETRICS & VITAL SCROBBLER',
      subtitle: 'Android Health Connect Telemetry',
      metricValue: '74 BPM',
      metricLabel: '8,840 Steps Today',
      items: [
        { id: 'h1', title: 'Heart Rate Monitor', subtitle: '74 BPM Current • 58 BPM Resting', tag: 'Vitals', progress: 74 },
        { id: 'h2', title: 'Daily Step Goal', subtitle: '8,840 / 10,000 steps (6.4 km)', tag: 'Activity', progress: 88 },
        { id: 'h3', title: 'Sleep & SpO2 Recovery', subtitle: '7.8 hrs Sleep • 99% SpO2', tag: 'Recovery', progress: 99 }
      ]
    }
  },
  {
    id: 'letterboxd',
    name: 'Letterboxd Export Zip Importer',
    description: 'Imports and parses Letterboxd export.zip files containing watched, ratings, diary, and watchlist CSVs.',
    version: '1.0.0',
    author: 'Trakt Data Migration',
    category: 'movies',
    endpointUrl: '/api/v1/import/letterboxd/summary',
    uiEndpointUrl: '/static/plugins/letterboxd/ui',
    enabled: true,
    isCustomizable: true,
    pingMs: 10,
    theme: {
      primaryColor: '#FF8000',
      glowColor: 'rgba(255, 128, 0, 0.35)',
      gradient: 'from-amber-600 to-emerald-500',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      cardBorder: 'hover:border-amber-500/50'
    },
    widget: {
      title: 'LETTERBOXD ZIP MIGRATION ENGINE',
      subtitle: 'Data Export Importer',
      metricValue: '428 Movies',
      metricLabel: '312 Ratings Converted',
      items: [
        { id: 'lb1', title: 'Watched Movies Export', subtitle: '428 Entries parsed from watched.csv', tag: 'Watched', progress: 100 },
        { id: 'lb2', title: 'Ratings & Reviews', subtitle: '312 Star Ratings mapped to Trakt 10-scale', tag: 'Ratings', progress: 100 },
        { id: 'lb3', title: 'Diary & Watchlist', subtitle: '185 Diary Logs • 94 Watchlist Items', tag: 'Lists', progress: 100 }
      ]
    }
  }
];

interface PluginContextType {
  plugins: PluginManifest[];
  activePluginId: string;
  activePlugin: PluginManifest;
  setActivePluginId: (id: string) => void;
  updatePluginTheme: (id: string, theme: Partial<PluginTheme>) => void;
  togglePlugin: (id: string) => void;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export function PluginProvider({ children }: { children: React.ReactNode }) {
  const [plugins, setPlugins] = useState<PluginManifest[]>(DEFAULT_PLUGINS);
  const [activePluginId, setActivePluginId] = useState<string>('movies');

  const activePlugin = plugins.find(p => p.id === activePluginId) || plugins[0];

  useEffect(() => {
    // Inject active plugin primary color into CSS root variables dynamically
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--plugin-accent', activePlugin.theme.primaryColor);
      document.documentElement.style.setProperty('--plugin-glow', activePlugin.theme.glowColor);
    }
  }, [activePlugin]);

  const updatePluginTheme = (id: string, newTheme: Partial<PluginTheme>) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, theme: { ...p.theme, ...newTheme } } : p))
    );
  };

  const togglePlugin = (id: string) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <PluginContext.Provider
      value={{
        plugins,
        activePluginId,
        activePlugin,
        setActivePluginId,
        updatePluginTheme,
        togglePlugin
      }}
    >
      {children}
    </PluginContext.Provider>
  );
}

export function usePlugins() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
}
