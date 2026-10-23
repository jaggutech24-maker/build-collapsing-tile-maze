import React from "react";
import type { HunterPartyMember } from "./AnimeTeamBar";

interface AnimeTeamModalProps {
  member: HunterPartyMember | null;
  onClose: () => void;
}

export default function AnimeTeamModal({ member, onClose }: AnimeTeamModalProps) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-sm border-4 border-black bg-gradient-to-b from-[#021b44] to-[#01091a] p-4 comic-shadow-xl rounded-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="manga-skew absolute top-2 right-2 w-8 h-8 bg-[#e60012] border-2 border-black text-white font-black text-sm flex items-center justify-center comic-shadow-sm hover:scale-105 cursor-pointer z-30"
        >
          <span className="manga-skew-reverse">✕</span>
        </button>

        {/* Header */}
        <div className="manga-skew inline-block bg-[#ffe500] border-2 border-black px-3 py-0.5 comic-shadow-sm mb-3">
          <span className="manga-skew-reverse font-display text-black text-sm font-black tracking-wider uppercase">
            HUNTER PROFILE
          </span>
        </div>

        {/* Member Showcase */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full border-4 border-[#ffe500] bg-black overflow-hidden comic-shadow anim-nen">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          </div>

          <h3 className="comic-text text-white text-xl font-black mt-1">
            {member.name}
          </h3>
          <div className="text-xs text-yellow-300 font-bold">{member.jpName}</div>

          {/* Stats Box */}
          <div className="w-full bg-black/70 border-2 border-white/40 p-3 rounded-sm my-2 text-left space-y-1.5 text-xs text-white">
            <div className="flex justify-between border-b border-white/20 pb-1">
              <span className="text-slate-400">Nen Affinity:</span>
              <span className="font-bold text-[#00f0ff]">{member.affinity}</span>
            </div>
            <div className="flex justify-between border-b border-white/20 pb-1">
              <span className="text-slate-400">Combat Power:</span>
              <span className="font-mono font-bold text-yellow-400">{member.power.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-white/20 pb-1">
              <span className="text-slate-400">Level:</span>
              <span className="font-bold">Lv.{member.level} / {member.maxLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rating:</span>
              <span className="text-yellow-400">★★★</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="manga-skew w-full bg-[#ffe500] hover:bg-yellow-300 active:scale-95 border-3 border-black text-black font-display font-black py-2 comic-shadow tracking-wider cursor-pointer mt-2"
          >
            <span className="manga-skew-reverse">CLOSE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
