import { useMemo } from 'react';

function Stars({ count }: { count: number }) {
  return (
    <div className="flex justify-center gap-1 text-3xl">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={i <= count ? 'animate-[pop_0.4s_ease]' : 'opacity-20'}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.2 + Math.random() * 1.6,
        color: ['#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa'][i % 5],
        size: 6 + Math.random() * 6,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function OverlayShell({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'danger' | 'success' | 'gold';
}) {
  const ring =
    tone === 'danger'
      ? 'border-rose-500/50 shadow-rose-900/50'
      : tone === 'gold'
        ? 'border-amber-400/50 shadow-amber-900/50'
        : 'border-emerald-500/50 shadow-emerald-900/50';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border bg-slate-900/95 p-8 text-center shadow-2xl ${ring}`}
      >
        {children}
      </div>
    </div>
  );
}

export function TrappedOverlay({
  stepsTaken,
  onRetry,
  onRestartGame,
}: {
  stepsTaken: number;
  onRetry: () => void;
  onRestartGame: () => void;
}) {
  return (
    <OverlayShell tone="danger">
      <div className="mb-3 text-5xl">💥</div>
      <h2 className="mb-2 text-2xl font-bold text-rose-300">Trapped!</h2>
      <p className="mb-4 text-sm text-slate-300">
        Every tile around you has crumbled into the void. You survived{' '}
        <span className="font-semibold text-white">{stepsTaken}</span> steps
        before the maze closed in.
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={onRetry}
          className="rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Retry This Maze
        </button>
        <button
          onClick={onRestartGame}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
        >
          Restart Whole Game
        </button>
      </div>
    </OverlayShell>
  );
}

export function LevelCompleteOverlay({
  stars,
  moves,
  hintsUsed,
  isFinalLevel,
  onNext,
}: {
  stars: number;
  moves: number;
  hintsUsed: number;
  isFinalLevel: boolean;
  onNext: () => void;
}) {
  return (
    <OverlayShell tone="success">
      <Confetti />
      <div className="relative mb-2 text-5xl animate-[pop_0.3s_ease]">🏁</div>
      <h2 className="relative mb-1 text-2xl font-bold text-emerald-300">
        Maze Cleared!
      </h2>
      <p className="relative mb-3 text-sm text-slate-300">
        You reached the exit with no way back — a perfect, irreversible run.
      </p>
      <div className="relative mb-4">
        <Stars count={stars} />
      </div>
      <div className="relative mb-6 flex justify-center gap-6 text-sm text-slate-300">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Steps</div>
          <div className="font-mono text-lg font-semibold text-white">{moves}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Hints Used</div>
          <div className="font-mono text-lg font-semibold text-white">{hintsUsed}</div>
        </div>
      </div>
      <button
        onClick={onNext}
        className="relative w-full rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
      >
        {isFinalLevel ? 'See Final Results →' : 'Next Maze →'}
      </button>
    </OverlayShell>
  );
}

export function GameCompleteOverlay({
  totalStars,
  maxStars,
  totalMoves,
  totalHints,
  onRestartGame,
}: {
  totalStars: number;
  maxStars: number;
  totalMoves: number;
  totalHints: number;
  onRestartGame: () => void;
}) {
  return (
    <OverlayShell tone="gold">
      <Confetti />
      <div className="relative mb-2 text-6xl animate-[victory-pulse_1.4s_ease-in-out_infinite]">
        👑
      </div>
      <h2 className="relative mb-1 text-3xl font-extrabold text-amber-300">
        You Escaped Every Maze
      </h2>
      <p className="relative mb-4 text-sm text-slate-300">
        Three mazes. Zero backtracks. You planned every single step ahead of
        time.
      </p>
      <div className="relative mb-4">
        <Stars count={3} />
        <p className="mt-1 text-xs text-slate-400">
          Total rating: {totalStars} / {maxStars} stars
        </p>
      </div>
      <div className="relative mb-6 flex justify-center gap-6 text-sm text-slate-300">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Total Steps</div>
          <div className="font-mono text-lg font-semibold text-white">{totalMoves}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Hints Used</div>
          <div className="font-mono text-lg font-semibold text-white">{totalHints}</div>
        </div>
      </div>
      <button
        onClick={onRestartGame}
        className="relative w-full rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
      >
        Play Again
      </button>
    </OverlayShell>
  );
}
