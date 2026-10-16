import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GameMode, BoardTheme } from '../types/game';
import { Bot, Users, Flame, Volume2, VolumeX, Mic } from 'lucide-react';
import { sound } from '../utils/audio';
import wadiyaBg from '../assets/images/wadiya_on_fire_bg_1792159277557.jpg';

interface TitleScreenProps {
  onStart: (mode: GameMode, theme: BoardTheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  isMuted,
  onToggleMute,
  selectedMode,
  onSelectMode,
}) => {
  const [activeArtist, setActiveArtist] = useState<'clean' | 'panic' | 'deep'>(sound.getVoiceArtist());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onStart(selectedMode, 'wood');
      } else if (e.key === 'm' || e.key === 'M') {
        onToggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, selectedMode, onToggleMute]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-black text-stone-100 select-none">
      {/* 1. Cinematic Background (Metallic Cobras Breathing Fire) */}
      <div className="absolute inset-0 z-0">
        <img
          src={wadiyaBg}
          alt="Wadiya on Fire Cobras"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-[0.55] contrast-[1.15]"
        />
        {/* Fiery radial vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
      </div>

      {/* 2. Top Perimeter Control (Mute Only) */}
      <header className="relative z-10 flex items-center justify-end px-6 py-4 max-w-6xl w-full mx-auto">
        <button
          type="button"
          onClick={onToggleMute}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-stone-900 border border-red-900/60 text-stone-300 hover:text-red-400 transition-all cursor-pointer backdrop-blur-sm"
          title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>
      </header>

      {/* 3. Centerpiece: Title + 4 Mode Buttons + Start Game (English Only) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto text-center">
        {/* Fiery Title Lockup */}
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-600/60 text-red-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span>CYBER COBRA ARENA</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-orange-500 to-red-600 drop-shadow-[0_8px_25px_rgba(239,68,68,0.7)] font-['Black_Ops_One'] uppercase">
            WADIYA ON FIRE
          </h1>
        </motion.div>

        {/* Clean 4 Game Mode Selection (English Only) */}
        <div className="w-full max-w-lg mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                id: '1P_BOT' as GameMode,
                icon: Bot,
                label: 'ROBOT VS',
                sub: 'Solo AI',
              },
              {
                id: '2P_PASS' as GameMode,
                icon: Users,
                label: '2 PLAYERS',
                sub: 'Pass & Play',
              },
              {
                id: '3P_PASS' as GameMode,
                icon: Users,
                label: '3 PLAYERS',
                sub: 'Pass & Play',
              },
              {
                id: '4P_PASS' as GameMode,
                icon: Users,
                label: '4 PLAYERS',
                sub: 'Pass & Play',
              },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectMode(mode.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-950/80 border-red-500 text-amber-200 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105'
                      : 'bg-black/60 border-stone-800 text-stone-400 hover:border-red-900/80 hover:text-stone-200'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-orange-400' : 'text-stone-400'}`} />
                  <span className="text-xs font-black tracking-wide font-['Black_Ops_One']">
                    {mode.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {mode.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bengali Voice Artist Selector with instant audio preview */}
        <div className="w-full max-w-lg mb-7 p-3 rounded-2xl bg-black/70 border border-red-950/80 backdrop-blur-md text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <Mic className="w-3.5 h-3.5 text-orange-400" />
              <span>BENGALI VOICE ARTIST:</span>
            </span>
            <button
              type="button"
              onClick={() => sound.playWadiyaAgunVoice()}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-orange-400 hover:bg-red-900 border border-red-800 transition-colors cursor-pointer"
              title="Preview Bengali vocal scream"
            >
              TEST VOICE 🔊
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'clean' as const, name: 'ARTIST 1', sub: 'Rashed (Classic)' },
              { id: 'panic' as const, name: 'ARTIST 2', sub: 'Shanto (Scream)' },
              { id: 'deep' as const, name: 'ARTIST 3', sub: 'Kabir (Dramatic)' },
            ].map((a) => {
              const isSelected = activeArtist === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    sound.setVoiceArtist(a.id);
                    setActiveArtist(a.id);
                    sound.playWadiyaAgunVoice(a.id);
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-950 border-red-500 text-amber-300 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="text-[11px] font-black">{a.name}</div>
                  <div className="text-[9px] text-stone-400 truncate">{a.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Start CTA Button */}
        <motion.button
          type="button"
          onClick={() => onStart(selectedMode, 'wood')}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative group px-12 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:from-red-500 hover:to-orange-400 text-black font-black text-xl md:text-2xl tracking-wider font-['Black_Ops_One'] shadow-[0_10px_35px_rgba(239,68,68,0.6)] cursor-pointer flex items-center justify-center gap-3 transition-all"
        >
          <Flame className="w-6 h-6 text-black fill-black" />
          <span>START GAME</span>
        </motion.button>
      </main>

      {/* 4. Single Clean Flat Line */}
      <footer className="relative z-10 py-3 text-center border-t border-red-950/50 bg-black/80 text-xs text-stone-500 font-mono">
        <span>Space / Enter to Start · Space / Click to Roll Dice · Esc Pause</span>
      </footer>
    </div>
  );
};
