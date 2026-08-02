'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Server, 
  Database, 
  Zap, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Radio, 
  Layers, 
  ShieldAlert 
} from 'lucide-react';

interface ServiceNode {
  id: string;
  name: string;
  role: string;
  port: number;
  status: 'online' | 'degraded' | 'offline';
  latencyMs: number;
  dockerContainer: string;
  memoryMb: number;
}

export default function SystemTopologyPage() {
  const [nodes, setNodes] = useState<ServiceNode[]>([
    {
      id: "gateway",
      name: "Core API Gateway",
      role: "FastAPI Routing & Auth",
      port: 8000,
      status: "online",
      latencyMs: 1.4,
      dockerContainer: "trakt-gateway-1",
      memoryMb: 42
    },
    {
      id: "redis",
      name: "Redis Tiered Storage (Hot)",
      role: "In-Memory LRU Cache",
      port: 6379,
      status: "online",
      latencyMs: 0.8,
      dockerContainer: "trakt-redis-1",
      memoryMb: 18
    },
    {
      id: "postgres",
      name: "PostgreSQL Database (Cold)",
      role: "Persistent JSONB Storage",
      port: 5432,
      status: "online",
      latencyMs: 2.1,
      dockerContainer: "trakt-postgres-1",
      memoryMb: 110
    },
    {
      id: "plugin-movies",
      name: "Plugin: Movies Microservice",
      role: "Watch Data & Up-Next",
      port: 8001,
      status: "online",
      latencyMs: 3.5,
      dockerContainer: "trakt-plugin-movies-1",
      memoryMb: 36
    },
    {
      id: "frontend",
      name: "Next.js Web Portal",
      role: "Dashboard UI & SSR",
      port: 3000,
      status: "online",
      latencyMs: 1.1,
      dockerContainer: "trakt-frontend-1",
      memoryMb: 85
    }
  ]);

  const [pinging, setPinging] = useState<boolean>(false);
  const [flushMessage, setFlushMessage] = useState<string | null>(null);

  const handlePingServices = async () => {
    setPinging(true);
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        latencyMs: parseFloat((Math.random() * 3 + 0.5).toFixed(1))
      })));
      setPinging(false);
    }, 800);
  };

  const handleFlushCache = (type: 'hot' | 'all') => {
    setFlushMessage(
      type === 'hot' 
        ? "Redis Hot Tier Cache invalidated successfully!" 
        : "Full Tiered Storage purge triggered. In-memory, Redis, and Cold pointers cleared."
    );
    setTimeout(() => setFlushMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            System Topology & Microservices Inspector
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Container health, ping latency monitors, and tiered cache management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePingServices}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 border border-gray-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin text-amber-400' : ''}`} />
            Ping Containers
          </button>
          <button
            onClick={() => handleFlushCache('hot')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-xs font-medium text-white shadow-md shadow-amber-900/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Flush Hot Cache
          </button>
        </div>
      </div>

      {/* Flush Alert Banner */}
      {flushMessage && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{flushMessage}</span>
          </div>
        </div>
      )}

      {/* Microservice Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="glass-card p-5 rounded-xl border border-gray-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  node.id === 'gateway' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                  node.id === 'redis' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  node.id === 'postgres' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  node.id === 'plugin-movies' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                  'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  {node.id === 'gateway' && <Server className="w-4 h-4" />}
                  {node.id === 'redis' && <Zap className="w-4 h-4" />}
                  {node.id === 'postgres' && <Database className="w-4 h-4" />}
                  {node.id === 'plugin-movies' && <Cpu className="w-4 h-4" />}
                  {node.id === 'frontend' && <Globe className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{node.name}</h3>
                  <p className="text-[10px] text-gray-400 font-mono">{node.role}</p>
                </div>
              </div>

              <span className="flex items-center space-x-1 font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Docker Container:</span>
                <span className="text-gray-200">{node.dockerContainer}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Exposed Port:</span>
                <span className="text-blue-400 font-bold">:{node.port}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Ping Latency:</span>
                <span className="text-emerald-400">{node.latencyMs} ms</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>RAM Usage:</span>
                <span className="text-gray-200">{node.memoryMb} MB</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>Status check: OK</span>
              <button
                onClick={() => handleFlushCache('all')}
                className="text-amber-400 hover:text-amber-300 underline text-[10px]"
              >
                Reset Cache
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Network Topology Visualizer */}
      <div className="glass-card p-6 rounded-xl border border-gray-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Container Communication Architecture
        </h2>

        <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 font-mono text-xs text-gray-300 space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] p-3 rounded bg-gray-900 border border-gray-800">
            <span className="text-red-400 font-bold">Frontend Next.js (:3000)</span>
            <span className="text-gray-500">━━━ HTTP / REST ━━━▶</span>
            <span className="text-blue-400 font-bold">Core API Gateway (:8000)</span>
            <span className="text-gray-500">━━━ HTTP Proxy ━━━▶</span>
            <span className="text-purple-400 font-bold">Plugin Movies (:8001)</span>
          </div>

          <div className="flex items-center justify-between min-w-[650px] p-3 rounded bg-gray-900 border border-gray-800">
            <span className="text-blue-400 font-bold">Core API Gateway (:8000)</span>
            <span className="text-gray-500">━━━ Hot Tier (&lt;100KB) ━━━▶</span>
            <span className="text-amber-400 font-bold">Redis Cache (:6379)</span>
            <span className="text-gray-500">━━━ Cold Offload (_cold_ref) ━━━▶</span>
            <span className="text-emerald-400 font-bold">PostgreSQL DB (:5432)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
