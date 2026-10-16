import { Snake, Ladder } from '../types/game';

export const BOARD_SIZE = 1000; // SVG internal coordinate system (0 to 1000)
export const CELL_SIZE = BOARD_SIZE / 10; // 100px per cell

// Standard Snakes on board
export const SNAKES: Snake[] = [
  { head: 17, tail: 7, color: '#ef4444' },
  { head: 54, tail: 34, color: '#f97316' },
  { head: 62, tail: 19, color: '#dc2626' },
  { head: 64, tail: 60, color: '#e11d48' },
  { head: 87, tail: 24, color: '#b91c1c' },
  { head: 93, tail: 73, color: '#ea580c' },
  { head: 95, tail: 75, color: '#c026d3' },
  { head: 99, tail: 78, color: '#991b1b' }, // Most dangerous snake!
];

// Standard Ladders on board
export const LADDERS: Ladder[] = [
  { bottom: 4, top: 14 },
  { bottom: 9, top: 31 },
  { bottom: 20, top: 38 },
  { bottom: 28, top: 84 }, // Mega ladder
  { bottom: 40, top: 59 },
  { bottom: 51, top: 67 },
  { bottom: 63, top: 81 },
  { bottom: 71, top: 91 },
  { bottom: 77, top: 96 },
];

/**
 * Returns center coordinates and cell bounds in the 1000x1000 SVG coordinate space.
 * Cell 1 is bottom-left (col 0, row 9 from top).
 * Cell 100 is top-left (col 0, row 0 from top).
 */
export function getCellCoordinates(cell: number) {
  if (cell < 1) cell = 1;
  if (cell > 100) cell = 100;

  const zeroIndex = cell - 1;
  const rowFromBottom = Math.floor(zeroIndex / 10);
  const rowFromTop = 9 - rowFromBottom;
  const colInRow = zeroIndex % 10;

  // Even rows from bottom (0, 2, 4, 6, 8) go Left -> Right
  // Odd rows from bottom (1, 3, 5, 7, 9) go Right -> Left
  const isLeftToRight = rowFromBottom % 2 === 0;
  const col = isLeftToRight ? colInRow : 9 - colInRow;

  const left = col * CELL_SIZE;
  const top = rowFromTop * CELL_SIZE;
  const centerX = left + CELL_SIZE / 2;
  const centerY = top + CELL_SIZE / 2;

  return {
    cell,
    col,
    row: rowFromTop,
    left,
    top,
    centerX,
    centerY,
    isLeftToRight,
  };
}

/**
 * Convert number to Bengali digits (e.g. 100 -> ১০০)
 */
export function toBengaliNum(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

/**
 * Generates an organic S-curved serpentine SVG path for a snake from head to tail.
 */
export function generateSnakeGeometry(headCell: number, tailCell: number) {
  const head = getCellCoordinates(headCell);
  const tail = getCellCoordinates(tailCell);

  const dx = tail.centerX - head.centerX;
  const dy = tail.centerY - head.centerY;
  const dist = Math.hypot(dx, dy);

  // Perpendicular vector for wave curves
  const perpX = -dy / dist;
  const perpY = dx / dist;

  // Control points creating an undulating snake curve
  const waveAmp = Math.min(60, dist * 0.22);
  const cp1X = head.centerX + dx * 0.28 + perpX * waveAmp;
  const cp1Y = head.centerY + dy * 0.28 + perpY * waveAmp;

  const cp2X = head.centerX + dx * 0.68 - perpX * waveAmp * 0.9;
  const cp2Y = head.centerY + dy * 0.68 - perpY * waveAmp * 0.9;

  // Snake head angle for eye and mouth alignment
  const headAngle = Math.atan2(cp1Y - head.centerY, cp1X - head.centerX) * (180 / Math.PI);

  const path = `M ${head.centerX} ${head.centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${tail.centerX} ${tail.centerY}`;

  return {
    head,
    tail,
    path,
    headAngle,
    dx,
    dy,
    dist,
    p0: { x: head.centerX, y: head.centerY },
    p1: { x: cp1X, y: cp1Y },
    p2: { x: cp2X, y: cp2Y },
    p3: { x: tail.centerX, y: tail.centerY },
  };
}

/**
 * Returns coordinate along the snake body curve for parameter t (0 = head, 1 = tail)
 */
export function getSnakePointAt(
  geom: ReturnType<typeof generateSnakeGeometry>,
  t: number
) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x =
    uuu * geom.p0.x +
    3 * uu * t * geom.p1.x +
    3 * u * tt * geom.p2.x +
    ttt * geom.p3.x;

  const y =
    uuu * geom.p0.y +
    3 * uu * t * geom.p1.y +
    3 * u * tt * geom.p2.y +
    ttt * geom.p3.y;

  return { x, y };
}

/**
 * Calculates ladder geometry: 2 side rails and rungs connecting bottom to top.
 */
export function generateLadderGeometry(bottomCell: number, topCell: number) {
  const bottom = getCellCoordinates(bottomCell);
  const top = getCellCoordinates(topCell);

  const dx = top.centerX - bottom.centerX;
  const dy = top.centerY - bottom.centerY;
  const dist = Math.hypot(dx, dy);

  // Standard uniform rail width across all ladders
  const railSpacing = 24; // px width between left and right rails
  const perpX = (-dy / dist) * (railSpacing / 2);
  const perpY = (dx / dist) * (railSpacing / 2);

  const leftRailStart = { x: bottom.centerX - perpX, y: bottom.centerY - perpY };
  const leftRailEnd = { x: top.centerX - perpX, y: top.centerY - perpY };

  const rightRailStart = { x: bottom.centerX + perpX, y: bottom.centerY + perpY };
  const rightRailEnd = { x: top.centerX + perpX, y: top.centerY + perpY };

  // Calculate uniform rungs spaced consistently ~32px apart
  const numRungs = Math.max(3, Math.floor(dist / 32));
  const rungs = [];

  for (let i = 1; i <= numRungs; i++) {
    const t = i / (numRungs + 1);
    const rungLeft = {
      x: leftRailStart.x + (leftRailEnd.x - leftRailStart.x) * t,
      y: leftRailStart.y + (leftRailEnd.y - leftRailStart.y) * t,
    };
    const rungRight = {
      x: rightRailStart.x + (rightRailEnd.x - rightRailStart.x) * t,
      y: rightRailStart.y + (rightRailEnd.y - rightRailStart.y) * t,
    };
    rungs.push({ left: rungLeft, right: rungRight });
  }

  return {
    bottom,
    top,
    leftRailStart,
    leftRailEnd,
    rightRailStart,
    rightRailEnd,
    rungs,
  };
}
