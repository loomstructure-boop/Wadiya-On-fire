import React from 'react';
import { GameRules, Language } from '../types/game';
import { X, Check } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: GameRules;
  onUpdateRules: (rules: GameRules) => void;
  lang: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  rules,
  onUpdateRules,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-2xl p-6 shadow-2xl text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <h2 className="text-xl font-bold text-amber-300 font-['Hind_Siliguri']">
            {lang === 'bn' ? 'খেলার নিয়ম ও সেটিংস' : 'Rules & Settings'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules summary */}
        <div className="mt-4 space-y-3 text-xs md:text-sm text-stone-300 font-['Hind_Siliguri'] leading-relaxed">
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
            <p className="font-semibold text-amber-200 mb-1">
              {lang === 'bn' ? '১. মূল উদ্দেশ্য:' : '1. Objective:'}
            </p>
            <p className="text-stone-400">
              {lang === 'bn'
                ? '১ নম্বর ঘর থেকে শুরু করে সবার আগে ১০০ নম্বর ঘরে পৌঁছানো।'
                : 'Be the first player to travel from square 1 to the final square 100.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
            <p className="font-semibold text-emerald-400 mb-1">
              {lang === 'bn' ? '২. মই (Ladders 🪜):' : '2. Ladders 🪜:'}
            </p>
            <p className="text-stone-400">
              {lang === 'bn'
                ? 'মইয়ের গোঁড়ায় পড়লে স্বয়ংক্রিয়ভাবে মই বেয়ে উপরের ঘরে উঠে যাবেন।'
                : 'Landing at the foot of a ladder lifts you straight up to its top.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
            <p className="font-semibold text-rose-400 mb-1">
              {lang === 'bn' ? '৩. সাপ (Snakes 🐍):' : '3. Snakes 🐍:'}
            </p>
            <p className="text-stone-400">
              {lang === 'bn'
                ? 'সাপের মুখে পড়লে সাপের লেজের ঘরে নেমে যেতে হবে।'
                : 'Landing on a snake’s mouth forces you down to the tip of its tail.'}
            </p>
          </div>

          {/* Rule Toggles */}
          <div className="pt-2 border-t border-stone-800 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-stone-800/60 transition-colors">
              <span className="text-xs font-medium text-stone-200">
                {lang === 'bn'
                  ? 'সঠিক ১০০ নম্বরে পৌঁছাতে হবে (বাউন্স ব্যাক নিয়ম)'
                  : 'Exact 100 to win (Bounce back on excess)'}
              </span>
              <input
                type="checkbox"
                checked={rules.exact100}
                onChange={(e) => onUpdateRules({ ...rules, exact100: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-stone-800/60 transition-colors">
              <span className="text-xs font-medium text-stone-200">
                {lang === 'bn'
                  ? 'ছক্কা (৬) পড়লে অতিরিক্ত চাল পাবেন'
                  : 'Roll 6 grants an extra turn'}
              </span>
              <input
                type="checkbox"
                checked={rules.extraTurnOnSix}
                onChange={(e) => onUpdateRules({ ...rules, extraTurnOnSix: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-all cursor-pointer shadow-md"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
