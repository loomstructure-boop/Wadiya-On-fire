import React from 'react';
import { motion } from 'motion/react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
  accentColor?: string;
  theme?: string;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  onRoll,
  accentColor = '#f59e0b',
}) => {
  // Dot layout coordinates for 1 to 6
  const renderPips = (val: number) => {
    switch (val) {
      case 1:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <div className="col-start-2 row-start-2 w-3.5 h-3.5 rounded-full bg-red-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5 place-items-center">
            <div className="col-start-1 row-start-1 w-3 h-3 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-3 w-3 h-3 rounded-full bg-stone-900 shadow-inner" />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5 place-items-center">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-2 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-2 row-start-2 w-2.5 h-2.5 rounded-full bg-red-600 shadow-inner" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
          </div>
        );
      case 6:
      default:
        return (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 place-items-center">
            <div className="col-start-1 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-1 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-1 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-2 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-1 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
            <div className="col-start-3 row-start-3 w-2.5 h-2.5 rounded-full bg-stone-900 shadow-inner" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <motion.button
        type="button"
        onClick={onRoll}
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.06, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.94, y: 1 }}
        className={`relative group w-20 h-20 md:w-22 md:h-22 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
          disabled
            ? 'opacity-60 cursor-not-allowed filter grayscale-[0.3]'
            : 'hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400'
        }`}
        style={{
          perspective: '600px',
        }}
        title={disabled ? 'অপেক্ষা করুন / Waiting...' : 'ক্লিক করুন বা স্পেস চাপুন (Click or Press Space)'}
      >
        {/* Shadow under dice */}
        <div
          className={`absolute -bottom-2 w-16 h-3 rounded-full bg-black/40 blur-[4px] transition-all duration-300 ${
            isRolling ? 'scale-75 opacity-25' : 'scale-100 opacity-60'
          }`}
        />

        {/* Dice Body with 3D bevel and specular gradient */}
        <motion.div
          animate={
            isRolling
              ? {
                  rotateX: [0, 180, 360, 540, 720],
                  rotateY: [0, 240, 480, 600, 720],
                  rotateZ: [0, 90, -90, 180, 0],
                  y: [-3, -22, -8, -18, 0],
                  scale: [1, 1.15, 0.95, 1.08, 1],
                }
              : {
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  y: 0,
                  scale: 1,
                }
          }
          transition={
            isRolling
              ? { duration: 0.55, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 400, damping: 25 }
          }
          className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/90 border-2 border-amber-200/80 shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden"
        >
          {renderPips(value)}
        </motion.div>

        {/* Rolling indicator ring */}
        {!disabled && !isRolling && (
          <div
            className="absolute inset-0 rounded-2xl border-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: accentColor }}
          />
        )}
      </motion.button>
    </div>
  );
};
