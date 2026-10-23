import React from "react";

export type NavTab = "home" | "team" | "quest" | "gacha" | "menu";

interface AnimeBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  gachaBadge?: boolean;
}

export default function AnimeBottomNav({
  activeTab = "quest",
  onTabChange,
  gachaBadge = true,
}: AnimeBottomNavProps) {
  return (
    <footer className="w-full max-w-md mx-auto select-none mt-auto">
      {/* Upper Navigation Tabs Bar */}
      <div className="relative z-10 flex items-stretch justify-between bg-black/90 border-t-3 border-black px-1 pt-1 gap-1">
        {/* TAB 1: HOME */}
        <button
          onClick={() => onTabChange("home")}
          className={`manga-skew flex-1 py-1.5 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            {/* Anime Eye Icon */}
            <div className="text-base leading-none">👁️</div>
            <span className="text-[10px] font-display font-black tracking-tight leading-tight mt-1 uppercase">
              HOME
            </span>
          </div>
        </button>

        {/* TAB 2: TEAM */}
        <button
          onClick={() => onTabChange("team")}
          className={`manga-skew flex-1 py-1.5 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "team"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            <div className="text-base leading-none">👥</div>
            <span className="text-[10px] font-display font-black tracking-tight leading-tight mt-1 uppercase">
              TEAM
            </span>
          </div>
        </button>

        {/* TAB 3: QUEST - PRIMARY / ACTIVE */}
        <button
          onClick={() => onTabChange("quest")}
          className={`manga-skew flex-1 py-1.5 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            activeTab === "quest"
              ? "bg-[#ffe500] text-black comic-shadow-md scale-105 ring-2 ring-[#00f0ff]"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            <div className="text-base leading-none anim-bounce">💣</div>
            <span className="text-[10px] font-display font-black tracking-tight leading-tight mt-1 uppercase">
              QUEST
            </span>
          </div>
        </button>

        {/* TAB 4: GACHA */}
        <button
          onClick={() => onTabChange("gacha")}
          className={`manga-skew flex-1 py-1.5 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            activeTab === "gacha"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          {/* Exclamation / Red Alert badge */}
          {gachaBadge && (
            <div className="absolute -top-1.5 -right-1 z-20 anim-pulse">
              <span className="w-4 h-4 rounded-full bg-[#e60012] border-2 border-black flex items-center justify-center text-[9px] font-black text-white">
                !
              </span>
            </div>
          )}
          <div className="manga-skew-reverse flex flex-col items-center">
            <div className="text-base leading-none">🚪</div>
            <span className="text-[10px] font-display font-black tracking-tight leading-tight mt-1 uppercase">
              GACHA
            </span>
          </div>
        </button>

        {/* TAB 5: MENU */}
        <button
          onClick={() => onTabChange("menu")}
          className={`manga-skew flex-1 py-1.5 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "menu"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            <div className="text-base leading-none">📜</div>
            <span className="text-[10px] font-display font-black tracking-tight leading-tight mt-1 uppercase">
              MENU
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Footer Strip: CHAT / Tap to send message / STAMPS / CHANNELS */}
      <div className="relative bg-black px-2 py-1 flex items-center justify-between text-white border-t-2 border-zinc-800 text-xs">
        {/* Left: Chat Tab */}
        <div className="manga-skew bg-[#ffe500] text-black border border-black px-2 py-0.2 flex items-center gap-1 cursor-pointer hover:bg-white">
          <span className="manga-skew-reverse font-display font-black text-[10px] uppercase">
            💬 CHAT
          </span>
        </div>

        {/* Center: Tap to send message */}
        <div className="manga-skew bg-white/95 text-zinc-700 px-3 py-0.5 border border-black flex-1 mx-2 cursor-pointer hover:bg-white">
          <span className="manga-skew-reverse block text-center text-[10px] font-medium truncate">
            Tap to send message
          </span>
        </div>

        {/* Right side: Stamps & Channels */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-0.5 text-[#ffe500] hover:text-white font-bold text-[10px] cursor-pointer uppercase">
            <span>😊</span>
            <span>STAMPS</span>
          </button>
          <button className="flex items-center gap-0.5 text-[#ffe500] hover:text-white font-bold text-[10px] cursor-pointer uppercase">
            <span>📡</span>
            <span>CHANNEL</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
