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
  Check
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

export function MovieLogger() {
  const [diary, setDiary] = useState<MovieDiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logging, setLogging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [movieTitle, setMovieTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState(2024);
  const [watchedDate, setWatchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(8);
  const [isRewatch, setIsRewatch] = useState(false);
  const [liked, setLiked] = useState(false);
  const [review, setReview] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const fetchDiary = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/movies/diary`);
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

  useEffect(() => {
    fetchDiary();
  }, []);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle) return;
    setLogging(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/movies/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movie_title: movieTitle,
          release_year: Number(releaseYear),
          watched_date: watchedDate,
          rating: Number(rating),
          is_rewatch: isRewatch,
          liked: liked,
          review: review,
          tags: tags
        })
      });

      const data = await res.json();
      if (data.entry) {
        setDiary(prev => [data.entry, ...prev]);
        setMovieTitle('');
        setReview('');
        setTagsInput('');
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
        setShowLogModal(false);
      }
    } catch (err) {
      console.error('Failed to log movie:', err);
    } finally {
      setLogging(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-development-8adc.up.railway.app'}/api/v1/movies/log/${id}`, {
        method: 'DELETE'
      });
      setDiary(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logger Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Trakt Movie Logger & Diary</h2>
            <p className="text-xs text-slate-400 font-mono">Letterboxd-style movie journal, ratings, and rewatch tracking</p>
          </div>
        </div>

        <button
          onClick={() => setShowLogModal(!showLogModal)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{showLogModal ? 'Close Form' : 'Log a Movie'}</span>
        </button>
      </div>

      {/* Log Movie Modal / Drawer Form */}
      {showLogModal && (
        <form onSubmit={handleLogSubmit} className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Log Movie to Diary</span>
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              LETTERBOXD FORMAT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400">MOVIE TITLE</label>
              <input
                type="text"
                required
                value={movieTitle}
                onChange={e => setMovieTitle(e.target.value)}
                placeholder="e.g. Dune: Part Two"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">RELEASE YEAR</label>
              <input
                type="number"
                value={releaseYear}
                onChange={e => setReleaseYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">WATCHED DATE</label>
              <input
                type="date"
                value={watchedDate}
                onChange={e => setWatchedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Interactive Rating Selector */}
            <div className="space-y-1">
              <label className="text-slate-400 block">RATING: {rating} / 10 ★</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 text-sm ${star <= rating ? 'text-amber-400' : 'text-slate-700'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Rewatch Toggle */}
            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsRewatch(!isRewatch)}
                className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                  isRewatch ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{isRewatch ? 'Rewatched' : 'First Watch'}</span>
              </button>

              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all ${
                  liked ? 'bg-pink-950 text-pink-400 border-pink-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-pink-400' : ''}`} />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">TAGS (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="cinema, imax, favorite"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">REVIEW / JOURNAL NOTES</label>
            <textarea
              rows={3}
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Write your thoughts or review notes..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={logging}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs font-mono shadow-lg transition-all"
          >
            <span>{logging ? 'Saving Log...' : 'Save Entry to Trakt Diary'}</span>
          </button>
        </form>
      )}

      {/* Diary Feed List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-1">
          <span>RECENT DIARY LOGS ({diary.length})</span>
          <span>Sorted by Date</span>
        </div>

        {diary.map(item => (
          <div
            key={item.id}
            className="glass-panel p-4 rounded-xl border border-slate-800/80 hover:border-amber-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start space-x-4">
              <img
                src={item.poster_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80"}
                alt={item.movie_title}
                className="w-12 h-16 object-cover rounded-lg border border-slate-800 flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                    {item.movie_title}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">({item.release_year})</span>
                  {item.liked && <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />}
                  {item.is_rewatch && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Repeat className="w-2.5 h-2.5" /> Rewatch
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-amber-400 font-bold">★ {item.rating} / 10</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{item.watched_date}</span>
                </div>

                {item.review && (
                  <p className="text-xs text-slate-300 italic pt-1 leading-relaxed">
                    "{item.review}"
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDeleteLog(item.id)}
              className="text-slate-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/30 transition-colors self-end md:self-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
