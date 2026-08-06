'use client';

import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Star, 
  Heart, 
  Repeat, 
  Calendar, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag, 
  MessageSquare,
  Check,
  Search,
  Compass,
  Zap
} from 'lucide-react';

export interface MovieDiaryItem {
  id: string;
  movie_title: string;
  release_year: number;
  watched_date: string;
  rating: number;
  is_rewatch: boolean;
  liked: boolean;
  review: string;
  tags: string[];
  poster_url?: string;
}

export interface SearchMovieItem {
  id: number;
  title: string;
  release_year: number;
  rating: number;
  overview: string;
  poster_url: string;
  genre?: string;
}

export function MovieLogger() {
  const [diary, setDiary] = useState<MovieDiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logging, setLogging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Movie Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchMovieItem[]>([]);
  const [searchingMovies, setSearchingMovies] = useState(false);

  // Form State
  const [movieTitle, setMovieTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState(2024);
  const [watchedDate, setWatchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(8);
  const [isRewatch, setIsRewatch] = useState(false);
  const [liked, setLiked] = useState(false);
  const [review, setReview] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const originUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app';

  const fetchDiary = async () => {
    try {
      const res = await fetch(`${originUrl}/api/v1/movies/diary`);
      const data = await res.json();
      if (data.diary) {
        setDiary(data.diary);
      }
    } catch (err) {
      console.error('Failed to fetch movie diary:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingOrSearch = async (query: string = '') => {
    setSearchingMovies(true);
    try {
      const endpoint = query 
        ? `${originUrl}/api/v1/movies/search?q=${encodeURIComponent(query)}`
        : `${originUrl}/api/v1/movies/trending`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const list = data.results || data.movies || [];
      setSearchResults(list);
    } catch (err) {
      console.error('Failed to search movies:', err);
    } finally {
      setSearchingMovies(false);
    }
  };

  useEffect(() => {
    fetchDiary();
    fetchTrendingOrSearch();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrendingOrSearch(searchQuery);
  };

  const handleQuickLog = (m: SearchMovieItem) => {
    setMovieTitle(m.title);
    setReleaseYear(m.release_year);
    setPosterUrl(m.poster_url);
    setRating(m.rating ? Math.min(10, Math.max(1, Math.round(m.rating))) : 8);
    setShowLogModal(true);
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    setLogging(true);
    try {
      const payload = {
        movie_title: movieTitle,
        release_year: releaseYear,
        watched_date: watchedDate,
        rating: rating,
        is_rewatch: isRewatch,
        liked: liked,
        review: review,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        poster_url: posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80"
      };

      const res = await fetch(`${originUrl}/api/v1/movies/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          setShowLogModal(false);
          setMovieTitle('');
          setReview('');
          setTagsInput('');
          setPosterUrl('');
        }, 1200);
        fetchDiary();
      }
    } catch (err) {
      console.error('Failed to log movie:', err);
    } finally {
      setLogging(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await fetch(`${originUrl}/api/v1/movies/log/${logId}`, { method: 'DELETE' });
      setDiary(diary.filter(item => item.id !== logId));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              LETTERBOXD-STYLE DIARY & SEARCH
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            <Film className="w-6 h-6 text-amber-400" />
            <span>Movie Logger & Discovery Engine</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Search movies, discover trending titles, log ratings, rewatches, and journal reviews
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Movie</span>
        </button>
      </div>

      {/* Movie Search & Discovery Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <span>Search & Discover Movies</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Click any movie poster to pre-fill and log into your Trakt Diary
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchTrendingOrSearch(e.target.value);
              }}
              placeholder="Search movies by title (e.g. Dune, Oppenheimer, Interstellar, Alien)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-mono text-xs transition-colors"
          >
            Search
          </button>
        </form>

        {/* Movie Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {searchResults.map((m) => (
            <div
              key={m.id}
              onClick={() => handleQuickLog(m)}
              className="group relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer hover:border-amber-500/60 transition-all hover:scale-105"
            >
              <img
                src={m.poster_url}
                alt={m.title}
                className="w-full h-36 object-cover"
              />
              <div className="p-2 space-y-0.5">
                <p className="font-bold text-white text-[11px] truncate">{m.title}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>{m.release_year}</span>
                  <span className="text-amber-400 font-bold">★ {m.rating}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-1 rounded shadow font-mono">
                  + Quick Log
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                Log Movie into Trakt Diary
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">MOVIE TITLE</label>
                <input
                  type="text"
                  required
                  value={movieTitle}
                  onChange={e => setMovieTitle(e.target.value)}
                  placeholder="e.g. Dune: Part Two"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">RELEASE YEAR</label>
                  <input
                    type="number"
                    value={releaseYear}
                    onChange={e => setReleaseYear(parseInt(e.target.value) || 2024)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">WATCHED DATE</label>
                  <input
                    type="date"
                    value={watchedDate}
                    onChange={e => setWatchedDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 10-Star Rating Selector */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex justify-between">
                  <span>RATING (1-10 SCALE)</span>
                  <span className="text-amber-400 font-bold">★ {rating}.0</span>
                </label>
                <div className="flex items-center space-x-1 py-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 hover:scale-125 transition-transform ${
                        star <= rating ? 'text-amber-400' : 'text-slate-700'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rewatch & Like Toggles */}
              <div className="flex items-center space-x-6 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRewatch(!isRewatch)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    isRewatch
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Rewatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    liked
                      ? 'bg-pink-500/20 text-pink-400 border-pink-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                  <span>Liked / Favorite</span>
                </button>
              </div>

              {/* Review & Tags */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">JOURNAL REVIEW / NOTES</label>
                <textarea
                  rows={3}
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  placeholder="Write your review or thoughts..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="cinema, imax, favorite"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={logging}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{savedSuccess ? 'Logged to Trakt Diary!' : logging ? 'Saving Log...' : 'Log Entry into Trakt'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Diary Timeline Feed */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span>Your Movie Diary Timeline</span>
        </h2>

        {diary.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-xs text-slate-500">
            No movie diary logs recorded yet. Use the search bar above or click "Log New Movie" to start!
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            {diary.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {item.poster_url && (
                    <img src={item.poster_url} alt={item.movie_title} className="w-14 h-20 object-cover rounded-lg border border-slate-800 flex-shrink-0" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base font-sans">{item.movie_title}</span>
                      <span className="text-slate-400">({item.release_year})</span>
                      {item.is_rewatch && <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30 text-[10px]">REWATCH</span>}
                      {item.liked && <Heart className="w-4 h-4 text-pink-400 fill-current" />}
                    </div>

                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                      <span>★ {item.rating}.0</span>
                      <span className="text-slate-500 font-normal text-xs">• Watched {item.watched_date}</span>
                    </div>

                    {item.review && <p className="text-slate-300 font-sans text-xs italic pt-1">{item.review}</p>}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center space-x-1.5 pt-1">
                        {item.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteLog(item.id)}
                  className="text-slate-600 hover:text-red-400 p-1.5 rounded hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
