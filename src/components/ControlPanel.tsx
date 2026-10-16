import React from 'react';
import { Player, MoveLogItem } from '../types/game';
import { Dice } from './Dice';
import { Bot } from 'lucide-react';

interface ControlPanelProps {
  players: Player[];
  activePlayerIndex: number;
  diceValue: number;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  recentLogs: MoveLogItem[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  players,
  activePlayerIndex,
  diceValue,
  isRolling,
  canRoll,
  onRoll,
  recentLogs,
}) => {
  const activePlayer = players[activePlayerIndex];

  return (
    <div className="w-full lg:w-72 flex flex-col gap-3 select-none text-stone-200">
      {/* 1. Dice Section */}
      <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-red-950/80 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient flame glow */}
        <div
          className="absolute -top-10 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors"
          style={{ backgroundColor: activePlayer?.color || '#ef4444' }}
        />

        <div className="text-center mb-1.5">
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-400">
            {activePlayer?.isBot ? 'ROBOT PLAYING...' : `${activePlayer?.name}'S TURN`}
          </p>
        </div>

        {/* 3D Dice */}
        <div className="py-1">
          <Dice
            value={diceValue}
            isRolling={isRolling}
            disabled={!canRoll}
            onRoll={onRoll}
            accentColor={activePlayer?.color}
          />
        </div>

        {/* Roll Button */}
        <button
          type="button"
          onClick={onRoll}
          disabled={!canRoll}
          className={`mt-2 w-full py-2.5 px-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer font-['Black_Ops_One'] ${
            canRoll
              ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:from-red-500 hover:to-orange-400 text-black shadow-[0_4px_16px_rgba(239,68,68,0.5)] active:scale-95'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-800'
          }`}
        >
          <span>{isRolling ? 'ROLLING...' : 'ROLL DICE'}</span>
          <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-black/30 text-stone-900">
            SPACE
          </span>
        </button>
      </div>

      {/* 2. Player Cards */}
      <div className="p-3 rounded-2xl bg-stone-900/90 border border-red-950/80 shadow-xl space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-xs font-bold text-stone-400 uppercase font-mono">
          <span>PLAYERS</span>
          <span>CELL (1-100)</span>
        </div>

        <div className="space-y-1.5">
          {players.map((p, idx) => {
            const isActive = activePlayerIndex === idx;
            const progress = Math.min(100, Math.max(0, p.position));

            return (
              <div
                key={p.id}
                className={`p-2 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-stone-800/90 border-orange-500 shadow-md'
                    : 'bg-black/40 border-stone-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className={isActive ? 'text-orange-300 font-bold' : 'text-stone-300'}>
                      {p.name}
                    </span>
                    {p.isBot && <Bot className="w-3 h-3 text-stone-400" />}
                  </div>

                  <div className="font-mono tabular-nums text-xs">
                    <span
                      className="font-black px-1.5 py-0.5 rounded text-[11px]"
                      style={{ backgroundColor: `${p.color}30`, color: p.color }}
                    >
                      {p.position} / 100
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-stone-950 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Short Punchy Feed (English Only) */}
      {recentLogs.length > 0 && (
        <div className="p-2.5 rounded-2xl bg-black/60 border border-stone-800 text-xs text-stone-400 space-y-1">
          {recentLogs.slice(0, 2).map((log) => (
            <div
              key={log.id}
              className={`p-1 rounded-lg text-[11px] flex items-center justify-between font-mono ${
                log.event === 'snake'
                  ? 'text-red-400 font-bold'
                  : log.event === 'ladder'
                  ? 'text-amber-300 font-bold'
                  : 'text-stone-300'
              }`}
            >
              <span className="truncate">{log.textEn}</span>
              <span className="ml-1 flex-shrink-0">🎲 {log.roll}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
