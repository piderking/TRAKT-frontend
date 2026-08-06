'use client';

import React from 'react';
import { MovieLogger } from '../../components/MovieLogger';
import { PluginHelpGuide } from '../../components/PluginHelpGuide';

export default function MoviesPage() {
  return (
    <div className="space-y-6 font-sans">
      <PluginHelpGuide pluginId="movies" />
      <MovieLogger />
    </div>
  );
}
