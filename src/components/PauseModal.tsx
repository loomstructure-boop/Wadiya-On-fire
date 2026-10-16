import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onMainMenu,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-stone-900 border border-red-950 rounded-2xl p-6 shadow-2xl text-stone-200 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <h2 className="text-xl font-black text-amber-300 font-['Black_Ops_One'] uppercase">
            GAME PAUSED
          </h2>
          <button
            type="button"
            onClick={onResume}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound Toggle & Bengali Voice Artist Selection */}
        <div className="my-4 space-y-3 p-3.5 rounded-xl bg-black/60 border border-stone-800 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300 uppercase font-mono">
              SOUND EFFECTS
            </span>
            <button
              type="button"
              onClick={onToggleMute}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                🎙️ BENGALI VOICE ARTIST
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playWadiyaAgunVoice();
                }}
                className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-orange-400 hover:bg-red-900 border border-red-800/80 transition-colors cursor-pointer"
                title="Listen to artist"
              >
                TEST 🔊
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'clean' as const, label: 'ARTIST 1', desc: 'Rashed (Classic)' },
                { id: 'panic' as const, label: 'ARTIST 2', desc: 'Shanto (Scream)' },
                { id: 'deep' as const, label: 'ARTIST 3', desc: 'Kabir (Dramatic)' },
              ].map((artist) => {
                const isSelected = sound.getVoiceArtist() === artist.id;
                return (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => {
                      sound.setVoiceArtist(artist.id);
                      sound.playWadiyaAgunVoice(artist.id);
                    }}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-950 border-red-500 text-amber-300 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        : 'bg-stone-900/90 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div className="text-[10px] font-bold">{artist.label}</div>
                    <div className="text-[9px] text-stone-400 truncate">{artist.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:from-red-500 hover:to-orange-400 text-black font-black text-sm tracking-wider shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-98 font-['Black_Ops_One']"
          >
            <Play className="w-4 h-4 text-black fill-black" />
            <span>RESUME (ESC)</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm border border-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-stone-400" />
            <span>RESTART MATCH</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="w-full py-2.5 px-4 rounded-xl bg-black/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-bold text-sm border border-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-stone-400" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
