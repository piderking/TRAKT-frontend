'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  Film, 
  Music, 
  Gamepad2, 
  Smartphone, 
  Code2, 
  Tag, 
  MapPin, 
  Link2, 
  Clock, 
  Trash2, 
  Check, 
  Layers, 
  Sliders,
  Calendar,
  ExternalLink
} from 'lucide-react';

export interface UniversalEntity {
  id: string;
  domain: 'music' | 'movie' | 'gaming' | 'health' | 'coding' | 'custom' | string;
  title: string;
  subtitle?: string;
  timestamp: number;
  tags: string[];
  properties: Record<string, any>;
  relations: string[];
  image_url?: string;
}

export function UniversalActivityStream() {
  const [entities, setEntities] = useState<UniversalEntity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search State
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Creator Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createDomain, setCreateDomain] = useState<string>('movie');
  const [createTitle, setCreateTitle] = useState<string>('');
  const [createSubtitle, setCreateSubtitle] = useState<string>('');
  const [createTagsInput, setCreateTagsInput] = useState<string>('');
  const [propDirector, setPropDirector] = useState<string>('');
  const [propLocation, setPropLocation] = useState<string>('');
  const [propRating, setPropRating] = useState<string>('10');
  const [createImageUrl, setCreateImageUrl] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const originUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app';

  const fetchEntities = async () => {
    try {
      let url = `${originUrl}/api/v1/entities?domain=${selectedDomain}`;
      if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.entities) {
        setEntities(data.entities);
      }
    } catch (err) {
      console.error('Failed to fetch universal entities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [selectedDomain, selectedTag, searchQuery]);

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    setCreating(true);
    try {
      const propertiesObj: Record<string, any> = {};
      if (propDirector) propertiesObj.director = propDirector;
      if (propLocation) propertiesObj.location = propLocation;
      if (propRating) propertiesObj.rating = parseFloat(propRating) || 10.0;

      const payload = {
        domain: createDomain,
        title: createTitle,
        subtitle: createSubtitle,
        tags: createTagsInput.split(',').map(t => t.trim()).filter(Boolean),
        properties: propertiesObj,
        relations: [],
        image_url: createImageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80"
      };

      const res = await fetch(`${originUrl}/api/v1/entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setShowCreateModal(false);
          setCreateTitle('');
          setCreateSubtitle('');
          setCreateTagsInput('');
          setPropDirector('');
          setPropLocation('');
          setCreateImageUrl('');
        }, 1200);
        fetchEntities();
      }
    } catch (err) {
      console.error('Failed to create entity:', err);
    } finally {
      setCreating(false);
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

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'music': return <Music className="w-4 h-4 text-emerald-400" />;
      case 'movie': return <Film className="w-4 h-4 text-amber-400" />;
      case 'gaming': return <Gamepad2 className="w-4 h-4 text-cyan-400" />;
      case 'health': return <Smartphone className="w-4 h-4 text-red-400" />;
      case 'coding': return <Code2 className="w-4 h-4 text-purple-400" />;
      default: return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  const getDomainBadgeStyle = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'music': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'movie': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'gaming': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'health': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'coding': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  // Extract all unique tags across all entities for filtering
  const allTags = Array.from(new Set(entities.flatMap(e => e.tags || [])));

  return (
    <div className="space-y-8 font-sans">
      {/* Notion-Style Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              UNIVERSAL INTERCONNECTED STREAM
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-400" />
            <span>Notion-Style Life Knowledge Graph</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Single flowing workspace interconnecting Movies, Music, Gaming, Health, and Coding with custom properties & location tags
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Life Entity</span>
        </button>
      </div>

      {/* Notion Filter Bar & Search */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Domain Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>DOMAIN:</span>
            </span>
            {['all', 'movie', 'music', 'gaming', 'health', 'coding'].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all border ${
                  selectedDomain === dom
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, director, location, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tag Filter Chips */}
        {allTags.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-800/80 font-mono text-[11px]">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">TAG FILTER:</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`px-2 py-0.5 rounded ${!selectedTag ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-900 text-slate-400'}`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Universal Activity Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-slate-500">Loading Universal Knowledge Stream...</div>
        ) : entities.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-500">
            No entities match current filter. Click "+ Create New Life Entity" to log an activity!
          </div>
        ) : (
          <div className="space-y-4">
            {entities.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start justify-between gap-6"
              >
                <div className="flex items-start space-x-4 flex-1">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-2xl border border-slate-800 flex-shrink-0 shadow-lg"
                    />
                  )}

                  <div className="space-y-2 flex-1">
                    {/* Domain & Tags Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase flex items-center gap-1 ${getDomainBadgeStyle(item.domain)}`}>
                        {getDomainIcon(item.domain)}
                        <span>{item.domain}</span>
                      </span>

                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedTag(t)}
                          className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-mono cursor-pointer hover:border-indigo-500/50"
                        >
                          #{t}
                        </span>
                      ))}

                      <span className="text-[11px] font-mono text-slate-500 ml-auto">
                        {new Date(item.timestamp * 1000).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Entity Title & Subtitle */}
                    <div>
                      <h3 className="text-xl font-extrabold text-white tracking-tight">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-xs text-indigo-400 font-mono font-semibold mt-0.5">{item.subtitle}</p>
                      )}
                    </div>

                    {/* Notion-Style Key-Value Properties Grid */}
                    {item.properties && Object.keys(item.properties).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                        {Object.entries(item.properties).map(([k, v]) => (
                          <div key={k} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">{k}</span>
                            <span className="text-slate-200 font-bold truncate block">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interconnected Entity Relations */}
                    {item.relations && item.relations.length > 0 && (
                      <div className="flex items-center space-x-2 pt-2 text-xs font-mono text-indigo-400">
                        <Link2 className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[11px]">Connected Entities:</span>
                        {item.relations.map((relId) => {
                          const relObj = entities.find(e => e.id === relId);
                          return relObj ? (
                            <span key={relId} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px]">
                              🔗 {relObj.title}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteEntity(item.id)}
                  className="text-slate-600 hover:text-red-400 p-2 rounded-xl hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notion-Style Universal Creator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Create Interconnected Life Entity
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateEntity} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">DOMAIN / TYPE</label>
                <select
                  value={createDomain}
                  onChange={e => setCreateDomain(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 capitalize"
                >
                  <option value="movie">Movie (e.g. The Odyssey)</option>
                  <option value="music">Music (e.g. Spotify Track)</option>
                  <option value="gaming">Gaming (e.g. Steam Game)</option>
                  <option value="health">Health (e.g. Vitals / Workout)</option>
                  <option value="coding">Coding (e.g. Project / Telemetry)</option>
                  <option value="custom">Custom Entity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">TITLE</label>
                <input
                  type="text"
                  required
                  value={createTitle}
                  onChange={e => setCreateTitle(e.target.value)}
                  placeholder="e.g. The Odyssey / Marvel Rivals / Starboy"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">SUBTITLE / CREATOR</label>
                <input
                  type="text"
                  value={createSubtitle}
                  onChange={e => setCreateSubtitle(e.target.value)}
                  placeholder="e.g. Christopher Nolan / The Weeknd"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={createTagsInput}
                  onChange={e => setCreateTagsInput(e.target.value)}
                  placeholder="e.g. spotify, theatre, imax-70mm, nolan, steam"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">DIRECTOR / ARTIST</label>
                  <input
                    type="text"
                    value={propDirector}
                    onChange={e => setPropDirector(e.target.value)}
                    placeholder="e.g. Christopher Nolan"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">LOCATION</label>
                  <input
                    type="text"
                    value={propLocation}
                    onChange={e => setPropLocation(e.target.value)}
                    placeholder="e.g. AMC IMAX 70mm / Couch"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">IMAGE / COVER URL</label>
                <input
                  type="text"
                  value={createImageUrl}
                  onChange={e => setCreateImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {saveSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{saveSuccess ? 'Saved to Knowledge Graph!' : creating ? 'Saving Entity...' : 'Create Interconnected Entity'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
