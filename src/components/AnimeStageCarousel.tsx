import React from "react";

export interface StageNode {
  id: number;
  type: "story" | "battle" | "trial" | "boss";
  title: string;
  subTitle: string;
  status: "complete" | "active" | "locked";
  isNew?: boolean;
}

interface AnimeStageCarouselProps {
  stages: StageNode[];
  activeStageId: number;
  onSelectStage: (id: number) => void;
}

export default function AnimeStageCarousel({
  stages,
  activeStageId,
  onSelectStage,
}: AnimeStageCarouselProps) {
  return (
    <div className="relative w-full max-w-md mx-auto px-2 py-2 select-none">
      {/* Dynamic Comic Shards / Background Action Accents */}
      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#ffe500] transform rotate-45 border-2 border-black pointer-events-none -z-0" />
      <div className="absolute top-1/3 -right-2 w-5 h-5 bg-[#ffe500] transform -rotate-12 border-2 border-black pointer-events-none -z-0" />

      {/* Horizontal Scrollable Nodes Strip */}
      <div className="relative z-10 flex items-center justify-between gap-2 overflow-x-auto py-3 px-1 no-scrollbar">
        {stages.map((stage) => {
          const isActive = stage.id === activeStageId;
          const isComplete = stage.status === "complete";
          const isLocked = stage.status === "locked";

          return (
            <div
              key={stage.id}
              onClick={() => !isLocked && onSelectStage(stage.id)}
              className={`relative flex flex-col items-center flex-shrink-0 cursor-pointer transition-all duration-200 group ${
                isLocked ? "opacity-60 cursor-not-allowed" : "hover:scale-105 active:scale-95"
              }`}
              style={{ width: "88px" }}
            >
              {/* Comic Smoke / Explosion Effect behind active node */}
              <div className="absolute -top-3 inset-x-0 flex justify-center pointer-events-none">
                {isActive && (
                  <div className="w-16 h-12 bg-white/90 border-2 border-black rounded-full filter blur-[0.4px] comic-shadow-sm anim-smoke" 
                       style={{ clipPath: "polygon(10% 40%, 30% 10%, 70% 15%, 90% 45%, 80% 85%, 20% 90%)" }}>
                    <div className="w-full h-full bg-gradient-to-t from-orange-400/40 to-transparent" />
                  </div>
                )}
                {isComplete && (
                  <div className="w-14 h-10 bg-slate-300/80 border border-black rounded-full opacity-80" 
                       style={{ clipPath: "polygon(20% 50%, 40% 15%, 80% 25%, 95% 65%, 60% 90%, 10% 80%)" }} />
                )}
                {isLocked && (
                  <div className="w-12 h-8 bg-zinc-800/80 border border-black rounded-full opacity-50" />
                )}
              </div>

              {/* NEW Starburst Badge on Top Left */}
              {stage.isNew && (
                <div className="absolute -top-3 -left-1 z-30 anim-pulse">
                  <div className="burst-badge-sm bg-[#ffe500] border-2 border-black px-1.5 py-0.5 text-black font-display font-black text-[9px] tracking-tighter">
                    NEW
                  </div>
                </div>
              )}

              {/* Main Circular/Slanted Pedestal Container */}
              <div
                className={`relative w-20 h-20 rounded-2xl border-3 border-black flex flex-col items-center justify-center p-1.5 transition-all comic-shadow-sm overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-b from-orange-500 via-amber-500 to-amber-600 ring-3 ring-[#ffe500]"
                    : isComplete
                    ? "bg-gradient-to-b from-sky-600 to-blue-800"
                    : "bg-gradient-to-b from-zinc-800 to-zinc-950"
                }`}
              >
                {/* Comic Speed / Line Texture in background */}
                <div className="absolute inset-0 halftone-overlay pointer-events-none" />

                {/* Node Center Graphic / Symbol */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  {isComplete && (
                    <div className="flex flex-col items-center">
                      <div className="text-2xl drop-shadow transform -rotate-6">📖</div>
                      {/* STORY Badge */}
                      <span className="manga-skew bg-black/90 text-white font-display text-[9px] font-black px-1.5 py-0.2 border border-white mt-0.5">
                        STORY
                      </span>
                    </div>
                  )}

                  {isActive && (
                    <div className="flex flex-col items-center">
                      {/* Red Ring Target / Action Disc */}
                      <div className="relative w-10 h-7 rounded-full bg-gradient-to-b from-[#e60012] to-black border-2 border-white flex items-center justify-center comic-shadow-sm">
                        <div className="w-5 h-3 rounded-full bg-cyan-400 border border-black" />
                      </div>
                      {/* BATTLE Badge */}
                      <div className="manga-skew bg-black text-[#e60012] font-display text-[10px] font-black px-2 py-0.5 border-2 border-[#e60012] mt-1 comic-shadow-sm">
                        <span className="manga-skew-reverse text-white tracking-wider">
                          BATTLE
                        </span>
                      </div>
                    </div>
                  )}

                  {isLocked && (
                    <div className="flex flex-col items-center opacity-85">
                      <div className="text-2xl drop-shadow text-slate-300">🔒</div>
                      {/* Locked Badge with Chain motif */}
                      <span className="manga-skew bg-black text-slate-400 font-display text-[9px] font-black px-1.5 py-0.2 border border-slate-600 mt-1">
                        LOCK
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Status Ribbons */}
              <div className="relative z-20 -mt-2">
                {isComplete && (
                  <div className="manga-skew bg-[#00f0ff] border-2 border-black px-1.5 py-0.2 comic-shadow-sm">
                    <span className="manga-skew-reverse block text-black font-display font-black text-[9px] tracking-tight">
                      COMPLETE!
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="manga-skew bg-[#ffe500] border-2 border-black px-2 py-0.2 comic-shadow-sm">
                    <span className="manga-skew-reverse block text-black font-display font-black text-[10px] tracking-tight">
                      STAGE {stage.id}
                    </span>
                  </div>
                )}
                {isLocked && (
                  <div className="manga-skew bg-zinc-900 border border-black px-1.5 py-0.2">
                    <span className="manga-skew-reverse block text-zinc-500 font-display font-black text-[9px]">
                      CH. 0{stage.id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
