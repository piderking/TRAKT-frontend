import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { 
  LayoutDashboard, 
  BarChart3, 
  ListFilter, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Database
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trakt Ecosystem Portal',
  description: 'Modular Trakt architecture console & analytics engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0C10] text-gray-100 flex flex-col min-h-screen font-sans">
        {/* Top Status Banner - Live Railway Deploy Status */}
        <div className="bg-gradient-to-r from-blue-900/60 via-purple-900/50 to-indigo-900/60 border-b border-blue-500/20 px-4 py-2 text-xs font-mono text-blue-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white tracking-wide">RAILWAY ECOSYSTEM CLUSTER:</span>
            <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
              ONLINE (us-east-1)
            </span>
            <span className="text-gray-400 hidden md:inline">| Gateway :8000 | Redis Tiered Cache | PostgreSQL DB</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-[11px] hidden sm:inline">Build: v1.0.4-production</span>
            <a
              href="https://trakt.tv"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 underline decoration-blue-500/40"
            >
              <span>Trakt API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-[#0E121A] border-r border-[#1F2937] flex flex-col justify-between flex-shrink-0">
            <div className="p-5">
              {/* Brand Header */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="h-9 w-9 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white tracking-tight leading-none">TRAKT</h1>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">MODULAR ECOSYSTEM</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 font-medium text-sm">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all group"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Node Dashboard</span>
                </Link>

                <Link
                  href="/analytics"
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all group"
                >
                  <BarChart3 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>Analytics Engine</span>
                </Link>

                <Link
                  href="/lists"
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all group"
                >
                  <ListFilter className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Dynamic List Builder</span>
                </Link>

                <Link
                  href="/plugins"
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all group"
                >
                  <Cpu className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>System Topology</span>
                </Link>
              </nav>
            </div>

            {/* Sidebar Footer Widget */}
            <div className="p-4 border-t border-[#1F2937] bg-[#0A0C10]/40">
              <div className="rounded-lg bg-gray-900/80 p-3 border border-gray-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tiered Storage</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px]">ACTIVE</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[34%]" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Hot: Redis</span>
                  <span>Cold: PostgreSQL</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#0A0C10] p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
