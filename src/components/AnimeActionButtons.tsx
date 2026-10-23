import React from "react";

interface AnimeActionButtonsProps {
  onBack?: () => void;
  onDeploy?: () => void;
  deployText?: string;
  backText?: string;
}

export default function AnimeActionButtons({
  onBack,
  onDeploy,
  deployText = "出発する",
  backText = "戻る",
}: AnimeActionButtonsProps) {
  return (
    <div className="relative w-full max-w-md mx-auto px-3 py-1 flex items-center justify-between select-none">
      {/* Decorative Anime Yellow Arrow Shards */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#ffe500] border-2 border-black rotate-45 pointer-events-none" />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#ffe500] border-2 border-black rotate-45 pointer-events-none" />

      {/* Left: 戻る (BACK) Button with dynamic zig-zag arrow */}
      <button
        onClick={onBack}
        className="manga-skew relative group flex items-center bg-[#ffe500] hover:bg-yellow-300 active:scale-95 border-3 border-black px-4 py-2 comic-shadow-lg transition-transform cursor-pointer"
      >
        {/* Dynamic Zigzag White/Black Arrow */}
        <div className="manga-skew-reverse flex items-center mr-1 text-black font-black text-lg">
          <svg
            className="w-5 h-5 fill-current stroke-black stroke-2"
            viewBox="0 0 24 24"
          >
            <path d="M12 2 L4 10 L10 10 L6 18 L18 12 L12 12 Z" />
          </svg>
        </div>
        <span className="manga-skew-reverse text-black font-jp text-sm sm:text-base font-black tracking-wider">
          {backText}
        </span>
      </button>

      {/* Right: HUGE Spiky Red Starburst Button: 出発する (DEPLOY / START) */}
      <div className="relative group cursor-pointer" onClick={onDeploy}>
        {/* Pulsing Spiky Starburst Comic Aura */}
        <div className="absolute inset-0 burst-shape bg-[#ffe500] scale-110 pointer-events-none anim-pulse opacity-90" />
        
        {/* Starburst Button Body */}
        <button className="relative burst-shape bg-gradient-to-br from-[#ff2a34] via-[#e60012] to-[#b8000a] text-white px-8 py-4 sm:px-9 sm:py-5 flex items-center justify-center border-4 border-black transition-transform group-hover:scale-105 active:scale-95 comic-shadow-xl cursor-pointer">
          <span className="comic-text-lg text-white text-xl sm:text-2xl font-black tracking-widest drop-shadow-md">
            {deployText}
          </span>
        </button>

        {/* Comic Sparkle Effect */}
        <div className="absolute -top-1 -right-1 text-yellow-300 text-lg pointer-events-none anim-bounce">
          ✦
        </div>
      </div>
    </div>
  );
}
