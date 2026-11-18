import React, { useState } from 'react';
import { Tournament, SportId, TournamentFormat, Venue, Language } from '../types/tournament';
import { sportsConfig } from '../data/sportsConfig';
import { getTranslation } from '../utils/translations';
import { X, Trophy, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface TournamentWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  venues: Venue[];
  lang: Language;
  onSaveTournament: (tournament: Tournament) => void;
}

export const TournamentWizardModal: React.FC<TournamentWizardModalProps> = ({
  isOpen,
  onClose,
  venues,
  lang,
  onSaveTournament,
}) => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    sportId: 'football' as SportId,
    category: "Men's Open Division",
    description: '',
    format: 'group_knockout' as TournamentFormat,
    organizer: 'National Sports Federation',
    country: 'Cameroon',
    city: 'Douala',
    venueId: venues[0]?.id || 'ven_japoma',
    startDate: '2026-12-01',
    endDate: '2026-12-20',
    registrationFee: 150000,
    currency: 'XAF' as 'XAF' | 'USD' | 'EUR',
    maxTeams: 8,
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    rulesText: 'Standard FIFA rules apply. 2x45 minute halves. Single substitution rule.',
    status: 'registration_open' as any,
  });

  if (!isOpen) return null;

  const handleSportChange = (sportId: SportId) => {
    const cfg = sportsConfig[sportId];
    setFormData((prev) => ({
      ...prev,
      sportId,
      pointsWin: cfg.pointsWin,
      pointsDraw: cfg.pointsDraw,
      pointsLoss: cfg.pointsLoss,
      rulesText: cfg.description,
    }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTournament: Tournament = {
      id: `tourn_${Date.now()}`,
      name: formData.name || 'Universal Sports Championship 2026',
      sportId: formData.sportId,
      organizationId: 'org_cysf',
      category: formData.category,
      description: formData.description || 'Championship tournament organized with UTMS tournament management engine.',
      format: formData.format,
      status: formData.status,
      organizer: formData.organizer,
      country: formData.country,
      city: formData.city,
      venueIds: [formData.venueId],
      bannerUrl:
        formData.sportId === 'basketball'
          ? 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'
          : formData.sportId === 'volleyball'
          ? 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80'
          : formData.sportId === 'tennis'
          ? 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80'
          : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      startDate: formData.startDate,
      endDate: formData.endDate,
      registrationOpenDate: '2026-10-01',
      registrationCloseDate: '2026-11-25',
      registrationFee: formData.registrationFee,
      currency: formData.currency,
      maxTeams: formData.maxTeams,
      registeredTeamIds: [],
      pointsWin: formData.pointsWin,
      pointsDraw: formData.pointsDraw,
      pointsLoss: formData.pointsLoss,
      rulesText: formData.rulesText,
      isFeatured: false,
    };

    onSaveTournament(newTournament);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-100 my-8">
        <button
          onClick={onClose}
          aria-label="Close wizard"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Progress header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <Trophy className="w-4 h-4" />
            Tournament Creation Wizard • Step {step} of 4
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {step === 1 && 'Basic Information & Sport Config'}
            {step === 2 && 'Format & Competition Rules'}
            {step === 3 && 'Financials & Registration Fees'}
            {step === 4 && 'Review & Publication'}
          </h3>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tournament Title *</label>
              <input
                type="text"
                placeholder="e.g. Douala Inter-Quarter Cup 2026"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Sport Profile</label>
                <select
                  value={formData.sportId}
                  onChange={(e) => handleSportChange(e.target.value as SportId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="football">⚽ Football (Soccer)</option>
                  <option value="basketball">🏀 Basketball</option>
                  <option value="volleyball">🏐 Volleyball</option>
                  <option value="tennis">🎾 Tennis</option>
                  <option value="athletics">🏃 Athletics</option>
                  <option value="esports">🎮 Esports / EA FC</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Competition Category</label>
                <input
                  type="text"
                  placeholder="e.g. U-17 Youth / Senior Open"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Organizer</label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Host City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Main Venue</label>
                <select
                  value={formData.venueId}
                  onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Overview of the competition, objective and prizes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* Step 2: Format & Rules */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tournament Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as TournamentFormat })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
              >
                <option value="group_knockout">Group Stage + Knockout Phase (e.g. World Cup style)</option>
                <option value="round_robin">Single Round Robin (Everyone plays each other once)</option>
                <option value="double_round_robin">Double Round Robin (Home and Away)</option>
                <option value="single_elimination">Single Elimination (Knockout bracket directly)</option>
                <option value="swiss">Swiss System (Performance paired rounds)</option>
                <option value="league">Full League Season (Cumulative standings table)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Max Teams</label>
                <input
                  type="number"
                  min="2"
                  max="64"
                  value={formData.maxTeams}
                  onChange={(e) => setFormData({ ...formData, maxTeams: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Win Points</label>
                <input
                  type="number"
                  value={formData.pointsWin}
                  onChange={(e) => setFormData({ ...formData, pointsWin: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Draw Points</label>
                <input
                  type="number"
                  value={formData.pointsDraw}
                  onChange={(e) => setFormData({ ...formData, pointsDraw: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Loss Points</label>
                <input
                  type="number"
                  value={formData.pointsLoss}
                  onChange={(e) => setFormData({ ...formData, pointsLoss: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Competition Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Competition End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Competition Rules Summary</label>
              <textarea
                rows={2}
                value={formData.rulesText}
                onChange={(e) => setFormData({ ...formData, rulesText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>
        )}

        {/* Step 3: Financials */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Registration Fee per Team</label>
                <input
                  type="number"
                  value={formData.registrationFee}
                  onChange={(e) => setFormData({ ...formData, registrationFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                >
                  <option value="XAF">FCFA (XAF) - Central Africa Default</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[11px]">
                Supported Payment Providers
              </span>
              <p className="text-slate-300">
                Teams can submit payments via <strong>MTN Mobile Money</strong>, <strong>Orange Money</strong>, <strong>Direct Bank Transfer</strong>, or cash at the secretariat desk.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review & Status */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm">{formData.name || 'Universal Tournament'}</h4>
              <p className="text-slate-300">
                Sport: <strong className="text-emerald-400 capitalize">{formData.sportId}</strong> • Format: <strong className="text-emerald-400">{formData.format}</strong>
              </p>
              <p className="text-slate-400">
                Location: {formData.city}, {formData.country} • Max Teams: {formData.maxTeams}
              </p>
              <p className="text-slate-400">
                Fee: {formData.registrationFee.toLocaleString()} {formData.currency}
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Initial Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
              >
                <option value="registration_open">Registration Open (Publicly accepting teams)</option>
                <option value="ongoing">Ongoing (Fixtures active)</option>
                <option value="draft">Save as Draft (Private)</option>
              </select>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" /> Create & Publish Tournament
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
