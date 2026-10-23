import { useMemo } from 'react';
import type { Coord, LevelData } from '../game/types';
import { WALL_BOTTOM, WALL_LEFT, WALL_RIGHT, WALL_TOP } from '../game/types';
import { key } from '../game/maze';

interface MazeBoardProps {
  level: LevelData;
  position: Coord;
  collapsed: Set<string>;
  hintCell: Coord | null;
  shakeToken: number;
  onCellClick: (r: number, c: number) => void;
}

const WALL_COLOR = '#f8fafc';

export default function MazeBoard({
  level,
  position,
  collapsed,
  hintCell,
  shakeToken,
  onCellClick,
}: MazeBoardProps) {
  const { rows, cols, grid, start, end } = level;

  const adjacentKeys = useMemo(() => {
    const [r, c] = position;
    const set = new Set<string>();
    set.add(key(r - 1, c));
    set.add(key(r + 1, c));
    set.add(key(r, c - 1));
    set.add(key(r, c + 1));
    return set;
  }, [position]);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[min(80vw,560px)] select-none rounded-lg bg-slate-950 p-1 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      style={{
        // shake animation retriggers via key/token
      }}
    >
      <div
        key={shakeToken}
        className={shakeToken > 0 ? 'animate-[shake_0.35s_ease]' : ''}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: '100%',
          height: '100%',
          gap: 0,
        }}
      >
        {grid.map((row, r) =>
          row.map((mask, c) => {
            const k = key(r, c);
            const isCollapsed = collapsed.has(k);
            const isPlayer = position[0] === r && position[1] === c;
            const isStart = start[0] === r && start[1] === c;
            const isEnd = end[0] === r && end[1] === c;
            const isHint = hintCell ? hintCell[0] === r && hintCell[1] === c : false;
            const isReachable = !isPlayer && !isCollapsed && adjacentKeys.has(k);

            let bg = 'bg-slate-800/70';
            if (isCollapsed) bg = 'bg-slate-950';
            else if (isEnd) bg = 'bg-amber-900/40';
            else if (isStart && !isCollapsed) bg = 'bg-emerald-900/30';

            return (
              <button
                key={k}
                aria-label={`cell ${r} ${c}`}
                onClick={() => onCellClick(r, c)}
                disabled={!isReachable}
                className={`relative flex items-center justify-center transition-colors duration-150 ${bg} ${
                  isReachable ? 'cursor-pointer hover:bg-slate-700/70' : 'cursor-default'
                }`}
                style={{
                  borderTop: `3px solid ${(mask & WALL_TOP) !== 0 ? WALL_COLOR : 'transparent'}`,
                  borderRight: `3px solid ${(mask & WALL_RIGHT) !== 0 ? WALL_COLOR : 'transparent'}`,
                  borderBottom: `3px solid ${(mask & WALL_BOTTOM) !== 0 ? WALL_COLOR : 'transparent'}`,
                  borderLeft: `3px solid ${(mask & WALL_LEFT) !== 0 ? WALL_COLOR : 'transparent'}`,
                }}
              >
                {isCollapsed && (
                  <span className="absolute inset-0 flex items-center justify-center text-slate-700">
                    <CrackIcon />
                  </span>
                )}

                {isReachable && (
                  <span className="absolute inset-1 rounded-sm border-2 border-dashed border-sky-400/40" />
                )}

                {isHint && !isPlayer && (
                  <span className="absolute inset-0.5 animate-pulse rounded-sm bg-amber-400/30 ring-2 ring-amber-300" />
                )}

                {isEnd && !isPlayer && (
                  <span className="absolute h-[55%] w-[55%] animate-pulse rounded-sm bg-amber-400 shadow-[0_0_18px_4px_rgba(251,191,36,0.6)]" />
                )}

                {isStart && !isPlayer && !isCollapsed && (
                  <span className="absolute h-[35%] w-[35%] rounded-full bg-emerald-500/60" />
                )}

                {isPlayer && (
                  <span
                    key={`player-${k}`}
                    className="absolute h-[60%] w-[60%] animate-[pop_0.2s_ease] rounded-full bg-sky-400 shadow-[0_0_16px_4px_rgba(56,189,248,0.7)]"
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function CrackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full opacity-60" fill="none">
      <path
        d="M4 4 L11 11 L8 13 L14 19 M20 4 L13 11 L16 13 L10 20"
        stroke="#334155"
        strokeWidth="1.2"
      />
    </svg>
  );
}
