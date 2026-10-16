export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY';

export type GameMode = '1P_BOT' | '2P_PASS' | '3P_PASS' | '4P_PASS';

export type BoardTheme = 'wood' | 'emerald' | 'cosmic';

export type Language = 'bn' | 'en';

export interface Player {
  id: number;
  name: string;
  nameBn: string;
  color: string;
  colorName: string;
  colorNameBn: string;
  secondaryColor: string;
  badgeBg: string;
  isBot: boolean;
  position: number; // 0 = start yard, 1-100 on board
  targetPosition: number;
  isMoving: boolean;
  isScreaming?: boolean;
  isSlidingInSnake?: boolean;
  hasPoopSplat?: boolean;
  slideCoords?: { x: number; y: number } | null;
  isClimbingLadder?: boolean;
  climbCoords?: { x: number; y: number } | null;
  runCycleFrame?: number;
  stomachBulge?: { x: number; y: number; progress: number } | null;
  stats: {
    rolls: number;
    sixes: number;
    laddersClimbed: number;
    snakesBitten: number;
  };
}

export interface Snake {
  head: number;
  tail: number;
  name?: string;
  color?: string;
}

export interface Ladder {
  bottom: number;
  top: number;
}

export interface GameRules {
  exact100: boolean; // Must reach 100 exactly (or bounce back if roll is higher)
  extraTurnOnSix: boolean; // Rolling 6 gives an extra roll
  maxConsecutiveSixes: number; // 3 sixes forfeits extra roll
  fastAnimation: boolean;
}

export interface MoveLogItem {
  id: string;
  timestamp: number;
  playerId: number;
  playerName: string;
  roll: number;
  fromPos: number;
  toPos: number;
  event?: 'ladder' | 'snake' | 'win' | 'extraTurn' | 'bounce';
  textBn: string;
  textEn: string;
}
