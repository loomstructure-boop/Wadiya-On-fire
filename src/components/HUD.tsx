import React from 'react';
import { Player } from '../types/game';
import { Volume2, VolumeX, Pause, RotateCcw, Home, Flame, Mic } from 'lucide-react';
import { sound } from '../utils/audio';

interface HUDProps {
  players: Player[];
  activePlayerIndex: number;
  onPause: () => void;
  onRestart: () => void;
  onHome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  bannerMessage?: { text: string; type: 'info' | 'ladder' | 'snake' | 'six' } | null;
}

export const HUD: React.FC<HUDProps> = ({
  players,
  activePlayerIndex,
  onPause,
  onRestart,
  onHome,
  isMuted,
  onToggleMute,
  bannerMessage,
}) => {
  const activePlayer = players[activePlayerIndex];

  return (
    <div className="w-full flex flex-col justify-between pointer-events-none select-none">
      {/* 1. Top Minimal Bar */}
      <header className="w-full px-4 py-2.5 flex items-center justify-between gap-4 border-b border-red-950/60 bg-black/80 backdrop-blur-md pointer-events-auto">
        {/* Brand */}
        <button
          type="button"
          onClick={onHome}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
          title="Menu"
        >
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="text-lg md:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500 font-['Black_Ops_One']">
            WADIYA ON FIRE
          </span>
        </button>

        {/* Turn Status */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900/90 border border-red-900/60 shadow-inner">
          <span
            className="w-3 h-3 rounded-full ring-2 ring-black"
            style={{ backgroundColor: activePlayer?.color || '#ef4444' }}
          />
          <span className="text-xs sm:text-sm font-bold text-stone-200 uppercase tracking-wide">
            {activePlayer?.isBot ? 'ROBOT THINKING... 🤖' : `${activePlayer?.name}'S TURN`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Quick Voice Artist Switcher with live preview */}
          <button
            type="button"
            onClick={() => {
              const current = sound.getVoiceArtist();
              const next = current === 'clean' ? 'panic' : current === 'panic' ? 'deep' : 'clean';
              sound.setVoiceArtist(next);
              sound.playWadiyaAgunVoice(next);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-red-900/60 hover:border-orange-500 text-amber-300 text-[11px] font-bold transition-all cursor-pointer"
            title="Click to switch and test Voice Artist"
          >
            <Mic className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline uppercase">
              ARTIST: {sound.getVoiceArtist() === 'clean' ? '1 (RASHED)' : sound.getVoiceArtist() === 'panic' ? '2 (SHANTO)' : '3 (KABIR)'}
            </span>
            <span className="sm:hidden uppercase font-mono">
              A{sound.getVoiceArtist() === 'clean' ? '1' : sound.getVoiceArtist() === 'panic' ? '2' : '3'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-orange-400 transition-colors cursor-pointer"
            title="Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
          </button>

          <button
            type="button"
            onClick={onPause}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-orange-400 transition-colors cursor-pointer"
            title="Pause & Settings"
          >
            <Pause className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-orange-400 transition-colors cursor-pointer"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Banner Notification Bar (English Only) */}
      {bannerMessage && (
        <div className="w-full flex justify-center py-2 px-4 pointer-events-none transition-all">
          <div
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-2xl border backdrop-blur-md flex items-center gap-2 animate-bounce uppercase tracking-wide ${
              bannerMessage.type === 'snake'
                ? 'bg-red-950/95 text-red-200 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                : bannerMessage.type === 'ladder'
                ? 'bg-amber-950/95 text-amber-200 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                : 'bg-stone-900/95 text-stone-200 border-stone-700'
            }`}
          >
            <span>{bannerMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
