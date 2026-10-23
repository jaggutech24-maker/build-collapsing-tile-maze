import React, { useState } from "react";
import gemImg from "../assets/gem.jpg";
import gonImg from "../assets/gon.jpg";
import killuaImg from "../assets/killua.jpg";
import kurapikaImg from "../assets/kurapika.jpg";

interface AnimeGachaModalProps {
  gems: number;
  onSpendGems: (amount: number) => boolean;
  onClose: () => void;
}

const GACHA_CHARACTERS = [
  { name: "Gon Freecss", jp: "ゴン＝フリークス", rarity: "SSR ★★★★★", type: "強化系 (Enhancer)", img: gonImg, phrase: "最初ハ グー！ジャン・ケン・グー！" },
  { name: "Killua Zoldyck", jp: "キルア＝ゾルディック", rarity: "SSR ★★★★★", type: "変化系 (Transmuter)", img: killuaImg, phrase: "クセになってんだ、音殺して動くの。" },
  { name: "Kurapika", jp: "クラピカ", rarity: "SSR ★★★★★", type: "具現化系 (Conjurer)", img: kurapikaImg, phrase: "命を賭けることと命を軽く扱うことは正反対だ。" },
];

export default function AnimeGachaModal({
  gems,
  onSpendGems,
  onClose,
}: AnimeGachaModalProps) {
  const [pulling, setPulling] = useState(false);
  const [summonResult, setSummonResult] = useState<(typeof GACHA_CHARACTERS)[0] | null>(null);

  const handleSummon = () => {
    if (gems < 5) {
      alert("虹の結晶が足りません！ (Need at least 5 Rainbow Gems!)");
      return;
    }
    const success = onSpendGems(5);
    if (!success) return;

    setPulling(true);
    setSummonResult(null);

    setTimeout(() => {
      const picked = GACHA_CHARACTERS[Math.floor(Math.random() * GACHA_CHARACTERS.length)];
      setSummonResult(picked);
      setPulling(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-sm border-4 border-black bg-gradient-to-b from-[#11052c] via-[#220038] to-[#0d001a] p-4 comic-shadow-xl text-center rounded-sm overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="manga-skew absolute top-2 right-2 w-8 h-8 bg-[#e60012] border-2 border-black text-white font-black text-sm flex items-center justify-center comic-shadow-sm hover:scale-105 cursor-pointer z-30"
        >
          <span className="manga-skew-reverse">✕</span>
        </button>

        {/* Title Badge */}
        <div className="manga-skew inline-block bg-[#ffe500] border-3 border-black px-4 py-1 comic-shadow-sm mb-3">
          <span className="manga-skew-reverse font-display text-black text-base font-black tracking-widest uppercase">
            NEN SUMMON GACHA
          </span>
        </div>

        {/* Summon animation or showcase */}
        <div className="relative my-3 p-4 border-3 border-black bg-black/60 min-h-[220px] flex flex-col items-center justify-center overflow-hidden">
          {/* Halftone texture */}
          <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />

          {pulling ? (
            <div className="flex flex-col items-center gap-3 anim-pulse">
              <div className="w-20 h-20 rounded-full border-4 border-[#ffe500] bg-white flex items-center justify-center anim-nen">
                <span className="text-4xl">⚡</span>
              </div>
              <div className="comic-text text-[#ffe500] text-lg font-black">
                SUMMONING NEN AURA...
              </div>
              <div className="text-xs text-white">オーラ解放中！</div>
            </div>
          ) : summonResult ? (
            <div className="flex flex-col items-center gap-2 anim-pulse">
              <div className="text-xs text-[#ffe500] font-black tracking-widest">
                {summonResult.rarity}
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-[#ffe500] bg-black overflow-hidden comic-shadow anim-nen">
                <img src={summonResult.img} alt={summonResult.name} className="w-full h-full object-cover" />
              </div>
              <div className="comic-text text-white text-base font-black">
                {summonResult.name}
              </div>
              <div className="text-[11px] text-[#00f0ff] font-bold">
                {summonResult.type}
              </div>
              <div className="text-[10px] text-yellow-300 italic max-w-[200px] mt-1 bg-black/80 px-2 py-0.5 border border-yellow-400">
                "{summonResult.phrase}"
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img src={gemImg} alt="Gacha" className="w-20 h-20 object-contain anim-bounce" />
              <div className="comic-text text-white text-sm font-black">
                HUNTER PREMIUM RECRUIT
              </div>
              <p className="text-[11px] text-slate-300 max-w-[220px]">
                Spend 5 Rainbow Gems to summon powerful Hunters to boost your Combat Power!
              </p>
            </div>
          )}
        </div>

        {/* Gem Balance */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white mb-3">
          <span>Current Gems:</span>
          <img src={gemImg} alt="Gem" className="w-4 h-4 object-contain" />
          <span className="text-[#ffe500] font-mono font-black text-sm">{gems}</span>
        </div>

        {/* Summon Button */}
        <button
          onClick={handleSummon}
          disabled={pulling || gems < 5}
          className={`manga-skew w-full border-3 border-black py-2.5 comic-shadow-lg font-display text-base font-black tracking-wider transition-all cursor-pointer ${
            gems >= 5
              ? "bg-[#ffe500] hover:bg-yellow-300 text-black active:scale-95"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <span className="manga-skew-reverse flex items-center justify-center gap-2">
            <span>SUMMON 1x</span>
            <span>(5 💎)</span>
          </span>
        </button>
      </div>
    </div>
  );
}
