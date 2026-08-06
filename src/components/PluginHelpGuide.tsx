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
  Film,
  Activity,
  Book,
  Tv,
  Mic,
  Coffee,
  Utensils,
  Plane,
  MapPin,
  DollarSign,
  Car,
  Moon,
  GraduationCap,
  Sparkles,
  Palette,
  ShoppingBag
} from 'lucide-react';

interface PluginHelpGuideProps {
  pluginId: string;
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
    switch (pluginId.toLowerCase()) {
      case 'steam':
      case 'gaming':
        return {
          icon: <Gamepad2 className="w-5 h-5 text-cyan-400" />,
          title: 'Steam & Gaming Track Guide',
          subtitle: 'Connect your Steam library, live game telemetry, and recent 2-week playtime hours.',
          steps: [
            { num: 1, title: 'Get Steam Web API Key', desc: 'Visit steamcommunity.com/dev/apikey, sign in with your Steam account, enter your domain (e.g. piderking.org), and copy your 32-character API key.' },
            { num: 2, title: 'Find Your SteamID64', desc: 'Open your Steam Community profile URL (e.g. steamcommunity.com/profiles/76561199053737486/) and copy the 17-digit SteamID64 number from the path.' },
            { num: 3, title: 'Set Profile Privacy to Public', desc: 'In Steam -> Edit Profile -> Privacy Settings, ensure Game Details and Profile Status are set to Public.' },
            { num: 4, title: 'Register Credentials in TRAKT', desc: 'Paste your Steam Web API Key and SteamID64 into TRAKT Plugin Studio (/plugins).' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/steam/track" \\
     -H "Content-Type: application/json" \\
     -d '{"game_title":"Marvel Rivals","app_id":2767030,"playtime_mins":60,"is_playing":true}'`
        };

      case 'spotify':
      case 'music':
        return {
          icon: <Music className="w-5 h-5 text-emerald-400" />,
          title: 'Spotify & Music Track Guide',
          subtitle: 'Track live music playback, audio features (BPM, Energy), and listening history.',
          steps: [
            { num: 1, title: 'Create Spotify Developer App', desc: 'Go to developer.spotify.com/dashboard, click Create App, name it TRAKT Music Scrobbler, and select Web API.' },
            { num: 2, title: 'Set Redirect URIs', desc: 'Add https://backend-development-8adc.up.railway.app/oauth/callback to Redirect URIs in your Spotify App settings.' },
            { num: 3, title: 'Copy Client ID & Secret', desc: 'Copy your Client ID and Client Secret from the Spotify App overview page.' },
            { num: 4, title: 'Configure in TRAKT', desc: 'Paste your Spotify Client ID and Client Secret into TRAKT Plugin Studio (/plugins).' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/spotify/track" \\
     -H "Content-Type: application/json" \\
     -d '{"track_name":"Blinding Lights","artist_name":"The Weeknd","album_name":"After Hours","duration_ms":200000,"is_playing":true}'`
        };

      case 'health':
        return {
          icon: <Smartphone className="w-5 h-5 text-red-400" />,
          title: 'Android Health Connect Daemon Track Guide',
          subtitle: 'Sync real-time Heart Rate (BPM), daily steps, active calories, sleep hours, and SpO2.',
          steps: [
            { num: 1, title: 'Declare Android Permissions', desc: 'In your Android Daemon AndroidManifest.xml, declare READ_HEART_RATE, READ_STEPS, READ_TOTAL_CALORIES_BURNED, READ_SLEEP, READ_OXYGEN_SATURATION permissions.' },
            { num: 2, title: 'Obtain Sync Token', desc: 'Use Bearer Token hc_token_demo_3341 or generate a custom token in TRAKT Plugin Studio.' },
            { num: 3, title: 'Send Periodic Sync Payload', desc: 'Schedule a WorkManager background job in your Android app to query Health Connect API every 15 minutes and POST to TRAKT.' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/health/sync" \\
     -H "Authorization: Bearer hc_token_demo_3341" \\
     -H "Content-Type: application/json" \\
     -d '{"user_id":"default_user","heart_rate_bpm":74,"step_count_today":8840,"sleep_duration_hours":7.8}'`
        };

      case 'fitness':
        return {
          icon: <Activity className="w-5 h-5 text-orange-400" />,
          title: 'Fitness & Workouts Track Guide',
          subtitle: 'Track workouts, running distance, calories burned, and park/gym locations.',
          steps: [
            { num: 1, title: 'Connect Strava / Fitness API', desc: 'Sync workout sessions from Strava, Apple Fitness, or Garmin Connect.' },
            { num: 2, title: 'Track Workout Metrics', desc: 'Record run distance, average pace, active kilocalories, and location venue.' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/entities" \\
     -H "Content-Type: application/json" \\
     -d '{"domain":"fitness","title":"10k Park Run","subtitle":"Central Park Loop","tags":["running","strava"],"properties":{"distance_km":10.2,"calories_kcal":680}}'`
        };

      case 'reading':
        return {
          icon: <Book className="w-5 h-5 text-yellow-400" />,
          title: 'Books & Reading Track Guide',
          subtitle: 'Track book reading progress, author notes, Kindle sync, and ratings.',
          steps: [
            { num: 1, title: 'Goodreads / Kindle Sync', desc: 'Import books from Goodreads CSV export or log Kindle page progress.' },
            { num: 2, title: 'Log Reading Milestones', desc: 'Record author name, total pages read, rating, and reading nook location.' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/entities" \\
     -H "Content-Type: application/json" \\
     -d '{"domain":"reading","title":"Dune Messiah","subtitle":"Frank Herbert","tags":["kindle","goodreads"],"properties":{"pages_read":304,"rating":9.0}}'`
        };

      case 'wakatime':
      case 'coding':
        return {
          icon: <Code2 className="w-5 h-5 text-purple-400" />,
          title: 'WakaTime & Antigravity Token Track Guide',
          subtitle: 'Track active coding hours, languages ratio, and AI model token consumption.',
          steps: [
            { num: 1, title: 'Get WakaTime API Key', desc: 'Log into wakatime.com/settings/api-key and copy your Secret API Key.' },
            { num: 2, title: 'Configure Antigravity CLI Telemetry Hook', desc: 'Ensure agy CLI or Gemini CLI logs prompt and completion tokens to TRAKT endpoint.' },
            { num: 3, title: 'Save API Credentials in TRAKT', desc: 'Save your WakaTime API Key in TRAKT Plugin Studio (/plugins).' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/plugins/config/wakatime" \\
     -H "Content-Type: application/json" \\
     -d '{"wakatime_api_key":"sec_wakatime_key_...","sync_interval_mins":"15"}'`
        };

      case 'letterboxd':
      case 'movies':
      default:
        return {
          icon: <Film className="w-5 h-5 text-amber-400" />,
          title: 'Movies & Cinema Track Guide',
          subtitle: 'Track watched movies, 10-star ratings, theatre locations, and directors.',
          steps: [
            { num: 1, title: 'Log New Movies', desc: 'Use the Movie Logger form on the /movies page to log watched movies, select 1-10 star ratings, and set theatre locations.' },
            { num: 2, title: 'Import Letterboxd History', desc: 'Upload your Letterboxd export.zip archive to import your full historical movie diary.' }
          ],
          codeSnippet: `curl -X POST "https://backend-development-8adc.up.railway.app/api/v1/movies/log" \\
     -H "Content-Type: application/json" \\
     -d '{"movie_title":"The Odyssey","release_year":2024,"watched_date":"2026-08-05","rating":10.0,"is_rewatch":false}'`
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
                INTEGRATION & TRACK GUIDE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{guide.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? 'Hide Instructions' : 'View Track Instructions'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Instruction Body */}
      {isOpen && (
        <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-6">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>API Connection Endpoint & Track Payload</span>
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
