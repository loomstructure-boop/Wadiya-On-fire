import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Player } from '../types/game';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  onPlayAgain,
  onMainMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#f97316'];
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.4 - height * 0.2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative z-10 w-full max-w-lg bg-gradient-to-b from-stone-900 to-black border-2 border-red-600 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(239,68,68,0.4)] text-stone-100 text-center"
      >
        {/* Trophy */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xl mb-3 text-black animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Victory Headline */}
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500 font-['Black_Ops_One'] uppercase tracking-wide">
          VICTORY!
        </h2>

        {/* Winner Tag */}
        <div className="mt-3 flex items-center justify-center gap-2.5">
          <span
            className="w-4 h-4 rounded-full shadow-md"
            style={{ backgroundColor: winner.color }}
          />
          <span className="text-xl md:text-2xl font-black text-stone-100 uppercase font-['Outfit']">
            {winner.name}
          </span>
          <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
            CHAMPION
          </span>
        </div>

        <p className="mt-2 text-sm text-stone-400 font-mono">
          Reached square 100 on the fiery arena!
        </p>

        {/* Stats */}
        <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-stone-800 text-left">
          <p className="text-xs uppercase tracking-wider font-bold text-stone-400 mb-3 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MATCH STATS</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[11px] text-stone-400 block uppercase">Rolls</span>
              <span className="text-lg font-bold text-amber-300">{winner.stats.rolls}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[11px] text-stone-400 block uppercase">Ladders</span>
              <span className="text-lg font-bold text-emerald-400">{winner.stats.laddersClimbed}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[11px] text-stone-400 block uppercase">Snake Bites</span>
              <span className="text-lg font-bold text-rose-400">{winner.stats.snakesBitten}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="text-[11px] text-stone-400 block uppercase">Sixes</span>
              <span className="text-lg font-bold text-sky-400">{winner.stats.sixes}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:from-red-500 hover:to-orange-400 text-black font-black text-sm tracking-wide shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95 whitespace-nowrap font-['Black_Ops_One']"
          >
            <RotateCcw className="w-4 h-4 text-black" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm border border-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap font-mono"
          >
            <Home className="w-4 h-4 text-stone-300" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
