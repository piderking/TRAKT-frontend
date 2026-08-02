import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { PluginProvider } from '../context/PluginContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  ListFilter, 
  Cpu, 
  ExternalLink,
  Layers,
  Database,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trakt Modular Ecosystem Console',
  description: 'High-aesthetic modular Trakt dashboard & microservice telemetry engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090E] text-gray-100 flex flex-col min-h-screen font-sans selection:bg-blue-500 selection:text-white">
        <PluginProvider>
          {/* Top Status Banner & Live Railway Status */}
          <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-2 text-xs font-mono text-slate-300 flex items-center justify-between shadow-xl z-50">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>RAILWAY ECOSYSTEM CLUSTER:</span>
              </span>
              <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                ONLINE (us-west)
              </span>
              <span className="text-slate-400 hidden md:inline">
                | Core Gateway :8000 | Tiered Storage | Domain Plugins
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Build v1.2.0-customizable</span>
              <a
                href="https://github.com/piderking/TRAKT-backend"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 underline decoration-blue-500/40 text-xs"
              >
                <span>GitHub Repositories</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-[#0B0E17]/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 z-40">
              <div className="p-5">
                {/* Brand Header */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-white tracking-tight leading-none">TRAKT</h1>
                    <p className="text-[10px] text-blue-400 font-mono mt-0.5 tracking-wider">MODULAR ECOSYSTEM</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5 font-medium text-sm">
                  <Link
                    href="/"
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition-all group"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>Node Dashboard</span>
                  </Link>

                  <Link
                    href="/analytics"
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition-all group"
                  >
                    <BarChart3 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Analytics Engine</span>
                  </Link>

                  <Link
                    href="/lists"
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition-all group"
                  >
                    <ListFilter className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Dynamic List Builder</span>
                  </Link>

                  <Link
                    href="/plugins"
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 transition-all group"
                  >
                    <Cpu className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Plugin Studio & Topology</span>
                  </Link>
                </nav>
              </div>

              {/* Sidebar Footer Widget */}
              <div className="p-4 border-t border-slate-800/80 bg-[#07090E]/60">
                <div className="rounded-xl bg-slate-900/80 p-3.5 border border-slate-800 text-xs space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tiered Storage</span>
                    </span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      CONNECTED
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[42%]" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Warm: Redis Cache</span>
                    <span>Cold: Postgres</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#07090E] p-6 lg:p-8">
              {children}
            </main>
          </div>
        </PluginProvider>
      </body>
    </html>
  );
}
