export interface PluginTheme {
  primaryColor: string;     // e.g. '#3B82F6'
  glowColor: string;        // e.g. 'rgba(59, 130, 246, 0.35)'
  gradient: string;         // e.g. 'from-blue-600 to-indigo-600'
  badgeBg: string;          // e.g. 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  cardBorder: string;       // e.g. 'border-blue-500/30'
}

export interface PluginWidgetData {
  title: string;
  subtitle: string;
  metricValue: string;
  metricLabel: string;
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    tag: string;
    progress?: number;
    rating?: number;
    image?: string;
  }>;
}

export interface PluginManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'movies' | 'telemetry' | 'anime' | 'gaming' | 'books';
  endpointUrl: string;
  uiEndpointUrl?: string;
  theme: PluginTheme;
  widget: PluginWidgetData;
  isCustomizable: boolean;
  enabled: boolean;
  pingMs?: number;
}
