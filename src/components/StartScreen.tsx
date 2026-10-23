interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_70%)] p-6 text-slate-100">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700/60 bg-slate-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-2xl shadow-lg shadow-rose-900/40">
            🧨
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Crumbling Maze
            </h1>
            <p className="text-sm text-slate-400">
              Every step is permanent. There is no going back.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-slate-300">
          <p>
            Navigate from the glowing{' '}
            <span className="font-semibold text-emerald-400">start tile</span> to
            the pulsing{' '}
            <span className="font-semibold text-amber-400">exit</span>. The
            instant you leave a tile, it collapses into the void behind you —
            it becomes a wall forever.
          </p>
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <h2 className="mb-2 font-semibold text-white">How to play</h2>
            <ul className="list-inside list-disc space-y-1.5 text-slate-300">
              <li>Move with the <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-xs">Arrow keys</kbd> / <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-xs">WASD</kbd>, or click a lit neighboring tile.</li>
              <li>There is no backtracking — the tile you leave crumbles immediately.</li>
              <li>Some branches dead-end. Walking into one with no way out ends the run.</li>
              <li>Exactly one true path exists through each maze. Look before you leap.</li>
              <li>Stuck? Burn a limited <span className="text-amber-300">Hint</span> to reveal your next safe step — but using fewer earns more stars.</li>
            </ul>
          </div>
          <p className="text-xs text-slate-500">
            Three hand-crafted mazes, growing larger and trickier. Plan the
            whole route before you take your first step.
          </p>
        </div>

        <button
          onClick={onStart}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-rose-900/40 transition hover:scale-[1.01] hover:shadow-rose-900/60 active:scale-[0.99]"
        >
          Begin the Maze
        </button>
      </div>
    </div>
  );
}
