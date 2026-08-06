'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Plus, 
  Sparkles, 
  Layers, 
  BarChart2, 
  TrendingUp, 
  List, 
  Columns, 
  Rows, 
  FileText, 
  Tag, 
  MapPin, 
  Edit3, 
  Check, 
  Trash2, 
  Search, 
  X, 
  Layout, 
  Sliders, 
  Activity, 
  Film, 
  Music, 
  Gamepad2, 
  Code2, 
  Smartphone
} from 'lucide-react';

export interface CanvasWidget {
  id: string;
  type: 'chart' | 'graph' | 'list' | 'timeline' | 'text' | 'table';
  title: string;
  targetProperty?: string;
  targetDomain?: string;
  flexSplit?: 'horizontal' | 'vertical' | 'full';
}

export interface CanvasPage {
  id: string;
  title: string;
  widgets: CanvasWidget[];
}

export function MinimalistCanvasWorkspace() {
  const [pages, setPages] = useState<CanvasPage[]>([
    { id: 'page_1', title: 'Main Canvas Workspace', widgets: [] }
  ]);
  const [activePageId, setActivePageId] = useState<string>('page_1');

  // Command Input State
  const [commandInput, setCommandInput] = useState<string>('');
  const [showCommandSuggestions, setShowCommandSuggestions] = useState<boolean>(false);

  // Entities Data State
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable Tag State
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editTagsInput, setEditTagsInput] = useState<string>('');
  const [editDirectorInput, setEditDirectorInput] = useState<string>('');
  const [editLocationInput, setEditLocationInput] = useState<string>('');

  const originUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app';

  const fetchEntities = async () => {
    try {
      const res = await fetch(`${originUrl}/api/v1/entities`);
      const data = await res.json();
      if (data.entities) setEntities(data.entities);
    } catch (err) {
      console.error('Failed to fetch entities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();

    // Connect to Real-Time SSE Stream for Instant Database Mutative Reactivity
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${originUrl}/api/v1/events/stream`);
      eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed.event === 'ENTITY_CREATED' || parsed.event === 'ENTITY_UPDATED' || parsed.event === 'DB_MUTATION') {
            fetchEntities();
          }
        } catch (err) {
          fetchEntities();
        }
      };
    } catch (err) {
      console.error('SSE EventSource setup error:', err);
    }

    const interval = setInterval(() => {
      fetchEntities();
    }, 5000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, []);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const availableCommands = [
    { cmd: '/chart director', desc: 'Create a bar chart container for Director distribution' },
    { cmd: '/chart location', desc: 'Create a bar chart container for Locations & Venues' },
    { cmd: '/graph steps', desc: 'Create a line graph container for Daily Step count' },
    { cmd: '/graph bpm', desc: 'Create a line graph container for Heart Rate (BPM)' },
    { cmd: '/list movies', desc: 'Create a domain list container for Movies' },
    { cmd: '/list music', desc: 'Create a domain list container for Music' },
    { cmd: '/list gaming', desc: 'Create a domain list container for Gaming' },
    { cmd: '/list health', desc: 'Create a domain list container for Health & Vitals' },
    { cmd: '/timeline', desc: 'Create a full chronological timeline container' },
    { cmd: '/split horizontal', desc: 'Split layout horizontally' },
    { cmd: '/split vertical', desc: 'Split layout vertically' },
    { cmd: '/page new', desc: 'Create a new blank canvas page' }
  ];

  const handleExecuteCommand = (rawCmd: string) => {
    const clean = rawCmd.trim().toLowerCase();
    if (!clean) return;

    if (clean.startsWith('/chart')) {
      const prop = clean.replace('/chart', '').trim() || 'director';
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'chart',
        title: `Chart: ${prop.toUpperCase()}`,
        targetProperty: prop,
        flexSplit: 'horizontal'
      });
    } else if (clean.startsWith('/graph')) {
      const metric = clean.replace('/graph', '').trim() || 'steps';
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'graph',
        title: `Metric Graph: ${metric.toUpperCase()}`,
        targetProperty: metric,
        flexSplit: 'horizontal'
      });
    } else if (clean.startsWith('/list')) {
      const domain = clean.replace('/list', '').trim() || 'all';
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'list',
        title: `Stream: ${domain.toUpperCase()}`,
        targetDomain: domain,
        flexSplit: 'vertical'
      });
    } else if (clean === '/timeline') {
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'timeline',
        title: 'Universal Chronological Timeline',
        flexSplit: 'full'
      });
    } else if (clean.startsWith('/page')) {
      const newPageId = `page_${Date.now()}`;
      const newPageTitle = `Canvas Page ${pages.length + 1}`;
      setPages([...pages, { id: newPageId, title: newPageTitle, widgets: [] }]);
      setActivePageId(newPageId);
    }

    setCommandInput('');
    setShowCommandSuggestions(false);
  };

  const addWidget = (widget: CanvasWidget) => {
    setPages(pages.map(p => {
      if (p.id === activePageId) {
        return { ...p, widgets: [...p.widgets, widget] };
      }
      return p;
    }));
  };

  const removeWidget = (widgetId: string) => {
    setPages(pages.map(p => {
      if (p.id === activePageId) {
        return { ...p, widgets: p.widgets.filter(w => w.id !== widgetId) };
      }
      return p;
    }));
  };

  const handleStartEditEntity = (entity: any) => {
    setEditingEntityId(entity.id);
    setEditTagsInput((entity.tags || []).join(', '));
    setEditDirectorInput(entity.properties?.director || '');
    setEditLocationInput(entity.properties?.location || '');
  };

  const handleSaveEntityEdit = async (entity: any) => {
    try {
      const updatedTags = editTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const updatedProps = { ...entity.properties };
      if (editDirectorInput) updatedProps.director = editDirectorInput;
      if (editLocationInput) updatedProps.location = editLocationInput;

      const payload = {
        domain: entity.domain,
        title: entity.title,
        subtitle: entity.subtitle,
        tags: updatedTags,
        properties: updatedProps,
        relations: entity.relations || [],
        image_url: entity.image_url
      };

      const res = await fetch(`${originUrl}/api/v1/entities/${entity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditingEntityId(null);
        fetchEntities();
      }
    } catch (err) {
      console.error('Failed to update entity:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans min-h-[85vh] flex flex-col">
      {/* Top Page Tabs & Minimalist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePageId(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                activePageId === p.id
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-lg'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {p.title}
            </button>
          ))}
          <button
            onClick={() => handleExecuteCommand('/page new')}
            className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Page</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real Persistent DB Engine</span>
        </div>
      </div>

      {/* Slash Command Bar */}
      <div className="relative z-30">
        <div className="glass-panel p-2.5 rounded-2xl border border-slate-800 focus-within:border-indigo-500 flex items-center space-x-3 shadow-xl">
          <Terminal className="w-5 h-5 text-indigo-400 pl-1" />
          <input
            type="text"
            value={commandInput}
            onFocus={() => setShowCommandSuggestions(true)}
            onChange={(e) => {
              setCommandInput(e.target.value);
              setShowCommandSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteCommand(commandInput);
            }}
            placeholder="Type '/' for commands (/chart director, /graph steps, /list movies, /timeline)..."
            className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-500"
          />
          {commandInput && (
            <button onClick={() => handleExecuteCommand(commandInput)} className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-mono text-xs font-bold">
              Run
            </button>
          )}
        </div>

        {/* Slash Command Auto-Suggestions Modal */}
        {showCommandSuggestions && (
          <div className="absolute left-0 right-0 top-14 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-1 font-mono text-xs z-50">
            <div className="text-[10px] text-slate-500 uppercase font-bold px-3 py-1">AVAILABLE SLASH COMMANDS</div>
            {availableCommands.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteCommand(c.cmd)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-300 flex items-center justify-between text-slate-300 transition-colors"
              >
                <span className="font-bold text-indigo-400">{c.cmd}</span>
                <span className="text-slate-500 text-[11px]">{c.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col space-y-6">
        {activePage.widgets.length === 0 ? (
          /* Blank Canvas Initial State */
          <div className="flex-1 rounded-3xl border-2 border-dashed border-slate-800/80 p-12 flex flex-col items-center justify-center text-center space-y-4 font-mono">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xl">
              <Layout className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight font-sans">Blank Canvas Workspace</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Type <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">/chart</code>, <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">/graph</code>, or <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">/list</code> in the command bar above to place custom containers & metrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <button
                onClick={() => handleExecuteCommand('/list all')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all"
              >
                <List className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Add Stream Container</span>
              </button>

              <button
                onClick={() => handleExecuteCommand('/chart director')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all"
              >
                <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Add Director Chart</span>
              </button>

              <button
                onClick={() => handleExecuteCommand('/graph steps')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Add Steps Graph</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render Active Widgets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePage.widgets.map((w) => (
              <div
                key={w.id}
                className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {w.type === 'chart' ? <BarChart2 className="w-4 h-4" /> : w.type === 'graph' ? <TrendingUp className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    </span>
                    <h4 className="font-bold text-white text-sm font-sans">{w.title}</h4>
                  </div>

                  <button
                    onClick={() => removeWidget(w.id)}
                    className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Widget Contents */}
                {w.type === 'list' && (
                  <div className="space-y-3 font-mono text-xs">
                    {entities.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No tracked data yet. Zero dummy data active!</div>
                    ) : (
                      entities
                        .filter(e => w.targetDomain === 'all' || !w.targetDomain || e.domain.toLowerCase() === w.targetDomain.toLowerCase())
                        .map((item) => (
                          <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] text-indigo-400 uppercase font-bold">{item.domain}</span>
                                <h5 className="font-bold text-white text-sm">{item.title}</h5>
                                {item.subtitle && <p className="text-slate-400 text-[11px]">{item.subtitle}</p>}
                              </div>
                              <button
                                onClick={() => handleStartEditEntity(item)}
                                className="text-slate-500 hover:text-indigo-400 p-1 text-[11px] flex items-center space-x-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Tags</span>
                              </button>
                            </div>

                            {/* Inline Tag & Property Editor */}
                            {editingEntityId === item.id ? (
                              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-400">EDIT TAGS (COMMA SEPARATED)</label>
                                  <input
                                    type="text"
                                    value={editTagsInput}
                                    onChange={e => setEditTagsInput(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-slate-400">EDIT LOCATION</label>
                                  <input
                                    type="text"
                                    value={editLocationInput}
                                    onChange={e => setEditLocationInput(e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                                  />
                                </div>
                                <div className="flex space-x-2 pt-1">
                                  <button
                                    onClick={() => handleSaveEntityEdit(item)}
                                    className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-[11px] font-bold"
                                  >
                                    Save Edits
                                  </button>
                                  <button
                                    onClick={() => setEditingEntityId(null)}
                                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {(item.tags || []).map((t: string, idx: number) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                )}

                {w.type === 'chart' && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-400">
                    Bar Chart visualization container for <code className="text-indigo-400">{w.targetProperty}</code> property distribution.
                  </div>
                )}

                {w.type === 'graph' && (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-400">
                    Line Graph time-series container for <code className="text-indigo-400">{w.targetProperty}</code> metric values.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
