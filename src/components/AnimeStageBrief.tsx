import React from "react";
import baiseImg from "../assets/baise.jpg";
import gemImg from "../assets/gem.jpg";

interface AnimeStageBriefProps {
  episodeNumber?: string;
  episodeTitle?: string;
  recommendedPower?: number;
  enemyName?: string;
  enemyImage?: string;
  attemptsLeft?: number;
}

export default function AnimeStageBrief({
  episodeNumber = "EP.02",
  episodeTitle = "RIDDLE × OF × THE MAZE",
  recommendedPower = 8000,
  enemyName = "Baise",
  enemyImage = baiseImg,
  attemptsLeft = 1,
}: AnimeStageBriefProps) {
  return (
    <div className="relative w-full max-w-md mx-auto px-2 pt-1 select-none">
      {/* Upper Tab Badge: SCENE IMAGE */}
      <div className="flex justify-start pl-6 -mb-1 relative z-10">
        <div className="manga-skew bg-black border-2 border-black px-3 py-0.5 comic-shadow-sm flex items-center gap-1">
          <span className="manga-skew-reverse text-[#00f0ff] font-display text-xs sm:text-sm font-black tracking-widest uppercase">
            SCENE IMAGE
          </span>
        </div>
      </div>

      {/* Main Red Action Panel */}
      <div className="relative border-4 border-black manga-red-panel comic-shadow-lg rounded-sm overflow-hidden p-3.5 pt-4">
        {/* Comic Speedline Starburst Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 35%, transparent 15%, rgba(0,0,0,0.6) 80%),
                              repeating-conic-gradient(from 0deg at 70% 35%, #000 0deg 4deg, transparent 4deg 12deg)`
          }}
        />

        {/* Top Slanted White Ribbon: Episode Name */}
        <div className="relative z-10 flex mb-3">
          <div className="manga-skew bg-white border-2 border-black px-3 py-1 comic-shadow-sm flex items-center gap-2 max-w-full">
            <span className="manga-skew-reverse text-black font-display text-xs sm:text-sm font-black tracking-wider">
              {episodeNumber}
            </span>
            <span className="manga-skew-reverse text-black font-display text-xs sm:text-sm font-extrabold tracking-wide truncate">
              {episodeTitle}
            </span>
          </div>
        </div>

        {/* Main Content Layout: Left Enemy Box, Right Clear & Drop Rewards */}
        <div className="relative z-10 flex items-stretch justify-between gap-3">
          {/* Left Column: Target Enemy & Recommended Power */}
          <div className="flex flex-col gap-1.5 flex-1 max-w-[210px]">
            {/* Recommended Power Ribbon */}
            <div className="manga-skew bg-black border-2 border-black flex items-center justify-between px-2 py-0.5 text-white comic-shadow-sm">
              <span className="manga-skew-reverse text-[10px] sm:text-xs font-black text-slate-200 uppercase tracking-tight">
                REC. POWER
              </span>
              <span className="manga-skew-reverse font-display text-sm sm:text-base font-black text-white tracking-widest">
                {recommendedPower.toLocaleString()}
              </span>
            </div>

            {/* Enemy Frame */}
            <div className="relative">
              {/* Slanted ENEMY Badge pinned to top-left */}
              <div className="absolute -top-2 -left-2 z-20">
                <span className="manga-skew inline-block bg-[#e60012] border-2 border-black text-white text-[10px] font-black px-2 py-0.2 comic-shadow-sm tracking-wider">
                  ENEMY
                </span>
              </div>

              {/* Enemy Portrait Card */}
              <div className="manga-skew border-3 border-black bg-black overflow-hidden comic-shadow-sm aspect-[4/3] w-full relative group">
                <img 
                  src={enemyImage} 
                  alt={enemyName} 
                  className="manga-skew-reverse w-[115%] h-[115%] -ml-[7%] -mt-[7%] object-cover object-top hover:scale-105 transition-transform duration-300"
                />
                {/* Comic Halftone shade in corner */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1 right-1 text-[9px] font-mono text-white/80 bg-black/70 px-1 rounded-xs">
                  LV. 15
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rewards (Clear Reward & Drop Items) */}
          <div className="flex flex-col items-center justify-between gap-2 py-1 pr-1">
            {/* Clear Reward (Rainbow Crystal) */}
            <div className="relative flex flex-col items-center">
              {/* Spiky / Angled CLEAR REWARD Badge */}
              <div className="manga-skew bg-black border-2 border-[#ffe500] text-[#ffe500] text-[9px] sm:text-[10px] font-black px-2 py-0.5 comic-shadow-sm -mb-2 z-20">
                <span className="manga-skew-reverse inline-block tracking-wider uppercase">
                  CLEAR REWARD
                </span>
              </div>

              {/* Reward Item Box with Rainbow Crystal */}
              <div className="border-3 border-[#ffe500] bg-[#121212] p-1 comic-shadow-sm rounded-xs w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_3px,#222_3px,#222_6px)] opacity-50" />
                <img 
                  src={gemImg} 
                  alt="Clear Reward Crystal" 
                  className="w-12 h-12 object-contain relative z-10 anim-bounce drop-shadow-[0_0_8px_rgba(255,229,0,0.8)]"
                />
              </div>

              {/* Attempts Left Text */}
              <span className="comic-text text-white text-[10px] sm:text-[11px] font-black mt-1 uppercase">
                {attemptsLeft} LEFT!
              </span>
            </div>

            {/* Drop Reward (Hunter License Card / Chip) */}
            <div className="relative flex flex-col items-center">
              {/* Angled DROP Badge */}
              <div className="manga-skew bg-[#e60012] border-2 border-black text-white text-[9px] font-black px-2 py-0.2 comic-shadow-sm -mb-1.5 z-20 uppercase">
                <span className="manga-skew-reverse inline-block">
                  DROP
                </span>
              </div>

              {/* Drop Card Box */}
              <div className="border-3 border-black bg-[#101010] p-1 comic-shadow-sm rounded-xs w-12 h-12 flex items-center justify-center relative">
                {/* Chip / Card Item */}
                <div className="w-8 h-6 bg-gradient-to-r from-emerald-600 to-teal-400 border border-black rounded-xs flex items-center justify-center shadow-inner">
                  <span className="text-[9px] font-black text-black">
                    LIC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
