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
  Table as TableIcon,
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
  Smartphone,
  Code,
  Copy,
  ExternalLink,
  Eye,
  Smile,
  Image as ImageIcon,
  Kanban,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

export interface CanvasWidget {
  id: string;
  type: 'chart' | 'graph' | 'list' | 'timeline' | 'text' | 'table' | 'board' | 'callout';
  title: string;
  targetProperty?: string;
  targetDomain?: string;
  colorTheme?: string;
  content?: string;
  icon?: string;
  flexSplit?: 'horizontal' | 'vertical' | 'full';
}

export interface CanvasPage {
  id: string;
  title: string;
  icon: string;
  coverBannerUrl: string;
  widgets: CanvasWidget[];
}

export function MinimalistCanvasWorkspace() {
  const [pages, setPages] = useState<CanvasPage[]>([
    {
      id: 'page_1',
      title: 'Main Notion Workspace',
      icon: '🚀',
      coverBannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80',
      widgets: []
    }
  ]);
  const [activePageId, setActivePageId] = useState<string>('page_1');

  // Command Input State
  const [commandInput, setCommandInput] = useState<string>('');
  const [showCommandSuggestions, setShowCommandSuggestions] = useState<boolean>(false);

  // Entities Data State
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable Notion Page Title & Icon State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitleInput, setPageTitleInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Editable Tag State
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [editTagsInput, setEditTagsInput] = useState<string>('');
  const [editDirectorInput, setEditDirectorInput] = useState<string>('');
  const [editLocationInput, setEditLocationInput] = useState<string>('');

  // Widget Customizer Modal State
  const [editingWidget, setEditingWidget] = useState<CanvasWidget | null>(null);
  const [widgetTitleInput, setWidgetTitleInput] = useState<string>('');
  const [widgetPropInput, setWidgetPropInput] = useState<string>('director');
  const [widgetTypeInput, setWidgetTypeInput] = useState<'chart' | 'graph' | 'list' | 'table' | 'board' | 'callout'>('table');

  // "View Source" Engine Modal State
  const [selectedSourceEntity, setSelectedSourceEntity] = useState<any | null>(null);
  const [copiedSource, setCopiedSource] = useState<boolean>(false);

  const originUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app';

  const emojiList = ['🚀', '🎬', '🎵', '🎮', '⚡', '📌', '📊', '💻', '☕', '🧠', '🌿', '📍', '🍿', '🔥'];

  const coverBannerPresets = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&q=80'
  ];

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
    { cmd: '/table', category: 'DATABASE VIEWS', desc: 'Create an interactive Notion Database Table' },
    { cmd: '/board', category: 'DATABASE VIEWS', desc: 'Create a Kanban Board View grouped by Domain' },
    { cmd: '/chart director', category: 'TELEMETRY VISUALS', desc: 'Create a Bar Chart for Director frequency' },
    { cmd: '/chart location', category: 'TELEMETRY VISUALS', desc: 'Create a Bar Chart for Locations & Venues' },
    { cmd: '/graph steps', category: 'TELEMETRY VISUALS', desc: 'Create a Line Graph for Daily Step Vitals' },
    { cmd: '/graph bpm', category: 'TELEMETRY VISUALS', desc: 'Create a Line Graph for Heart Rate (BPM)' },
    { cmd: '/callout', category: 'BASIC BLOCKS', desc: 'Create a Notion Callout Banner with Icon' },
    { cmd: '/list movies', category: 'TELEMETRY STREAMS', desc: 'Filter Stream for Movies' },
    { cmd: '/list music', category: 'TELEMETRY STREAMS', desc: 'Filter Stream for Music' },
    { cmd: '/timeline', category: 'TELEMETRY STREAMS', desc: 'Chronological Telemetry Stream' },
    { cmd: '/page new', category: 'CANVAS SYSTEM', desc: 'Create a brand new Notion Canvas Page' }
  ];

  const handleExecuteCommand = (rawCmd: string) => {
    const clean = rawCmd.trim().toLowerCase();
    if (!clean) return;

    if (clean === '/table') {
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'table',
        title: 'Universal Database Table',
        flexSplit: 'full'
      });
    } else if (clean === '/board') {
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'board',
        title: 'Kanban Domain Board',
        flexSplit: 'full'
      });
    } else if (clean === '/callout') {
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'callout',
        title: 'Notion Knowledge Callout',
        content: 'Welcome to TRAKT Notion Canvas. Everything is interconnected and automatically fetched into your persistent database.',
        icon: '💡',
        flexSplit: 'full'
      });
    } else if (clean.startsWith('/chart')) {
      const prop = clean.replace('/chart', '').trim() || 'director';
      addWidget({
        id: `widget_${Date.now()}`,
        type: 'chart',
        title: `Bar Chart: ${prop.toUpperCase()}`,
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
      const newPageTitle = `Notion Canvas ${pages.length + 1}`;
      setPages([...pages, {
        id: newPageId,
        title: newPageTitle,
        icon: '📌',
        coverBannerUrl: coverBannerPresets[pages.length % coverBannerPresets.length],
        widgets: []
      }]);
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

  const handleOpenCustomizer = (widget: CanvasWidget) => {
    setEditingWidget(widget);
    setWidgetTitleInput(widget.title);
    setWidgetPropInput(widget.targetProperty || 'director');
    setWidgetTypeInput(widget.type as any);
  };

  const handleSaveWidgetCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWidget) return;

    setPages(pages.map(p => {
      if (p.id === activePageId) {
        return {
          ...p,
          widgets: p.widgets.map(w => {
            if (w.id === editingWidget.id) {
              return {
                ...w,
                title: widgetTitleInput,
                targetProperty: widgetPropInput,
                type: widgetTypeInput
              };
            }
            return w;
          })
        };
      }
      return p;
    }));

    setEditingWidget(null);
  };

  const handleUpdatePageHeader = (newTitle?: string, newIcon?: string, newCover?: string) => {
    setPages(pages.map(p => {
      if (p.id === activePageId) {
        return {
          ...p,
          title: newTitle !== undefined ? newTitle : p.title,
          icon: newIcon !== undefined ? newIcon : p.icon,
          coverBannerUrl: newCover !== undefined ? newCover : p.coverBannerUrl
        };
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

  const handleDeleteEntity = async (id: string) => {
    try {
      await fetch(`${originUrl}/api/v1/entities/${id}`, { method: 'DELETE' });
      setEntities(entities.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete entity:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSource(true);
    setTimeout(() => setCopiedSource(false), 2000);
  };

  // --- Real Data Chart & Line Graph Rendering Helpers ---
  const renderRealBarChart = (targetProp: string = 'director') => {
    const counts: Record<string, number> = {};
    entities.forEach((e) => {
      let val = e.properties?.[targetProp] || e[targetProp] || e.domain;
      if (val) {
        const valStr = String(val);
        counts[valStr] = (counts[valStr] || 0) + 1;
      }
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxVal = Math.max(...entries.map(e => e[1]), 1);

    if (entries.length === 0) {
      return (
        <div className="p-6 rounded-xl bg-[#191919] border border-[#2f2f2f] text-center font-mono text-xs text-slate-500">
          No records with property <code className="text-amber-400">"{targetProp}"</code> found in database yet.
        </div>
      );
    }

    return (
      <div className="space-y-3 font-mono text-xs pt-1">
        {entries.map(([label, count], idx) => {
          const pct = Math.round((count / maxVal) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-white font-bold truncate max-w-[200px]">{label}</span>
                <span className="text-amber-400 font-bold">{count} entries ({pct}%)</span>
              </div>
              <div className="h-3 w-full bg-[#111111] rounded-full border border-[#2f2f2f] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRealLineGraph = (targetMetric: string = 'steps') => {
    const points: { label: string; val: number }[] = [];
    entities.forEach((e) => {
      const v = e.properties?.[targetMetric] ?? e[targetMetric];
      if (v !== undefined && v !== null && !isNaN(Number(v))) {
        points.push({
          label: e.title || new Date(e.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          val: Number(v)
        });
      }
    });

    if (points.length === 0) {
      return (
        <div className="p-6 rounded-xl bg-[#191919] border border-[#2f2f2f] text-center font-mono text-xs text-slate-500">
          No numeric metric records for <code className="text-emerald-400">"{targetMetric}"</code> found in database yet.
        </div>
      );
    }

    const values = points.map(p => p.val);
    const min = Math.min(...values);
    const max = Math.max(...values, min + 1);
    const height = 120;
    const width = 450;

    const coords = points.map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * (width - 40) + 20;
      const y = height - ((p.val - min) / (max - min || 1)) * (height - 30) - 15;
      return { x, y, val: p.val, label: p.label };
    });

    const pathD = coords.reduce((acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`), '');

    return (
      <div className="space-y-2 font-mono text-xs">
        <div className="flex justify-between items-center text-[11px] text-slate-400 pb-1 border-b border-[#2f2f2f]">
          <span>MIN: <strong className="text-emerald-400">{min}</strong></span>
          <span>MAX: <strong className="text-emerald-400">{max}</strong></span>
          <span>SAMPLES: <strong className="text-white">{points.length}</strong></span>
        </div>

        <div className="relative overflow-x-auto pt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
            <line x1="0" y1="20" x2={width} y2="20" stroke="#2f2f2f" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2={width} y2="60" stroke="#2f2f2f" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2={width} y2="100" stroke="#2f2f2f" strokeDasharray="3 3" />

            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {coords.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r="5" className="fill-[#191919] stroke-emerald-400 stroke-2 hover:r-7 transition-all cursor-pointer" />
                <text x={c.x} y={c.y - 10} textAnchor="middle" fill="#64748b" fontSize="9">
                  {c.val}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans min-h-[90vh] flex flex-col bg-[#191919] text-gray-100 -mx-6 -my-6 p-6">
      {/* NOTION COVER BANNER HEADER */}
      <div className="relative rounded-3xl overflow-hidden h-44 bg-slate-900 border border-[#2f2f2f] shadow-2xl group">
        <img
          src={activePage.coverBannerUrl}
          alt="Notion Cover Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191919] via-[#191919]/40 to-transparent" />

        {/* Change Cover Button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
          {coverBannerPresets.map((presetUrl, idx) => (
            <button
              key={idx}
              onClick={() => handleUpdatePageHeader(undefined, undefined, presetUrl)}
              className="w-6 h-6 rounded-full border-2 border-white/80 overflow-hidden hover:scale-125 transition-transform"
            >
              <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* NOTION PAGE ICON & TITLE HEADER */}
      <div className="-mt-14 px-4 flex items-end justify-between border-b border-[#2f2f2f] pb-6">
        <div className="flex items-end space-x-4">
          {/* Emoji Page Icon Picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-16 h-16 rounded-2xl bg-[#202020] border border-[#333333] shadow-2xl flex items-center justify-center text-3xl hover:scale-105 transition-transform"
            >
              {activePage.icon}
            </button>

            {showEmojiPicker && (
              <div className="absolute left-0 top-18 bg-[#202020] border border-[#333333] rounded-2xl p-3 shadow-2xl z-50 flex flex-wrap gap-2 w-48 font-mono">
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      handleUpdatePageHeader(undefined, emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 text-xl flex items-center justify-center transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Editable Page Title */}
          <div>
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={pageTitleInput}
                  onChange={(e) => setPageTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdatePageHeader(pageTitleInput);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="text-3xl font-extrabold bg-[#202020] border border-indigo-500 rounded-xl px-3 py-1 text-white focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    handleUpdatePageHeader(pageTitleInput);
                    setIsEditingTitle(false);
                  }}
                  className="p-2 rounded-xl bg-indigo-500 text-white font-mono text-xs"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h1
                onClick={() => {
                  setPageTitleInput(activePage.title);
                  setIsEditingTitle(true);
                }}
                className="text-3xl font-extrabold text-white tracking-tight cursor-pointer hover:text-indigo-300 transition-colors flex items-center gap-2 font-sans"
              >
                <span>{activePage.title}</span>
                <Edit3 className="w-4 h-4 text-slate-500 hover:text-white" />
              </h1>
            )}
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Notion Canvas Architecture • Type <code className="text-indigo-400 font-bold">/</code> for blocks and databases
            </p>
          </div>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePageId(p.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-all border flex items-center space-x-1.5 ${
                activePageId === p.id
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                  : 'bg-[#202020] text-slate-400 border-[#2f2f2f] hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.title}</span>
            </button>
          ))}
          <button
            onClick={() => handleExecuteCommand('/page new')}
            className="p-1.5 rounded-xl bg-[#202020] text-slate-400 hover:text-white border border-[#2f2f2f]"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FLOATING NOTION SLASH COMMAND BAR */}
      <div className="relative z-30">
        <div className="bg-[#202020] p-3 rounded-2xl border border-[#2f2f2f] focus-within:border-indigo-500 flex items-center space-x-3 shadow-2xl">
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
            placeholder="Type '/' for Notion blocks & databases (/table, /board, /chart, /graph, /callout)..."
            className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-500"
          />
          {commandInput && (
            <button onClick={() => handleExecuteCommand(commandInput)} className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-mono text-xs font-bold">
              Run
            </button>
          )}
        </div>

        {/* NOTION FLOATING SLASH COMMAND SUGGESTIONS POPUP */}
        {showCommandSuggestions && (
          <div className="absolute left-0 right-0 top-14 bg-[#202020]/95 backdrop-blur-2xl border border-[#2f2f2f] rounded-2xl p-3 shadow-2xl space-y-1 font-mono text-xs z-50 max-h-72 overflow-y-auto">
            <div className="text-[10px] text-slate-500 uppercase font-bold px-3 py-1">NOTION CANVAS BLOCK CATALOG</div>
            {availableCommands.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteCommand(c.cmd)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-300 flex items-center justify-between text-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[9px] bg-slate-900 text-slate-400 border border-slate-800 uppercase font-bold">
                    {c.category}
                  </span>
                  <span className="font-bold text-indigo-400">{c.cmd}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{c.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN NOTION CANVAS WORKSPACE GRID */}
      <div className="flex-1 flex flex-col space-y-6">
        {activePage.widgets.length === 0 ? (
          /* Blank Canvas Initial State */
          <div className="flex-1 rounded-3xl border-2 border-dashed border-[#2f2f2f] p-12 flex flex-col items-center justify-center text-center space-y-4 font-mono bg-[#1c1c1c]">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xl">
              <Layout className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight font-sans">Blank Notion Canvas</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Type <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">/table</code>, <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">/board</code>, or <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">/chart</code> in the command bar above.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <button
                onClick={() => handleExecuteCommand('/table')}
                className="px-4 py-2 rounded-xl bg-[#202020] text-slate-200 hover:text-white border border-[#2f2f2f] hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all"
              >
                <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>+ Notion Data Table</span>
              </button>

              <button
                onClick={() => handleExecuteCommand('/board')}
                className="px-4 py-2 rounded-xl bg-[#202020] text-slate-200 hover:text-white border border-[#2f2f2f] hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all"
              >
                <Kanban className="w-3.5 h-3.5 text-purple-400" />
                <span>+ Kanban Board View</span>
              </button>

              <button
                onClick={() => handleExecuteCommand('/chart director')}
                className="px-4 py-2 rounded-xl bg-[#202020] text-slate-200 hover:text-white border border-[#2f2f2f] hover:border-indigo-500/40 flex items-center space-x-1.5 transition-all"
              >
                <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Director Chart</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render Active Widgets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePage.widgets.map((w) => (
              <div
                key={w.id}
                className={`bg-[#202020] p-6 rounded-2xl border border-[#2f2f2f] flex flex-col justify-between space-y-4 shadow-2xl ${
                  w.type === 'table' || w.type === 'board' || w.type === 'timeline' || w.type === 'callout' ? 'md:col-span-2' : ''
                }`}
              >
                {/* Container Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2f2f2f]">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {w.type === 'chart' ? <BarChart2 className="w-4 h-4" /> : w.type === 'graph' ? <TrendingUp className="w-4 h-4" /> : w.type === 'table' ? <TableIcon className="w-4 h-4" /> : w.type === 'board' ? <Kanban className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    </span>
                    <h4 className="font-bold text-white text-sm font-sans">{w.title}</h4>
                  </div>

                  <div className="flex items-center space-x-1 font-mono text-xs">
                    <button
                      onClick={() => handleOpenCustomizer(w)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-900 transition-colors flex items-center space-x-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Customize</span>
                    </button>

                    <button
                      onClick={() => removeWidget(w.id)}
                      className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* NOTION CALLOUT BLOCK */}
                {w.type === 'callout' && (
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 flex items-start space-x-3 font-mono text-xs">
                    <span className="text-2xl">{w.icon || '💡'}</span>
                    <div>
                      <h5 className="font-bold text-white text-sm font-sans">{w.title}</h5>
                      <p className="text-slate-300 text-xs mt-1">{w.content}</p>
                    </div>
                  </div>
                )}

                {/* NOTION KANBAN BOARD VIEW BLOCK */}
                {w.type === 'board' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs pt-1">
                    {['movies', 'music', 'gaming', 'health'].map((domainName) => {
                      const domainEntities = entities.filter(e => e.domain.toLowerCase() === domainName);
                      return (
                        <div key={domainName} className="p-4 rounded-xl bg-[#181818] border border-[#2b2b2b] space-y-3">
                          <div className="flex justify-between items-center border-b border-[#2b2b2b] pb-2">
                            <span className="font-bold text-white uppercase text-[11px] tracking-wider">{domainName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-indigo-400 font-bold text-[10px]">
                              {domainEntities.length}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {domainEntities.length === 0 ? (
                              <div className="p-4 text-center text-slate-600 text-[10px]">No items</div>
                            ) : (
                              domainEntities.map((item) => (
                                <div key={item.id} className="p-3 rounded-lg bg-[#222222] border border-[#303030] space-y-1 hover:border-indigo-500/50 transition-colors">
                                  <p className="font-bold text-white text-xs font-sans">{item.title}</p>
                                  {item.subtitle && <p className="text-[10px] text-slate-400">{item.subtitle}</p>}
                                  <div className="flex justify-between items-center pt-1 text-[9px] text-slate-500">
                                    <span>#{item.tags?.[0] || domainName}</span>
                                    <button onClick={() => setSelectedSourceEntity(item)} className="text-indigo-400 hover:underline">
                                      Source
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* NOTION DATA TABLE BLOCK */}
                {w.type === 'table' && (
                  <div className="overflow-x-auto font-mono text-xs pt-1">
                    {entities.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No table records in database.</div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#2f2f2f] text-[10px] text-slate-400 uppercase">
                            <th className="p-2.5">Domain</th>
                            <th className="p-2.5">Title & Subtitle</th>
                            <th className="p-2.5">Tags</th>
                            <th className="p-2.5">Properties (Director, Location)</th>
                            <th className="p-2.5">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                          {entities.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-bold text-[10px]">
                                  {item.domain}
                                </span>
                              </td>
                              <td className="p-2.5 font-bold text-white">
                                <div>{item.title}</div>
                                {item.subtitle && <div className="text-[10px] text-slate-400 font-normal">{item.subtitle}</div>}
                              </td>
                              <td className="p-2.5">
                                <div className="flex flex-wrap gap-1">
                                  {(item.tags || []).map((t: string, idx: number) => (
                                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[#161616] text-slate-300 border border-[#2a2a2a] text-[9px]">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-2.5 text-[11px] text-slate-300">
                                {item.properties?.director && <div>🎬 {item.properties.director}</div>}
                                {item.properties?.location && <div>📍 {item.properties.location}</div>}
                                {item.properties?.rating && <div>★ {item.properties.rating}</div>}
                              </td>
                              <td className="p-2.5">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setSelectedSourceEntity(item)}
                                    className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-900 transition-colors flex items-center space-x-1"
                                  >
                                    <Code className="w-3.5 h-3.5" />
                                    <span className="text-[10px]">Source</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteEntity(item.id)}
                                    className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-slate-900 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* TELEMETRY CHARTS & GRAPHS */}
                {w.type === 'chart' && renderRealBarChart(w.targetProperty || 'director')}
                {w.type === 'graph' && renderRealLineGraph(w.targetProperty || 'steps')}

                {w.type === 'list' && (
                  <div className="space-y-3 font-mono text-xs">
                    {entities.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No tracked data yet.</div>
                    ) : (
                      entities
                        .filter(e => w.targetDomain === 'all' || !w.targetDomain || e.domain.toLowerCase() === w.targetDomain.toLowerCase())
                        .map((item) => (
                          <div key={item.id} className="p-4 rounded-xl bg-[#181818] border border-[#2b2b2b] space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] text-indigo-400 uppercase font-bold">{item.domain}</span>
                                <h5 className="font-bold text-white text-sm">{item.title}</h5>
                                {item.subtitle && <p className="text-slate-400 text-[11px]">{item.subtitle}</p>}
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedSourceEntity(item)}
                                  className="text-slate-500 hover:text-indigo-400 p-1 text-[11px] flex items-center space-x-1"
                                >
                                  <Code className="w-3.5 h-3.5" />
                                  <span>Source</span>
                                </button>
                                <button
                                  onClick={() => handleStartEditEntity(item)}
                                  className="text-slate-500 hover:text-indigo-400 p-1 text-[11px] flex items-center space-x-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WIDGET CUSTOMIZER MODAL */}
      {editingWidget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <span>Customize Container Widget</span>
              </h3>
              <button onClick={() => setEditingWidget(null)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveWidgetCustomization} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">CONTAINER TITLE</label>
                <input
                  type="text"
                  required
                  value={widgetTitleInput}
                  onChange={e => setWidgetTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">CONTAINER TYPE</label>
                <select
                  value={widgetTypeInput}
                  onChange={e => setWidgetTypeInput(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="table">Notion Data Table</option>
                  <option value="board">Kanban Board View</option>
                  <option value="chart">Bar Chart</option>
                  <option value="graph">Line Graph</option>
                  <option value="callout">Notion Callout</option>
                  <option value="list">Stream List</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">TARGET METRIC / PROPERTY</label>
                <input
                  type="text"
                  value={widgetPropInput}
                  onChange={e => setWidgetPropInput(e.target.value)}
                  placeholder="director, location, rating, bpm, steps, hours"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Save Widget Customization
              </button>
            </form>
          </div>
        </div>
      )}

      {/* "VIEW SOURCE" RAW DATA PAYLOAD MODAL */}
      {selectedSourceEntity && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-xl w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>View Source Engine: Raw Payload</span>
              </h3>
              <button onClick={() => setSelectedSourceEntity(null)} className="text-slate-400 hover:text-white text-xs">
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">ENTITY ID: {selectedSourceEntity.id}</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedSourceEntity, null, 2))}
                  className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-[11px]"
                >
                  {copiedSource ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSource ? 'Copied Payload!' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] max-h-80 selection:bg-emerald-950">
                {JSON.stringify(selectedSourceEntity, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
