import { WALL_BOTTOM, WALL_LEFT, WALL_RIGHT, WALL_TOP, type Coord, type LevelData } from './types';

export type Direction = 'up' | 'down' | 'left' | 'right';

const DIRECTION_VECTORS: Record<Direction, { dr: number; dc: number; wall: number }> = {
  up: { dr: -1, dc: 0, wall: WALL_TOP },
  right: { dr: 0, dc: 1, wall: WALL_RIGHT },
  down: { dr: 1, dc: 0, wall: WALL_BOTTOM },
  left: { dr: 0, dc: -1, wall: WALL_LEFT },
};

export function key(r: number, c: number): string {
  return `${r},${c}`;
}

export function inBounds(level: LevelData, r: number, c: number): boolean {
  return r >= 0 && r < level.rows && c >= 0 && c < level.cols;
}

/** Can the player step from (r,c) to the neighbor in `dir`? Checks bounds + wall only. */
export function canStep(level: LevelData, r: number, c: number, dir: Direction): boolean {
  const { dr, dc, wall } = DIRECTION_VECTORS[dir];
  const nr = r + dr;
  const nc = c + dc;
  if (!inBounds(level, nr, nc)) return false;
  if ((level.grid[r][c] & wall) !== 0) return false;
  return true;
}

export function stepTarget(r: number, c: number, dir: Direction): Coord {
  const { dr, dc } = DIRECTION_VECTORS[dir];
  return [r + dr, c + dc];
}

/** All 4 directions, used for rendering wall segments. */
export const ALL_DIRECTIONS: Direction[] = ['up', 'right', 'down', 'left'];

export function wallBit(dir: Direction): number {
  return DIRECTION_VECTORS[dir].wall;
}

/**
 * Returns the directions the player can currently move in from (r, c),
 * excluding any cell already collapsed (visited).
 */
export function availableMoves(
  level: LevelData,
  r: number,
  c: number,
  collapsed: Set<string>
): Direction[] {
  return ALL_DIRECTIONS.filter((dir) => {
    if (!canStep(level, r, c, dir)) return false;
    const [nr, nc] = stepTarget(r, c, dir);
    return !collapsed.has(key(nr, nc));
  });
}

/** Direction from cell `from` to an orthogonally-adjacent cell `to`. */
export function directionBetween(from: Coord, to: Coord): Direction | null {
  const dr = to[0] - from[0];
  const dc = to[1] - from[1];
  if (dr === -1 && dc === 0) return 'up';
  if (dr === 1 && dc === 0) return 'down';
  if (dr === 0 && dc === -1) return 'left';
  if (dr === 0 && dc === 1) return 'right';
  return null;
}

/**
 * Runtime BFS from `from` to the level's exit, only traveling through cells
 * that are not walled off and have not already collapsed. Used by the hint
 * system so a hint always reflects the *actual* remaining possibilities —
 * including correctly reporting when a wrong turn has made the exit
 * unreachable.
 */
export function findPathToExit(
  level: LevelData,
  from: Coord,
  collapsed: Set<string>
): Coord[] | null {
  const { end } = level;
  const startKey = key(from[0], from[1]);
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>([startKey]);
  const queue: Coord[] = [from];
  let qi = 0;

  while (qi < queue.length) {
    const [r, c] = queue[qi++];
    if (r === end[0] && c === end[1]) {
      // reconstruct path
      const path: Coord[] = [[r, c]];
      let k = key(r, c);
      while (cameFrom.has(k)) {
        k = cameFrom.get(k)!;
        const [pr, pc] = k.split(',').map(Number);
        path.unshift([pr, pc]);
      }
      return path;
    }
    for (const dir of ALL_DIRECTIONS) {
      if (!canStep(level, r, c, dir)) continue;
      const [nr, nc] = stepTarget(r, c, dir);
      const nk = key(nr, nc);
      if (visited.has(nk) || collapsed.has(nk)) continue;
      visited.add(nk);
      cameFrom.set(nk, key(r, c));
      queue.push([nr, nc]);
    }
  }
  return null;
}
