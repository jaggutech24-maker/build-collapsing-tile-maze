import type { MoveFeedback } from '../game/types';

interface HudProps {
  levelNumber: number;
  totalLevels: number;
  title: string;
  moves: number;
  hintsRemaining: number;
  hintBudget: number;
  onHint: () => void;
  canHint: boolean;
  feedback: MoveFeedback | null;
  onRestart: () => void;
}

const FEEDBACK_STYLES: Record<MoveFeedback['type'], string> = {
  blocked: 'bg-rose-950/80 border-rose-500 text-rose-200',
  collapsed: 'bg-rose-950/80 border-rose-500 text-rose-200',
  advance: 'bg-slate-800/90 border-sky-500 text-sky-100',
  hint: 'bg-amber-950/80 border-amber-400 text-amber-100',
  win: 'bg-emerald-950/80 border-emerald-400 text-emerald-100',
  trapped: 'bg-rose-950/90 border-rose-500 text-rose-100',
};

export default function Hud({
  levelNumber,
  totalLevels,
  title,
  moves,
  hintsRemaining,
  hintBudget,
  onHint,
  canHint,
  feedback,
  onRestart,
}: HudProps) {
  return (
    <div className="mx-auto mb-4 w-full max-w-[min(80vw,560px)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Level {levelNumber} / {totalLevels}
          </p>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-sm text-slate-200">
            Steps: <span className="font-mono font-semibold">{moves}</span>
          </div>
          <button
            onClick={onHint}
            disabled={!canHint}
            title="Reveal the next safe step. Uses a limited hint and lowers your star rating."
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
              canHint
                ? 'border-amber-400/60 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'cursor-not-allowed border-slate-700 bg-slate-800/50 text-slate-600'
            }`}
          >
            💡 Hint ({hintsRemaining}/{hintBudget})
          </button>
          <button
            onClick={onRestart}
            title="Restart this level from the beginning"
            className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
          >
            ↺ Restart
          </button>
        </div>
      </div>

      <div
        key={feedback?.id ?? 'none'}
        className={`min-h-[2.5rem] rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
          feedback ? FEEDBACK_STYLES[feedback.type] : 'border-transparent bg-transparent text-transparent'
        }`}
      >
        {feedback?.message ?? 'Plan your route carefully.'}
      </div>
    </div>
  );
}
