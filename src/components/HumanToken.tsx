import React from 'react';
import { Player } from '../types/game';

interface HumanTokenProps {
  player: Player;
  isActive: boolean;
  isMoving: boolean;
  isScreaming: boolean;
  isSlidingInSnake: boolean;
  isClimbingLadder: boolean;
  hasPoopSplat: boolean;
  runCycleFrame?: number;
  x: number;
  y: number;
}

export const HumanToken: React.FC<HumanTokenProps> = ({
  player,
  isActive,
  isMoving,
  isScreaming,
  isSlidingInSnake,
  isClimbingLadder,
  hasPoopSplat,
  runCycleFrame = 0,
  x,
  y,
}) => {
  const isAltGait = runCycleFrame % 2 === 0;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="select-none pointer-events-none transition-transform duration-75"
    >
      {/* 1. Screaming Speech Bubble ("ALLAH! WADIYA ON FIRE!") */}
      {isScreaming && (
        <g transform="translate(0, -56)" className="animate-bounce">
          <rect
            x="-105"
            y="-26"
            width="210"
            height="32"
            rx="10"
            fill="#b91c1c"
            stroke="#f59e0b"
            strokeWidth="2.5"
            filter="drop-shadow(0 6px 12px rgba(239,68,68,0.7))"
          />
          <polygon points="-8,6 8,6 0,15" fill="#b91c1c" />
          <text
            x="0"
            y="-5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="11"
            fontWeight="900"
            fontFamily="Outfit, sans-serif"
            letterSpacing="0.5"
          >
            🔥 ALLAH! WADIYA ON FIRE! 😱
          </text>
        </g>
      )}

      {/* 2. Poop Splat under human feet after expulsion */}
      {hasPoopSplat && (
        <g transform="translate(0, 16)">
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="#451a03" opacity="0.9" />
          <ellipse cx="-2" cy="0" rx="15" ry="6" fill="#78350f" opacity="0.9" />
          <circle cx="-14" cy="-4" r="4" fill="#78350f" />
          <circle cx="13" cy="3" r="4.5" fill="#78350f" />
          <circle cx="5" cy="-6" r="3" fill="#92400e" />
          <text x="18" y="-6" fontSize="18" textAnchor="middle">
            💩
          </text>
        </g>
      )}

      {/* 2.5 Fiery Sprint Flame Aura under runner's feet during movement */}
      {isMoving && (
        <g transform="translate(0, 16)">
          <ellipse cx="0" cy="0" rx="14" ry="4.5" fill="#f97316" opacity="0.65" />
          <polygon points="-6,0 0,-16 6,0" fill="#fef08a" opacity="0.85" className="animate-pulse" />
          <polygon points="-10,2 -5,-10 0,2" fill="#ef4444" opacity="0.7" />
          <polygon points="0,2 5,-10 10,2" fill="#ef4444" opacity="0.7" />
        </g>
      )}

      {/* 3. Real Cast Shadow */}
      <ellipse
        cx={isMoving ? (isAltGait ? 3 : -3) : 0}
        cy={18}
        rx={isMoving ? 9 : 13}
        ry={isMoving ? 3.5 : 5}
        fill="#000000"
        opacity="0.55"
      />

      {/* 4. Active player glowing arena ring */}
      {isActive && (
        <circle
          cx="0"
          cy="0"
          r="24"
          fill="none"
          stroke={player.color}
          strokeWidth="2.5"
          strokeDasharray="4 4"
          className="animate-spin"
          style={{ animationDuration: '4s', transformOrigin: '0 0' }}
        />
      )}

      {/* 5. Realistic Human Runner Model */}
      <g
        transform={
          isSlidingInSnake
            ? 'scale(0.85) rotate(45)'
            : isClimbingLadder
            ? 'scale(0.95)'
            : isMoving
            ? 'rotate(8)'
            : ''
        }
        style={{ transformOrigin: '0 6px' }}
      >
        {/* LEGS: Climbing or Running or Standing */}
        {isClimbingLadder ? (
          /* Ladder Climbing Legs (Knees stepping up onto rungs) */
          <g>
            {/* Left stepping leg */}
            <g transform={isAltGait ? 'rotate(-25, -2, 6)' : 'rotate(30, -2, 6)'}>
              <line x1="-2" y1="6" x2="-4" y2="13" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="-4" y1="13" x2="-6" y2="20" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="-7" cy="21" rx="4" ry="2" fill="#ffffff" stroke="#ef4444" strokeWidth="0.8" />
            </g>
            {/* Right stepping leg */}
            <g transform={isAltGait ? 'rotate(30, 2, 6)' : 'rotate(-25, 2, 6)'}>
              <line x1="2" y1="6" x2="5" y2="12" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="5" y1="12" x2="3" y2="19" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="4" cy="20" rx="4" ry="2" fill="#ffffff" stroke="#ef4444" strokeWidth="0.8" />
            </g>
          </g>
        ) : isMoving ? (
          /* Running Legs */
          <g>
            <g transform={isAltGait ? 'rotate(-28, -2, 6)' : 'rotate(32, -2, 6)'}>
              <line x1="-2" y1="6" x2="-4" y2="13" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="-4" y1="13" x2="-6" y2="20" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="-7" cy="21" rx="4" ry="2" fill="#ffffff" stroke="#ef4444" strokeWidth="0.8" />
            </g>
            <g transform={isAltGait ? 'rotate(36, 2, 6)' : 'rotate(-26, 2, 6)'}>
              <line x1="2" y1="6" x2="5" y2="12" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="5" y1="12" x2="3" y2="19" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="4" cy="20" rx="4" ry="2" fill="#ffffff" stroke="#ef4444" strokeWidth="0.8" />
            </g>
          </g>
        ) : (
          /* Standing Natural Posture */
          <g>
            <line x1="-3" y1="6" x2="-4" y2="13" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <line x1="-4" y1="13" x2="-4" y2="19" stroke="#fcd34d" strokeWidth="3.2" strokeLinecap="round" />
            <ellipse cx="-5" cy="20" rx="3.5" ry="2" fill="#ffffff" stroke="#334155" strokeWidth="0.8" />

            <line x1="3" y1="6" x2="4" y2="13" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <line x1="4" y1="13" x2="4" y2="19" stroke="#fcd34d" strokeWidth="3.2" strokeLinecap="round" />
            <ellipse cx="5" cy="20" rx="3.5" ry="2" fill="#ffffff" stroke="#334155" strokeWidth="0.8" />
          </g>
        )}

        {/* Hips & Running Shorts */}
        <path d="M -6 4 L 6 4 L 5 9 L -5 9 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="0.8" />

        {/* Torso: Athletic Runner's Tank */}
        <path d="M -7 -7 L 7 -7 L 6 4 L -6 4 Z" fill={player.color} stroke="#ffffff" strokeWidth="1.2" />

        {/* Chest Stripe & Player Number */}
        <rect x="-4" y="-5" width="8" height="6" rx="1.5" fill="#ffffff" opacity="0.95" />
        <text
          x="0"
          y="-0.5"
          textAnchor="middle"
          fontSize="6"
          fontWeight="900"
          fill="#000000"
          fontFamily="Outfit, sans-serif"
        >
          {player.id}
        </text>

        {/* ARMS: Climbing or Running or Screaming */}
        {isClimbingLadder ? (
          /* Climbing Arms Reaching Up for Rungs */
          <g stroke="#fcd34d" strokeWidth="3" strokeLinecap="round">
            {/* Left arm reaching high */}
            <line x1="-6" y1="-5" x2="-10" y2={isAltGait ? -18 : -10} />
            {/* Right arm reaching high */}
            <line x1="6" y1="-5" x2="10" y2={isAltGait ? -10 : -18} />
          </g>
        ) : isScreaming ? (
          /* Panic flailing */
          <g stroke={player.color} strokeWidth="3" strokeLinecap="round">
            <line x1="-6" y1="-5" x2="-12" y2="-16" />
            <line x1="6" y1="-5" x2="12" y2="-16" />
            <circle cx="-13" cy="-17" r="2" fill="#fcd34d" />
            <circle cx="13" cy="-17" r="2" fill="#fcd34d" />
          </g>
        ) : isMoving ? (
          /* Sprinting Arms */
          <g strokeWidth="3" strokeLinecap="round">
            <path
              d={isAltGait ? 'M -6 -5 L -12 -1 L -10 6' : 'M -6 -5 L -9 -11 L -4 -13'}
              stroke="#ca8a04"
              fill="none"
            />
            <path
              d={isAltGait ? 'M 6 -5 L 9 -11 L 4 -13' : 'M 6 -5 L 12 -1 L 10 6'}
              stroke="#fcd34d"
              fill="none"
            />
          </g>
        ) : (
          /* Resting arms */
          <g stroke="#fcd34d" strokeWidth="2.8" strokeLinecap="round">
            <line x1="-6" y1="-4" x2="-8" y2="3" />
            <line x1="6" y1="-4" x2="8" y2="3" />
          </g>
        )}

        {/* Neck */}
        <rect x="-2" y="-9" width="4" height="3" fill="#fcd34d" />

        {/* Head */}
        <circle cx="0" cy="-14" r="6" fill="#fcd34d" stroke="#d97706" strokeWidth="0.8" />

        {/* Sporty Hair */}
        <path d="M -6 -15 C -6 -21, 6 -21, 6 -15 C 4 -14, -4 -14, -6 -15 Z" fill="#1c1917" />
        <rect x="-6" y="-17" width="12" height="2.5" rx="1" fill={player.color} />

        {/* Face */}
        {isScreaming ? (
          <g>
            <circle cx="-2.5" cy="-14" r="1.6" fill="#ffffff" />
            <circle cx="-2.5" cy="-14" r="0.8" fill="#000000" />
            <circle cx="2.5" cy="-14" r="1.6" fill="#ffffff" />
            <circle cx="2.5" cy="-14" r="0.8" fill="#000000" />
            <ellipse cx="0" cy="-10.5" rx="3" ry="3.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.8" />
          </g>
        ) : (
          <g>
            <ellipse cx="-2.2" cy="-14" rx="1.2" ry="0.9" fill="#0f172a" />
            <ellipse cx="2.2" cy="-14" rx="1.2" ry="0.9" fill="#0f172a" />
            <line x1="-2" y1="-10.5" x2="2" y2="-10.5" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
      </g>
    </g>
  );
};
