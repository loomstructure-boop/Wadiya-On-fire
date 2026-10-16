import React, { useMemo } from 'react';
import { Player, BoardTheme, Language } from '../types/game';
import { HumanToken } from './HumanToken';
import { FireParticleOverlay } from './FireParticleOverlay';
import {
  BOARD_SIZE,
  CELL_SIZE,
  SNAKES,
  LADDERS,
  getCellCoordinates,
  generateSnakeGeometry,
  generateLadderGeometry,
} from '../utils/boardData';
import snakeSkinTexture from '../assets/images/realistic_snake_skin_1792160562887.jpg';

interface BoardProps {
  players: Player[];
  activePlayerIndex: number;
  theme: BoardTheme;
  lang: Language;
  highlightCell?: number | null;
  activeFireSnakeHead?: number | null;
  fireBurstOrigin?: { x: number; y: number } | null;
}

export const Board: React.FC<BoardProps> = ({
  players,
  activePlayerIndex,
  highlightCell,
  activeFireSnakeHead,
  fireBurstOrigin,
}) => {
  // Pre-calculate snake geometries
  const snakeGeometries = useMemo(() => {
    return SNAKES.map((s, idx) => ({
      ...s,
      id: `snake-${s.head}-${s.tail}-${idx}`,
      geom: generateSnakeGeometry(s.head, s.tail),
    }));
  }, []);

  // Pre-calculate ladder geometries
  const ladderGeometries = useMemo(() => {
    return LADDERS.map((l, idx) => ({
      ...l,
      id: `ladder-${l.bottom}-${l.top}-${idx}`,
      geom: generateLadderGeometry(l.bottom, l.top),
    }));
  }, []);

  // Board colors for "Wadiya on Fire"
  const styles = useMemo(() => {
    return {
      evenCell: '#18181b', // Dark zinc
      oddCell: '#09090b', // Deep obsidian black
      cellBorder: '#3f3f46',
      numColor: '#a1a1aa',
      accentColor: '#ef4444',
      goldColor: '#f59e0b',
    };
  }, []);

  // Compute token offsets if multiple players share the exact same cell
  const getPlayerTokenOffset = (player: Player) => {
    if (player.position === 0) return { offsetX: 0, offsetY: 0 };
    const playersOnSameCell = players.filter(
      (p) => p.position === player.position && p.position > 0
    );
    if (playersOnSameCell.length <= 1) return { offsetX: 0, offsetY: 0 };

    const idx = playersOnSameCell.findIndex((p) => p.id === player.id);
    const total = playersOnSameCell.length;
    const radius = 18;
    const angle = (idx / total) * 2 * Math.PI;

    return {
      offsetX: Math.cos(angle) * radius,
      offsetY: Math.sin(angle) * radius,
    };
  };

  // Real-time trailing fire origin behind moving runner or climbing player
  const trailOrigin = useMemo(() => {
    const movingPlayer = players.find((p) => p.isMoving || p.isClimbingLadder);
    if (!movingPlayer || movingPlayer.position === 0) return null;

    if (movingPlayer.isClimbingLadder && movingPlayer.climbCoords) {
      return movingPlayer.climbCoords;
    }
    const coords = getCellCoordinates(movingPlayer.position);
    const { offsetX, offsetY } = getPlayerTokenOffset(movingPlayer);
    return {
      x: coords.centerX + offsetX,
      y: coords.centerY + offsetY,
    };
  }, [players]);

  return (
    <div className="relative w-full aspect-square max-w-[650px] mx-auto select-none p-1.5 md:p-2.5 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-red-950 shadow-[0_15px_50px_rgba(220,38,38,0.4)]">
      {/* Outer Fiery Border Glow */}
      <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-red-800 shadow-[inset_0_0_25px_rgba(220,38,38,0.35)]">
        {/* Dynamic Fire Sparks & Runner Trailing Embers Particle Overlay */}
        <FireParticleOverlay
          burstOrigin={fireBurstOrigin || null}
          trailOrigin={trailOrigin || null}
        />

        <svg
          viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
          className="w-full h-full block"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Real Photographic Snake Scales Texture Pattern */}
            <pattern
              id="realPhotographicScales"
              patternUnits="userSpaceOnUse"
              width="60"
              height="60"
            >
              <image
                href={snakeSkinTexture}
                x="0"
                y="0"
                width="60"
                height="60"
                preserveAspectRatio="none"
              />
            </pattern>

            {/* 3D Timber Ladder Beam Shading - Uniform across all angles */}
            <linearGradient id="timberBeam3D" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="25%" stopColor="#78350f" />
              <stop offset="55%" stopColor="#b45309" />
              <stop offset="80%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* 3D Cylindrical Ladder Rung Shading */}
            <linearGradient id="timberRung3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="30%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Metallic Iron Bracket on Ladder */}
            <linearGradient id="ironBracket" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Realistic Snake Body Shading */}
            <linearGradient id="snakeShadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#1c1917" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>

            {/* Translucent Stomach Bulge Glow for Digestion View */}
            <radialGradient id="stomachBulgeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#f97316" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#dc2626" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
            </radialGradient>

            {/* Fire Blast Radial Flare */}
            <radialGradient id="fireBlastGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#dc2626" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </radialGradient>

            {/* Procedural Scaly Reptile Skin Texture Shader - Clipped strictly to SourceAlpha (No yellow bounding box) */}
            <filter id="proceduralScalyShader" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.08 0.16"
                numOctaves="2"
                result="scaleTurbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="scaleTurbulence"
                scale="3.2"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feComposite in="displaced" in2="SourceAlpha" operator="in" />
            </filter>

            <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.6" />
            </filter>
            <filter id="lavaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Grid Cells (1 to 100) - English Only */}
          {Array.from({ length: 100 }).map((_, i) => {
            const cellNum = i + 1;
            const coord = getCellCoordinates(cellNum);
            const isEven = (coord.col + coord.row) % 2 === 0;
            const isHighlight = highlightCell === cellNum;
            const isGoal = cellNum === 100;
            const isStart = cellNum === 1;

            return (
              <g key={`cell-${cellNum}`}>
                <rect
                  x={coord.left}
                  y={coord.top}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  fill={isEven ? styles.evenCell : styles.oddCell}
                  stroke={styles.cellBorder}
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                />

                {isHighlight && (
                  <rect
                    x={coord.left + 2}
                    y={coord.top + 2}
                    width={CELL_SIZE - 4}
                    height={CELL_SIZE - 4}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}

                {isGoal && (
                  <g transform={`translate(${coord.centerX}, ${coord.centerY})`}>
                    <circle r="36" fill="#ef4444" fillOpacity="0.25" />
                    <circle r="28" fill="#f59e0b" fillOpacity="0.35" />
                    <path
                      d="M -15 -4 L -11 -15 L -3 -7 L 3 -18 L 11 -7 L 15 -15 L 15 6 L -15 6 Z"
                      fill="#f59e0b"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                    <text
                      y="18"
                      textAnchor="middle"
                      fill="#f59e0b"
                      fontSize="10"
                      fontWeight="900"
                      fontFamily="Outfit, sans-serif"
                    >
                      FINISH 100
                    </text>
                  </g>
                )}

                {isStart && (
                  <g transform={`translate(${coord.centerX}, ${coord.centerY})`}>
                    <circle r="32" fill="#10b981" fillOpacity="0.2" />
                    <text
                      y="16"
                      textAnchor="middle"
                      fill="#10b981"
                      fontSize="9"
                      fontWeight="800"
                      fontFamily="Outfit, sans-serif"
                    >
                      START
                    </text>
                  </g>
                )}

                <text
                  x={coord.isLeftToRight ? coord.left + 8 : coord.left + CELL_SIZE - 8}
                  y={coord.top + 18}
                  textAnchor={coord.isLeftToRight ? 'start' : 'end'}
                  fontSize={isGoal || isStart ? '14' : '13'}
                  fontWeight="700"
                  fill={isGoal ? '#f59e0b' : styles.numColor}
                  className="tabular-nums select-none"
                  fontFamily="Outfit, sans-serif"
                  opacity={isGoal ? '1' : '0.8'}
                >
                  {cellNum}
                </text>
              </g>
            );
          })}

          {/* 2. REALISTIC UNIFORM 3D LADDERS (Identical across all 9 ladders) */}
          <g id="realistic-ladders-layer" filter="url(#shadowFilter)">
            {ladderGeometries.map((l) => (
              <g key={l.id}>
                {/* Left Timber Rail - Base Shadow */}
                <line
                  x1={l.geom.leftRailStart.x + 1}
                  y1={l.geom.leftRailStart.y + 1.5}
                  x2={l.geom.leftRailEnd.x + 1}
                  y2={l.geom.leftRailEnd.y + 1.5}
                  stroke="#1c1917"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                {/* Left Timber Rail - Main Body */}
                <line
                  x1={l.geom.leftRailStart.x}
                  y1={l.geom.leftRailStart.y}
                  x2={l.geom.leftRailEnd.x}
                  y2={l.geom.leftRailEnd.y}
                  stroke="url(#timberBeam3D)"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                />
                {/* Left Timber Rail - Top Bevel Highlight */}
                <line
                  x1={l.geom.leftRailStart.x - 0.8}
                  y1={l.geom.leftRailStart.y - 0.8}
                  x2={l.geom.leftRailEnd.x - 0.8}
                  y2={l.geom.leftRailEnd.y - 0.8}
                  stroke="#fde68a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.5"
                />

                {/* Right Timber Rail - Base Shadow */}
                <line
                  x1={l.geom.rightRailStart.x + 1}
                  y1={l.geom.rightRailStart.y + 1.5}
                  x2={l.geom.rightRailEnd.x + 1}
                  y2={l.geom.rightRailEnd.y + 1.5}
                  stroke="#1c1917"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                {/* Right Timber Rail - Main Body */}
                <line
                  x1={l.geom.rightRailStart.x}
                  y1={l.geom.rightRailStart.y}
                  x2={l.geom.rightRailEnd.x}
                  y2={l.geom.rightRailEnd.y}
                  stroke="url(#timberBeam3D)"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                />
                {/* Right Timber Rail - Top Bevel Highlight */}
                <line
                  x1={l.geom.rightRailStart.x - 0.8}
                  y1={l.geom.rightRailStart.y - 0.8}
                  x2={l.geom.rightRailEnd.x - 0.8}
                  y2={l.geom.rightRailEnd.y - 0.8}
                  stroke="#fde68a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.5"
                />

                {/* Cast Iron End Caps with Rivets */}
                <circle cx={l.geom.leftRailStart.x} cy={l.geom.leftRailStart.y} r="4.5" fill="url(#ironBracket)" />
                <circle cx={l.geom.leftRailStart.x} cy={l.geom.leftRailStart.y} r="1.3" fill="#000000" />
                <circle cx={l.geom.rightRailStart.x} cy={l.geom.rightRailStart.y} r="4.5" fill="url(#ironBracket)" />
                <circle cx={l.geom.rightRailStart.x} cy={l.geom.rightRailStart.y} r="1.3" fill="#000000" />
                <circle cx={l.geom.leftRailEnd.x} cy={l.geom.leftRailEnd.y} r="4.5" fill="url(#ironBracket)" />
                <circle cx={l.geom.leftRailEnd.x} cy={l.geom.leftRailEnd.y} r="1.3" fill="#000000" />
                <circle cx={l.geom.rightRailEnd.x} cy={l.geom.rightRailEnd.y} r="4.5" fill="url(#ironBracket)" />
                <circle cx={l.geom.rightRailEnd.x} cy={l.geom.rightRailEnd.y} r="1.3" fill="#000000" />

                {/* Uniform Cylindrical Rungs with Bolts */}
                {l.geom.rungs.map((rung, rIdx) => (
                  <g key={`rung-${l.id}-${rIdx}`}>
                    {/* Shadow underneath */}
                    <line
                      x1={rung.left.x}
                      y1={rung.left.y + 2}
                      x2={rung.right.x}
                      y2={rung.right.y + 2}
                      stroke="#000000"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    {/* Main Rung */}
                    <line
                      x1={rung.left.x}
                      y1={rung.left.y}
                      x2={rung.right.x}
                      y2={rung.right.y}
                      stroke="url(#timberRung3D)"
                      strokeWidth="4.6"
                      strokeLinecap="round"
                    />
                    {/* Top Highlight Sheen */}
                    <line
                      x1={rung.left.x}
                      y1={rung.left.y - 1}
                      x2={rung.right.x}
                      y2={rung.right.y - 1}
                      stroke="#fef3c7"
                      strokeWidth="1"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                    {/* Iron Mounting Bracket Joint */}
                    <circle cx={rung.left.x} cy={rung.left.y} r="2.2" fill="url(#ironBracket)" />
                    <circle cx={rung.left.x} cy={rung.left.y} r="0.7" fill="#000000" />
                    <circle cx={rung.right.x} cy={rung.right.y} r="2.2" fill="url(#ironBracket)" />
                    <circle cx={rung.right.x} cy={rung.right.y} r="0.7" fill="#000000" />
                  </g>
                ))}
              </g>
            ))}
          </g>

          {/* 3. ULTRA-REALISTIC TEXTURED SNAKES with Procedural Scaly Skin Shader & Dynamic Reactive Segments */}
          <g id="realistic-snakes-layer">
            {snakeGeometries.map((s, idx) => {
              const isFireActive = activeFireSnakeHead === s.head;

              const swallowedPlayer = players.find(
                (p) => p.isSlidingInSnake && p.stomachBulge
              );

              // Detect if any player is actively moving, running, or sliding in this snake
              const isReactingToMovement =
                players.some((p) => p.isMoving || p.isClimbingLadder) ||
                Boolean(swallowedPlayer);

              return (
                <g key={s.id}>
                  {/* Heavy Cast Shadow under snake body */}
                  <path
                    d={s.geom.path}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="24"
                    strokeLinecap="round"
                    opacity="0.7"
                    transform="translate(4, 6)"
                  />

                  {/* Procedural Scaly Texture Base Layer */}
                  <path
                    d={s.geom.path}
                    fill="none"
                    stroke={idx % 2 === 0 ? '#18181b' : '#3f0f0f'}
                    strokeWidth="21"
                    strokeLinecap="round"
                    filter="url(#proceduralScalyShader)"
                  />

                  {/* Real Photographic Reptile Scales Overlay */}
                  <path
                    d={s.geom.path}
                    fill="none"
                    stroke="url(#realPhotographicScales)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    opacity="0.9"
                  />

                  {/* 3D Cylindrical Volume Shading */}
                  <path
                    d={s.geom.path}
                    fill="none"
                    stroke="url(#snakeShadowGradient)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    opacity="0.75"
                  />

                  {/* Dynamic Reactive Ventral Scale Bands (Gastrosteges) that slither & contract on movement */}
                  <path
                    d={s.geom.path}
                    fill="none"
                    stroke="#3b0707"
                    strokeWidth="19"
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                    className={
                      isReactingToMovement
                        ? 'animate-scale-slither-active'
                        : 'animate-scale-slither-idle'
                    }
                    opacity="0.65"
                  />

                  {/* Dynamic Dorsal Spine Scales with Ember Crimson Sheen reacting to movement (Zero yellow) */}
                  <path
                    d={s.geom.path}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3.2"
                    strokeDasharray="5 12"
                    strokeLinecap="round"
                    className={`animate-scale-sheen ${
                      isReactingToMovement
                        ? 'animate-scale-slither-active'
                        : 'animate-scale-slither-idle'
                    }`}
                    opacity="0.85"
                  />

                  {/* VISIBLE STOMACH BULGE */}
                  {swallowedPlayer &&
                    swallowedPlayer.stomachBulge &&
                    swallowedPlayer.slideCoords && (
                      <g
                        transform={`translate(${swallowedPlayer.stomachBulge.x}, ${swallowedPlayer.stomachBulge.y})`}
                      >
                        <ellipse
                          rx="26"
                          ry="18"
                          fill="url(#stomachBulgeGlow)"
                          className="animate-pulse"
                        />
                        <g opacity="0.85" transform="scale(0.85) rotate(45)">
                          <ellipse rx="10" ry="6" fill="#fb7185" />
                          <circle cx="-5" cy="-8" r="4.5" fill="#fb7185" />
                          <line x1="-3" y1="2" x2="6" y2="10" stroke="#0f172a" strokeWidth="2.8" />
                          <line x1="3" y1="2" x2="-6" y2="10" stroke="#0f172a" strokeWidth="2.8" />
                        </g>
                      </g>
                    )}

                  {/* REALISTIC COBRA HEAD */}
                  <g
                    transform={`translate(${s.geom.head.centerX}, ${s.geom.head.centerY}) rotate(${s.geom.headAngle})`}
                  >
                    <path
                      d="M -16 0 C -12 -20, 14 -24, 20 0 C 14 24, -12 20, -16 0 Z"
                      fill="#1e1e24"
                      stroke="#ef4444"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M -16 0 C -12 -20, 14 -24, 20 0 C 14 24, -12 20, -16 0 Z"
                      fill="url(#realPhotographicScales)"
                      opacity="0.6"
                    />

                    {/* Dark metallic head scales (No yellow dots) */}
                    <ellipse cx="7" cy="-7" rx="3.5" ry="5.5" fill="#27272a" stroke="#450a0a" strokeWidth="0.8" opacity="0.9" />
                    <ellipse cx="7" cy="7" rx="3.5" ry="5.5" fill="#27272a" stroke="#450a0a" strokeWidth="0.8" opacity="0.9" />
                    <circle cx="7" cy="-7" r="1.8" fill="#000000" />
                    <circle cx="7" cy="7" r="1.8" fill="#000000" />

                    <polygon
                      points={isFireActive ? '-22,0 2,-16 18,-9 20,0 18,9 2,16' : '-17,0 0,-12 15,-8 18,0 15,8 0,12'}
                      fill={idx % 2 === 0 ? '#111827' : '#450a0a'}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />

                    <polygon points="-15,-4 -24,-7 -17,0" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                    <polygon points="-15,4 -24,7 -17,0" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />

                    {/* Eyes with periodic flare */}
                    <g
                      className="animate-snake-eye-flare"
                      style={{ animationDelay: `${(idx * 0.9) % 3.6}s` }}
                    >
                      <circle cx="-3" cy="-7.5" r="3.4" fill="#ef4444" filter="url(#lavaGlow)" />
                      <ellipse cx="-3" cy="-7.5" rx="0.7" ry="2.6" fill="#000000" />
                      <circle cx="-3.8" cy="-8.5" r="0.8" fill="#ffffff" />

                      <circle cx="-3" cy="7.5" r="3.4" fill="#ef4444" filter="url(#lavaGlow)" />
                      <ellipse cx="-3" cy="7.5" rx="0.7" ry="2.6" fill="#000000" />
                      <circle cx="-3.8" cy="6.5" r="0.8" fill="#ffffff" />
                    </g>

                    {/* Forked Fire Tongue */}
                    <path
                      d="M -16 0 L -27 -4.5 M -16 0 L -27 4.5 M -10 0 L -16 0"
                      stroke="#f97316"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* PERIODIC IDLE FIRE-BREATHING ANIMATION (Wadiya on Fire theme) */}
                    {!isFireActive && (
                      <g
                        className="animate-idle-fire-breath pointer-events-none"
                        style={{
                          animationDelay: `${(idx * 0.9) % 3.6}s`,
                          transformOrigin: '-16px 0px',
                        }}
                      >
                        {/* Core Flame Jet */}
                        <path
                          d="M -16 0 C -24 -7, -36 -9, -44 0 C -36 9, -24 7, -16 0 Z"
                          fill="url(#fireBlastGlow)"
                          opacity="0.95"
                        />
                        {/* White-Hot Core Lick */}
                        <path
                          d="M -16 0 C -22 -3.5, -30 -4, -36 0 C -30 4, -22 3.5, -16 0 Z"
                          fill="#ffffff"
                          opacity="0.9"
                        />
                        {/* Upper Flame Flicker */}
                        <path
                          d="M -22 -2 L -40 -10 L -30 0 Z"
                          fill="#f97316"
                        />
                        {/* Lower Flame Flicker */}
                        <path
                          d="M -22 2 L -40 10 L -30 0 Z"
                          fill="#f97316"
                        />
                        {/* Emitting Sparks */}
                        <circle cx="-42" cy="-6" r="1.6" fill="#fef08a" />
                        <circle cx="-45" cy="5" r="1.8" fill="#facc15" />
                        <circle cx="-50" cy="0" r="1.4" fill="#ffffff" />
                      </g>
                    )}
                  </g>

                  {/* FIRE ERUPTION BLAST EFFECT */}
                  {isFireActive && (
                    <g transform={`translate(${s.geom.head.centerX}, ${s.geom.head.centerY})`}>
                      <circle
                        r="55"
                        fill="url(#fireBlastGlow)"
                        className="animate-ping"
                        style={{ animationDuration: '0.6s' }}
                      />
                      {[-35, -20, 0, 20, 35].map((angle, sparkIdx) => (
                        <g key={`spark-${sparkIdx}`} transform={`rotate(${angle})`}>
                          <path
                            d="M 0 0 L 42 -8 L 32 0 L 46 8 Z"
                            fill="#f59e0b"
                            className="animate-pulse"
                          />
                        </g>
                      ))}
                    </g>
                  )}

                  <circle
                    cx={s.geom.tail.centerX}
                    cy={s.geom.tail.centerY}
                    r="5"
                    fill="#ef4444"
                  />
                </g>
              );
            })}
          </g>

          {/* 4. Realistic Human Runner Tokens Layer */}
          <g id="human-tokens-layer">
            {players.map((player, pIdx) => {
              if (player.position === 0) return null;

              let posX: number;
              let posY: number;

              if (player.isSlidingInSnake && player.slideCoords) {
                posX = player.slideCoords.x;
                posY = player.slideCoords.y;
              } else if (player.isClimbingLadder && player.climbCoords) {
                posX = player.climbCoords.x;
                posY = player.climbCoords.y;
              } else {
                const coords = getCellCoordinates(player.position);
                const { offsetX, offsetY } = getPlayerTokenOffset(player);
                posX = coords.centerX + offsetX;
                posY = coords.centerY + offsetY;
              }

              const isActive = activePlayerIndex === pIdx;

              return (
                <HumanToken
                  key={`human-${player.id}`}
                  player={player}
                  isActive={isActive}
                  isMoving={player.isMoving}
                  isScreaming={!!player.isScreaming}
                  isSlidingInSnake={!!player.isSlidingInSnake}
                  isClimbingLadder={!!player.isClimbingLadder}
                  hasPoopSplat={!!player.hasPoopSplat}
                  runCycleFrame={player.runCycleFrame || 0}
                  x={posX}
                  y={posY}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
