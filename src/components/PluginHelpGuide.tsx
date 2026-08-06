'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Key,
  Terminal,
  Code2,
  Smartphone,
  Music,
  Gamepad2,
  Film
} from 'lucide-react';

interface PluginHelpGuideProps {
  pluginId: 'movies' | 'wakatime' | 'health' | 'spotify' | 'steam' | 'letterboxd';
}

export function PluginHelpGuide({ pluginId }: PluginHelpGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderGuideContent = () => {
    switch (pluginId) {
      case 'steam':
        return {
          icon: <Gamepad2 className="w-5 h-5 text-cyan-400" />,
          title: 'Steam Web API Setup Guide',
          subtitle: 'Connect your Steam library, live game telemetry, and recent 2-week playtime hours.',
          steps: [
            {
              num: 1,
              title: 'Get Steam Web API Key',
              desc: 'Go to steamcommunity.com/dev/apikey, sign in with your Steam account, enter your domain (e.g. piderking.org), and copy your 32-character API key.'
            },
            {
              num: 2,
              title: 'Find Your SteamID64',
              desc: 'Open your Steam Community profile URL (e.g., steamcommunity.com/profiles/76561199053737486/) and copy the 17-digit SteamID64 number from the path.'
            },
            {
              num: 3,
              title: 'Set Profile Privacy to Public',
              desc: 'In Steam -> Edit Profile -> Privacy Settings, ensure "Game Details" and "Profile Status" are set to Public so the API can read owned games and playtime.'
            },
            {
              num: 4,
              title: 'Register Credentials in TRAKT',
              desc: 'Paste your Steam Web API Key and SteamID64 into the Plugin Studio settings drawer on the /plugins page or via the backend endpoint below.'
            }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/plugins/config/steam" \\
     -H "Content-Type: application/json" \\
     -d '{"steam_api_key":"YOUR_STEAM_KEY","steam_id64":"76561199053737486"}'`
        };

      case 'spotify':
        return {
          icon: <Music className="w-5 h-5 text-emerald-400" />,
          title: 'Spotify Web API Setup Guide',
          subtitle: 'Track live music playback, track audio features (BPM, Energy), and scrobble history.',
          steps: [
            {
              num: 1,
              title: 'Create Spotify Developer App',
              desc: 'Go to developer.spotify.com/dashboard, click "Create App", name it "TRAKT Music Scrobbler", and set App Type to Web API.'
            },
            {
              num: 2,
              title: 'Set Redirect URIs',
              desc: 'Add https://backend-development-8adc.up.railway.app/oauth/callback to Redirect URIs in your Spotify App settings.'
            },
            {
              num: 3,
              title: 'Copy Client ID & Secret',
              desc: 'Copy your Client ID and Client Secret from the Spotify App overview page.'
            },
            {
              num: 4,
              title: 'Configure in TRAKT',
              desc: 'Paste your Spotify Client ID and Client Secret into TRAKT Plugin Studio (/plugins).'
            }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/spotify/scrobble" \\
     -H "Content-Type: application/json" \\
     -d '{"track_name":"Levitating","artist_name":"Dua Lipa","album_name":"Future Nostalgia","duration_ms":203000,"progress_ms":120000,"is_playing":true}'`
        };

      case 'health':
        return {
          icon: <Smartphone className="w-5 h-5 text-red-400" />,
          title: 'Android Health Connect Daemon Setup Guide',
          subtitle: 'Sync real-time Heart Rate (BPM), daily steps, active calories, sleep hours, and SpO2.',
          steps: [
            {
              num: 1,
              title: 'Declare Android Permissions',
              desc: 'In your Android Daemon AndroidManifest.xml, declare READ_HEART_RATE, READ_STEPS, READ_TOTAL_CALORIES_BURNED, READ_SLEEP, READ_OXYGEN_SATURATION permissions.'
            },
            {
              num: 2,
              title: 'Obtain Sync Token',
              desc: 'Use Bearer Token "hc_token_demo_3341" or generate a custom token in TRAKT Plugin Studio.'
            },
            {
              num: 3,
              title: 'Send Periodic Sync Payload',
              desc: 'Schedule a WorkManager background job in your Android app to query Health Connect API every 15 minutes and POST to TRAKT.'
            }
          ],
          codeSnippet: `val request = Request.Builder()
    .url("https://backend-development-8adc.up.railway.app/api/v1/health/sync")
    .addHeader("Authorization", "Bearer hc_token_demo_3341")
    .post(jsonPayload.toString().toRequestBody("application/json".toMediaType()))
    .build()`
        };

      case 'wakatime':
        return {
          icon: <Code2 className="w-5 h-5 text-purple-400" />,
          title: 'WakaTime & Antigravity Token Telemetry Setup Guide',
          subtitle: 'Track active coding hours, languages ratio, and AI model token consumption.',
          steps: [
            {
              num: 1,
              title: 'Get WakaTime API Key',
              desc: 'Log into wakatime.com/settings/api-key and copy your Secret API Key.'
            },
            {
              num: 2,
              title: 'Configure Antigravity CLI Telemetry Hook',
              desc: 'Ensure agy CLI or Gemini CLI logs prompt and completion tokens to TRAKT endpoint.'
            },
            {
              num: 3,
              title: 'Save API Credentials in TRAKT',
              desc: 'Save your WakaTime API Key in TRAKT Plugin Studio (/plugins).'
            }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/plugins/config/wakatime" \\
     -H "Content-Type: application/json" \\
     -d '{"wakatime_api_key":"sec_wakatime_key_...","sync_interval_mins":"15"}'`
        };

      case 'letterboxd':
        return {
          icon: <Film className="w-5 h-5 text-amber-400" />,
          title: 'Letterboxd Export Zip Importer Setup Guide',
          subtitle: 'Import watched.csv, ratings.csv, diary.csv, and watchlist.csv into TRAKT.',
          steps: [
            {
              num: 1,
              title: 'Export Data from Letterboxd',
              desc: 'Log into Letterboxd, go to Account Settings -> Import & Export -> Export Your Data, and download your export.zip archive.'
            },
            {
              num: 2,
              title: 'Upload Zip to TRAKT',
              desc: 'Go to /plugins or /movies tab, select your downloaded letterboxd-export.zip file, and click "Upload & Import Export Zip".'
            },
            {
              num: 3,
              title: 'Automatic Field Conversion',
              desc: 'TRAKT automatically converts 5-star ratings to TRAKT 10-star scale and populates your Movie Logger Diary.'
            }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/import/letterboxd" \\
     -F "file=@/path/to/letterboxd-export.zip"`
        };

      case 'movies':
      default:
        return {
          icon: <Film className="w-5 h-5 text-blue-400" />,
          title: 'Movie Logger & Diary Setup Guide',
          subtitle: 'Log movies, rate on 10-star scale, tag reviews, and sync watchlist.',
          steps: [
            {
              num: 1,
              title: 'Log New Movies',
              desc: 'Use the Movie Logger form on the /movies page to log watched movies, select 1-10 star ratings, toggle rewatches, and write reviews.'
            },
            {
              num: 2,
              title: 'Import Letterboxd History',
              desc: 'Upload your Letterboxd export.zip archive to import your full historical movie diary.'
            },
            {
              num: 3,
              title: 'View Analytics & Rating Distribution',
              desc: 'Check your ratings distribution bar chart and rewatch statistics in real time.'
            }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/movies/log" \\
     -H "Content-Type: application/json" \\
     -d '{"movie_title":"Interstellar","release_year":2014,"watched_date":"2026-08-05","rating":10.0,"is_rewatch":true,"liked":true}'`
        };
    }
  };

  const guide = renderGuideContent();

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden font-sans transition-all">
      {/* Drawer Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            {guide.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm">{guide.title}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                INTEGRATION & SETUP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{guide.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? 'Hide Instructions' : 'View Setup Instructions'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Instruction Body */}
      {isOpen && (
        <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-6">
          {/* Step-by-Step Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.steps.map((step) => (
              <div key={step.num} className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[10px]">
                    {step.num}
                  </span>
                  <span>{step.title}</span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] pl-7">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* API Payload / Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>API Connection Endpoint & Payload</span>
              </span>
              <button
                onClick={() => handleCopy(guide.codeSnippet, 1)}
                className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied!' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-emerald-400 overflow-x-auto selection:bg-emerald-900 selection:text-white">
              {guide.codeSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
