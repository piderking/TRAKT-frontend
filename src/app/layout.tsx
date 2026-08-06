'use client';

import React, { useState } from 'react';
import './globals.css';
import { PluginProvider } from '../context/PluginContext';
import { 
  Sparkles, 
  Settings, 
  Database, 
  Layers, 
  ExternalLink,
  Activity,
  HardDrive
} from 'lucide-react';
import { SettingsModal } from '../components/SettingsModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090E] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <PluginProvider>
          {/* Top Full-Width Glass Header (Zero Sidebar) */}
          <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-xl z-40 sticky top-0">
            {/* Brand Logo & Live Engine Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">TRAKT</h1>
                  <p className="text-[10px] text-indigo-400 font-mono mt-0.5 tracking-wider">CANVAS KNOWLEDGE ENGINE</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-3 border-l border-slate-800 pl-4 font-mono text-xs">
                <span className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>DATABASE PERSISTENT</span>
                </span>

                <span className="flex items-center space-x-1.5 text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                  <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span>FETCHERS ACTIVE (30s)</span>
                </span>
              </div>
            </div>

            {/* Right Control Bar with Settings Icon */}
            <div className="flex items-center space-x-3 font-mono text-xs">
              <a
                href="https://github.com/piderking/TRAKT-backend"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center space-x-1 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <span>GitHub Repositories</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all border border-indigo-400/30"
              >
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>⚙ Settings & Plugins</span>
              </button>
            </div>
          </header>

          {/* Full Screen Edge-to-Edge Canvas Content Container */}
          <main className="flex-1 p-6 max-w-[1700px] w-full mx-auto">
            {children}
          </main>

          {/* Core Settings & Plugin Configuration Modal */}
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
          />
        </PluginProvider>
      </body>
    </html>
  );
}
