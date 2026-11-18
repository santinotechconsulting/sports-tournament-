import React from 'react';

export const TournamentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 animate-pulse">
      <div className="h-44 bg-slate-800/80 rounded-xl mb-4" />
      <div className="h-6 w-3/4 bg-slate-800 rounded mb-2" />
      <div className="h-4 w-1/2 bg-slate-800/60 rounded mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-10 bg-slate-800/40 rounded-lg" />
        <div className="h-10 bg-slate-800/40 rounded-lg" />
      </div>
      <div className="h-10 bg-slate-800 rounded-xl" />
    </div>
  );
};

export const MatchCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-4 w-16 bg-slate-800 rounded" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-800" />
            <div className="h-4 w-32 bg-slate-800 rounded" />
          </div>
          <div className="h-6 w-8 bg-slate-800 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-800" />
            <div className="h-4 w-32 bg-slate-800 rounded" />
          </div>
          <div className="h-6 w-8 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export const StandingsSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse space-y-3">
      <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-slate-800 rounded" />
            <div className="w-6 h-6 bg-slate-800 rounded-full" />
            <div className="w-36 h-4 bg-slate-800 rounded" />
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-4 bg-slate-800 rounded" />
            <div className="w-6 h-4 bg-slate-800 rounded" />
            <div className="w-6 h-4 bg-slate-800 rounded" />
            <div className="w-8 h-4 bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
