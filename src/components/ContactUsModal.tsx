import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Loader2, Phone, Mail, User, HelpCircle } from 'lucide-react';
import { Language } from '../types/tournament';
import { getTranslation } from '../utils/translations';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose, lang }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'registration',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errs.name = lang === 'fr' ? 'Le nom complet doit comporter au moins 3 caractères.' : 'Full name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = lang === 'fr' ? 'Veuillez saisir une adresse email valide.' : 'Please enter a valid email address.';
    }

    const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '');
    if (!phoneClean || phoneClean.length < 8) {
      errs.phone = lang === 'fr' ? 'Veuillez renseigner un numéro de téléphone valide (+237...).' : 'Please provide a valid phone number (at least 8 digits).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errs.message = lang === 'fr' ? 'Votre message doit faire au moins 15 caractères.' : 'Message must be at least 15 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate secure API dispatch to tournament organizing secretariat
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', category: 'registration', message: '' });
        onClose();
      }, 2500);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl text-slate-100 my-auto max-h-[94dvh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            UTMS Secretariat Desk
          </div>
          <h3 id="contact-modal-title" className="text-xl md:text-2xl font-bold text-white">
            {getTranslation(lang, 'contactTitle')}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {getTranslation(lang, 'contactSubtitle')}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-white">
              {lang === 'fr' ? 'Message Transmis avec Succès !' : 'Inquiry Successfully Transmitted!'}
            </h4>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              {getTranslation(lang, 'messageSentSuccess')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {getTranslation(lang, 'fullName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Samuel Mbappe / Coach Nsame"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-red-500/80 focus:ring-red-500/40' : 'border-slate-800 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {getTranslation(lang, 'email')} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="contact@club.cm"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-red-500/80 focus:ring-red-500/40' : 'border-slate-800 focus:ring-emerald-500/40 focus:border-emerald-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {getTranslation(lang, 'phone')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="+237 670 00 11 22"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? 'border-red-500/80 focus:ring-red-500/40' : 'border-slate-800 focus:ring-emerald-500/40 focus:border-emerald-500'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {getTranslation(lang, 'subject')}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              >
                <option value="registration">Team or Player Registration / Eligibility</option>
                <option value="sanctioning">New Tournament Creation & Sanctioning</option>
                <option value="rules_protest">Competition Rules, Referees & Protests</option>
                <option value="finance">Registration Fees & MTN/Orange Money Verification</option>
                <option value="general">Media, Press & General Sponsorship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {getTranslation(lang, 'message')} *
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                placeholder="Describe your inquiry or submit tournament documentation..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.message ? 'border-red-500/80 focus:ring-red-500/40' : 'border-slate-800 focus:ring-emerald-500/40 focus:border-emerald-500'
                }`}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {getTranslation(lang, 'sendMessage')}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
