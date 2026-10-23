import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { music, setMuted, sfx } from "./sound";

// tile states
const WALL = 0, SOLID = 1, CRACK = 2, GONE = 3;

const DEAD_MEMES = [
  { e: "🔥🐶☕", t: "THIS IS FINE", b: "(it was not fine)" },
  { e: "🗿", t: "SKILL ISSUE", b: "git gud" },
  { e: "🤡", t: "TASK FAILED", b: "SUCCESSFULLY" },
  { e: "🐸☕", t: "BUT THAT'S", b: "NONE OF MY BUSINESS" },
  { e: "💀", t: "BRUH.", b: "you had ONE job" },
  { e: "🧍🕳️", t: "SIR, THIS IS A", b: "CRUMBLING MAZE" },
  { e: "😭🧀", t: "I WAS SO CLOSE", b: "the cheese knows" },
];
const WIN_MEMES = [
  { e: "😎🏆", t: "BIG BRAIN TIME", b: "200 IQ plays only" },
  { e: "🕺📈", t: "NOT STONKS?", b: "STONKS!!" },
  { e: "🐭👑", t: "ABSOLUTE", b: "CINEMA" },
];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function makeLevel(lv: number) {
  const n = Math.min(6 + lv, 11);
  const total = n * n;
  const target = total - 1;
  const minLen = Math.floor(n * 2.2);

  let solutionPath: number[] | null = null;
  for (let attempt = 0; attempt < 50; attempt++) {
    const visited = new Set<number>([0]);
    const path: number[] = [0];
    let curr = 0;

    while (curr !== target) {
      const cx = curr % n, cy = (curr / n) | 0;
      const validNeighbors: number[] = [];

      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        const nxt = ny * n + nx;
        if (nx >= 0 && ny >= 0 && nx < n && ny < n && !visited.has(nxt)) {
          if (nxt === target) {
            validNeighbors.push(nxt);
            continue;
          }
          // Fast BFS connectivity check through unvisited cells
          const q: number[] = [nxt];
          const reach = new Set<number>([nxt]);
          let canReach = false;
          while (q.length) {
            const cur = q.pop()!;
            if (cur === target) {
              canReach = true;
              break;
            }
            const x = cur % n, y = (cur / n) | 0;
            for (const [adx, ady] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
              const ax = x + adx, ay = y + ady;
              const anxt = ay * n + ax;
              if (ax >= 0 && ay >= 0 && ax < n && ay < n && !visited.has(anxt) && !reach.has(anxt)) {
                reach.add(anxt);
                q.push(anxt);
              }
            }
          }
          if (canReach) validNeighbors.push(nxt);
        }
      }

      if (validNeighbors.length === 0) break;

      let chosen: number;
      const nonTarget = validNeighbors.filter((v) => v !== target);
      if (path.length < minLen && nonTarget.length > 0) {
        chosen = nonTarget[(Math.random() * nonTarget.length) | 0];
      } else {
        chosen = validNeighbors[(Math.random() * validNeighbors.length) | 0];
      }

      visited.add(chosen);
      path.push(chosen);
      curr = chosen;
    }

    if (curr === target && path.length >= minLen) {
      solutionPath = path;
      break;
    }
  }

  // Fallback winding path if needed
  if (!solutionPath) {
    solutionPath = [];
    let x = 0, y = 0;
    while (x < n - 1 || y < n - 1) {
      solutionPath.push(y * n + x);
      if (x < n - 1 && (y === n - 1 || Math.random() < 0.5)) x++;
      else y++;
    }
    solutionPath.push(target);
  }

  // Build grid
  const tiles: number[] = Array(total).fill(WALL);
  for (const idx of solutionPath) tiles[idx] = SOLID;

  // Add clever decoy branches so it remains a thoughtful puzzle
  const branchSeeds = solutionPath.slice(1, -2);
  const branchCount = Math.min(3 + lv * 2, Math.floor(solutionPath.length * 0.45));
  for (let b = 0; b < branchCount; b++) {
    let cur = branchSeeds[(Math.random() * branchSeeds.length) | 0];
    const len = 1 + ((Math.random() * 2) | 0);
    for (let s = 0; s < len; s++) {
      const cx = cur % n, cy = (cur / n) | 0;
      const candidates: number[] = [];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        const nxt = ny * n + nx;
        if (nx >= 0 && ny >= 0 && nx < n && ny < n && tiles[nxt] === WALL) {
          candidates.push(nxt);
        }
      }
      if (candidates.length === 0) break;
      const pick = candidates[(Math.random() * candidates.length) | 0];
      tiles[pick] = SOLID;
      cur = pick;
    }
  }

  // Place coins along the verified solution path so EVERY coin has a guaranteed connecting path to the cheese
  const numCoins = Math.min(2 + lv, 7);
  const coins = new Set<number>();
  const eligible = solutionPath.slice(2, -2);
  if (eligible.length > 0) {
    const step = eligible.length / (numCoins + 1);
    for (let i = 1; i <= numCoins; i++) {
      const idx = Math.min(eligible.length - 1, Math.floor(i * step));
      coins.add(eligible[idx]);
    }
  }

  return { n, tiles, coins };
}

type Status = "play" | "dead" | "won";

export default function App() {
  const [level, setLevel] = useState(1);
  const [lv, setLv] = useState(() => makeLevel(1));
  const [tiles, setTiles] = useState<number[]>(lv.tiles);
  const [coins, setCoins] = useState(lv.coins);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<Status>("play");
  const [meme, setMeme] = useState(DEAD_MEMES[0]);
  const [bump, setBump] = useState(0);
  const [mute, setMute] = useState(false);
  const timers = useRef<number[]>([]);
  const { n } = lv;

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const load = useCallback((l: ReturnType<typeof makeLevel>) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLv(l);
    setTiles(l.tiles);
    setCoins(new Set(l.coins));
    setPos({ x: 0, y: 0 });
    setMoves(0);
    setStatus("play");
  }, []);

  const move = useCallback(
    (dx: number, dy: number) => {
      if (status !== "play") return;
      const nx = pos.x + dx, ny = pos.y + dy;
      const to = ny * n + nx, from = pos.y * n + pos.x;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || tiles[to] !== SOLID) {
        sfx.bump();
        setBump((b) => b + 1);
        return;
      }
      const next = tiles.slice();
      next[from] = CRACK;
      setTiles(next);
      setPos({ x: nx, y: ny });
      setMoves((m) => m + 1);
      sfx.step();
      later(() => {
        sfx.crumble();
        setTiles((t) => t.map((v, i) => (i === from && v === CRACK ? GONE : v)));
      }, 450);
      if (coins.has(to)) {
        sfx.coin();
        setScore((s) => s + 10);
        setCoins((c) => {
          const d = new Set(c);
          d.delete(to);
          return d;
        });
      }
      if (to === n * n - 1) {
        setMeme(pick(WIN_MEMES));
        setScore((s) => s + 50);
        later(() => {
          sfx.win();
          setStatus("won");
        }, 150);
        return;
      }
      const open = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => {
        const x = nx + a, y = ny + b;
        return x >= 0 && y >= 0 && x < n && y < n && next[y * n + x] === SOLID;
      });
      if (!open) {
        later(() => {
          sfx.fall();
          sfx.sadTrombone();
          setMeme(pick(DEAD_MEMES));
          setStatus("dead");
        }, 700);
      }
    },
    [status, pos, n, tiles, coins],
  );

  useEffect(() => {
    const keys: Record<string, [number, number]> = {
      ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1],
      ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0],
    };
    const h = (e: KeyboardEvent) => {
      const k = keys[e.key];
      if (k) {
        e.preventDefault();
        move(k[0], k[1]);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [move]);

  useEffect(() => {
    const startAudioOnFirstGesture = () => {
      if (!mute) {
        music.start();
      }
      window.removeEventListener("pointerdown", startAudioOnFirstGesture);
      window.removeEventListener("keydown", startAudioOnFirstGesture);
    };
    window.addEventListener("pointerdown", startAudioOnFirstGesture);
    window.addEventListener("keydown", startAudioOnFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", startAudioOnFirstGesture);
      window.removeEventListener("keydown", startAudioOnFirstGesture);
    };
  }, [mute]);

  const next = () => {
    setLevel((l) => l + 1);
    load(makeLevel(level + 1));
  };
  const toggleMute = () => {
    const nextMute = !mute;
    setMute(nextMute);
    setMuted(nextMute);
    if (!nextMute) {
      music.start();
    }
  };

  const pad = "h-16 w-16 rounded-2xl bg-white/10 text-3xl ring-1 ring-white/15 select-none touch-manipulation active:bg-[#E47CB8]/40";

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-3 py-5">
      <h1 className="font-display text-center text-4xl font-bold leading-none tracking-tight text-[#F0EFEB] sm:text-5xl">
        Crumbling Maze <span className="bob inline-block">🧀</span>
        <div className="mt-2 text-lg font-medium text-[#D8F878]">No Way Back</div>
      </h1>

      <div className="flex w-full items-center justify-between gap-2 text-lg font-extrabold">
        <span className="rounded-full bg-white/10 text-[#F0EFEB] backdrop-blur px-4 py-1">Level {level}</span>
        <span className="rounded-full bg-white/10 text-[#F0EFEB] backdrop-blur px-4 py-1">🪙 {score}</span>
        <span className="rounded-full bg-white/10 text-[#F0EFEB] backdrop-blur px-4 py-1">👣 {moves}</span>
        <button onClick={toggleMute} aria-label="Toggle sound" className="rounded-full bg-white/10 text-[#F0EFEB] backdrop-blur px-3 py-1">
          {mute ? "🔇" : "🔊"}
        </button>
      </div>

      <div key={bump} className={clsx("relative w-full rounded-3xl bg-[#001C3D]/60 p-2 ring-1 ring-white/15 backdrop-blur", bump > 0 && "board-bump")}>
        <div className="relative grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {tiles.map((t, i) => {
            const tx = i % n, ty = (i / n) | 0;
            const dx = tx - pos.x, dy = ty - pos.y;
            const isAdj = Math.abs(dx) + Math.abs(dy) === 1 && t === SOLID;
            return (
              <div
                key={i}
                onClick={() => isAdj && move(dx, dy)}
                className={clsx(
                  "relative aspect-square",
                  isAdj && "cursor-pointer transition-transform hover:scale-[1.04]",
                )}
              >
                {t === WALL && <div className="h-full w-full rounded-lg bg-white/5" />}
                {(t === SOLID || t === CRACK) && (
                  <div
                    className={clsx(
                      "flex h-full w-full items-center justify-center rounded-xl border-b-4 border-[#944880] bg-gradient-to-br from-[#F0EFEB] to-[#E47CB8] text-xl transition-colors",
                      isAdj && "ring-2 ring-[#D8F878]/60 hover:ring-[#D8F878]",
                      t === CRACK && "tile-crack",
                    )}
                  >
                    {coins.has(i) ? <span className="bob h-1/2 w-1/2 rounded-full bg-[#D8F878] ring-4 ring-[#001C3D]/30" /> : i === n * n - 1 ? <span className="bob">🧀</span> : ""}
                  </div>
                )}
                {t === GONE && <div className="tile-fall h-full w-full rounded-xl bg-[#E47CB8]" />}
              </div>
            );
          })}
          <div
            className="pointer-events-none absolute left-0 top-0 flex items-center justify-center text-2xl transition-transform duration-100 sm:text-3xl"
            style={{ width: `${100 / n}%`, height: `${100 / n}%`, transform: `translate(${pos.x * 100}%, ${pos.y * 100}%)` }}
          >
            {status === "dead" ? "😵" : "🐭"}
          </div>
        </div>

        {status !== "play" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#001C3D]/85 backdrop-blur-sm p-4 text-center">
            <div className="pop flex flex-col items-center gap-1">
              <div className="text-7xl">{meme.e}</div>
              <div className="meme-text text-3xl">{meme.t}</div>
              <div className="meme-text text-2xl">{meme.b}</div>
              {status === "won" && <div className="font-bold text-[#D8F878]">+50 cheese bonus!</div>}
            </div>
            <div className="flex gap-2">
              {status === "won" ? (
                <button onClick={next} className="rounded-xl bg-[#D8F878] px-5 py-2 font-display text-lg font-bold text-[#001C3D] hover:brightness-95">
                  Next level
                </button>
              ) : (
                <>
                  <button onClick={() => load(lv)} className="rounded-xl bg-[#D8F878] px-5 py-2 font-display text-lg font-bold text-[#001C3D] hover:brightness-95">
                    Retry same maze
                  </button>
                  <button onClick={() => load(makeLevel(level))} className="rounded-xl bg-[#E47CB8] px-5 py-2 font-display text-lg font-bold text-[#001C3D] hover:brightness-95">
                    New maze
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        {status === "won" && (
          <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} className="absolute -top-10 text-3xl" style={{ left: `${(i * 4.3) % 100}%`, animation: `confetti ${2 + (i % 5) * 0.4}s linear ${(i % 7) * 0.1}s forwards` }}>
                {["🎉", "🧀", "⭐", "🪙"][i % 4]}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-sm font-semibold text-[#F0EFEB]/70">
        Every cracker you leave crumbles. Grab 🪙, reach 🧀, never get stuck. Arrow keys / WASD.
      </p>

      <div className="grid grid-cols-3 place-items-center gap-2 sm:hidden">
        <span />
        <button className={pad} onClick={() => move(0, -1)}>⬆️</button>
        <span />
        <button className={pad} onClick={() => move(-1, 0)}>⬅️</button>
        <button className={pad} onClick={() => move(0, 1)}>⬇️</button>
        <button className={pad} onClick={() => move(1, 0)}>➡️</button>
      </div>

      <button onClick={() => load(lv)} className="text-sm font-bold text-[#E47CB8] underline">
        Restart this maze
      </button>
    </div>
  );
}