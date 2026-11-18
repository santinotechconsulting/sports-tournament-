import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Settings2 } from 'lucide-react';
import { Language } from '../types/tournament';
import { getTranslation } from '../utils/translations';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
}

interface CookieConsentBannerProps {
  lang: Language;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    performance: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('utms_cookie_consent');
    if (!saved) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const all = { essential: true, analytics: true, performance: true };
    localStorage.setItem('utms_cookie_consent', JSON.stringify(all));
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    const essentialOnly = { essential: true, analytics: false, performance: false };
    localStorage.setItem('utms_cookie_consent', JSON.stringify(essentialOnly));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('utms_cookie_consent', JSON.stringify(prefs));
    setShowSettings(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-5 shadow-2xl text-slate-100 transition-all duration-300 print:hidden no-print"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl mt-0.5 shrink-0 border border-emerald-500/20">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm sm:text-base flex items-center justify-between">
            {getTranslation(lang, 'cookieTitle')}
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              HTTPS Enforced
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {getTranslation(lang, 'cookieDesc')}
          </p>

          {showSettings && (
            <div className="mt-3.5 space-y-2.5 pt-3 border-t border-slate-800 text-xs">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 cursor-not-allowed">
                <span>
                  <strong className="text-slate-200">Strictly Necessary Cookies</strong>
                  <p className="text-slate-400 text-[11px]">Authentication, role permissions & match scoring state</p>
                </span>
                <input type="checkbox" checked disabled className="accent-emerald-500" />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 cursor-pointer">
                <span>
                  <strong className="text-slate-200">Analytics & Live Tracking</strong>
                  <p className="text-slate-400 text-[11px]">Google Analytics / traffic telemetry for tournament organizers</p>
                </span>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  className="accent-emerald-500"
                />
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!showSettings ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {getTranslation(lang, 'acceptAll')}
                </button>
                <button
                  onClick={handleEssentialOnly}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700"
                >
                  {getTranslation(lang, 'rejectNonEssential')}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors ml-auto"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  {getTranslation(lang, 'cookieSettings')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveCustom}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs rounded-lg transition-colors"
                >
                  Save My Preferences
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
