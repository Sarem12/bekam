"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Lightbulb, MoreVertical, Copy, RefreshCw, Trash2 } from "lucide-react";

export function Analogy({ text }: { text: string }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative my-6 ml-4 w-fit min-w-[320px] max-w-[95%] rounded-lg border border-amber-500/30 shadow-xl backdrop-blur-md">
      
      {/* Header Bar */}
      <div className="flex items-center rounded-t-lg border-b border-amber-500/20 bg-amber-500/20 px-4 py-2">
        <Lightbulb className="h-4 w-4 text-amber-600" />
        
        <h4 className="flex-1 text-center text-[12px] font-medium tracking-[0.2em] text-amber-600 uppercase">
          Analogy
        </h4>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-amber-500/30 transition-all text-amber-600 active:scale-90"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* THE OUTSIDE MENU - SWAPPED SLATE FOR NEUTRAL */}
          {showMenu && (
            <>
              {/* Invisible backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              
              {/* Menu Container: Swapped slate for neutral/900 (Pure Dark Gray)
                  and border for neutral/700 */}
              <div className="absolute right-0 top-full z-50 mt-2 w-52 origin-top-right rounded-xl border border-neutral-700/50 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 mb-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Options
                </div>
                
                <MenuOption icon={<Copy size={14}/>} label="Copy to Clipboard" onClick={() => setShowMenu(false)} />
                <MenuOption icon={<RefreshCw size={14}/>} label="Try another version" onClick={() => setShowMenu(false)} />
                
                {/* Separator Line */}
                <div className="my-1 border-t border-neutral-800/60" />
                
                <MenuOption 
                    icon={<Trash2 size={14} />} 
                    label="Delete Analogy" 
                    className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    onClick={() => setShowMenu(false)} 
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Area (Remains Pure and Tinted Paper) */}
      <div className="rounded-b-lg px-6 py-4 text-[13px] leading-relaxed text-slate-200 bg-amber-500/5">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

function MenuOption({ icon, label, onClick, className = "" }: { icon: any, label: string, onClick: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      /* MenuOption Hover Style: Also using neutral and a subtle white transparent tint */
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-all active:bg-white/15 ${className}`}
    >
      <span className="opacity-70 group-hover:opacity-100">{icon}</span>
      {label}
    </button>
  );
}