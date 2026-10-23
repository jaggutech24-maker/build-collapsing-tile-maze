import React from "react";
import gonImg from "../assets/gon.jpg";
import gemImg from "../assets/gem.jpg";

interface AnimeMazeBoardProps {
  n: number;
  tiles: number[];
  coins: Set<number>;
  pos: { x: number; y: number };
  bump: number;
  score: number;
  moves: number;
  level: number;
  onMove: (dx: number, dy: number) => void;
  onRestart: () => void;
  onRetreat: () => void;
  status: "play" | "dead" | "won";
  onNextLevel: () => void;
  meme: { e: string; t: string; b: string };
  audioMuted: boolean;
  onToggleAudio: () => void;
}

const WALL = 0, SOLID = 1, CRACK = 2, GONE = 3;

export default function AnimeMazeBoard({
  n,
  tiles,
  coins,
  pos,
  bump,
  score,
  moves,
  level,
  onMove,
  onRestart,
  onRetreat,
  status,
  onNextLevel,
  meme,
  audioMuted,
  onToggleAudio,
}: AnimeMazeBoardProps) {
  const dpadBtn =
    "manga-skew w-13 h-13 sm:w-14 sm:h-14 rounded-md bg-[#ffe500] hover:bg-yellow-300 active:scale-90 border-3 border-black text-black font-black text-xl flex items-center justify-center comic-shadow cursor-pointer select-none";

  return (
    <div className="relative w-full max-w-md mx-auto px-2 py-1 select-none flex flex-col items-center">
      {/* Upper Comic Battle HUD */}
      <div className="w-full flex items-center justify-between mb-2">
        {/* Retreat / Back button */}
        <button
          onClick={onRetreat}
          className="manga-skew bg-black hover:bg-zinc-800 text-white border-2 border-[#ffe500] px-3 py-1 comic-shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
        >
          <span className="manga-skew-reverse text-[11px] font-display font-black text-[#ffe500] uppercase">
            ◀ RETREAT
          </span>
        </button>

        {/* Live Battle Stats Ribbon */}
        <div className="flex items-center gap-1.5">
          {/* Level / Stage */}
          <div className="manga-skew bg-[#e60012] border-2 border-black text-white px-2.5 py-0.5 comic-shadow-sm">
            <span className="manga-skew-reverse font-display text-[11px] font-black tracking-wider uppercase">
              STAGE {level}
            </span>
          </div>

          {/* Nen Orbs / Coins */}
          <div className="manga-skew bg-[#ffe500] border-2 border-black text-black px-2 py-0.5 comic-shadow-sm flex items-center gap-1">
            <span className="manga-skew-reverse text-[11px] font-black">
              🪙 {score}
            </span>
          </div>

          {/* Steps */}
          <div className="manga-skew bg-black border-2 border-white text-white px-2 py-0.5 comic-shadow-sm">
            <span className="manga-skew-reverse font-mono text-[11px] font-black">
              👣 {moves}
            </span>
          </div>

          {/* Mute */}
          <button
            onClick={onToggleAudio}
            className="manga-skew w-7 h-7 bg-black border border-yellow-400 text-yellow-400 text-xs flex items-center justify-center cursor-pointer"
          >
            <span className="manga-skew-reverse">
              {audioMuted ? "🔇" : "🔊"}
            </span>
          </button>
        </div>
      </div>

      {/* Warning Mission Ticker */}
      <div className="w-full manga-skew bg-black border-2 border-[#e60012] px-3 py-1 mb-2 comic-shadow-sm flex items-center justify-between">
        <span className="manga-skew-reverse text-[11px] font-display font-black text-[#00f0ff] uppercase tracking-wide">
          MISSION:
        </span>
        <span className="manga-skew-reverse text-[11px] font-display font-bold text-white tracking-tight truncate uppercase">
          BREAK THROUGH THE CRUMBLING MAZE!
        </span>
      </div>

      {/* Main Collapsing Maze Arena Container */}
      <div
        key={bump}
        className={`relative w-full aspect-square border-4 border-black bg-gradient-to-b from-[#021330] to-[#01091a] p-2.5 comic-shadow-xl rounded-md overflow-hidden ${
          bump > 0 ? "anim-shake" : ""
        }`}
      >
        {/* Background Manga Speedline & Halftone Texture */}
        <div className="absolute inset-0 halftone-overlay pointer-events-none opacity-25" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 30%, #000 90%),
                              repeating-conic-gradient(from 0deg, #ffe500 0deg 3deg, transparent 3deg 15deg)`
          }}
        />

        {/* The Tile Grid */}
        <div
          className="relative w-full h-full grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
        >
          {tiles.map((t, i) => {
            const tx = i % n, ty = (i / n) | 0;
            const dx = tx - pos.x, dy = ty - pos.y;
            const isAdj = Math.abs(dx) + Math.abs(dy) === 1 && t === SOLID;
            const isExit = i === n * n - 1;

            return (
              <div
                key={i}
                onClick={() => isAdj && onMove(dx, dy)}
                className={`relative aspect-square transition-all duration-150 ${
                  isAdj ? "cursor-pointer hover:scale-105 active:scale-95" : ""
                }`}
              >
                {/* Wall Cell */}
                {t === WALL && (
                  <div className="w-full h-full rounded-sm bg-black/50 border border-white/10" />
                )}

                {/* Solid or Cracking Tile */}
                {(t === SOLID || t === CRACK) && (
                  <div
                    className={`w-full h-full rounded-md border-2 border-black flex items-center justify-center relative overflow-hidden transition-all duration-150 ${
                      t === CRACK
                        ? "tile-cracking bg-[#e60012]"
                        : isAdj
                        ? "bg-gradient-to-br from-[#fffbdf] to-[#ffe500] ring-2 ring-[#00f0ff] comic-shadow-sm"
                        : "bg-gradient-to-br from-slate-100 to-slate-300 comic-shadow-sm"
                    }`}
                  >
                    {/* Comic Crosshatch Texture */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_4px)]" />

                    {/* Exit Tile Graphic (Hunter License Gate / Golden Chest) */}
                    {isExit ? (
                      <div className="relative z-10 flex flex-col items-center justify-center anim-bounce">
                        <span className="text-xl sm:text-2xl drop-shadow">🏆</span>
                        <span className="text-[8px] font-black text-black bg-[#ffe500] px-1 rounded-xs border border-black leading-tight uppercase">
                          GOAL
                        </span>
                      </div>
                    ) : coins.has(i) ? (
                      /* Nen Coin */
                      <div className="relative z-10 w-3/5 h-3/5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 border-2 border-black flex items-center justify-center anim-bounce comic-shadow-sm">
                        <span className="text-[10px] font-black text-black">🪙</span>
                      </div>
                    ) : null}

                    {/* Stepped Cracking Onomatopoeia */}
                    {t === CRACK && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="comic-text text-[#ffe500] text-xs font-black anim-pulse uppercase">
                          CRACK!
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsed Abyss Tile */}
                {t === GONE && (
                  <div className="w-full h-full rounded-md bg-[#e60012]/40 border border-dashed border-red-500/40 tile-collapsed flex items-center justify-center">
                    <span className="text-[10px] text-red-300 font-mono">🕳️</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Smooth Hunter Gon Player Sprite moving across grid */}
          <div
            className="pointer-events-none absolute left-0 top-0 flex items-center justify-center transition-transform duration-120 z-30"
            style={{
              width: `${100 / n}%`,
              height: `${100 / n}%`,
              transform: `translate(${pos.x * 100}%, ${pos.y * 100}%)`,
            }}
          >
            <div className="relative w-4/5 h-4/5 rounded-full border-2 border-[#ffe500] bg-black overflow-hidden comic-shadow anim-nen">
              <img
                src={gonImg}
                alt="Gon"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Win / Defeat Manga Overlays */}
        {status !== "play" && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-sm text-center">
            {status === "won" ? (
              /* MISSION COMPLETE (VICTORY) */
              <div className="flex flex-col items-center gap-2 anim-pulse">
                {/* Comic Cleared Stamp */}
                <div className="manga-skew bg-[#ffe500] border-4 border-black px-5 py-2 comic-shadow-xl transform -rotate-3">
                  <span className="manga-skew-reverse block comic-text-lg text-black text-2xl sm:text-3xl font-black tracking-widest uppercase">
                    STAGE CLEARED!
                  </span>
                  <span className="manga-skew-reverse block text-black text-xs font-display font-black tracking-wider uppercase">
                    MISSION ACCOMPLISHED ★★★
                  </span>
                </div>

                {/* Rewards Earned Callout */}
                <div className="flex items-center gap-2 mt-2 bg-black/90 border-2 border-[#00f0ff] px-4 py-1.5 rounded-sm comic-shadow">
                  <img src={gemImg} alt="Gem" className="w-8 h-8 object-contain" />
                  <div className="text-left">
                    <div className="text-xs font-display font-black text-[#00f0ff] uppercase">REWARD OBTAINED:</div>
                    <div className="text-sm font-bold text-white">+1 Rainbow Gem!</div>
                  </div>
                </div>

                <p className="comic-text text-[#ffe500] text-base font-bold mt-1 uppercase">
                  {meme.t} - {meme.b}
                </p>

                {/* Next Level Button */}
                <button
                  onClick={onNextLevel}
                  className="manga-skew mt-3 bg-[#e60012] hover:bg-red-500 active:scale-95 border-3 border-black text-white px-6 py-2.5 comic-shadow-lg font-display text-lg font-black tracking-wider cursor-pointer"
                >
                  <span className="manga-skew-reverse block uppercase">
                    NEXT STAGE ▶
                  </span>
                </button>
              </div>
            ) : (
              /* MISSION FAILED (TRAPPED) */
              <div className="flex flex-col items-center gap-2 anim-shake">
                {/* Comic Defeat Stamp */}
                <div className="manga-skew bg-[#e60012] border-4 border-black px-5 py-2 comic-shadow-xl transform rotate-2">
                  <span className="manga-skew-reverse block comic-text-lg text-white text-2xl sm:text-3xl font-black tracking-widest uppercase">
                    MISSION FAILED
                  </span>
                  <span className="manga-skew-reverse block text-yellow-300 text-xs font-display font-black tracking-wider uppercase">
                    TRAPPED IN THE ABYSS
                  </span>
                </div>

                <div className="text-5xl mt-1">{meme.e}</div>
                <div className="comic-text text-white text-lg font-black uppercase">{meme.t}</div>
                <div className="text-xs text-slate-300 font-bold">{meme.b}</div>

                {/* Retry Buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={onRestart}
                    className="manga-skew bg-[#ffe500] hover:bg-yellow-300 active:scale-95 border-3 border-black text-black px-4 py-2 comic-shadow font-display text-sm font-black tracking-wider cursor-pointer uppercase"
                  >
                    <span className="manga-skew-reverse block">
                      ↺ RETRY
                    </span>
                  </button>
                  <button
                    onClick={onRetreat}
                    className="manga-skew bg-zinc-800 hover:bg-zinc-700 active:scale-95 border-2 border-white text-white px-3 py-2 comic-shadow font-display text-xs font-black cursor-pointer uppercase"
                  >
                    <span className="manga-skew-reverse block">
                      STAGE MENU
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manga Touch D-Pad for Mobile Controls */}
      <div className="mt-3 flex flex-col items-center gap-1.5 sm:hidden">
        <button
          className={dpadBtn}
          onClick={() => onMove(0, -1)}
          aria-label="Up"
        >
          <span className="manga-skew-reverse">▲</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            className={dpadBtn}
            onClick={() => onMove(-1, 0)}
            aria-label="Left"
          >
            <span className="manga-skew-reverse">◀</span>
          </button>
          <button
            className={dpadBtn}
            onClick={() => onMove(0, 1)}
            aria-label="Down"
          >
            <span className="manga-skew-reverse">▼</span>
          </button>
          <button
            className={dpadBtn}
            onClick={() => onMove(1, 0)}
            aria-label="Right"
          >
            <span className="manga-skew-reverse">▶</span>
          </button>
        </div>
      </div>

      {/* Keyboard Controls Hint */}
      <p className="text-center text-[11px] font-bold text-white/80 mt-2 hidden sm:block">
        Use <kbd className="bg-black border border-white/50 px-1.5 py-0.5 rounded text-yellow-400">Arrow Keys</kbd> or <kbd className="bg-black border border-white/50 px-1.5 py-0.5 rounded text-yellow-400">WASD</kbd> or click neighboring tiles!
      </p>
    </div>
  );
}
