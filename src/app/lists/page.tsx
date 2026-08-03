'use client';

import React, { useState } from 'react';
import { MovieLogger } from '../../components/MovieLogger';
import { 
  ListFilter, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Sparkles, 
  Copy, 
  Check, 
  Eye, 
  Film, 
  Tv, 
  Save 
} from 'lucide-react';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ListItem {
  id: string;
  title: string;
  type: string;
  year: number;
  runtime_min: number;
  rating: number;
  genre: string;
}

export default function DynamicListBuilderPage() {
  const [activeTab, setActiveTab] = useState<'logger' | 'builder'>('logger');
  const [listName, setListName] = useState<string>("High-Rated Modern Sci-Fi Blockbusters");
  const [rules, setRules] = useState<FilterRule[]>([
    { id: "r1", field: "runtime_min", operator: ">", value: "90" },
    { id: "r2", field: "rating", operator: ">", value: "8.0" },
    { id: "r3", field: "genre", operator: "equals", value: "Sci-Fi" },
    { id: "r4", field: "year", operator: ">=", value: "2020" }
  ]);

  const [items, setItems] = useState<ListItem[]>([
    { id: "1", title: "Dune: Part Two", type: "movie", year: 2024, runtime_min: 166, rating: 8.6, genre: "Sci-Fi" },
    { id: "2", title: "Severance", type: "show", year: 2022, runtime_min: 55, rating: 8.7, genre: "Sci-Fi" },
    { id: "3", title: "Interstellar (Extended)", type: "movie", year: 2014, runtime_min: 169, rating: 8.7, genre: "Sci-Fi" },
    { id: "4", title: "Blade Runner 2049", type: "movie", year: 2017, runtime_min: 164, rating: 8.0, genre: "Sci-Fi" },
    { id: "5", title: "Cyberpunk: Edgerunners", type: "show", year: 2022, runtime_min: 24, rating: 8.3, genre: "Sci-Fi" },
  ]);

  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const addRule = () => {
    const newRule: FilterRule = {
      id: `r_${Date.now()}`,
      field: "rating",
      operator: ">",
      value: "7.5"
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, field: keyof FilterRule, val: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleCopyJSON = () => {
    const payload = {
      list_name: listName,
      rules: rules,
      item_count: items.length,
      items: items
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveList = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Tab Bar: Movie Logger & Diary vs Smart List Builder */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 font-mono">
        <button
          onClick={() => setActiveTab('logger')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'logger'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Movie Logger & Diary (Letterboxd)</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'builder'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Dynamic Smart List Builder</span>
        </button>
      </div>

      {activeTab === 'logger' ? (
        <MovieLogger />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <ListFilter className="w-6 h-6 text-emerald-400" />
                Dynamic List Builder Engine
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Construct automated smart lists with conditional rule engines and live ordering preview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyJSON}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 border border-slate-800 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Config!' : 'Export JSON'}
              </button>
              <button
                onClick={handleSaveList}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white shadow-md shadow-emerald-900/30 transition-all"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {savedSuccess ? 'List Saved!' : 'Save Smart List'}
              </button>
            </div>
          </div>

          {/* List Name Input Bar */}
          <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter smart list title..."
              className="bg-transparent text-lg font-bold text-white focus:outline-none w-full border-b border-transparent focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rule Builder Column */}
            <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Filter Rules Configuration
                </h2>
                <button
                  onClick={addRule}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900 text-xs font-mono transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Rule
                </button>
              </div>

              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={rule.id} className="flex items-center space-x-2 bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-mono text-xs">
                    <span className="text-slate-500 w-8">{idx === 0 ? 'IF' : 'AND'}</span>
                    
                    <select
                      value={rule.field}
                      onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                      className="bg-slate-950 text-white rounded px-2 py-1.5 border border-slate-800 focus:outline-none"
                    >
                      <option value="runtime_min">Runtime (mins)</option>
                      <option value="rating">Rating (1-10)</option>
                      <option value="genre">Genre</option>
                      <option value="year">Release Year</option>
                    </select>

                    <select
                      value={rule.operator}
                      onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                      className="bg-slate-950 text-white rounded px-2 py-1.5 border border-slate-800 focus:outline-none"
                    >
                      <option value=">">&gt; (Greater than)</option>
                      <option value=">=">&gt;= (At least)</option>
                      <option value="<">&lt; (Less than)</option>
                      <option value="equals">equals</option>
                    </select>

                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                      className="bg-slate-950 text-white rounded px-2 py-1.5 border border-slate-800 focus:outline-none flex-1 w-20"
                    />

                    <button
                      onClick={() => removeRule(rule.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Item Re-ordering & Live Preview Column */}
            <div className="glass-card p-6 rounded-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  Matched Items & Order Preview
                </h2>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  {items.length} Matched
                </span>
              </div>

              <div className="space-y-2.5">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-all font-mono text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 text-slate-500 font-bold text-center">{index + 1}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm font-sans">{item.title}</span>
                          <span className="text-slate-400">({item.year})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 space-x-3">
                          <span>Runtime: {item.runtime_min}m</span>
                          <span>Rating: ★ {item.rating}</span>
                          <span className="text-blue-400">{item.genre}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveItem(index, 'up')}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => moveItem(index, 'down')}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
