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
        {/* TAB 1: ホーム (HOME) */}
        <button
          onClick={() => onTabChange("home")}
          className={`manga-skew flex-1 py-1 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            {/* Anime Eye Icon */}
            <div className="text-base leading-none">👁️</div>
            <span className="text-[10px] font-black tracking-tight leading-tight mt-0.5">
              ホーム
            </span>
            <span className="text-[8px] font-mono tracking-widest opacity-80 uppercase leading-none">
              HOME
            </span>
          </div>
        </button>

        {/* TAB 2: 編成 (TEAM / FORMATION) */}
        <button
          onClick={() => onTabChange("team")}
          className={`manga-skew flex-1 py-1 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "team"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            {/* Hunter Team Icon */}
            <div className="text-base leading-none">👥</div>
            <span className="text-[10px] font-black tracking-tight leading-tight mt-0.5">
              編成
            </span>
            <span className="text-[8px] font-mono tracking-widest opacity-80 uppercase leading-none">
              TEAM
            </span>
          </div>
        </button>

        {/* TAB 3: クエスト (QUEST) - PRIMARY / ACTIVE */}
        <button
          onClick={() => onTabChange("quest")}
          className={`manga-skew flex-1 py-1 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer relative ${
            activeTab === "quest"
              ? "bg-[#ffe500] text-black comic-shadow-md scale-105 ring-2 ring-[#00f0ff]"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            {/* Nen Bullet / Target Quest Icon */}
            <div className="text-base leading-none anim-bounce">💣</div>
            <span className="text-[10px] font-black tracking-tight leading-tight mt-0.5">
              クエスト
            </span>
            <span className="text-[8px] font-mono tracking-widest opacity-80 uppercase leading-none">
              QUEST
            </span>
          </div>
        </button>

        {/* TAB 4: ガシャ (GACHA) */}
        <button
          onClick={() => onTabChange("gacha")}
          className={`manga-skew flex-1 py-1 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer relative ${
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
            <span className="text-[10px] font-black tracking-tight leading-tight mt-0.5">
              ガシャ
            </span>
            <span className="text-[8px] font-mono tracking-widest opacity-80 uppercase leading-none">
              GACHA
            </span>
          </div>
        </button>

        {/* TAB 5: メニュー (MENU) */}
        <button
          onClick={() => onTabChange("menu")}
          className={`manga-skew flex-1 py-1 px-0.5 border-2 border-black flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === "menu"
              ? "bg-[#ffe500] text-black comic-shadow-sm scale-105"
              : "bg-[#181818] text-white hover:bg-zinc-800"
          }`}
        >
          <div className="manga-skew-reverse flex flex-col items-center">
            <div className="text-base leading-none">📜</div>
            <span className="text-[10px] font-black tracking-tight leading-tight mt-0.5">
              メニュー
            </span>
            <span className="text-[8px] font-mono tracking-widest opacity-80 uppercase leading-none">
              MENU
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Footer Strip: チャット / タップでメッセージ / スタンプ / チャンネル */}
      <div className="relative bg-black px-2 py-1 flex items-center justify-between text-white border-t-2 border-zinc-800 text-xs">
        {/* Left: Chat Tab */}
        <div className="manga-skew bg-[#ffe500] text-black border border-black px-1.5 py-0.2 flex items-center gap-1 cursor-pointer hover:bg-white">
          <span className="manga-skew-reverse font-black text-[10px]">
            💬 チャット
          </span>
        </div>

        {/* Center: Tap for message box */}
        <div className="manga-skew bg-white/95 text-zinc-700 px-3 py-0.5 border border-black flex-1 mx-2 cursor-pointer hover:bg-white">
          <span className="manga-skew-reverse block text-center text-[10px] font-medium truncate">
            タップでメッセージ
          </span>
        </div>

        {/* Right side: Stamps & Channel */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-0.5 text-[#ffe500] hover:text-white font-bold text-[10px] cursor-pointer">
            <span>😊</span>
            <span>スタンプ</span>
          </button>
          <button className="flex items-center gap-0.5 text-[#ffe500] hover:text-white font-bold text-[10px] cursor-pointer">
            <span>📡</span>
            <span>チャンネル</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
