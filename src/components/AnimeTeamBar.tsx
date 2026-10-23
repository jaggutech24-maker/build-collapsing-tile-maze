import React from "react";
import gonImg from "../assets/gon.jpg";
import killuaImg from "../assets/killua.jpg";
import kurapikaImg from "../assets/kurapika.jpg";

export interface HunterPartyMember {
  id: string;
  name: string;
  jpName: string;
  level: number;
  maxLevel: number;
  stars: number;
  type: "rock" | "scissors" | "paper";
  image: string;
  affinity: string;
  power: number;
}

interface AnimeTeamBarProps {
  totalPower?: number;
  teamName?: string;
  party?: HunterPartyMember[];
  onSelectMember?: (member: HunterPartyMember) => void;
}

const DEFAULT_PARTY: HunterPartyMember[] = [
  {
    id: "gon",
    name: "Gon Freecss",
    jpName: "Enhancer",
    level: 8,
    maxLevel: 40,
    stars: 3,
    type: "rock",
    image: gonImg,
    affinity: "Enhancement",
    power: 5240,
  },
  {
    id: "killua",
    name: "Killua Zoldyck",
    jpName: "Transmuter",
    level: 8,
    maxLevel: 40,
    stars: 3,
    type: "scissors",
    image: killuaImg,
    affinity: "Transmutation",
    power: 5120,
  },
  {
    id: "kurapika",
    name: "Kurapika",
    jpName: "Conjurer",
    level: 1,
    maxLevel: 40,
    stars: 3,
    type: "paper",
    image: kurapikaImg,
    affinity: "Conjuration",
    power: 4209,
  },
];

export default function AnimeTeamBar({
  totalPower = 14569,
  teamName = "TEAM 1",
  party = DEFAULT_PARTY,
  onSelectMember,
}: AnimeTeamBarProps) {
  return (
    <div className="relative w-full max-w-md mx-auto px-2 select-none">
      {/* Top Tabs: TEAM SELECT / TEAM 1 */}
      <div className="flex items-center gap-1 pl-4 -mb-1 relative z-10">
        <div className="manga-skew bg-black border-2 border-black px-2.5 py-0.5 text-white comic-shadow-sm">
          <span className="manga-skew-reverse text-[10px] sm:text-xs font-black tracking-wider text-slate-200 uppercase">
            TEAM SELECT
          </span>
        </div>
        <div className="manga-skew bg-[#ffe500] border-2 border-black px-3 py-0.5 text-black comic-shadow-sm">
          <span className="manga-skew-reverse text-[10px] sm:text-xs font-black tracking-wider uppercase">
            {teamName}
          </span>
        </div>
      </div>

      {/* Main Slanted Dark Deck Box */}
      <div className="relative border-3 border-black bg-gradient-to-r from-[#031535] via-[#052458] to-[#021330] p-2.5 pb-2 comic-shadow-lg rounded-sm overflow-hidden">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 halftone-overlay pointer-events-none opacity-20" />

        <div className="relative z-10 flex items-center justify-between">
          {/* Party Character Medallions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {party.map((hero) => {
              const ringColor =
                hero.type === "rock"
                  ? "border-[#e60012] bg-[#e60012]"
                  : hero.type === "scissors"
                  ? "border-[#0088ff] bg-[#0088ff]"
                  : "border-[#00cc44] bg-[#00cc44]";

              const typeBadge =
                hero.type === "rock" ? "✊" : hero.type === "scissors" ? "✌️" : "✋";

              return (
                <div
                  key={hero.id}
                  onClick={() => onSelectMember && onSelectMember(hero)}
                  className="relative flex flex-col items-center cursor-pointer group hover:scale-105 active:scale-95 transition-transform"
                >
                  {/* Circular Avatar with Glowing Ring */}
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 ${ringColor} bg-black overflow-hidden comic-shadow-sm`}>
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />

                    {/* Janken / Nen Type Icon in bottom-left */}
                    <div className="absolute bottom-0 left-0 w-5 h-5 rounded-full bg-black/90 border border-white flex items-center justify-center text-[10px] shadow">
                      {typeBadge}
                    </div>
                  </div>

                  {/* Level Badge: Lv.8/40 */}
                  <div className="manga-skew bg-black border border-white/60 px-1.5 py-0.2 -mt-1.5 z-10 comic-shadow-sm">
                    <span className="manga-skew-reverse block text-white font-mono text-[9px] sm:text-[10px] font-black leading-tight">
                      Lv.{hero.level}/{hero.maxLevel}
                    </span>
                  </div>

                  {/* Stars ⭐⭐⭐ */}
                  <div className="flex justify-center -space-x-0.5 mt-0.5">
                    {Array.from({ length: hero.stars }).map((_, i) => (
                      <span key={i} className="text-[10px] text-[#ffe500] drop-shadow-sm leading-none">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right/Bottom side: TOTAL POWER */}
          <div className="flex flex-col items-end justify-center pl-2">
            {/* Slanted Red Badge */}
            <div className="manga-skew bg-[#e60012] border-2 border-black text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 comic-shadow-sm -mb-1 z-10">
              <span className="manga-skew-reverse inline-block tracking-wider uppercase">
                TOTAL POWER
              </span>
            </div>

            {/* Combat Power Number */}
            <div className="manga-skew bg-black border-2 border-black px-3 py-1 comic-shadow-sm min-w-[90px] text-right">
              <span className="manga-skew-reverse block font-display text-white text-base sm:text-xl font-black tracking-wider">
                {totalPower.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
