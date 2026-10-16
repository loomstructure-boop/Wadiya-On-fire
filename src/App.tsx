/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  GameMode,
  BoardTheme,
  Language,
  Player,
  GameRules,
  MoveLogItem,
} from './types/game';
import {
  SNAKES,
  LADDERS,
  getCellCoordinates,
  generateSnakeGeometry,
  getSnakePointAt,
  generateLadderGeometry,
} from './utils/boardData';
import { sound } from './utils/audio';
import { TitleScreen } from './components/TitleScreen';
import { Board } from './components/Board';
import { HUD } from './components/HUD';
import { ControlPanel } from './components/ControlPanel';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';

// Player presets (English Only)
const PLAYER_CONFIGS = [
  {
    id: 1,
    name: 'Player 1',
    nameBn: 'Player 1',
    color: '#ef4444', // Red
    colorName: 'Red',
    colorNameBn: 'Red',
    secondaryColor: '#991b1b',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
  {
    id: 2,
    name: 'Player 2',
    nameBn: 'Player 2',
    color: '#06b6d4', // Cyan
    colorName: 'Cyan',
    colorNameBn: 'Cyan',
    secondaryColor: '#0891b2',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    id: 3,
    name: 'Player 3',
    nameBn: 'Player 3',
    color: '#f59e0b', // Gold Amber
    colorName: 'Amber',
    colorNameBn: 'Amber',
    secondaryColor: '#b45309',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 4,
    name: 'Player 4',
    nameBn: 'Player 4',
    color: '#a855f7', // Purple
    colorName: 'Purple',
    colorNameBn: 'Purple',
    secondaryColor: '#7e22ce',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [gameMode, setGameMode] = useState<GameMode>('1P_BOT');
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('wood');
  const [lang] = useState<Language>('en');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted());

  const [rules, setRules] = useState<GameRules>({
    exact100: true,
    extraTurnOnSix: true,
    maxConsecutiveSixes: 3,
    fastAnimation: false,
  });

  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [consecutiveSixes, setConsecutiveSixes] = useState(0);
  const [recentLogs, setRecentLogs] = useState<MoveLogItem[]>([]);
  const [activeFireSnakeHead, setActiveFireSnakeHead] = useState<number | null>(null);
  const [fireBurstOrigin, setFireBurstOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState(false);

  const [bannerMessage, setBannerMessage] = useState<{
    text: string;
    type: 'info' | 'ladder' | 'snake' | 'six';
  } | null>(null);

  const [winner, setWinner] = useState<Player | null>(null);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showBanner = (
    text: string,
    type: 'info' | 'ladder' | 'snake' | 'six' = 'info',
    duration = 3200
  ) => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setBannerMessage({ text, type });
    bannerTimerRef.current = setTimeout(() => {
      setBannerMessage(null);
    }, duration);
  };

  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const initGame = useCallback((mode: GameMode, theme: BoardTheme) => {
    sound.initContext();
    sound.playClick();

    let count = 2;
    let hasBot = false;

    if (mode === '1P_BOT') {
      count = 2;
      hasBot = true;
    } else if (mode === '2P_PASS') {
      count = 2;
    } else if (mode === '3P_PASS') {
      count = 3;
    } else if (mode === '4P_PASS') {
      count = 4;
    }

    const newPlayers: Player[] = Array.from({ length: count }).map((_, idx) => {
      const cfg = PLAYER_CONFIGS[idx];
      const isBot = hasBot && idx === 1;
      return {
        id: cfg.id,
        name: isBot ? 'Robo Bot' : cfg.name,
        nameBn: isBot ? 'Robo Bot' : cfg.name,
        color: cfg.color,
        colorName: cfg.colorName,
        colorNameBn: cfg.colorName,
        secondaryColor: cfg.secondaryColor,
        badgeBg: cfg.badgeBg,
        isBot,
        position: 1,
        targetPosition: 1,
        isMoving: false,
        isScreaming: false,
        isSlidingInSnake: false,
        isClimbingLadder: false,
        climbCoords: null,
        hasPoopSplat: false,
        runCycleFrame: 0,
        stomachBulge: null,
        stats: {
          rolls: 0,
          sixes: 0,
          laddersClimbed: 0,
          snakesBitten: 0,
        },
      };
    });

    setPlayers(newPlayers);
    setActivePlayerIndex(0);
    setDiceValue(Math.floor(Math.random() * 6) + 1);
    setIsRolling(false);
    setIsMoving(false);
    setConsecutiveSixes(0);
    setRecentLogs([]);
    setWinner(null);
    setBannerMessage(null);
    setActiveFireSnakeHead(null);
    setFireBurstOrigin(null);
    setGameState('PLAYING');
  }, []);

  // Animate human runner jogging step-by-step, climbing ladder rung-by-rung, and the slow digestion sequence
  const animatePlayerMovement = async (
    playerIdx: number,
    startPos: number,
    endPos: number
  ) => {
    setIsMoving(true);
    const stepDelay = 250;

    const path: number[] = [];
    if (endPos > startPos) {
      for (let p = startPos + 1; p <= endPos; p++) path.push(p);
    } else {
      for (let p = startPos + 1; p <= 100; p++) path.push(p);
      for (let p = 99; p >= endPos; p--) path.push(p);
    }

    let gaitFrame = 0;
    for (const step of path) {
      gaitFrame++;
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === playerIdx
            ? { ...p, position: step, isMoving: true, runCycleFrame: gaitFrame }
            : p
        )
      );
      sound.playStep();
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
    }

    setPlayers((prev) =>
      prev.map((p, idx) => (idx === playerIdx ? { ...p, isMoving: false } : p))
    );

    let currentLandedPos = endPos;

    // 1. Check Ladder: RUNG-BY-RUNG Climbing Animation!
    const ladder = LADDERS.find((l) => l.bottom === currentLandedPos);
    if (ladder) {
      showBanner(
        `🪜 CLIMBING LADDER! (${ladder.bottom} → ${ladder.top})`,
        'ladder',
        2500
      );

      const ladderGeom = generateLadderGeometry(ladder.bottom, ladder.top);
      const rungs = ladderGeom.rungs;

      // Climb through each rung step-by-step
      for (let rIdx = 0; rIdx < rungs.length; rIdx++) {
        const rung = rungs[rIdx];
        const rungCenterX = (rung.left.x + rung.right.x) / 2;
        const rungCenterY = (rung.left.y + rung.right.y) / 2;

        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === playerIdx
              ? {
                  ...p,
                  isClimbingLadder: true,
                  climbCoords: { x: rungCenterX, y: rungCenterY },
                  runCycleFrame: rIdx,
                }
              : p
          )
        );

        sound.playLadderRungStep(rIdx);
        await new Promise((resolve) => setTimeout(resolve, 190));
      }

      // Step off ladder onto top cell
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === playerIdx
            ? {
                ...p,
                position: ladder.top,
                isClimbingLadder: false,
                climbCoords: null,
                stats: {
                  ...p.stats,
                  laddersClimbed: p.stats.laddersClimbed + 1,
                },
              }
            : p
        )
      );
      currentLandedPos = ladder.top;
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    // 2. Check Snake Bite:
    // Fire burst particles + Bengali speech line + slow digestion
    const snake = SNAKES.find((s) => s.head === currentLandedPos);
    if (snake) {
      const snakeGeom = generateSnakeGeometry(snake.head, snake.tail);

      // Phase A: Fire particle burst overlay + screen shake + striking snake head
      setActiveFireSnakeHead(snake.head);
      setFireBurstOrigin({ x: snakeGeom.head.centerX, y: snakeGeom.head.centerY });
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 460);
      sound.playFireBlast();

      // Clear voice line in Bengali: "আল্লাহ! ওয়াদিয়া আগুন লাগিয়ে দিল!"
      sound.playWadiyaAgunVoice();

      // English Banner
      showBanner(
        `🔥 ALLAH! WADIYA ON FIRE! 😱`,
        'snake',
        3800
      );

      // Runner flails and screams
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === playerIdx ? { ...p, isScreaming: true } : p
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Phase B: SLOW DIGESTION inside the snake's belly!
      const totalSteps = 26;

      for (let s = 1; s <= totalSteps; s++) {
        const t = s / totalSteps;
        const pt = getSnakePointAt(snakeGeom, t);

        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === playerIdx
              ? {
                  ...p,
                  isSlidingInSnake: true,
                  slideCoords: pt,
                  stomachBulge: { x: pt.x, y: pt.y, progress: t },
                }
              : p
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 130));
      }

      // Phase C: Expulsion at the tail with comedic fart & poop splat!
      sound.playPoopSplat();
      setActiveFireSnakeHead(null);
      setFireBurstOrigin(null);

      showBanner(
        `💩 EXPELLED THROUGH THE REAR! (CELL ${snake.tail})`,
        'snake',
        2800
      );

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === playerIdx
            ? {
                ...p,
                position: snake.tail,
                isScreaming: false,
                isSlidingInSnake: false,
                slideCoords: null,
                stomachBulge: null,
                hasPoopSplat: true,
                stats: {
                  ...p.stats,
                  snakesBitten: p.stats.snakesBitten + 1,
                },
              }
            : p
        )
      );

      currentLandedPos = snake.tail;

      setTimeout(() => {
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === playerIdx ? { ...p, hasPoopSplat: false } : p
          )
        );
      }, 3500);

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setIsMoving(false);
    return currentLandedPos;
  };

  // Roll Dice Action
  const handleRoll = useCallback(async () => {
    if (isRolling || isMoving || gameState !== 'PLAYING') return;

    sound.initContext();
    setIsRolling(true);
    sound.playDiceShake();

    const rollDuration = 600;
    await new Promise((resolve) => setTimeout(resolve, rollDuration));

    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    setIsRolling(false);
    sound.playDiceLand(roll);

    const activePlayer = players[activePlayerIndex];
    if (!activePlayer) return;

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex
          ? {
              ...p,
              stats: {
                ...p.stats,
                rolls: p.stats.rolls + 1,
                sixes: roll === 6 ? p.stats.sixes + 1 : p.stats.sixes,
              },
            }
          : p
      )
    );

    const currentPos = activePlayer.position;
    let targetPos = currentPos + roll;
    let isBounced = false;

    if (rules.exact100 && targetPos > 100) {
      const excess = targetPos - 100;
      targetPos = 100 - excess;
      isBounced = true;
      showBanner(
        `BOUNCE BACK! RETURNED TO ${targetPos}`,
        'info',
        1800
      );
    }

    const finalPos = await animatePlayerMovement(activePlayerIndex, currentPos, targetPos);

    const logItem: MoveLogItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      playerId: activePlayer.id,
      playerName: activePlayer.name,
      roll,
      fromPos: currentPos,
      toPos: finalPos,
      event:
        finalPos === 100
          ? 'win'
          : roll === 6
          ? 'extraTurn'
          : isBounced
          ? 'bounce'
          : undefined,
      textBn: `${activePlayer.name}: ${currentPos} → ${finalPos}`,
      textEn: `${activePlayer.name}: ${currentPos} → ${finalPos}`,
    };

    setRecentLogs((prev) => [logItem, ...prev.slice(0, 9)]);

    if (finalPos === 100) {
      sound.playVictory();
      setWinner(activePlayer);
      setGameState('VICTORY');
      return;
    }

    // If rolled a 6, trigger fire celebration sparks at player location
    if (roll === 6) {
      const coords = getCellCoordinates(currentPos);
      setFireBurstOrigin({ x: coords.centerX, y: coords.centerY });
      setTimeout(() => setFireBurstOrigin(null), 800);
    }

    if (rules.extraTurnOnSix && roll === 6) {
      const newConsecutive = consecutiveSixes + 1;
      if (newConsecutive >= rules.maxConsecutiveSixes) {
        setConsecutiveSixes(0);
        setActivePlayerIndex((prev) => (prev + 1) % players.length);
      } else {
        setConsecutiveSixes(newConsecutive);
        showBanner(`🔥 ROLLED A 6! WADIYA ON FIRE! 🔥`, 'six', 2400);
      }
    } else {
      setConsecutiveSixes(0);
      setActivePlayerIndex((prev) => (prev + 1) % players.length);
    }
  }, [
    isRolling,
    isMoving,
    gameState,
    players,
    activePlayerIndex,
    rules,
    consecutiveSixes,
  ]);

  // Bot automation
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const activePlayer = players[activePlayerIndex];
    if (activePlayer && activePlayer.isBot && !isRolling && !isMoving && !winner) {
      const botTimer = setTimeout(() => {
        handleRoll();
      }, 850);
      return () => clearTimeout(botTimer);
    }
  }, [gameState, activePlayerIndex, players, isRolling, isMoving, winner, handleRoll]);

  // Keyboard shortcut: Space rolls dice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      sound.initContext();
      if (gameState === 'PLAYING') {
        if (e.code === 'Space') {
          const activePlayer = players[activePlayerIndex];
          if (activePlayer && !activePlayer.isBot && !isRolling && !isMoving) {
            e.preventDefault();
            handleRoll();
          }
        } else if (e.key === 'Escape') {
          setIsPauseOpen((prev) => !prev);
        } else if (e.key === 'm' || e.key === 'M') {
          handleToggleMute();
        }
      } else if (gameState === 'PAUSED' && e.key === 'Escape') {
        setIsPauseOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    activePlayerIndex,
    players,
    isRolling,
    isMoving,
    handleRoll,
    handleToggleMute,
  ]);

  const activePlayer = players[activePlayerIndex];
  const canRoll =
    gameState === 'PLAYING' &&
    !isRolling &&
    !isMoving &&
    activePlayer &&
    !activePlayer.isBot &&
    !winner;

  // Title Screen
  if (gameState === 'TITLE') {
    return (
      <TitleScreen
        onStart={(mode, theme) => {
          setGameMode(mode);
          setBoardTheme(theme);
          initGame(mode, theme);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        selectedMode={gameMode}
        onSelectMode={setGameMode}
      />
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-black text-stone-100 select-none">
      {/* 1. Sleek Minimal HUD (English Only) */}
      <HUD
        players={players}
        activePlayerIndex={activePlayerIndex}
        onPause={() => setIsPauseOpen(true)}
        onRestart={() => initGame(gameMode, boardTheme)}
        onHome={() => setGameState('TITLE')}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        bannerMessage={bannerMessage}
      />

      {/* Red impact screen flash */}
      {isScreenShaking && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-red-600/25 mix-blend-screen animate-pulse" />
      )}

      {/* 2. Main Arena: Board with Fire Particle Overlay + Control Console */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 py-1 sm:py-2 flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-5 overflow-y-auto">
        {/* Game Board Container with Screen Shake */}
        <div
          className={`w-full max-w-[560px] lg:max-w-[620px] flex-shrink-0 flex items-center justify-center transition-transform ${
            isScreenShaking ? 'animate-screen-shake' : ''
          }`}
        >
          <Board
            players={players}
            activePlayerIndex={activePlayerIndex}
            theme={boardTheme}
            lang={lang}
            highlightCell={
              canRoll ? null : activePlayer?.position ? activePlayer.position : null
            }
            activeFireSnakeHead={activeFireSnakeHead}
            fireBurstOrigin={fireBurstOrigin}
          />
        </div>

        {/* Side Control Cluster */}
        <div className="w-full max-w-[560px] lg:max-w-xs flex-shrink-0">
          <ControlPanel
            players={players}
            activePlayerIndex={activePlayerIndex}
            diceValue={diceValue}
            isRolling={isRolling}
            canRoll={canRoll}
            onRoll={handleRoll}
            recentLogs={recentLogs}
          />
        </div>
      </main>

      {/* 3. Victory Modal (English Only) */}
      {gameState === 'VICTORY' && winner && (
        <VictoryModal
          winner={winner}
          players={players}
          onPlayAgain={() => initGame(gameMode, boardTheme)}
          onMainMenu={() => setGameState('TITLE')}
        />
      )}

      {/* 4. Pause Modal (English Only) */}
      <PauseModal
        isOpen={isPauseOpen}
        onResume={() => setIsPauseOpen(false)}
        onRestart={() => {
          setIsPauseOpen(false);
          initGame(gameMode, boardTheme);
        }}
        onMainMenu={() => {
          setIsPauseOpen(false);
          setGameState('TITLE');
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </div>
  );
}
