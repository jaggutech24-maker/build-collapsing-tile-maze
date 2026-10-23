import React from "react";
import gemImg from "../assets/gem.jpg";

interface AnimeHeaderProps {
  chapterTitle?: string;
  chapterNumber?: string;
  gems?: number;
  muted?: boolean;
  onToggleMute?: () => void;
  onOpenGacha?: () => void;
}

export default function AnimeHeader({
  chapterTitle = "ナゾ × ノ × ショウジョ",
  chapterNumber = "02",
  gems = 10,
  muted = false,
  onToggleMute,
  onOpenGacha,
}: AnimeHeaderProps) {
  return (
    <header className="relative w-full z-20 select-none">
      {/* Top Hazard Black/Yellow angled strip */}
      <div className="relative flex items-center justify-between bg-black px-2.5 py-1.5 border-b-3 border-black overflow-hidden shadow-md">
        {/* Yellow caution angle slice in background */}
        <div 
          className="absolute -right-8 -top-8 w-44 h-24 bg-[#ffe500] transform rotate-12 -z-0 opacity-90 pointer-events-none" 
          style={{ clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)" }}
        />

        {/* Left Side: Chapter & Story Quest Badge */}
        <div className="relative z-10 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            {/* Red slanted badge: ストーリークエスト */}
            <span className="manga-skew inline-block bg-[#e60012] text-white text-[11px] sm:text-xs font-black px-2 py-0.5 border-2 border-black comic-shadow-sm tracking-wider">
              ストーリークエスト
            </span>
            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest hidden sm:inline">
              STORY QUEST
            </span>
          </div>

          {/* Chapter title with big bold red/white text */}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="comic-text-lg text-2xl sm:text-3xl text-[#e60012] tracking-tighter">
              {chapterNumber}章
            </span>
            <h1 className="comic-text text-lg sm:text-xl text-white tracking-wide uppercase drop-shadow">
              {chapterTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Currency & Audio controls */}
        <div className="relative z-10 flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={muted ? "Unmute BGM" : "Mute BGM"}
            className="manga-skew flex items-center justify-center w-8 h-8 rounded bg-black/80 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black text-white text-xs font-black transition-all comic-shadow-sm cursor-pointer"
          >
            <span className="manga-skew-reverse font-mono text-[10px]">
              {muted ? "🔇" : "BGM"}
            </span>
          </button>

          {/* Rainbow Nen Gem Currency Pill */}
          <div 
            onClick={onOpenGacha}
            title="Rainbow Nen Gems - Tap to Summon!"
            className="manga-skew flex items-center bg-[#151515] border-2 border-[#ffe500] rounded-sm pl-1 pr-1.5 py-0.5 gap-1.5 comic-shadow-sm cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          >
            {/* Rainbow Gem Icon */}
            <div className="manga-skew-reverse w-6 h-6 rounded-full overflow-hidden border border-black bg-black flex-shrink-0 animate-pulse">
              <img 
                src={gemImg} 
                alt="Rainbow Gem" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gem Count */}
            <span className="manga-skew-reverse font-display text-white text-sm sm:text-base font-extrabold tracking-wider px-1">
              {gems}
            </span>

            {/* Yellow Plus Button */}
            <div className="manga-skew-reverse w-5 h-5 rounded-full bg-[#ffe500] border-2 border-black flex items-center justify-center text-black font-black text-xs leading-none shadow hover:bg-white">
              +
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
