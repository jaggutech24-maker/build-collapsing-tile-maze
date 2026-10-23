import { useCallback, useEffect, useRef, useState } from "react";
import AnimeHeader from "./components/AnimeHeader";
import AnimeStageBrief from "./components/AnimeStageBrief";
import AnimeStageCarousel, { type StageNode } from "./components/AnimeStageCarousel";
import AnimeTeamBar, { type HunterPartyMember } from "./components/AnimeTeamBar";
import AnimeActionButtons from "./components/AnimeActionButtons";
import AnimeBottomNav, { type NavTab } from "./components/AnimeBottomNav";
import AnimeMazeBoard from "./components/AnimeMazeBoard";
import AnimeGachaModal from "./components/AnimeGachaModal";
import AnimeTeamModal from "./components/AnimeTeamModal";
import { music, setMuted, sfx } from "./sound";
import baiseImg from "./assets/baise.jpg";

// Tile states
const WALL = 0, SOLID = 1, CRACK = 2, GONE = 3;

const DEAD_MEMES = [
  { e: "🔥🐶☕", t: "THIS IS FINE", b: "(Floor collapsed into the abyss!)" },
  { e: "🗿", t: "SKILL ISSUE", b: "Plan your route before stepping!" },
  { e: "🤡", t: "TASK FAILED", b: "Every step is permanent!" },
  { e: "💀", t: "BRUH.", b: "No way back in this maze!" },
  { e: "😭🧀", t: "SO CLOSE", b: "The exit was right there..." },
];

const WIN_MEMES = [
  { e: "😎🏆", t: "BIG BRAIN HUNTER", b: "Flawless route execution!" },
  { e: "⚡👑", t: "NEN MASTER", b: "Stage cleared with 3 stars!" },
  { e: "🕺📈", t: "MISSION COMPLETE", b: "Hunter License verified!" },
];

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function makeLevel(lv: number) {
  const n = Math.min(6 + lv, 10);
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

  const tiles: number[] = Array(total).fill(WALL);
  for (const idx of solutionPath) tiles[idx] = SOLID;

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
      const chosenCandidate = candidates[(Math.random() * candidates.length) | 0];
      tiles[chosenCandidate] = SOLID;
      cur = chosenCandidate;
    }
  }

  const numCoins = Math.min(2 + lv, 6);
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

const INITIAL_STAGES: StageNode[] = [
  { id: 1, type: "story", title: "旅立ち", subTitle: "Departure", status: "complete" },
  { id: 2, type: "battle", title: "ナゾ × ノ × ショウジョ", subTitle: "Mystery Girl", status: "active", isNew: true },
  { id: 3, type: "trial", title: "ハンター試験", subTitle: "Hunter Exam", status: "locked" },
  { id: 4, type: "boss", title: "幻影旅団", subTitle: "Phantom Troupe", status: "locked" },
];

export default function App() {
  // Navigation & Screen View
  const [activeTab, setActiveTab] = useState<NavTab>("quest");
  const [inBattle, setInBattle] = useState(false);
  const [stages, setStages] = useState<StageNode[]>(INITIAL_STAGES);
  const [activeStageId, setActiveStageId] = useState(2);

  // Currencies & Gacha
  const [gems, setGems] = useState(10);
  const [showGacha, setShowGacha] = useState(false);
  const [selectedMember, setSelectedMember] = useState<HunterPartyMember | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Maze Logic
  const [level, setLevel] = useState(2);
  const [lv, setLv] = useState(() => makeLevel(2));
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

  const loadLevelData = useCallback((l: ReturnType<typeof makeLevel>) => {
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
        // Award a rainbow gem on win
        setGems((g) => g + 1);
        later(() => {
          sfx.win();
          setStatus("won");
          // Unlock next stage if on stage 2
          setStages((prev) =>
            prev.map((s) => (s.id === 3 ? { ...s, status: "active", isNew: true } : s))
          );
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
    if (!inBattle) return;
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
  }, [inBattle, move]);

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

  const toggleMute = () => {
    const nextMute = !mute;
    setMute(nextMute);
    setMuted(nextMute);
    if (!nextMute) {
      music.start();
    }
  };

  const handleSpendGems = (amount: number) => {
    if (gems >= amount) {
      setGems((g) => g - amount);
      return true;
    }
    return false;
  };

  const handleStageSelect = (stageId: number) => {
    setActiveStageId(stageId);
    setLevel(stageId);
    loadLevelData(makeLevel(stageId));
  };

  const handleDeploy = () => {
    sfx.win();
    setInBattle(true);
  };

  const handleRetreat = () => {
    setInBattle(false);
  };

  const handleNextLevel = () => {
    const nextL = level + 1;
    setLevel(nextL);
    setActiveStageId(nextL);
    loadLevelData(makeLevel(nextL));
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "gacha") {
      setShowGacha(true);
    } else if (tab === "menu") {
      setShowMenu(true);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between bg-cover bg-center overflow-x-hidden">
      {/* Anime Mobile Screen Frame */}
      <div className="relative w-full max-w-[480px] min-h-dvh flex flex-col justify-between border-x-4 border-black/80 bg-gradient-to-b from-[#0642a4] via-[#05378c] to-[#021f57] shadow-2xl">
        {/* Dynamic Background Manga Lines & Shards */}
        <div className="absolute inset-0 halftone-overlay pointer-events-none opacity-20" />
        <div className="absolute top-24 -left-6 w-12 h-12 bg-[#ffe500] rotate-45 border-3 border-black pointer-events-none -z-0" />
        <div className="absolute top-96 -right-6 w-14 h-14 bg-[#ffe500] -rotate-12 border-3 border-black pointer-events-none -z-0" />
        <div className="absolute bottom-40 -left-4 w-10 h-10 bg-[#e60012] rotate-12 border-2 border-black pointer-events-none -z-0" />

        {/* 1. TOP HEADER */}
        <AnimeHeader
          chapterNumber={activeStageId < 10 ? `0${activeStageId}` : `${activeStageId}`}
          chapterTitle={activeStageId === 2 ? "ナゾ × ノ × ショウジョ" : activeStageId === 1 ? "旅立ち × ノ × 始まり" : "試練 × ノ × 迷宮"}
          gems={gems}
          muted={mute}
          onToggleMute={toggleMute}
          onOpenGacha={() => setShowGacha(true)}
        />

        {/* 2. MAIN CONTENT AREA */}
        <main className="relative z-10 flex-1 flex flex-col justify-center py-2">
          {inBattle ? (
            /* COLLAPSING MAZE BATTLE ARENA */
            <AnimeMazeBoard
              n={n}
              tiles={tiles}
              coins={coins}
              pos={pos}
              bump={bump}
              score={score}
              moves={moves}
              level={level}
              onMove={move}
              onRestart={() => loadLevelData(lv)}
              onRetreat={handleRetreat}
              status={status}
              onNextLevel={handleNextLevel}
              meme={meme}
              audioMuted={mute}
              onToggleAudio={toggleMute}
            />
          ) : (
            /* AUTHENTIC ANIME QUEST UI (From user's screenshot!) */
            <div className="flex flex-col gap-2.5">
              {/* Feature Stage Mission Panel */}
              <AnimeStageBrief
                episodeNumber={`0${activeStageId}話`}
                episodeTitle={activeStageId === 2 ? "ナゾ × ノ × ショウジョ" : "旅立ち × ノ × 迷宮"}
                recommendedPower={8000}
                enemyName="Baise"
                enemyImage={baiseImg}
                attemptsLeft={1}
              />

              {/* Stage Node Carousel */}
              <AnimeStageCarousel
                stages={stages}
                activeStageId={activeStageId}
                onSelectStage={handleStageSelect}
              />

              {/* Hunter Team Deck Bar */}
              <AnimeTeamBar
                totalPower={14569}
                teamName="チーム 1"
                onSelectMember={(m) => setSelectedMember(m)}
              />

              {/* Action Buttons: 戻る (Back) & 出発する (Deploy / Start Maze) */}
              <AnimeActionButtons
                onBack={() => handleStageSelect(1)}
                onDeploy={handleDeploy}
                deployText="出発する"
                backText="戻る"
              />
            </div>
          )}
        </main>

        {/* 3. BOTTOM NAVIGATION BAR */}
        <AnimeBottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          gachaBadge={gems >= 5}
        />
      </div>

      {/* MODALS */}
      {/* Gacha Modal */}
      {showGacha && (
        <AnimeGachaModal
          gems={gems}
          onSpendGems={handleSpendGems}
          onClose={() => {
            setShowGacha(false);
            setActiveTab("quest");
          }}
        />
      )}

      {/* Team Inspection Modal */}
      {selectedMember && (
        <AnimeTeamModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Menu / Info Modal */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
          <div className="relative w-full max-w-sm border-4 border-black bg-gradient-to-b from-[#021b44] to-[#01091a] p-4 comic-shadow-xl text-center rounded-sm">
            <button
              onClick={() => {
                setShowMenu(false);
                setActiveTab("quest");
              }}
              className="manga-skew absolute top-2 right-2 w-8 h-8 bg-[#e60012] border-2 border-black text-white font-black text-sm flex items-center justify-center comic-shadow-sm cursor-pointer"
            >
              <span className="manga-skew-reverse">✕</span>
            </button>

            <div className="manga-skew inline-block bg-[#ffe500] border-2 border-black px-4 py-1 comic-shadow-sm mb-3">
              <span className="manga-skew-reverse font-display text-black text-sm font-black tracking-wider uppercase">
                SYSTEM MENU
              </span>
            </div>

            <div className="text-left bg-black/70 border-2 border-white/40 p-3 rounded-sm space-y-2 text-xs text-white">
              <div className="font-bold text-[#ffe500] text-sm">Rules of the Collapsing Maze:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                <li>Every tile you step off collapses into the void forever.</li>
                <li>Reach the Golden Hunter Gate 🏆 without getting trapped.</li>
                <li>Gather Nen Orbs 🪙 for extra bonus score!</li>
                <li>Earn Rainbow Gems 💎 to recruit legendary Hunters in Gacha!</li>
              </ul>
            </div>

            <button
              onClick={toggleMute}
              className="manga-skew w-full mt-3 bg-black hover:bg-zinc-800 border-2 border-yellow-400 py-2 text-yellow-300 font-bold text-xs comic-shadow cursor-pointer"
            >
              <span className="manga-skew-reverse">
                BGM & SFX: {mute ? "OFF (MUTED)" : "ON (PLAYING)"}
              </span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                setActiveTab("quest");
              }}
              className="manga-skew w-full mt-3 bg-[#ffe500] hover:bg-yellow-300 border-3 border-black py-2 font-display text-black font-black text-sm comic-shadow cursor-pointer"
            >
              <span className="manga-skew-reverse">CLOSE</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}