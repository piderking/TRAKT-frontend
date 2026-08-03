'use client';

import React from 'react';
import { MovieLogger } from '../../components/MovieLogger';

export default function MoviesPage() {
  return (
    <div className="space-y-6 font-sans">
      <MovieLogger />
    </div>
  );
}
