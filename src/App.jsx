import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TROPHY_COST = 100000;
const PLAYOFF_TICKET_COST = 10000;
const DOUBLE_OR_NOTHING_UPGRADE_COST = 20000;
const SUPER_GOLDEN_COST = 5000;
const COACH_CHALLENGE_COST = 500;
const COURT_VISION_COSTS = [75, 200, 500, 1200, 3000];
const COURT_VISION_CHANCES = [25, 35, 45, 55, 65];
const OPEN_LOOK_ODDS_BONUS = { layup: 5, freeThrow: 10, three: 15, halfCourt: 20 };
const OPEN_LOOK_POINTS_MULT = 1.25;
const SAVE_KEY = "fullCourtGrindSaveV1";
const RIM = { x: 50, y: 3.8 };
const FRONT_RIM_LEFT = { x: 44.2, y: 7.0 };
const FRONT_RIM_RIGHT = { x: 55.8, y: 7.0 };
const MISS_DEFLECT_LEFT = { x: 38.5, y: 9.8 };
const MISS_DEFLECT_RIGHT = { x: 61.5, y: 9.8 };
const RIM_IN_BOUNCE = { x: 50.9, y: 3.7 };
const RIM_SAVE_POP = { x: 47.8, y: 5.2 };
const RIM_SAVE_DEFLECT_RIGHT = { x: 52.8, y: 9.0 };
const RIM_SAVE_DEFLECT_LEFT = { x: 47.2, y: 9.0 };
const RIM_SAVE_CENTER = { x: 50.2, y: 5.8 };
const RIM_DROP_Y = 11.5;
const BACK_RIM_TARGET = { x: 50, y: 7.0 };
const MAKE_DROP_TARGET = { x: 50, y: 11.5 };
const PLAYOFF_BACK_RIM_TARGET = { x: 50, y: 21.2 };

const EXTRA_BALL_COSTS = [2, 8, 25, 70, 180, 400, 900, 2000];
const SPECIALIST_COSTS = [15, 45, 120, 300, 700, 1400, 2600, 4500, 7500, 11500, 17000, 24000];
const SPECIALIST_LEVEL_CAPS = {
  layup: 2,
  freeThrow: 5,
  three: 8,
  halfCourt: 9,
};
const HOT_HAND_COSTS = [5, 25, 75, 200, 550, 1200, 2600, 5000];
const HOT_HAND_MULTS = [2, 4, 8, 12, 18, 25, 35, 50];
const DOUBLE_RIM_COSTS = [40, 125, 350, 900, 2200];
const GOLDEN_BALL_COSTS = [15, 50, 150, 450, 1200];
const NEUTRAL_LOCKER_PHRASES = [
  "Hit the Showers",
  "Back to the Lab",
  "Check the Box Score",
  "Reload the Jumper",
  "Watch the Film",
  "Grab the Clipboard",
  "Film Session Time",
  "Reset the Game Plan",
];

const INSULT_LOCKER_PHRASES = [
  "Coach Wants a Word",
  "The Bench Is Calling",
  "Check Your Form",
  "Find Your Jumper",
  "Coach Pulled You",
  "Work on the Release",
  "Blame the Shoes",
  "Count Your Bricks",
  "Nice Try, Champ",
  "The Rim Won",
  "Somebody Check the Airball",
  "Not Your Finest Run",
  "Bench Needs You",
  "Pack It Up, Shooter",
];

const BIG_SCORE_THRESHOLD = 750;
const BAD_TRIP_THRESHOLD = 100;
const SCORE_REVEAL_DELAY = 500;
const HOT_STREAK_PHRASES = [
  "He's Heating Up",
  "Let Him Cook",
  "Locked In",
  "The Rim Looks Huge",
  "Can't Miss Right Now",
  "Keep Feeding Him",
];
const BIG_STREAK_PHRASES = [
  "Takeover Mode",
  "Someone Call Timeout",
  "White Hot",
  "Out of His Mind",
  "The Hoop Is a Swimming Pool",
  "Make It Rain",
];
const MISS_STREAK_PHRASES = [
  "Brick Watch",
  "Not in Front of the Scouts",
  "Coach Is Pacing",
  "The Hoop Moved",
  "Cold Spell",
  "I Usually Hit Those",
  "What Is Wrong With Me Today",
];
const BIG_SCORE_PHRASES = [
  "Bank Teller Flirting",
  "That Shot Paid Rent",
  "Scoreboard Broke",
  "Massive Payday",
  "The Bank Is Open",
  "Video Game Numbers",
  "Hang the Banner",
];
const GOLDEN_PHRASES = [
  "Golden Touch",
  "Gold Rush",
  "Money Ball",
  "Shiny Bucket",
  "Midas Mode",
  "Gold Standard",
  "Jackpot Ball",
  "That Ball's Different",
];
const SUPER_GOLDEN_PHRASES = [
  "Nuclear Bucket",
  "Jackpot Overload",
  "Delete the Scoreboard",
  "The Big One",
  "Crown Jewel",
  "Maximum Greed",
];
const RIM_SAVE_PHRASES = [
  "✓✓ Saved by the Rim",
  "✓✓ That Was Close",
  "✓✓ Lucky Bounce",
  "✓✓ Never a Doubt",
];

const DOUBLE_OR_NOTHING_MADE_PHRASES = [
  "Gamble Paid Off",
  "Cold Blooded",
  "That Took Nerve",
  "Big Baller Energy",
  "I Bet That Felt Good",
];

const DOUBLE_OR_NOTHING_MISS_PHRASES = [
  "Vegas Wins Again",
  "House Always Wins",
  "Pain.",
  "That Was Expensive",
];

const CALLOUT_STYLES = {
  hot: "bg-red-500 text-white border-red-200 shadow-[0_0_18px_rgba(239,68,68,0.7)]",
  bigStreak: "bg-orange-500 text-white border-yellow-200 shadow-[0_0_22px_rgba(251,146,60,0.8)]",
  golden: "bg-yellow-400 text-slate-950 border-white shadow-[0_0_24px_rgba(250,204,21,0.9)]",
  superGolden: "bg-white text-yellow-700 border-yellow-300 shadow-[0_0_30px_rgba(255,255,255,0.95)]",
  miss: "bg-slate-900 text-red-300 border-red-400 shadow-[0_0_16px_rgba(239,68,68,0.45)]",
  bigScore: "bg-green-400 text-slate-950 border-white shadow-[0_0_22px_rgba(74,222,128,0.85)]",
  rimSave: "bg-emerald-400 text-slate-950 border-white shadow-[0_0_16px_rgba(52,211,153,0.75)]",
};

const SHOT_CONFIG = {
  layup: { id: "layup", label: "Layup", points: 1, baseOdds: 55, maxOdds: 80, upgradeStep: 5, costs: [2, 8, 25, 75, 180], x: 72, y: 13 },
  freeThrow: { id: "freeThrow", label: "Free Throw", points: 2, baseOdds: 45, maxOdds: 75, upgradeStep: 5, unlockCost: 10, costs: [10, 25, 65, 160, 400, 950], x: 50, y: 35 },
  three: { id: "three", label: "Three Pointer", points: 3, baseOdds: 30, maxOdds: 65, upgradeStep: 5, unlockCost: 35, costs: [20, 60, 150, 350, 800, 1700, 3500], x: 33, y: 56 },
  halfCourt: { id: "halfCourt", label: "Half Court", points: 5, baseOdds: 15, maxOdds: 45, upgradeStep: 5, unlockCost: 100, costs: [40, 120, 300, 700, 1600, 3500], x: 50, y: 79 },
};

const THEME = {
  possessions: { header: "bg-sky-950/60 border-sky-400/60 text-sky-300", card: "bg-gradient-to-br from-sky-950/60 via-slate-900 to-slate-950 border-sky-400/60", title: "text-sky-200", add: "text-sky-300", button: "bg-sky-500 hover:bg-sky-600 text-white", bar: "bg-sky-400" },
  lab: { header: "bg-orange-950/60 border-orange-400/60 text-orange-300", card: "bg-gradient-to-br from-orange-950/50 via-slate-900 to-slate-950 border-orange-400/60", title: "text-orange-200", add: "text-orange-300", button: "bg-orange-500 hover:bg-orange-600 text-white", bar: "bg-orange-400" },
  hot: { header: "bg-red-950/60 border-red-400/60 text-red-300", card: "bg-gradient-to-br from-red-950/60 via-rose-950/30 to-slate-900 border-red-400/60", title: "text-red-200", add: "text-red-300", button: "bg-red-500 hover:bg-red-600 text-white", bar: "bg-red-400" },
  rim: { header: "bg-emerald-950/60 border-emerald-400/60 text-emerald-300", card: "bg-gradient-to-br from-emerald-950/60 via-teal-950/30 to-slate-900 border-emerald-400/60", title: "text-emerald-200", add: "text-emerald-300", button: "bg-emerald-500 hover:bg-emerald-600 text-white", bar: "bg-emerald-400" },
  golden: { header: "bg-yellow-950/60 border-yellow-400/60 text-yellow-300", card: "bg-gradient-to-br from-yellow-900/50 via-amber-950/40 to-slate-900 border-yellow-400/70", title: "text-yellow-200", add: "text-yellow-300", button: "bg-yellow-400 hover:bg-yellow-500 text-slate-950", bar: "bg-yellow-300" },
  challenge: { header: "bg-cyan-950/60 border-cyan-400/60 text-cyan-300", card: "bg-gradient-to-br from-cyan-950/60 via-blue-950/30 to-slate-900 border-cyan-400/60", title: "text-cyan-200", add: "text-cyan-300", button: "bg-cyan-500 hover:bg-cyan-600 text-white", bar: "bg-cyan-400" },
  vision: { header: "bg-lime-950/60 border-lime-400/60 text-lime-300", card: "bg-gradient-to-br from-lime-950/55 via-emerald-950/25 to-slate-900 border-lime-400/60", title: "text-lime-200", add: "text-lime-300", button: "bg-lime-500 hover:bg-lime-600 text-slate-950", bar: "bg-lime-400" },
  mystery: { header: "border-white/20 text-white bg-[linear-gradient(90deg,rgba(168,85,247,0.18),rgba(59,130,246,0.16),rgba(16,185,129,0.14),rgba(250,204,21,0.14),rgba(244,114,182,0.16))]", card: "border-white/20 text-white bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(88,28,135,0.28),rgba(30,64,175,0.22),rgba(5,150,105,0.18),rgba(202,138,4,0.18),rgba(190,24,93,0.2))] shadow-[0_0_26px_rgba(255,255,255,0.06)]", title: "text-white", add: "text-fuchsia-200", button: "bg-white/12 hover:bg-white/18 text-white border border-white/20", bar: "bg-gradient-to-r from-fuchsia-400 via-sky-400 via-emerald-300 to-amber-300" },
  trophy: { header: "bg-gradient-to-r from-yellow-300/22 via-amber-300/18 to-orange-300/16 border-yellow-300/40 text-yellow-100", card: "bg-gradient-to-br from-yellow-300/16 via-amber-400/14 to-slate-950 border-yellow-300/45", title: "text-yellow-200", add: "text-yellow-200", button: "bg-yellow-400 hover:bg-yellow-500 text-slate-950", bar: "bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400" },
  neutral: { header: "bg-slate-900/80 border-slate-600 text-slate-300", card: "bg-slate-900 border-slate-700", title: "text-slate-100", add: "text-slate-300", button: "bg-slate-700 hover:bg-slate-600 text-white", bar: "bg-slate-400" },
};

function formatNumber(value) { return Math.floor(value || 0).toLocaleString(); }
function pickPhrase(pool, seed = 0) { return pool[Math.abs(Math.floor(seed)) % pool.length]; }
function hypeTextSize(value) {
  if (value >= 35) return "text-4xl scale-125";
  if (value >= 25) return "text-3xl scale-115";
  if (value >= 12) return "text-2xl scale-110";
  if (value >= 4) return "text-xl scale-105";
  return "text-base";
}
function hypePulse(value) {
  if (value >= 25) return "animate-pulse drop-shadow-[0_0_18px_rgba(248,113,113,1)]";
  if (value >= 12) return "animate-pulse drop-shadow-[0_0_14px_rgba(251,146,60,0.95)]";
  if (value >= 4) return "drop-shadow-[0_0_10px_rgba(251,146,60,0.85)]";
  return "";
}
function streakTextSize(value) {
  if (value >= 7) return "text-2xl scale-110";
  if (value >= 5) return "text-xl scale-105";
  if (value >= 3) return "text-lg";
  return "text-base";
}
function shotBallScoreSize(points) {
  if (points >= 1000) return "text-[17px] scale-125 drop-shadow-[0_0_10px_rgba(134,239,172,1)]";
  if (points >= 500) return "text-[16px] scale-115 drop-shadow-[0_0_8px_rgba(134,239,172,0.95)]";
  if (points >= 250) return "text-[15px] scale-110 drop-shadow-[0_0_7px_rgba(134,239,172,0.85)]";
  if (points >= 100) return "text-[14px] scale-105 drop-shadow-[0_0_6px_rgba(134,239,172,0.7)]";
  if (points >= 50) return "text-[13px] drop-shadow-[0_0_5px_rgba(134,239,172,0.55)]";
  if (points >= 25) return "text-[12px]";
  if (points >= 10) return "text-[11px]";
  return "text-[10px]";
}
function shotBallSize(points) {
  if (points >= 1000) return "h-12 w-12";
  if (points >= 500) return "h-11 w-11";
  if (points >= 250) return "h-10 w-10";
  return "h-9 w-9";
}
function Shell({ children }) { return <div className="font-sans antialiased min-h-[100dvh] bg-slate-950 text-white flex justify-center overflow-hidden"><div className="w-full max-w-md min-h-[100dvh] bg-slate-950 overflow-hidden">{children}</div></div>; }
function Card({ children, className = "", ...props }) { return <div className={`rounded-3xl shadow-2xl ${className}`} {...props}>{children}</div>; }
function UpgradeButton({ children, disabled, onClick, className = "" }) { return <button type="button" disabled={disabled} onClick={onClick} className={`${className} disabled:cursor-not-allowed transition active:scale-[0.98]`}>{children}</button>; }

function StatBox({ label, value, color = "text-white", maxed = false, valueSize = "text-sm", onClick = undefined, maxTheme = "emerald", labelSize = "text-[7px]", heightClass = "h-[44px]" }) {
  const maxClass = maxed
    ? maxTheme === "sky"
      ? "bg-sky-950/70 border-sky-300/70 shadow-[0_0_16px_rgba(56,189,248,0.42)]"
      : maxTheme === "red"
      ? "bg-red-950/70 border-red-300/70 shadow-[0_0_16px_rgba(248,113,113,0.42)]"
      : maxTheme === "yellow"
      ? "bg-yellow-950/70 border-yellow-300/70 shadow-[0_0_16px_rgba(250,204,21,0.45)]"
      : maxTheme === "superGold"
      ? "bg-gradient-to-br from-yellow-200/25 via-white/14 to-yellow-950/70 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.58)]"
      : "bg-emerald-950/70 border-emerald-300/70 shadow-[0_0_16px_rgba(52,211,153,0.42)]"
    : "bg-slate-900/80 border-slate-700";
  return <div onClick={onClick} className={`${heightClass} rounded-xl border px-2 py-1.5 text-center relative overflow-hidden flex flex-col items-center justify-center active:scale-[0.98] ${maxClass}`}><p className={`${labelSize} uppercase tracking-wide text-slate-500 font-black leading-none`}>{label}</p><p className={`mt-1 ${valueSize} font-black leading-tight ${color}`}>{value}</p></div>;
}

function SingleTrackUpgradeCard({ title, theme = "lab", label, current, add, cost, level, max, onBuy, currentPoints, note = null, locked = false }) {
  const [showNote, setShowNote] = useState(false);
  const [noteAnchorY, setNoteAnchorY] = useState(0);
  const holdTimer = useRef(null);
  const t = THEME[theme] || THEME.lab;
  const maxed = level >= max;
  const disabled = currentPoints < cost;
  const buttonClass = maxed ? "bg-emerald-700/40 text-emerald-200" : disabled ? "bg-slate-800 text-slate-500" : t.button;
  const popupShiftClass = "translate-y-0";
  const noteTitle = note?.includes(":") ? note.split(":")[0] : "Info";
  const noteBody = note?.includes(":") ? note.slice(note.indexOf(":") + 1).trim() : note;

  function startInfoHold(event) {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      setNoteAnchorY(Math.max(12, rect.top));
      setShowNote(true);
    }, 100);
  }

  function stopInfoHold(event) {
    event?.preventDefault?.();
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setShowNote(false);
  }

  const infoHandlers = note
    ? {
        onPointerDown: startInfoHold,
        onPointerUp: stopInfoHold,
        onPointerCancel: stopInfoHold,
        onTouchStart: startInfoHold,
        onTouchEnd: stopInfoHold,
        onTouchCancel: stopInfoHold,
        onContextMenu: (event) => event.preventDefault(),
      }
    : {};

  const InfoButton = note ? (
    <button
      type="button"
      {...infoHandlers}
      className="absolute right-0 top-0 z-30 inline-flex h-11 w-11 select-none touch-none items-start justify-end rounded-xl pr-2 pt-2 text-[12px] font-black italic leading-none text-slate-300 active:scale-95 before:absolute before:right-2 before:top-2 before:h-6 before:w-6 before:rounded-full before:border before:border-slate-600 before:bg-slate-950/85 before:shadow-sm"
    >
      <span className="relative z-10 flex h-6 w-6 items-center justify-center">i</span>
    </button>
  ) : null;

  const InfoPopup = note && showNote ? (
    <div
      className={`fixed left-[43%] w-[min(300px,calc(100vw-56px))] -translate-x-1/2 ${popupShiftClass} select-none rounded-2xl border border-sky-300/30 bg-slate-950/98 px-4 py-3 text-left text-[12px] font-medium leading-snug text-slate-100 whitespace-pre-line shadow-[0_0_28px_rgba(0,0,0,0.88),0_0_16px_rgba(14,165,233,0.16)] backdrop-blur-md pointer-events-none`}
      style={{ top: `${noteAnchorY}px`, zIndex: 2147483647, WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      <span className={`font-black ${t.title}`}>{noteTitle}:</span> {noteBody}
    </div>
  ) : null;

  if (locked) {
    return (
      <div className={`relative col-span-2 rounded-xl border shadow-sm p-2.5 ${t.card} min-h-[142px]`}>
        <div className="absolute inset-0 bg-slate-950/45 z-0" />
        {InfoPopup}
        {InfoButton}
        <div className="relative z-10 flex items-center gap-2 min-w-0 pr-8">
          <span className="text-sm">🔒</span>
          <p className={`text-[15px] font-black leading-tight ${t.title}`}>{title}</p>
        </div>
        <div className="relative z-10 mt-1.5 rounded-xl bg-slate-950/45 border border-slate-800 px-2.5 py-2 opacity-55">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p>
          <p className="text-sm font-black text-slate-300 mt-1 leading-tight">{current}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700" />
            <p className="text-[10px] font-black text-slate-400 w-10 text-right">0/{max}</p>
          </div>
          <p className="text-xs font-black mt-1 text-slate-400">{add}</p>
        </div>
        <div className="absolute inset-x-0 top-16 bottom-3 z-20 flex items-center justify-center pointer-events-none">
          <button type="button" onClick={onBuy} disabled={disabled} className={`pointer-events-auto w-24 h-[88px] rounded-2xl border-2 text-xs font-black shadow-xl transition active:scale-[0.98] ${disabled ? "bg-slate-800 border-slate-700 text-slate-500" : `${t.button} border-white/30`}`}>
            <div className="flex h-full w-full flex-col items-center justify-center">
              <span className="text-2xl">{title === "Coach’s Challenge" ? "📋" : "🔒"}</span>
              <span>{title === "Coach’s Challenge" ? "Bribe the Refs" : "Unlock"}</span>
              <span className="text-sm mt-1">{formatNumber(cost)} pts</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative col-span-2 rounded-xl border shadow-sm p-2.5 ${maxed ? "bg-emerald-950/40 border-emerald-500/50" : t.card}`}>
      {InfoPopup}
      {InfoButton}
      <div className="flex items-center gap-2 min-w-0 pr-8">
        <p className={`text-[15px] font-black leading-tight ${maxed ? "text-emerald-200" : t.title}`}>{title}</p>
      </div>
      <div className="mt-1.5 rounded-xl bg-slate-950/70 border border-slate-800 px-2.5 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p>
            <p className="text-sm font-black text-slate-100 mt-1 leading-tight">{current}</p>
          </div>
          <UpgradeButton onClick={onBuy} disabled={disabled || maxed} className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${buttonClass}`}>{maxed ? "Maxed" : `Upgrade ${formatNumber(cost)} pts`}</UpgradeButton>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700"><div className={`h-full rounded-full ${t.bar}`} style={{ width: `${Math.min(100, (level / max) * 100)}%` }} /></div>
          <p className="text-[10px] font-black text-slate-300 w-10 text-right">{level}/{max}</p>
        </div>
        <p className={`text-xs font-black mt-1 ${maxed ? "text-emerald-300" : t.add}`}>{maxed ? "Maxed" : add}</p>
      </div>
    </div>
  );
}

function ShotUpgradeCard({ title, theme = "lab", accuracyCurrent, accuracyAdd, accuracyCost, accuracyLevel, accuracyMax, onBuyAccuracy, valueCurrent, valueAdd, valueCost, valueLevel, valueMax, onBuyValue, currentPoints, locked = false, unlockCost = 0, onUnlock = null }) {
  const t = THEME[theme] || THEME.lab;
  const Row = ({ label, current, add, cost, level, max, onBuy }) => {
    const maxed = level >= max;
    const disabled = currentPoints < cost;
    return <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2"><div className="flex items-center justify-between gap-2"><div><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p><p className="text-sm font-black text-slate-100 mt-1 leading-tight">{current}</p></div><UpgradeButton onClick={onBuy} disabled={disabled || maxed} className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${maxed ? "bg-emerald-700/40 text-emerald-200" : disabled ? "bg-slate-800 text-slate-500" : t.button}`}>{maxed ? "Maxed" : `Upgrade ${formatNumber(cost)} pts`}</UpgradeButton></div><div className="mt-2 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700"><div className={`h-full rounded-full ${t.bar}`} style={{ width: `${Math.min(100, (level / max) * 100)}%` }} /></div><p className="text-[10px] font-black text-slate-300 w-10 text-right">{level}/{max}</p></div><p className={`text-xs font-black mt-1 ${maxed ? "text-emerald-300" : t.add}`}>{maxed ? "Maxed" : add}</p></div>;
  };

  if (locked) {
    return <div className={`col-span-2 rounded-xl border shadow-sm p-2.5 ${t.card} relative overflow-hidden min-h-[196px]`}><div className="absolute inset-0 bg-slate-950/45 z-0" /><p className={`relative z-10 text-base font-black leading-tight ${t.title}`}>{title}</p><div className="relative z-10 mt-2 grid grid-cols-1 gap-2 opacity-50"><div className="rounded-xl bg-slate-950/45 border border-slate-800 px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">Make Chance</p><p className="text-sm font-black text-slate-300 mt-1 leading-tight">{accuracyCurrent}</p><div className="mt-2 h-2 rounded-full bg-slate-800 border border-slate-700" /><p className="text-xs font-black mt-1 text-slate-400">{accuracyAdd}</p></div><div className="rounded-xl bg-slate-950/45 border border-slate-800 px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">Shot Value</p><p className="text-sm font-black text-slate-300 mt-1 leading-tight">{valueCurrent}</p><div className="mt-2 h-2 rounded-full bg-slate-800 border border-slate-700" /><p className="text-xs font-black mt-1 text-slate-400">{valueAdd}</p></div></div><div className="absolute inset-x-0 top-14 bottom-2 z-20 flex items-center justify-center pointer-events-none"><button type="button" onClick={onUnlock} disabled={currentPoints < unlockCost} className={`pointer-events-auto w-28 h-28 rounded-3xl border-2 text-sm font-black shadow-xl transition active:scale-[0.98] ${currentPoints < unlockCost ? "bg-slate-800 border-slate-700 text-slate-500" : `${t.button} border-white/30`}`}><div className="flex h-full w-full flex-col items-center justify-center"><span className="text-2xl">{title === "Coach’s Challenge" ? "📋" : "🔒"}</span><span>Unlock</span><span className="text-sm mt-1">{formatNumber(unlockCost)} pts</span></div></button></div></div>;
  }

  return <div className={`col-span-2 rounded-xl border shadow-sm p-2.5 ${t.card}`}><p className={`text-base font-black leading-tight ${t.title}`}>{title}</p><div className="mt-2 grid grid-cols-1 gap-2"><Row label="Make Chance" current={accuracyCurrent} add={accuracyAdd} cost={accuracyCost} level={accuracyLevel} max={accuracyMax} onBuy={onBuyAccuracy} /><Row label="Shot Value" current={valueCurrent} add={valueAdd} cost={valueCost} level={valueLevel} max={valueMax} onBuy={onBuyValue} /></div></div>;
}

function TrophyCard({ title, text, buttonText, disabled, maxed, onClick, className, titleClassName, buttonClassName }) {
  return <div className={`col-span-2 rounded-xl border shadow-sm p-2.5 ${className}`}><p className={`text-base font-black ${titleClassName}`}>{title}</p>{text ? <p className="mt-1 text-[11px] leading-snug text-slate-300">{text}</p> : null}<button type="button" disabled={disabled || maxed} onClick={onClick} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-black ${maxed ? "bg-emerald-700/40 text-emerald-200" : disabled ? "bg-slate-800 text-slate-500" : buttonClassName}`}>{maxed ? "Claimed" : buttonText}</button></div>;
}

function HotHandFire() {
  return (
    <div className="absolute left-1/2 top-1/2 z-[-1] h-20 w-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.68, 0.56], rotate: [-4, 4, -4] }}
        transition={{ duration: 0.42, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-[72px] leading-none drop-shadow-[0_0_12px_rgba(249,115,22,0.65)]"
      >
        <span className="block -translate-y-[8px]">🔥</span>
      </motion.div>
    </div>
  );
}

function MenuBasketball() {
  const ballTypes = [
    { key: "normal", ball: "from-orange-300 to-orange-500", border: "border-orange-700", line: "bg-orange-900/75", glow: "shadow-[0_0_24px_rgba(251,146,60,0.34)]", aura: null },
    { key: "hot", ball: "from-orange-300 via-orange-500 to-red-600", border: "border-red-800", line: "bg-red-950/75", glow: "shadow-[0_0_34px_rgba(248,113,22,0.78)]", aura: "fire" },
    { key: "golden", ball: "from-yellow-100 via-yellow-300 to-amber-500", border: "border-yellow-700", line: "bg-yellow-800/70", glow: "shadow-[0_0_34px_rgba(250,204,21,0.78)]", aura: "spark" },
    { key: "super", ball: "from-white via-yellow-100 to-yellow-300", border: "border-white", line: "bg-yellow-600/70", glow: "shadow-[0_0_42px_rgba(255,255,255,0.95)]", aura: "super" },
    { key: "superFire", ball: "from-white via-yellow-100 to-yellow-300", border: "border-white", line: "bg-yellow-600/75", glow: "shadow-[0_0_48px_rgba(255,255,255,0.98)]", aura: "superFire" },
  ];
  const [ballIndex, setBallIndex] = useState(0);
  const type = ballTypes[ballIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBallIndex((current) => (current + 1) % ballTypes.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ y: -18, rotate: -8, scale: 0.9 }}
      animate={{ y: [0, -18, 0, -10, 0], rotate: [0, -5, 0, 5, 0], scale: [1, 1.04, 0.96, 1.02, 1] }}
      transition={{ duration: 1.65, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={type.key}
          initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.92, rotate: 8 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="absolute flex h-36 w-36 items-center justify-center"
        >
          {(type.aura === "fire" || type.aura === "superFire") && (
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.84], rotate: [-4, 4, -4] }}
                transition={{ duration: 0.62, repeat: Infinity, ease: "easeInOut" }}
                className={`leading-none ${type.aura === "superFire" ? "text-[142px] drop-shadow-[0_0_20px_rgba(255,200,60,0.95)]" : "text-[136px] drop-shadow-[0_0_18px_rgba(249,115,22,0.92)]"}`}
              >
                <span className="block -translate-y-[18px]">🔥</span>
              </motion.div>
            </div>
          )}

          {type.aura === "spark" && <div className="absolute inset-2 rounded-full bg-yellow-300/18 blur-xl" />}
          {type.aura === "super" && <div className="absolute inset-0 rounded-full bg-white/28 blur-2xl" />}
          {type.aura === "superFire" && <div className="absolute inset-0 rounded-full bg-white/24 blur-2xl" />}

          <div className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-[7px] bg-gradient-to-br ${type.ball} ${type.border} ${type.glow} overflow-hidden`}>
            <div className={`absolute h-28 w-[5px] ${type.line}`} />
            <div className={`absolute h-[5px] w-28 ${type.line}`} />
            <div className={`h-20 w-20 rounded-full border-4 ${type.key === "super" || type.key === "superFire" ? "border-yellow-500/60" : type.key === "golden" ? "border-yellow-800/55" : type.key === "hot" ? "border-red-950/55" : "border-orange-900/60"}`} />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function SavedProgressIcon() {
  return (
    <div className="mx-auto flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -2, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[88px] w-[88px]"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]" aria-hidden="true">
          <path d="M18 12 H72 L88 28 V78 Q88 88 78 88 H22 Q12 88 12 78 V18 Q12 12 18 12 Z" fill="#2FAEE8" stroke="#000" strokeWidth="2.8" strokeLinejoin="round" />
          <rect x="28" y="12" width="42" height="28" rx="3" fill="#B9B9BE" stroke="#000" strokeWidth="2.4" />
          <rect x="58" y="18" width="10" height="16" rx="1" fill="#F2F2F2" stroke="#000" strokeWidth="2" />
          <rect x="31" y="17" width="5" height="5" rx="0.6" fill="#F7F34A" stroke="#000" strokeWidth="1.6" />
          <rect x="24" y="60" width="48" height="28" rx="3" fill="#B9B9BE" stroke="#000" strokeWidth="2.4" />
          <rect x="32" y="66" width="32" height="12" rx="2" fill="#F2F2F2" stroke="#000" strokeWidth="2" />
          <rect x="18" y="72" width="5" height="5" rx="0.6" fill="#F7F34A" stroke="#000" strokeWidth="1.6" />
          <rect x="76" y="72" width="5" height="5" rx="0.6" fill="#F7F34A" stroke="#000" strokeWidth="1.6" />
          <line x1="24" y1="60" x2="24" y2="88" stroke="#000" strokeWidth="2.2" />
        </svg>
      </motion.div>
    </div>
  );
}

function CrownIcon() {
  return (
    <motion.div
      initial={{ scale: 0.72, y: 12, rotate: -5 }}
      animate={{ scale: 1, y: [0, -3, 0], rotate: [-2, 2, -2] }}
      transition={{ scale: { type: "spring", stiffness: 180, damping: 12 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
      className="relative mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-[24px] border-2 border-yellow-200/60 bg-gradient-to-br from-slate-800 via-yellow-950/50 to-slate-950 shadow-[0_0_28px_rgba(250,204,21,0.24),inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      <div className="absolute inset-[-12px] rounded-full bg-yellow-300/12 blur-2xl" />
      <svg className="relative z-10 h-14 w-14 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="winnerCrownGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff7ad" />
            <stop offset="42%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="winnerCrownGem" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <path d="M15 74 L23 30 L42 55 L50 18 L58 55 L77 30 L85 74 Z" fill="url(#winnerCrownGold)" stroke="rgba(255,255,255,0.75)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M19 74 H81 V84 H19 Z" fill="#92400e" stroke="rgba(255,255,255,0.65)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="23" cy="30" r="5" fill="#fde68a" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
        <circle cx="50" cy="18" r="6" fill="#fde68a" stroke="white" strokeOpacity="0.8" strokeWidth="2" />
        <circle cx="77" cy="30" r="5" fill="#fde68a" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
        <path d="M43 68 L50 60 L57 68 L50 76 Z" fill="url(#winnerCrownGem)" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
        <path d="M28 70 H72" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

function CrownRevealTile({ name, value, detail, tone = "violet" }) {
  const [flipped, setFlipped] = useState(false);

  const toneMap = {
    green: "border-green-300/25 text-green-300",
    red: "border-red-300/25 text-red-300",
    yellow: "border-yellow-300/30 text-yellow-300",
    emerald: "border-emerald-300/25 text-emerald-300",
    white: "border-white/25 text-white",
    orange: "border-orange-300/25 text-orange-300",
    violet: "border-violet-300/25 text-violet-200",
  };

  const toneClass = toneMap[tone] || toneMap.violet;

  return (
    <button type="button" onClick={() => setFlipped((current) => !current)} className="h-[88px] rounded-2xl text-left active:scale-[0.98]" style={{ perspective: 900 }}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.42, ease: "easeInOut" }} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        <div className={`absolute inset-0 rounded-2xl border ${toneClass} bg-gradient-to-br from-slate-100/10 via-slate-900/95 to-slate-950 px-2.5 py-2 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`} style={{ backfaceVisibility: "hidden" }}>
          <div className="absolute -right-5 -top-6 h-16 w-16 rounded-full bg-white/5 blur-xl" />
          <p className="relative z-10 text-[7px] uppercase tracking-[0.18em] font-black text-slate-500">Bonus Credit</p>
          <p className="relative z-10 mt-1 text-[10px] font-black uppercase leading-tight tracking-[-0.02em] text-white">{name}</p>
          <p className="relative z-10 mt-2 text-lg font-black leading-none">{value}</p>
          <p className="absolute bottom-1.5 right-2 text-[7px] font-black uppercase tracking-widest text-slate-600">Tap</p>
        </div>
        <div className={`absolute inset-0 rounded-2xl border ${toneClass} bg-gradient-to-br from-slate-100/10 via-slate-900/95 to-slate-950 px-2.5 py-2 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="relative z-10 text-[7px] uppercase tracking-[0.18em] font-black text-slate-500">Director’s Note</p>
          <p className="relative z-10 mt-1 text-[10px] font-black leading-tight text-white">{name}</p>
          <p className="relative z-10 mt-1.5 text-[9px] font-bold leading-tight text-slate-300">{detail}</p>
        </div>
      </motion.div>
    </button>
  );
}

export default function BasketballGame() {
  const [screen, setScreen] = useState("title");
  const [saveExists, setSaveExists] = useState(() => {
    try {
      return typeof window !== "undefined" && !!window.localStorage.getItem(SAVE_KEY);
    } catch {
      return false;
    }
  });
  const [saveStatus, setSaveStatus] = useState(null);
  const [autoSaveReady, setAutoSaveReady] = useState(false);
  const [showNewGamePrompt, setShowNewGamePrompt] = useState(false);
  const [confirmFreshStart, setConfirmFreshStart] = useState(false);
  const [transitionScreen, setTransitionScreen] = useState(null);
  const [startingPoints, setStartingPoints] = useState(5);
  const [testPointsInput, setTestPointsInput] = useState("5");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [isShooting, setIsShooting] = useState(false);
  const [activeShot, setActiveShot] = useState(null);
  const [shotAnimKey, setShotAnimKey] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [pointsPop, setPointsPop] = useState(null);
  const [bigShotMessage, setBigShotMessage] = useState(null);
  const [shotCallouts, setShotCallouts] = useState(null);
  const [lastMadeBreakdown, setLastMadeBreakdown] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shotHistory, setShotHistory] = useState([]);
  const [tripShots, setTripShots] = useState([]);
  const [courtRound, setCourtRound] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [crownStats, setCrownStats] = useState(null);
  const [careerStats, setCareerStats] = useState({
    largestSingleBall: 0,
    totalGoldenBalls: 0,
    totalSuperGoldenBalls: 0,
    rimSaves: 0,
    heaterShots: 0,
    biggestRound: 0,
    mostExpensiveMiss: 0,
    brickTax: 0,
    makesByShot: { layup: 0, freeThrow: 0, three: 0, halfCourt: 0 },
    moneyByShot: { layup: 0, freeThrow: 0, three: 0, halfCourt: 0 },
  });
  const [playoffShot, setPlayoffShot] = useState(null);
  const [playoffResult, setPlayoffResult] = useState(null);
  const [wagerInput, setWagerInput] = useState("10000");
  const [confirmDoubleOrNothingUpgrade, setConfirmDoubleOrNothingUpgrade] = useState(false);
  const [lockerScreen, setLockerScreen] = useState("shots");
  const [courtTripOver, setCourtTripOver] = useState(false);
  const [tripPointsEarned, setTripPointsEarned] = useState(0);
  const [missShakeKey, setMissShakeKey] = useState(0);
  const [lastShotMultiplier, setLastShotMultiplier] = useState(1);
  const [challengeOffer, setChallengeOffer] = useState(null);
  const [challengeFlashKey, setChallengeFlashKey] = useState(null);
  const [openLook, setOpenLook] = useState(null);
  const [openLookCooldown, setOpenLookCooldown] = useState(false);
  const [lockedPrompt, setLockedPrompt] = useState(null);
  const [upgrades, setUpgrades] = useState({ extraShots: 0, layup: 0, freeThrow: 0, three: 0, halfCourt: 0, freeThrowUnlocked: false, threeUnlocked: false, halfCourtUnlocked: false, layupSpecialist: 0, freeThrowSpecialist: 0, threeSpecialist: 0, halfCourtSpecialist: 0, hotHand: 0, doubleRim: 0, goldenBall: 0, moveBall: 0, playoffTicket: 0, doubleOrNothing: 0, superGolden: 0, coachChallenge: 0, courtVision: 0 });

  function saveGame(silent = false) {
    try {
      const saveData = {
        version: 1,
        savedAt: Date.now(),
        currentPoints,
        startingPoints,
        upgrades,
        hasWon,
        bestStreak,
        courtRound,
        shotHistory,
        careerStats,
      };
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      setSaveExists(true);
      if (!silent) {
        setSaveStatus("Saved");
        window.setTimeout(() => setSaveStatus(null), 1200);
      }
    } catch {
      setSaveStatus("Save failed");
      window.setTimeout(() => setSaveStatus(null), 1400);
    }
  }

  function resumeGame() {
    setShowNewGamePrompt(false);
    setConfirmFreshStart(false);
    try {
      const rawSave = window.localStorage.getItem(SAVE_KEY);
      if (!rawSave) return;
      const saveData = JSON.parse(rawSave);
      if (!saveData || saveData.version !== 1) return;
      setCurrentPoints(Math.max(0, Math.floor(Number(saveData.currentPoints) || 0)));
      setStartingPoints(Math.max(0, Math.floor(Number(saveData.startingPoints) || 5)));
      setUpgrades((current) => ({ ...current, ...(saveData.upgrades || {}) }));
      setHasWon(!!saveData.hasWon);
      setBestStreak(Math.max(0, Math.floor(Number(saveData.bestStreak) || 0)));
      setCourtRound(Math.max(1, Math.floor(Number(saveData.courtRound) || 1)));
      setShotHistory(Array.isArray(saveData.shotHistory) ? saveData.shotHistory.slice(0, 15) : []);
      setCareerStats((current) => ({
        ...current,
        ...(saveData.careerStats || {}),
        makesByShot: { ...current.makesByShot, ...(saveData.careerStats?.makesByShot || {}) },
        moneyByShot: { ...current.moneyByShot, ...(saveData.careerStats?.moneyByShot || {}) },
      }));
      setLastResult(null);
      setPointsPop(null);
      setBigShotMessage(null);
      setShotCallouts(null);
      setLastMadeBreakdown(null);
      setActiveShot(null);
      setIsShooting(false);
      setAttemptsUsed(0);
      setStreak(0);
      setLastShotMultiplier(1);
      setCourtTripOver(false);
      setTripPointsEarned(0);
      setMissShakeKey(0);
      setTripShots([]);
      setChallengeOffer(null);
      setChallengeFlashKey(null); setOpenLook(null); setOpenLookCooldown(false);
      setLockerScreen("shots");
      setAutoSaveReady(true);
      setScreen("lockerRoom");
      setSaveStatus("Resumed");
      window.setTimeout(() => setSaveStatus(null), 1200);
    } catch {
      setSaveStatus("Resume failed");
      window.setTimeout(() => setSaveStatus(null), 1400);
    }
  }

  function clearSave() {
    setShowNewGamePrompt(false);
    setConfirmFreshStart(false);
    try {
      window.localStorage.removeItem(SAVE_KEY);
      setSaveExists(false);
      setAutoSaveReady(false);
      setSaveStatus("Save cleared");
      window.setTimeout(() => setSaveStatus(null), 1200);
    } catch {
      setSaveStatus("Clear failed");
      window.setTimeout(() => setSaveStatus(null), 1400);
    }
  }

  useEffect(() => {
    if (!autoSaveReady) return;
    if (screen === "title") return;
    const timeout = window.setTimeout(() => saveGame(true), 250);
    return () => window.clearTimeout(timeout);
  }, [autoSaveReady, screen, currentPoints, startingPoints, upgrades, hasWon, bestStreak, courtRound, shotHistory, careerStats]);

  const shotsPerTrip = 2 + upgrades.extraShots;
  const shotsRemaining = Math.max(0, shotsPerTrip - attemptsUsed);
  const doubleRimChance = upgrades.doubleRim * 5;
  const goldenChance = upgrades.goldenBall * 3;
  const courtVisionChance = upgrades.courtVision > 0 ? COURT_VISION_CHANCES[upgrades.courtVision - 1] || 0 : 0;
  const doubleOrNothingChance = upgrades.doubleOrNothing > 0 ? 50 : 25;
  const endTripPhrasePool = tripPointsEarned >= BAD_TRIP_THRESHOLD ? NEUTRAL_LOCKER_PHRASES : INSULT_LOCKER_PHRASES;
  const endTripPhrase = endTripPhrasePool[courtRound % endTripPhrasePool.length];
  const getShotOdds = (shotId) => Math.min(SHOT_CONFIG[shotId].maxOdds, SHOT_CONFIG[shotId].baseOdds + upgrades[shotId] * SHOT_CONFIG[shotId].upgradeStep);
  const getShotValue = (shot) => shot.points * (1 + upgrades[`${shot.id}Specialist`]);
  const availableShots = useMemo(() => Object.values(SHOT_CONFIG).filter((shot) => shot.id === "layup" || upgrades[`${shot.id}Unlocked`]).map((shot) => ({ ...shot, odds: getShotOdds(shot.id) })), [upgrades]);

  function isOpenLookShot(shotId) {
    return upgrades.courtVision > 0 && openLook?.shotId === shotId;
  }

  function getDisplayedShotOdds(shot) {
    const bonus = isOpenLookShot(shot.id) ? OPEN_LOOK_ODDS_BONUS[shot.id] || 0 : 0;
    return Math.min(95, getShotOdds(shot.id) + bonus);
  }

  function getDisplayedShotValue(shot) {
    const base = getShotValue(shot);
    return isOpenLookShot(shot.id) ? Math.floor(base * OPEN_LOOK_POINTS_MULT) : base;
  }

  function rollOpenLook(nextAvailableShots = availableShots) {
    if (upgrades.courtVision <= 0 || nextAvailableShots.length === 0) return null;
    const chance = COURT_VISION_CHANCES[Math.min(upgrades.courtVision - 1, COURT_VISION_CHANCES.length - 1)] || 0;
    if (Math.random() * 100 >= chance) return null;
    const weights = { layup: 1, freeThrow: 3, three: 4, halfCourt: 3 };
    const weightedShots = nextAvailableShots.flatMap((shot) => Array.from({ length: weights[shot.id] || 1 }, () => shot.id));
    return { shotId: weightedShots[Math.floor(Math.random() * weightedShots.length)], key: Date.now() };
  }

  useEffect(() => {
    if (screen !== "court") return;
    if (isShooting || courtTripOver || shotsRemaining <= 0) return;
    if (openLookCooldown) {
      if (openLook) setOpenLook(null);
      return;
    }
    if (upgrades.courtVision <= 0) {
      if (openLook) setOpenLook(null);
      return;
    }
    if (!openLook) setOpenLook(rollOpenLook());
  }, [screen, isShooting, courtTripOver, shotsRemaining, upgrades.courtVision, openLook, openLookCooldown, availableShots]);
  const nextHotHandMult = shotsRemaining > 0 && upgrades.hotHand > 0 && streak >= 2 ? HOT_HAND_MULTS[Math.min(Math.max(streak - 2, 0), upgrades.hotHand - 1)] || HOT_HAND_MULTS[upgrades.hotHand - 1] : 1;
  function showLockedPrompt(label) {
    setLockedPrompt({ label, key: Date.now() });
    window.setTimeout(() => setLockedPrompt(null), 1350);
  }

  function goLockerRoom() {
    setTransitionScreen("toLocker"); setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setLastMadeBreakdown(null); setActiveShot(null); setIsShooting(false); setAttemptsUsed(0); setStreak(0); setLastShotMultiplier(1); setCourtTripOver(false); setTripPointsEarned(0); setMissShakeKey(0); setTripShots([]); setChallengeOffer(null); setChallengeFlashKey(null); setOpenLook(null); setOpenLookCooldown(false);
    window.setTimeout(() => setScreen("lockerRoom"), 1050); window.setTimeout(() => setTransitionScreen(null), 1500);
  }
  function startCourt() {
    setTransitionScreen("toCourt"); setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setLastMadeBreakdown(null); setActiveShot(null); setIsShooting(false); setAttemptsUsed(0); setStreak(0); setLastShotMultiplier(1); setCourtTripOver(false); setTripPointsEarned(0); setMissShakeKey(0); setTripShots([]); setChallengeOffer(null); setChallengeFlashKey(null); setOpenLook(null); setOpenLookCooldown(false);
    window.setTimeout(() => { setCourtRound((current) => current + 1); setScreen("court"); }, 1050); window.setTimeout(() => setTransitionScreen(null), 1500);
  }

  function runItBack() {
    setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setLastMadeBreakdown(null); setActiveShot(null); setIsShooting(false); setAttemptsUsed(0); setStreak(0); setLastShotMultiplier(1); setCourtTripOver(false); setTripPointsEarned(0); setMissShakeKey(0); setTripShots([]); setChallengeOffer(null); setChallengeFlashKey(null); setOpenLook(null); setOpenLookCooldown(false); setCourtRound((current) => current + 1);
  }
  function buyUpgrade(key, cost, max) { if (currentPoints < cost || upgrades[key] >= max) return; setCurrentPoints((current) => current - cost); setUpgrades((current) => ({ ...current, [key]: current[key] + 1 })); }
  function unlockShot(shotId) { const shot = SHOT_CONFIG[shotId]; const unlockKey = `${shotId}Unlocked`; if (!shot?.unlockCost || upgrades[unlockKey] || currentPoints < shot.unlockCost) return; setCurrentPoints((current) => current - shot.unlockCost); setUpgrades((current) => ({ ...current, [unlockKey]: true })); }
  function buyDoubleOrNothingUpgrade() { if (upgrades.doubleOrNothing > 0 || currentPoints < DOUBLE_OR_NOTHING_UPGRADE_COST) return; if (!confirmDoubleOrNothingUpgrade) { setConfirmDoubleOrNothingUpgrade(true); return; } setCurrentPoints((current) => current - DOUBLE_OR_NOTHING_UPGRADE_COST); setUpgrades((current) => ({ ...current, doubleOrNothing: 1 })); setConfirmDoubleOrNothingUpgrade(false); }
  function buyTrophy() {
    if (currentPoints < TROPHY_COST || hasWon) return;
    const shotEntries = Object.values(SHOT_CONFIG).map((shot) => ({
      id: shot.id,
      label: shot.label,
      makes: careerStats.makesByShot?.[shot.id] || 0,
      money: careerStats.moneyByShot?.[shot.id] || 0,
    }));
    const bestLocationByMakes = shotEntries.reduce((best, item) => (item.makes > best.makes ? item : best), { label: "None Yet", makes: 0 });
    const bestLocationByMoney = shotEntries.reduce((best, item) => (item.money > best.money ? item : best), { label: "None Yet", money: 0 });
    setCrownStats({
      finalBank: currentPoints,
      largestSingleBall: careerStats.largestSingleBall || 0,
      bestStreak,
      heaterShots: careerStats.heaterShots || 0,
      biggestRound: Math.max(careerStats.biggestRound || 0, tripPointsEarned || 0),
      totalGoldenBalls: careerStats.totalGoldenBalls || 0,
      totalSuperGoldenBalls: careerStats.totalSuperGoldenBalls || 0,
      rimSaves: careerStats.rimSaves || 0,
      mostExpensiveMiss: careerStats.mostExpensiveMiss || 0,
      brickTax: careerStats.brickTax || 0,
      bestLocationByMoney,
      courtRound,
    });
    setHasWon(true);
    setScreen("crownCelebration");
  }
  function openPlayoffDoor() { setConfirmDoubleOrNothingUpgrade(false); if (currentPoints < PLAYOFF_TICKET_COST) return; setPlayoffShot(null); setPlayoffResult(null); setWagerInput(String(Math.min(PLAYOFF_TICKET_COST, currentPoints))); setScreen("playoff"); }
  function getWagerAmount() { return Math.max(0, Math.min(currentPoints, Math.floor(Number(wagerInput) || 0))); }
  function takePlayoffShot() { if (playoffShot) return; const wagerAmount = getWagerAmount(); if (wagerAmount <= 0 || wagerAmount > currentPoints) return; const made = Math.random() * 100 < doubleOrNothingChance; setPlayoffShot({ made, wagerAmount, key: Date.now(), missSide: Math.random() < 0.5 ? "left" : "right", phrase: pickPhrase(made ? DOUBLE_OR_NOTHING_MADE_PHRASES : DOUBLE_OR_NOTHING_MISS_PHRASES, Date.now()) }); setPlayoffResult(null); window.setTimeout(() => { setCurrentPoints((current) => made ? current + wagerAmount : Math.max(0, current - wagerAmount)); setPlayoffResult(made ? "made" : "missed"); }, 7700); }

  function useCoachChallenge() {
    if (!challengeOffer || upgrades.coachChallenge <= 0) return;
    const savedChallenge = challengeOffer;
    setChallengeFlashKey(Date.now());
    setUpgrades((current) => ({ ...current, coachChallenge: 0 }));
    setChallengeOffer(null);
    setIsShooting(true);
    setCourtTripOver(false);

    window.setTimeout(() => {
      setChallengeFlashKey(null); setOpenLook(savedChallenge.openLookBefore || null);
      setOpenLookCooldown(!!savedChallenge.openLookCooldownBefore);
      setAttemptsUsed(savedChallenge.attemptsUsedBefore);
      setStreak(savedChallenge.streakBefore);
      setLastShotMultiplier(savedChallenge.lastShotMultiplierBefore || 1);
      setTripShots(savedChallenge.tripShotsBefore);
      setShotHistory(savedChallenge.shotHistoryBefore);
      setLastResult(null);
      setPointsPop(null);
      setBigShotMessage(null);
      setShotCallouts(null);
      setLastMadeBreakdown(null);
      setActiveShot(null);
      setIsShooting(false);
      }, 2200);
  }

  function passCoachChallenge() {
    if (challengeOffer?.isFinalShot) setCourtTripOver(true);
    setChallengeOffer(null);
  }

  function takeShot(shot) {
    if (isShooting || shotsRemaining <= 0) return;
    if (challengeOffer) setChallengeOffer(null);
    const openLookShot = isOpenLookShot(shot.id);
    const activeOpenLook = openLook;
    const openLookCooldownBefore = openLookCooldown;
    const openLookCooldownAfterShot = openLookShot;
    setOpenLook(null);
    const madeBase = Math.random() * 100 < getDisplayedShotOdds(shot);
    const bouncedIn = !madeBase && upgrades.doubleRim > 0 && Math.random() * 100 < doubleRimChance;
    const made = madeBase || bouncedIn;
    const golden = upgrades.goldenBall > 0 && Math.random() * 100 < goldenChance;
    const superGolden = made && golden && upgrades.superGolden > 0 && Math.random() * 100 < 33;
    const missSide = Math.random() < 0.5 ? "left" : "right";
    const nextStreak = made ? streak + 1 : 0;
    const hotHandStreakIndex = made ? Math.min(Math.max(nextStreak - 3, 0), Math.max(upgrades.hotHand - 1, 0)) : 0;
    const hotHandMult = made && nextStreak >= 3 && upgrades.hotHand > 0 ? HOT_HAND_MULTS[hotHandStreakIndex] || 1 : 1;
    const shotValue = getShotValue(shot);
    const earned = made ? Math.floor(shotValue * hotHandMult * (superGolden ? 10 : golden ? 5 : 1) * (openLookShot ? OPEN_LOOK_POINTS_MULT : 1)) : 0;
    const madeBreakdown = made ? { base: shotValue, earned, golden, superGolden, hotHandMult, bouncedIn, openLook: openLookShot } : null;
    const potentialMissValue = Math.floor(shotValue * hotHandMult * (golden ? 5 : 1));
    const wasOnHeater = upgrades.hotHand > 0 && streak >= 2;
    const isFinalShot = attemptsUsed + 1 >= shotsPerTrip;
    const challengeSnapshot = {
      attemptsUsedBefore: attemptsUsed,
      streakBefore: streak,
      lastShotMultiplierBefore: lastShotMultiplier,
      tripShotsBefore: tripShots,
      shotHistoryBefore: shotHistory,
      isFinalShot,
      openLookBefore: activeOpenLook,
      openLookCooldownBefore,
    };
    const phraseSeed = Date.now() + Math.floor(Math.random() * 1000);
    const mainCallout = superGolden
      ? { text: pickPhrase(SUPER_GOLDEN_PHRASES, phraseSeed), style: "superGolden" }
      : made && golden
      ? { text: pickPhrase(GOLDEN_PHRASES, phraseSeed), style: "golden" }
      : made && nextStreak >= 6
      ? { text: pickPhrase(BIG_STREAK_PHRASES, phraseSeed), style: "bigStreak" }
      : made && nextStreak >= 3 && upgrades.hotHand > 0
      ? { text: pickPhrase(HOT_STREAK_PHRASES, phraseSeed), style: "hot" }
      : !made && streak === 0 && shotHistory.filter((item) => item.round === courtRound).slice(0, 2).every((item) => !item.made) && shotHistory.filter((item) => item.round === courtRound).length >= 2
      ? { text: pickPhrase(MISS_STREAK_PHRASES, phraseSeed), style: "miss" }
      : null;
    const bigScoreCallout = earned >= BIG_SCORE_THRESHOLD ? { text: pickPhrase(BIG_SCORE_PHRASES, phraseSeed + 17), style: "bigScore" } : null;
    const rimSaveCallout = bouncedIn ? { text: pickPhrase(RIM_SAVE_PHRASES, phraseSeed + 31), style: "rimSave" } : null;

    setIsShooting(true); setActiveShot({ ...shot, made, golden, superGolden, bouncedIn, missSide, onFire: upgrades.hotHand > 0 && streak >= 2 }); setShotAnimKey((current) => current + 1); setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setLastMadeBreakdown(null);
    window.setTimeout(() => {
      setLastResult({ made, bouncedIn, golden }); if (!made) setMissShakeKey((current) => current + 1);
      window.setTimeout(() => {
        if (madeBreakdown) setLastMadeBreakdown(madeBreakdown);
        if (earned > 0) { setCurrentPoints((current) => current + earned); setTripPointsEarned((current) => current + earned); }
        setLastShotMultiplier(hotHandMult);
        setStreak(nextStreak);
        setOpenLookCooldown(openLookCooldownAfterShot);
        setBestStreak((current) => Math.max(current, nextStreak));
        setCareerStats((current) => ({
            ...current,
            largestSingleBall: made ? Math.max(current.largestSingleBall || 0, earned) : current.largestSingleBall || 0,
            totalGoldenBalls: (current.totalGoldenBalls || 0) + (made && golden ? 1 : 0),
            totalSuperGoldenBalls: (current.totalSuperGoldenBalls || 0) + (made && superGolden ? 1 : 0),
            rimSaves: (current.rimSaves || 0) + (made && bouncedIn ? 1 : 0),
            heaterShots: (current.heaterShots || 0) + (wasOnHeater ? 1 : 0),
            biggestRound: Math.max(current.biggestRound || 0, tripPointsEarned + earned),
            mostExpensiveMiss: !made ? Math.max(current.mostExpensiveMiss || 0, potentialMissValue) : current.mostExpensiveMiss || 0,
            brickTax: (current.brickTax || 0) + (!made ? 1 : 0),
            makesByShot: made ? { ...(current.makesByShot || {}), [shot.id]: ((current.makesByShot || {})[shot.id] || 0) + 1 } : current.makesByShot || {},
            moneyByShot: made ? { ...(current.moneyByShot || {}), [shot.id]: ((current.moneyByShot || {})[shot.id] || 0) + earned } : current.moneyByShot || {},
          }));
        setAttemptsUsed((current) => current + 1);
        if (earned > 0) setPointsPop(earned);
        setShotCallouts({ main: mainCallout, bigScore: bigScoreCallout, rimSave: rimSaveCallout });
        if (superGolden) setBigShotMessage("SUPER GOLDEN x10"); else if (made && golden) setBigShotMessage("GOLDEN BALL x5");
      }, SCORE_REVEAL_DELAY);
      window.setTimeout(() => {
        setTripShots((current) => [
          ...current,
          {
            id: `${Date.now()}-${Math.random()}`,
            made,
            points: earned,
            multiplier: hotHandMult,
            streakNumber: nextStreak,
            golden,
            superGolden,
            bouncedIn,
          },
        ]);
      }, SCORE_REVEAL_DELAY);
      setShotHistory((current) => [{ id: `${Date.now()}-${Math.random()}`, made, points: earned, multiplier: hotHandMult, golden, superGolden, bouncedIn, round: courtRound }, ...current].slice(0, 15));
      if (!made && upgrades.coachChallenge > 0) {
        setChallengeOffer(challengeSnapshot);
      } else if (isFinalShot) {
        window.setTimeout(() => setCourtTripOver(true), 1300);
      }
    }, 900);
    window.setTimeout(() => {
      setPointsPop(null);
      if (!isFinalShot) {
        setLastResult(null);
        setBigShotMessage(null);
        setShotCallouts(null);
      }
      setActiveShot(null);
      setIsShooting(false);
    }, 2400);
  }

  const transitionOverlay = transitionScreen ? (
    <AnimatePresence>
      <motion.div
        key="basketball-transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="fixed inset-0 z-[999] overflow-hidden bg-slate-950/95 backdrop-blur-sm pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute left-0 right-0 top-[70vh] h-[3px] bg-orange-300/25 shadow-[0_0_14px_rgba(251,146,60,0.35)]" />
        <motion.div
          initial={{
            left: transitionScreen === "toCourt" ? "-28vw" : "128vw",
            top: "58vh",
          }}
          animate={{
            left: transitionScreen === "toCourt" ? ["-28vw", "50vw", "128vw"] : ["128vw", "50vw", "-28vw"],
            top: ["30vh", "58vh", "30vh"],
          }}
          transition={{ duration: 1.5, ease: [0.2, 0.7, 0.2, 1], times: [0, 0.5, 1] }}
          className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            initial={{ rotate: transitionScreen === "toCourt" ? -160 : 160, scale: 1 }}
            animate={{
              rotate: transitionScreen === "toCourt" ? [-160, 220, 620] : [160, -220, -620],
              scale: [1, 1.06, 1],
            }}
            transition={{ duration: 1.5, ease: [0.2, 0.7, 0.2, 1], times: [0, 0.5, 1] }}
            className="relative h-40 w-40 rounded-full border-[9px] border-orange-900 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 shadow-[0_0_42px_rgba(249,115,22,0.6)] overflow-hidden"
          >
            <div className="absolute inset-y-0 left-1/2 w-[8px] -translate-x-1/2 bg-orange-900/80" />
            <div className="absolute inset-x-0 top-1/2 h-[8px] -translate-y-1/2 bg-orange-900/80" />
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-orange-900/65" />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;
  function beginFreshGame() {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch {}
    setSaveExists(false);
    setShowNewGamePrompt(false);
    setConfirmFreshStart(false);
    setAutoSaveReady(true);
    setCurrentPoints(startingPoints);
    setUpgrades({ extraShots: 0, layup: 0, freeThrow: 0, three: 0, halfCourt: 0, freeThrowUnlocked: false, threeUnlocked: false, halfCourtUnlocked: false, layupSpecialist: 0, freeThrowSpecialist: 0, threeSpecialist: 0, halfCourtSpecialist: 0, hotHand: 0, doubleRim: 0, goldenBall: 0, moveBall: 0, playoffTicket: 0, doubleOrNothing: 0, superGolden: 0, coachChallenge: 0, courtVision: 0 });
    setHasWon(false);
    setBestStreak(0);
    setShotHistory([]);
    setCareerStats({
      largestSingleBall: 0,
      totalGoldenBalls: 0,
      totalSuperGoldenBalls: 0,
      rimSaves: 0,
      heaterShots: 0,
      biggestRound: 0,
      mostExpensiveMiss: 0,
      brickTax: 0,
      makesByShot: { layup: 0, freeThrow: 0, three: 0, halfCourt: 0 },
      moneyByShot: { layup: 0, freeThrow: 0, three: 0, halfCourt: 0 },
    });
    setCourtRound(1);
    setAttemptsUsed(0);
    setIsShooting(false);
    setActiveShot(null);
    setLastResult(null);
    setPointsPop(null);
    setBigShotMessage(null);
    setShotCallouts(null);
    setLastMadeBreakdown(null);
    setStreak(0);
    setTripShots([]);
    setCourtTripOver(false);
    setTripPointsEarned(0);
    setMissShakeKey(0);
    setLastShotMultiplier(1);
    setChallengeOffer(null);
    setChallengeFlashKey(null); setOpenLook(null); setOpenLookCooldown(false);
    setLockerScreen("shots");
    startCourt();
  }

  function startNewGame() {
    if (saveExists) {
      setConfirmFreshStart(false);
      setShowNewGamePrompt(true);
      return;
    }
    beginFreshGame();
  }
  function openSettings() {
    setStartingPoints(100000);
    setCurrentPoints(100000);
    setScreen("lockerRoom");
  }
  function saveSettings() {
    if (testPointsInput.trim().toLowerCase() === "tanner") {
      setStartingPoints(2138);
      setCurrentPoints(2138);
      setTestPointsInput("Tanner");
      setUpgrades({
        extraShots: 7,
        layup: 5,
        freeThrow: 6,
        three: 6,
        halfCourt: 0,
        freeThrowUnlocked: true,
        threeUnlocked: true,
        halfCourtUnlocked: false,
        layupSpecialist: 2,
        freeThrowSpecialist: 5,
        threeSpecialist: 7,
        halfCourtSpecialist: 0,
        hotHand: 8,
        doubleRim: 5,
        goldenBall: 5,
        moveBall: 0,
        playoffTicket: 0,
        doubleOrNothing: 0,
        superGolden: 0,
        coachChallenge: 0, courtVision: 0,
      });
      setAttemptsUsed(0);
      setStreak(0);
      setTripShots([]);
      setShotHistory([]);
      setCourtTripOver(false);
      setTripPointsEarned(0);
      setLockerScreen("shots");
      setScreen("lockerRoom");
      return;
    }
    const parsed = Math.max(0, Math.floor(Number(testPointsInput) || 0));
    setStartingPoints(parsed);
    setCurrentPoints(parsed);
    setTestPointsInput(String(parsed));
    setScreen("title");
  }

  const shopItems = [
    { type: "section", title: "Shots", theme: "lab" },
    { type: "singleTrack", key: "extraShots", theme: "possessions", title: "Extra Balls", label: "Balls Per Turn", current: `${shotsPerTrip} balls`, add: "+1 ball", cost: EXTRA_BALL_COSTS[upgrades.extraShots] || 0, level: upgrades.extraShots, max: EXTRA_BALL_COSTS.length, action: () => buyUpgrade("extraShots", EXTRA_BALL_COSTS[upgrades.extraShots], EXTRA_BALL_COSTS.length) },
    ...Object.values(SHOT_CONFIG).map((shot) => ({ type: "shotUpgrade", key: `${shot.id}Bundle`, title: shot.label, locked: shot.id !== "layup" && !upgrades[`${shot.id}Unlocked`], unlockCost: shot.unlockCost, unlockAction: () => unlockShot(shot.id), accuracyCurrent: shot.id === "layup" || upgrades[`${shot.id}Unlocked`] ? `${getShotOdds(shot.id)}%` : "Locked", accuracyAdd: "+5% make", accuracyCost: shot.costs[upgrades[shot.id]] || 0, accuracyLevel: upgrades[shot.id], accuracyMax: shot.costs.length, accuracyAction: () => buyUpgrade(shot.id, shot.costs[upgrades[shot.id]], shot.costs.length), valueCurrent: shot.id === "layup" || upgrades[`${shot.id}Unlocked`] ? `${getShotValue(shot)} pts` : "Locked", valueAdd: `+${shot.points} pts`, valueCost: SPECIALIST_COSTS[upgrades[`${shot.id}Specialist`]] || 0, valueLevel: upgrades[`${shot.id}Specialist`], valueMax: SPECIALIST_LEVEL_CAPS[shot.id], valueAction: () => buyUpgrade(`${shot.id}Specialist`, SPECIALIST_COSTS[upgrades[`${shot.id}Specialist`]], SPECIALIST_LEVEL_CAPS[shot.id]) })),
    { type: "section", title: "Bonus Stuff", theme: "neutral" },
    { type: "singleTrack", key: "hotHand", theme: "hot", title: "Hot Hand", label: "Streak Multiplier", locked: upgrades.hotHand === 0, current: upgrades.hotHand === 0 ? "Locked" : `Up to x${HOT_HAND_MULTS[upgrades.hotHand - 1]}`, add: upgrades.hotHand === 0 ? "Unlock x2" : upgrades.hotHand >= HOT_HAND_COSTS.length ? "Maxed" : `Unlock x${HOT_HAND_MULTS[upgrades.hotHand]}`, note: "Hot Hand: Make 2 in a row to get hot. From the 3rd make on, streaks unlock big multipliers.\nThis is where the real points come from.", cost: HOT_HAND_COSTS[upgrades.hotHand] || 0, level: upgrades.hotHand, max: HOT_HAND_COSTS.length, action: () => buyUpgrade("hotHand", HOT_HAND_COSTS[upgrades.hotHand], HOT_HAND_COSTS.length) },
    { type: "singleTrack", key: "courtVision", theme: "vision", title: "Court Vision", label: "Open Look Chance", locked: upgrades.courtVision === 0, current: upgrades.courtVision === 0 ? "Locked" : `${COURT_VISION_CHANCES[upgrades.courtVision - 1]}%`, add: upgrades.courtVision === 0 ? "Unlock 25%" : upgrades.courtVision >= COURT_VISION_COSTS.length ? "Maxed" : `Next ${COURT_VISION_CHANCES[upgrades.courtVision]}%`, note: `Court Vision: Creates random Open Looks that boost one shot's odds.\nTake the glowing shot for +25% points and a better chance to hit.`, cost: COURT_VISION_COSTS[upgrades.courtVision] || 0, level: upgrades.courtVision, max: COURT_VISION_COSTS.length, action: () => buyUpgrade("courtVision", COURT_VISION_COSTS[upgrades.courtVision], COURT_VISION_COSTS.length) },
    { type: "singleTrack", key: "doubleRim", theme: "rim", title: "Rim Rescue", label: "Rim Rescue Chance", locked: upgrades.doubleRim === 0, current: upgrades.doubleRim === 0 ? "Locked" : `${doubleRimChance}%`, add: upgrades.doubleRim === 0 ? "Unlock 5%" : "+5%", note: "Rim Rescue: Gives some misses a chance to bounce in.\nIt saves streaks, saves rounds, and turns ugly shots into lucky buckets.", cost: DOUBLE_RIM_COSTS[upgrades.doubleRim] || 0, level: upgrades.doubleRim, max: DOUBLE_RIM_COSTS.length, action: () => buyUpgrade("doubleRim", DOUBLE_RIM_COSTS[upgrades.doubleRim], DOUBLE_RIM_COSTS.length) },
    { type: "singleTrack", key: "goldenBall", theme: "golden", title: "Golden Ball", label: "Golden Chance", locked: upgrades.goldenBall === 0, current: upgrades.goldenBall === 0 ? "Locked" : `${goldenChance}%`, add: upgrades.goldenBall === 0 ? "Unlock 3%" : "+3%", note: "Golden Ball: Gives made shots a chance to go gold for x5.\nEvery bucket gets jackpot potential.", cost: GOLDEN_BALL_COSTS[upgrades.goldenBall] || 0, level: upgrades.goldenBall, max: GOLDEN_BALL_COSTS.length, action: () => buyUpgrade("goldenBall", GOLDEN_BALL_COSTS[upgrades.goldenBall], GOLDEN_BALL_COSTS.length) },
    ...(upgrades.goldenBall >= GOLDEN_BALL_COSTS.length ? [{ type: "singleTrack", key: "superGolden", theme: "golden", title: "Super Golden", label: "Golden Upgrade", locked: upgrades.superGolden === 0, current: upgrades.superGolden === 0 ? "Locked" : "Unlocked", add: upgrades.superGolden === 0 ? "Unlock x10" : "Maxed", note: "Super Golden: Gives golden makes a chance to become x10.\nRare, flashy, and built to break the bank.", cost: upgrades.superGolden === 0 ? SUPER_GOLDEN_COST : 0, level: upgrades.superGolden, max: 1, action: () => buyUpgrade("superGolden", SUPER_GOLDEN_COST, 1) }] : []),
    { type: "singleTrack", key: "coachChallenge", theme: "challenge", title: "Coach’s Challenge", label: "Redo Token", locked: upgrades.coachChallenge === 0, current: upgrades.coachChallenge > 0 ? "1 of 1 Ready" : "0 of 1 Held", add: upgrades.coachChallenge > 0 ? "Max 1 held" : "Purchase 1 of 1", note: "Coach’s Challenge: Buy one redo and save it for a miss.\nErase the mistake, retake the shot, and keep the run alive.", cost: COACH_CHALLENGE_COST, level: upgrades.coachChallenge, max: 1, action: () => buyUpgrade("coachChallenge", COACH_CHALLENGE_COST, 1) },
    { type: "section", title: "Mystery / Trophy", theme: "mystery" }, { type: "playoff" }, { type: "trophy" },
  ];

  if (screen === "crownCelebration") return (
    <Shell>
      <div className="h-[100dvh] relative overflow-hidden bg-gradient-to-b from-slate-950 via-yellow-950/20 to-slate-950 p-3 flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-1/2 top-[-12%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute left-[-20%] bottom-[-10%] h-80 w-80 rounded-full bg-orange-400/12 blur-3xl" />
          <div className="absolute right-[-20%] top-[20%] h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        </div>

        <Card className="relative w-full h-[96dvh] border border-yellow-300/45 bg-slate-950 p-3 text-center shadow-[0_0_42px_rgba(250,204,21,0.18)] overflow-hidden flex flex-col">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-sky-300" />
          <div className="shrink-0 relative z-10">
            <CrownIcon />
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="mt-2 text-[9px] uppercase tracking-[0.28em] font-black text-yellow-200/80">Crown Claimed</p>
              <h1 className="mt-1 text-[34px] font-black uppercase leading-[0.86] tracking-[-0.055em] text-white drop-shadow-[0_3px_0_rgba(15,23,42,0.95)]">Winner</h1>
              <p className="mt-2 rounded-2xl border border-yellow-300/20 bg-yellow-300/8 px-3 py-2 text-[11px] font-black leading-snug text-yellow-100">You finished the grind and earned the crown.</p>
            </motion.div>
          </div>

          <div className="relative z-10 mt-3 rounded-[28px] border border-yellow-300/20 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.13),rgba(15,23,42,0.94)_42%,rgba(2,6,23,0.98))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_30px_rgba(250,204,21,0.08)] overflow-hidden flex-1 min-h-0">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent" />
            <div className="absolute -left-10 top-12 h-24 w-24 rounded-full bg-sky-400/8 blur-2xl" />
            <div className="absolute -right-10 bottom-12 h-24 w-24 rounded-full bg-orange-400/8 blur-2xl" />

            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-amber-200/20" />
              <p className="text-[8px] font-black uppercase tracking-[0.26em] text-amber-100/80">Winner’s Credits</p>
              <div className="h-px flex-1 bg-amber-200/20" />
            </div>

            <p className="mb-2 text-[10px] font-bold leading-snug text-slate-400 text-center">The grind is over. Tap each card for the bonus scenes from your run.</p>

            <div className="grid grid-cols-3 gap-1.5">
              <CrownRevealTile name="Biggest Bucket" value={`+${formatNumber(crownStats?.largestSingleBall || 0)}`} detail="One ball went nuclear. Biggest single payout." tone="green" />
              <CrownRevealTile name="Time on Heater" value={formatNumber(crownStats?.heaterShots || 0)} detail="You got cooking. Shots taken while hot." tone="red" />
              <CrownRevealTile name="Biggest Round" value={`+${formatNumber(crownStats?.biggestRound || 0)}`} detail="Best trip of the run. Biggest round total." tone="orange" />
              <CrownRevealTile name="Money Maker" value={crownStats?.bestLocationByMoney?.label || "None"} detail={`${crownStats?.bestLocationByMoney?.label || "No shot"} was your cash cow.`} tone="emerald" />
              <CrownRevealTile name="Gold Rush" value={formatNumber(crownStats?.totalGoldenBalls || 0)} detail="The shiny ones kept showing up." tone="yellow" />
              <CrownRevealTile name="Crown Jewels" value={formatNumber(crownStats?.totalSuperGoldenBalls || 0)} detail="Rare air. Super Goldens collected." tone="white" />
              <CrownRevealTile name="Rim Bailouts" value={formatNumber(crownStats?.rimSaves || 0)} detail="The rim absolutely had your back." tone="emerald" />
              <CrownRevealTile name="Brick Tax" value={formatNumber(crownStats?.brickTax || 0)} detail="Every legend pays the tax." tone="violet" />
              <CrownRevealTile name="Got Away" value={`+${formatNumber(crownStats?.mostExpensiveMiss || 0)}`} detail="This one still bugs you." tone="red" />
            </div>
          </div>

          <div className="relative z-10 mt-3 grid grid-cols-2 gap-2 shrink-0">
            <button type="button" onClick={() => setScreen("lockerRoom")} className="rounded-2xl border border-sky-200/60 bg-sky-500 px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_18px_rgba(14,165,233,0.35)] active:scale-[0.98]">Locker Room</button>
            <button type="button" onClick={() => setScreen("title")} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black uppercase tracking-wide text-slate-200 active:scale-[0.98]">Main Menu</button>
          </div>
        </Card>
      </div>
    </Shell>
  );

  if (screen === "settings") return <Shell><div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-5"><Card className="w-full border border-slate-700 bg-slate-900 p-5 shadow-2xl"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.28em] font-black text-sky-300">Settings</p><h1 className="mt-1 text-3xl font-black leading-none text-white">Test Mode</h1></div><button type="button" onClick={() => setScreen("title")} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-black text-slate-300 active:scale-[0.98]">Back</button></div><div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/80 p-4"><label className="block text-[11px] uppercase tracking-wide font-black text-slate-400">Starting pts</label><input value={testPointsInput} onChange={(event) => setTestPointsInput(event.target.value)} inputMode="text" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-3xl font-black text-white outline-none focus:border-sky-400" placeholder="0 or Tanner" /><p className="mt-2 text-xs font-bold text-slate-500">Use this to test upgrades. Leave it at 0 for a normal fresh run.</p></div><button type="button" onClick={saveSettings} className="mt-5 w-full rounded-2xl bg-sky-500 px-5 py-4 text-lg font-black text-white shadow-xl border border-sky-300 active:scale-[0.98] hover:bg-sky-600">Save Starting pts</button></Card></div></Shell>;

  if (screen === "howToPlay") {
    return (
      <Shell>
        <div className="min-h-[100dvh] bg-slate-950 p-4 flex items-center justify-center">
          <Card className="w-full border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] font-black text-orange-300">Full Court Grind</p>
                <h1 className="mt-1 text-3xl font-black leading-none text-white">How to Play</h1>
              </div>
              <button type="button" onClick={() => setScreen("title")} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-black text-slate-300 active:scale-[0.98]">Back</button>
            </div>

            <div className="mt-4 rounded-3xl border border-orange-300/25 bg-gradient-to-r from-orange-500/12 via-sky-500/10 to-yellow-400/10 p-3 text-center shadow-inner">
              <p className="text-[11px] uppercase tracking-[0.22em] font-black text-orange-200">Shoot • Score • Upgrade • Repeat</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                <div className="flex items-start gap-3">
                  <div className="w-24 shrink-0 rounded-2xl border border-slate-700 bg-[#c98542] p-2 shadow-inner">
                    <div className="rounded-xl border border-white/70 bg-orange-500 px-2 py-1 text-center text-[9px] font-black text-white shadow">+1</div>
                    <div className="mt-1 rounded-xl border border-white/70 bg-orange-500 px-2 py-1 text-center text-[9px] font-black text-white shadow">+2</div>
                    <div className="mt-1 rounded-xl border border-white/70 bg-orange-500 px-2 py-1 text-center text-[9px] font-black text-white shadow">+3</div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-orange-300 font-black">🏀 Tap a shot button</p>
                    <p className="mt-1 text-sm font-bold leading-snug text-slate-300">On the court, tap a shot button to shoot. If it goes in, you earn pts. Harder shots usually pay more.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                <div className="flex items-start gap-3">
                  <div className="w-24 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-inner">
                    <div className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-center">
                      <p className="text-[7px] font-black uppercase tracking-wide text-slate-500">Hot Hand</p>
                      <div className="mt-1 grid grid-cols-2 gap-1 text-[9px] font-black">
                        <div className="rounded bg-slate-950 px-1 py-1 text-orange-300">Last x2</div>
                        <div className="rounded bg-slate-950 px-1 py-1 text-red-300">Next x4</div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-red-300 font-black">🔥 Build a streak</p>
                    <p className="mt-1 text-sm font-bold leading-snug text-slate-300">Make 2 in a row to get hot. Starting on the 3rd straight make, Hot Hand multipliers can kick in.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                <div className="flex items-start gap-3">
                  <div className="w-24 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-inner">
                    <div className="flex flex-wrap gap-1 justify-center">
                      <div className="h-7 w-7 rounded-full border border-green-200 bg-emerald-400 text-[8px] font-black text-slate-950 flex items-center justify-center">+3</div>
                      <div className="h-7 w-7 rounded-full border border-yellow-100 bg-yellow-300 text-[8px] font-black text-slate-950 flex items-center justify-center">+20</div>
                      <div className="h-7 w-7 rounded-full border border-red-300 bg-red-950 text-[10px] font-black text-red-200 flex items-center justify-center">×</div>
                      <div className="h-7 w-7 rounded-full border border-yellow-200/40 bg-yellow-300/30 text-[8px] font-black text-yellow-100 flex items-center justify-center">0</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-yellow-300 font-black">💰 Watch your round</p>
                    <p className="mt-1 text-sm font-bold leading-snug text-slate-300">The balls on the side show each shot: makes, misses, points, and golden balls.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                <div className="flex items-start gap-3">
                  <div className="w-24 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 p-2 shadow-inner">
                    <div className="rounded-lg border border-sky-400/50 bg-sky-500 px-2 py-1 text-center text-[8px] font-black text-white">Locker Room</div>
                    <div className="mt-1 rounded-lg border border-orange-400/50 bg-orange-500 px-2 py-1 text-center text-[8px] font-black text-white">Upgrade</div>
                    <div className="mt-1 rounded-lg border border-cyan-400/50 bg-cyan-500 px-2 py-1 text-center text-[8px] font-black text-white">Power-Up</div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sky-300 font-black">📈 Spend pts</p>
                    <p className="mt-1 text-sm font-bold leading-snug text-slate-300">Use the Locker Room to buy more balls, better odds, bigger shot values, and power-ups.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                <p className="text-emerald-300 font-black">🏆 Win condition</p>
                <p className="mt-1 text-sm font-bold leading-snug text-slate-300">Reach enough pts to claim <span className="text-yellow-300">The Crown</span>. That’s the goal.</p>
              </div>
            </div>

            <button type="button" onClick={startNewGame} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 px-5 py-4 text-lg font-black text-slate-950 shadow-xl border-2 border-white/50 active:scale-[0.98]">Start Playing</button>
          </Card>
        </div>
      </Shell>
    );
  }

  if (screen === "title") return (
    <Shell>
      {transitionOverlay}
      <div className="min-h-[100dvh] relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-500/12 blur-3xl" />
          <div className="absolute left-[-20%] bottom-[-10%] h-72 w-72 rounded-full bg-red-500/12 blur-3xl" />
          <div className="absolute right-[-20%] top-[8%] h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.08),transparent_40%)]" />
        </div>

        <Card className="relative w-full border border-orange-300/25 bg-slate-950 p-5 text-center shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300" />

          <div className="relative z-10 pt-4">
            <MenuBasketball />

            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-300">Arcade Basketball</p>

            <h1 className="mt-3 text-[48px] font-black leading-[0.9] tracking-[-0.055em] drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]">
              <span className="inline-flex items-end justify-center">
                <span className="text-orange-300 drop-shadow-[0_0_14px_rgba(249,115,22,0.58)]">HEATER</span><span className="text-slate-100 drop-shadow-[0_2px_0_rgba(0,0,0,0.85)]">BALL</span>
              </span>
            </h1>

            <div className="mx-auto mt-4 h-1.5 w-40 rounded-full bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

            <div className="mt-5 rounded-2xl border border-orange-300/25 bg-gradient-to-r from-red-500/12 via-orange-500/14 to-yellow-400/12 px-5 py-4 text-center shadow-[0_0_22px_rgba(249,115,22,0.12)]">
              <p className="text-[20px] font-black uppercase leading-[0.95] tracking-[-0.03em] text-white">Get Hot. Get Buckets.</p>
              <p className="mt-2 text-[12px] font-black uppercase tracking-[0.16em] text-orange-200">Build heat, cash shots, and chase the crown.</p>
            </div>

            <button type="button" onClick={startNewGame} className="mt-7 w-full rounded-2xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 px-5 py-4 text-xl font-black text-slate-950 shadow-xl border-2 border-white/40 active:scale-[0.98]">PLAY</button>

            <button type="button" onClick={() => setScreen("howToPlay")} className="mt-3 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-slate-200 shadow-lg border border-slate-700 active:scale-[0.98]">HOW TO PLAY</button>

            {saveStatus && <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">{saveStatus}</p>}
          </div>

          {showNewGamePrompt && (
            <div className="absolute inset-0 z-[999] flex items-center justify-center bg-slate-950 px-4">
              <div className="w-full max-w-[345px] rounded-[30px] border-2 border-orange-300 bg-slate-950 p-5 text-center shadow-[0_0_42px_rgba(0,0,0,1),0_0_30px_rgba(249,115,22,0.24)]">
                <SavedProgressIcon />

                {!confirmFreshStart ? (
                  <>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.28em] text-orange-300">Saved Progress</p>
                    <h3 className="mt-2 text-[30px] font-black uppercase leading-[0.92] tracking-[-0.03em] text-white drop-shadow-[0_2px_0_rgba(15,23,42,0.95)]">Continue Your Run?</h3>
                    <p className="mt-3 text-[15px] font-bold leading-snug text-slate-200">We found saved Heaterball progress on this device.</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button type="button" onClick={resumeGame} className="rounded-[24px] border-2 border-emerald-100 bg-emerald-500 px-3 py-4 text-center text-white shadow-[0_10px_20px_rgba(16,185,129,0.35)] transition hover:brightness-105 active:translate-y-[1px] active:scale-[0.985]">
                        <div className="text-lg font-black uppercase tracking-[0.12em]">Yes</div>
                        <div className="mt-1 text-[11px] font-bold leading-snug text-emerald-50">Resume save</div>
                      </button>

                      <button type="button" onClick={() => setConfirmFreshStart(true)} className="rounded-[24px] border-2 border-slate-400 bg-slate-800 px-3 py-4 text-center text-white shadow-[0_10px_20px_rgba(0,0,0,0.55)] transition hover:brightness-105 active:translate-y-[1px] active:scale-[0.985]">
                        <div className="text-lg font-black uppercase tracking-[0.12em]">No</div>
                        <div className="mt-1 text-[11px] font-bold leading-snug text-slate-200">Start over</div>
                      </button>
                    </div>

                    <button type="button" onClick={() => setShowNewGamePrompt(false)} className="mt-3 w-full rounded-[22px] border-2 border-slate-500 bg-slate-900 px-4 py-3 text-[12px] font-black uppercase tracking-[0.26em] text-slate-300 shadow-[0_8px_18px_rgba(0,0,0,0.55)] transition hover:bg-slate-800 active:scale-[0.985]">Cancel</button>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.28em] text-red-300">Fresh Game</p>
                    <h3 className="mt-2 text-[30px] font-black uppercase leading-[0.92] tracking-[-0.03em] text-white drop-shadow-[0_2px_0_rgba(15,23,42,0.95)]">Start a New Run?</h3>
                    <p className="mt-3 rounded-2xl border-2 border-red-400 bg-red-950 px-3 py-2 text-[13px] font-black leading-snug text-red-100">This will erase your saved progress on this device.</p>
                    <p className="mt-2 text-[14px] font-bold leading-snug text-slate-200">This will be a fresh game.</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setConfirmFreshStart(false)} className="rounded-[24px] border-2 border-slate-500 bg-slate-800 px-3 py-4 text-center text-white shadow-[0_10px_20px_rgba(0,0,0,0.55)] transition hover:brightness-105 active:translate-y-[1px] active:scale-[0.985]">
                        <div className="text-sm font-black uppercase tracking-[0.12em]">Go Back</div>
                      </button>

                      <button type="button" onClick={beginFreshGame} className="rounded-[24px] border-2 border-red-100 bg-red-500 px-3 py-4 text-center text-white shadow-[0_10px_20px_rgba(239,68,68,0.32)] transition hover:brightness-105 active:translate-y-[1px] active:scale-[0.985]">
                        <div className="text-sm font-black uppercase tracking-[0.12em]">Fresh Game</div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );

  if (screen === "playoff") return <Shell><div className="h-[100dvh] bg-slate-950 p-2 flex flex-col gap-2 overflow-hidden"><Card className="shrink-0 border border-purple-400/50 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/70 p-2.5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[0.2em] font-black text-purple-300 whitespace-nowrap">DeepCourt Gambit</p><h1 className="mt-0.5 text-[23px] font-black leading-none text-white whitespace-nowrap">DeepCourt Gambit</h1></div><button type="button" onClick={() => setScreen("lockerRoom")} className="shrink-0 rounded-xl border border-sky-300/50 bg-sky-500 px-2.5 py-1.5 text-[9px] font-black text-white shadow-lg active:scale-[0.98] hover:bg-sky-600">Locker Room</button></div><div className="mt-2 grid grid-cols-2 gap-2"><div className="rounded-2xl border border-purple-300/25 bg-slate-950/65 p-2 text-center shadow-inner"><p className="text-[8px] uppercase tracking-[0.22em] font-black text-slate-500">Current Bank</p><p className="mt-0.5 text-3xl font-black leading-none text-white">{formatNumber(currentPoints)} <span className="text-sm text-slate-400">pts</span></p></div><div className="rounded-2xl border border-purple-300/25 bg-slate-950/65 p-2 text-center shadow-inner"><p className="text-[8px] uppercase tracking-[0.22em] font-black text-slate-500">Place Your Wager</p><input type="number" min="1" max={currentPoints} value={wagerInput} disabled={!!playoffShot} onChange={(event) => setWagerInput(event.target.value)} className="mt-0.5 w-full rounded-xl border border-purple-300/40 bg-slate-950 px-2 py-1 text-center text-2xl font-black leading-none text-white outline-none" /><button type="button" disabled={!!playoffShot} onClick={() => setWagerInput(String(currentPoints))} className="mt-1 text-[8px] font-black uppercase tracking-[0.18em] text-purple-300 disabled:text-slate-600">Max</button></div></div><p className="mt-1.5 text-center text-[11px] font-black leading-tight text-slate-200">Make it to win your wager. Miss and lose it.</p><p className="text-center text-[9px] font-bold leading-tight text-slate-500">Need 10,000 pts to enter. All bonuses are off.</p></Card><Card className="relative flex-1 min-h-0 overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-950 via-slate-900 to-[#c98542]"><div className="absolute left-3 top-3 z-20 rounded-2xl border border-purple-200/40 bg-slate-950/72 px-4 py-3 shadow-lg backdrop-blur-sm"><p className="text-[10px] uppercase tracking-[0.18em] font-black text-purple-200 leading-none">Make Chance</p><p className="mt-1 text-3xl font-black leading-none text-white">{doubleOrNothingChance}%</p></div>
        <div className="absolute left-1/2 top-[15%] z-10 -translate-x-1/2 pointer-events-none">
          <div className="relative h-[34px] w-[58px] rounded-[4px] border-[3px] border-white bg-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
            <div className="absolute left-1/2 top-[8px] h-[12px] w-[18px] -translate-x-1/2 border-[2px] border-slate-500" />
            <div className="absolute left-1/2 top-[24px] h-[6px] w-[28px] -translate-x-1/2 rounded-full border-[3px] border-orange-500 bg-transparent shadow-[0_0_8px_rgba(249,115,22,0.45)]" />
            <div className="absolute left-1/2 top-[29px] -translate-x-1/2">
              <svg width="24" height="16" viewBox="0 0 24 16">
                <path d="M2 1 L6 15 M7 1 L10 15 M12 1 L12 15 M17 1 L14 15 M22 1 L18 15" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
                <path d="M2 1 H22" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
                <path d="M4 6 H20 M6 10 H18 M8 13 H16" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
        </div>{!playoffShot && <div className="absolute left-1/2 bottom-[22%] z-10 -translate-x-1/2 pointer-events-none"><div className="relative h-14 w-14 rounded-full border-4 border-orange-900 bg-orange-500 shadow-2xl opacity-85 overflow-hidden"><div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-orange-900/75" /><div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-orange-900/75" /><div className="absolute inset-2 rounded-full border border-orange-900/60" /></div></div>}{!playoffShot && <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center"><button type="button" onClick={takePlayoffShot} disabled={getWagerAmount() <= 0 || getWagerAmount() > currentPoints} className={`rounded-3xl px-9 py-4 text-lg font-black text-white shadow-2xl border-2 active:scale-[0.98] ${getWagerAmount() <= 0 || getWagerAmount() > currentPoints ? "border-slate-600 bg-slate-700 text-slate-400" : "border-purple-200 bg-purple-500"}`}>Enter Challenge</button></div>}<AnimatePresence>{playoffShot && <motion.div key={playoffShot.key} initial={{ left: "50%", top: "78%", rotate: 0 }} animate={playoffShot.made ? { left: ["50%", "50%", "50%", "50%", "50%", `${PLAYOFF_BACK_RIM_TARGET.x}%`, "50%"], top: ["78%", "38%", "-18%", "-18%", "9%", `${PLAYOFF_BACK_RIM_TARGET.y}%`, "32%"], rotate: [0, 120, 240, 240, 320, 420, 500] } : playoffShot.missSide === "left" ? { left: ["50%", "50%", "50%", "50%", "50%", "45%", "37%"], top: ["78%", "38%", "-18%", "-18%", "9%", "25%", "32%"], rotate: [0, 120, 240, 240, 320, 420, 520] } : { left: ["50%", "50%", "50%", "50%", "50%", "55%", "63%"], top: ["78%", "38%", "-18%", "-18%", "9%", "25%", "32%"], rotate: [0, 120, 240, 240, 320, 420, 520] }} transition={{ duration: 7.8, ease: "easeInOut", times: [0, 0.28, 0.46, 0.58, 0.68, 0.86, 1] }} style={{ x: "-50%", y: "-50%" }} className="absolute z-30 pointer-events-none h-12 w-12"><motion.div animate={playoffShot.made ? { scale: [1.35, 0.95, 0.7, 0.7, 0.34, 0.2, 0.06], opacity: [1, 1, 0, 0, 1, 1, 0] } : { scale: [1.35, 0.95, 0.7, 0.7, 0.34, 0.22, 0.16], opacity: [1, 1, 0, 0, 1, 1, 0] }} transition={{ duration: 7.8, ease: "easeInOut", times: [0, 0.28, 0.46, 0.58, 0.68, 0.86, 1] }} className="relative h-12 w-12 rounded-full border-4 border-orange-900 bg-orange-500 shadow-2xl overflow-hidden"><div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-orange-900/75" /><div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-orange-900/75" /><div className="absolute inset-2 rounded-full border border-orange-900/60" /></motion.div></motion.div>}</AnimatePresence><AnimatePresence>{playoffResult && <motion.div initial={{ opacity: 0, scale: 0.55, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 180, damping: 14 }} className={`absolute inset-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none ${playoffResult === "made" ? "text-green-300" : "text-red-300"}`}>{playoffResult === "made" ? <><div className="mb-3 rounded-full border-2 border-green-200/60 bg-green-400/20 px-5 py-2 text-2xl font-black text-green-100 shadow-[0_0_28px_rgba(134,239,172,0.55)]">{playoffShot?.phrase || "CASHED IT!"}</div><div className="text-5xl font-black drop-shadow-[0_0_18px_rgba(134,239,172,0.8)]">WAGER WON</div><div className="mt-2 text-2xl font-black text-green-100">+{formatNumber(playoffShot?.wagerAmount || 0)} pts</div></> : <><div className="mb-3 rounded-full border-2 border-red-200/60 bg-red-400/20 px-5 py-2 text-2xl font-black text-red-100 shadow-[0_0_28px_rgba(248,113,113,0.45)]">{playoffShot?.phrase || "BUST"}</div><div className="text-6xl font-black">WAGER LOST</div><div className="mt-2 text-2xl font-black text-red-100">-{formatNumber(playoffShot?.wagerAmount || 0)} pts</div></>}</motion.div>}</AnimatePresence></Card></div></Shell>;

  if (screen === "lockerRoom") return <Shell>{transitionOverlay}<Card onClick={() => setConfirmDoubleOrNothingUpgrade(false)} className="h-[100dvh] p-2.5 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col overflow-hidden touch-pan-y"><div className="shrink-0 rounded-3xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-950 px-3 pt-1.5 pb-3 shadow-xl"><div className="flex items-start justify-between gap-3"><div><button type="button" onClick={() => setScreen("title")} className="mb-0.5 rounded-md border border-slate-700 bg-slate-950/70 px-2 py-0 text-[8px] font-black uppercase tracking-wide text-slate-400 shadow-sm active:scale-[0.98]">Main Menu</button><h1 className="text-3xl font-black leading-none mt-0.5">{formatNumber(currentPoints)} <span className="text-sm font-black text-slate-400 align-middle">pts</span></h1></div><button type="button" onClick={startCourt} className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black px-4 py-3 shadow-xl active:scale-[0.98]">Hit the Court</button></div><div className="grid grid-cols-6 gap-1 mt-1">
            <StatBox label="Balls" value={shotsPerTrip} color="text-sky-300" maxed={upgrades.extraShots >= EXTRA_BALL_COSTS.length} maxTheme="sky" labelSize="text-[7px]" valueSize="text-[13px]" heightClass="h-[52px]" />
            <StatBox label="Hot Hand" value={upgrades.hotHand > 0 ? `x${HOT_HAND_MULTS[upgrades.hotHand - 1]}` : "-"} color={upgrades.hotHand > 0 ? "text-red-300" : "text-slate-500"} maxed={upgrades.hotHand >= HOT_HAND_COSTS.length} maxTheme="red" labelSize="text-[7px]" valueSize="text-[13px]" heightClass="h-[52px]" />
            <StatBox label="Rim Rescue" value={upgrades.doubleRim > 0 ? `${doubleRimChance}%` : "-"} color={upgrades.doubleRim > 0 ? "text-emerald-300" : "text-slate-500"} maxed={upgrades.doubleRim >= DOUBLE_RIM_COSTS.length} maxTheme="emerald" labelSize="text-[7px]" valueSize="text-[11px]" heightClass="h-[52px]" />
            <StatBox label="Open Look" value={upgrades.courtVision > 0 ? (openLookCooldown ? "-" : `${courtVisionChance}%`) : "-"} color={upgrades.courtVision > 0 ? (openLookCooldown ? "text-slate-500" : "text-lime-300") : "text-slate-500"} maxed={upgrades.courtVision >= COURT_VISION_COSTS.length && !openLookCooldown} maxTheme="emerald" labelSize="text-[7px]" valueSize="text-[11px]" heightClass="h-[52px]" />
            <StatBox label="Golden" value={upgrades.goldenBall > 0 ? (upgrades.superGolden > 0 ? <span className="flex flex-col items-center leading-none"><span>{goldenChance}%</span><span className="mt-0.5 text-[7px] uppercase tracking-wide text-white">+SG</span></span> : `${goldenChance}%`) : "-"} color={upgrades.goldenBall > 0 ? "text-yellow-300" : "text-slate-500"} maxed={upgrades.goldenBall >= GOLDEN_BALL_COSTS.length} maxTheme={upgrades.superGolden > 0 ? "superGold" : "yellow"} labelSize="text-[7px]" valueSize="text-[11px]" heightClass="h-[52px]" />
            <div className={`h-[52px] rounded-xl px-1.5 py-1 text-center relative overflow-hidden flex flex-col items-center justify-center border ${upgrades.coachChallenge > 0 ? "bg-cyan-950/70 border-cyan-300/70 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.45)]" : "bg-slate-900/80 border-slate-700 text-slate-500"}`}>
              <p className="text-[7px] uppercase tracking-wide text-slate-500 font-black leading-none">Challenge</p>
              <p className="mt-1 text-[12px] font-black leading-tight">{upgrades.coachChallenge > 0 ? <span className="flex flex-col items-center leading-none"><span className="text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]">📋</span><span className="mt-0.5 text-[7px] uppercase tracking-wide text-cyan-200">Ready</span></span> : "-"}</p>
            </div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => setLockerScreen("shots")} className={`rounded-xl border px-2 py-2 text-[10px] font-black active:scale-[0.98] ${lockerScreen === "shots" ? "bg-orange-500 border-orange-300 text-white shadow-[0_0_14px_rgba(249,115,22,0.45)]" : "bg-slate-950 border-slate-700 text-slate-400"}`}>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base leading-none">🏀</span>
                <span className="leading-none">Shot Lab</span>
              </div>
            </button>
            <button type="button" onClick={() => setLockerScreen("bonus")} className={`rounded-xl border px-2 py-2 text-[10px] font-black active:scale-[0.98] ${lockerScreen === "bonus" ? "bg-red-500 border-red-300 text-white shadow-[0_0_14px_rgba(239,68,68,0.45)]" : "bg-slate-950 border-slate-700 text-slate-400"}`}>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base leading-none">⚡</span>
                <span className="leading-none">Power-Ups</span>
              </div>
            </button>
            <button type="button" onClick={() => setLockerScreen("mystery")} className={`rounded-xl border px-2 py-2 text-[10px] font-black active:scale-[0.98] ${lockerScreen === "mystery" ? "bg-violet-500 border-violet-300 text-white shadow-[0_0_14px_rgba(139,92,246,0.45)]" : "bg-slate-950 border-slate-700 text-slate-400"}`}>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base leading-none">🎲</span>
                <span className="leading-none">High Stakes</span>
              </div>
            </button>
          </div><div className="mt-2 flex-1 min-h-0 overflow-y-scroll overscroll-contain touch-pan-y pr-1 [-webkit-overflow-scrolling:touch]"><div className="grid grid-cols-2 gap-2 pb-0">{shopItems.filter(Boolean).filter((item) => {
                if (lockerScreen === "shots") return item.key === "extraShots" || item.type === "shotUpgrade";
                if (lockerScreen === "bonus") return ["hotHand", "courtVision", "coachChallenge", "doubleRim", "goldenBall", "superGolden"].includes(item.key);
                if (lockerScreen === "mystery") return item.type === "playoff" || item.type === "trophy";
                return true;
              }).map((item, index) => { if (item.type === "section") { const t = THEME[item.theme] || THEME.lab; return <div key={`section-${index}`} className={`col-span-2 mt-2 first:mt-0 rounded-xl border px-3 py-2 ${t.header}`}><p className="text-[9px] uppercase tracking-[0.2em] font-black">{item.title}</p></div>; } if (item.type === "singleTrack") return <SingleTrackUpgradeCard key={item.key} {...item} onBuy={item.action} currentPoints={currentPoints} />; if (item.type === "shotUpgrade") return <ShotUpgradeCard key={item.key} title={item.title} theme="lab" accuracyCurrent={item.accuracyCurrent} accuracyAdd={item.accuracyAdd} accuracyCost={item.accuracyCost} accuracyLevel={item.accuracyLevel} accuracyMax={item.accuracyMax} onBuyAccuracy={item.accuracyAction} valueCurrent={item.valueCurrent} valueAdd={item.valueAdd} valueCost={item.valueCost} valueLevel={item.valueLevel} valueMax={item.valueMax} onBuyValue={item.valueAction} currentPoints={currentPoints} locked={!!item.locked} unlockCost={item.unlockCost ?? 0} onUnlock={item.unlockAction} />; if (item.type === "playoff") return <div key="playoff" onClick={(event) => event.stopPropagation()} className="col-span-2 rounded-xl border border-white/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(88,28,135,0.28),rgba(30,64,175,0.22),rgba(5,150,105,0.18),rgba(202,138,4,0.18),rgba(190,24,93,0.2))] p-3.5 shadow-[0_0_24px_rgba(255,255,255,0.06)]"><div className="flex items-start justify-between gap-3"><div><p className="text-base font-black text-white">DeepCourt Gambit</p><p className="mt-1 text-[11px] leading-snug text-slate-300">Enter the challenge, place your wager, and take the deep shot.</p></div><div className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-center"><p className="text-lg font-black leading-none text-white">{currentPoints >= PLAYOFF_TICKET_COST ? `${doubleOrNothingChance}%` : "?"}</p><p className="text-[7px] uppercase tracking-wide font-black text-slate-300">Make</p></div></div><button type="button" disabled={currentPoints < PLAYOFF_TICKET_COST} onClick={openPlayoffDoor} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-black ${currentPoints < PLAYOFF_TICKET_COST ? "bg-slate-800 text-slate-500" : "bg-white/12 hover:bg-white/18 text-white border border-white/20"}`}>{currentPoints >= PLAYOFF_TICKET_COST ? "Enter Challenge" : `Reach ${formatNumber(PLAYOFF_TICKET_COST)} pts`}</button>{currentPoints >= PLAYOFF_TICKET_COST && <><div className="my-3 flex items-center gap-2"><div className="h-px flex-1 bg-white/12" /><span className="text-[8px] uppercase tracking-[0.18em] font-black text-slate-400">Upgrade</span><div className="h-px flex-1 bg-white/12" /></div><button type="button" disabled={upgrades.doubleOrNothing > 0 || currentPoints < DOUBLE_OR_NOTHING_UPGRADE_COST} onClick={buyDoubleOrNothingUpgrade} className={`mt-2 w-full rounded-xl px-3 py-2 text-xs font-black ${upgrades.doubleOrNothing > 0 ? "bg-emerald-700/40 text-emerald-200" : currentPoints < DOUBLE_OR_NOTHING_UPGRADE_COST ? "bg-slate-800 text-slate-500" : confirmDoubleOrNothingUpgrade ? "bg-red-500 hover:bg-red-600 text-white" : "bg-violet-500 hover:bg-violet-600 text-white"}`}>{upgrades.doubleOrNothing > 0 ? "50% Unlocked" : confirmDoubleOrNothingUpgrade ? "Are you sure? Tap again" : `Upgrade to 50% • ${formatNumber(DOUBLE_OR_NOTHING_UPGRADE_COST)} pts`}</button></>}</div>; if (item.type === "trophy") return <TrophyCard key="trophy" title="The Crown" text="The finish line. Reach the mark, claim the crown, win the grind." buttonText={currentPoints >= TROPHY_COST ? "Claim the Crown" : `Reach ${formatNumber(TROPHY_COST)} pts`} disabled={currentPoints < TROPHY_COST} maxed={hasWon} onClick={buyTrophy} className="bg-gradient-to-br from-yellow-300/22 via-amber-400/22 to-orange-500/20 border-yellow-300/55 shadow-[0_0_28px_rgba(250,204,21,0.16)]" titleClassName="text-yellow-200" buttonClassName="bg-yellow-400 hover:bg-yellow-500 text-slate-950" />; return null; })}</div></div></Card></Shell>;

  return <Shell>{transitionOverlay}<div className="p-3 space-y-1.5 bg-slate-950 min-h-[100dvh]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}><Card className="border border-slate-700 bg-slate-900"><motion.div animate={missShakeKey > 0 ? { x: missShakeKey % 2 === 0 ? [0, -8, 8, -6, 6, -3, 3, 0] : [0, 8, -8, 6, -6, 3, -3, 0], y: [0, 2, -2, 1, -1, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.42, ease: "easeOut" }} className="relative h-[472px] overflow-hidden rounded-3xl border border-amber-900/40 bg-[#c98542]"><div className={`absolute left-2 top-2 ${courtTripOver ? "z-[82] rounded-2xl bg-slate-950/42 p-1 backdrop-blur-[1px]" : "z-30"} flex flex-col items-center gap-1 pointer-events-none`}>
            {Array.from({ length: shotsPerTrip }).map((_, index) => {
              const item = tripShots[index];
              const isNext = index === tripShots.length && !courtTripOver;
              const madeStyle = item?.superGolden
                ? "bg-yellow-100 border-white text-yellow-700 shadow-[0_0_16px_rgba(255,255,255,0.95)]"
                : item?.golden && item?.made
                ? "bg-yellow-300 border-yellow-100 text-slate-950 shadow-[0_0_12px_rgba(250,204,21,0.85)]"
                : item?.golden && !item?.made
                ? "bg-yellow-300/35 border-yellow-200/50 text-yellow-100 shadow-[0_0_8px_rgba(250,204,21,0.32)]"
                : item?.made
                ? "bg-emerald-400 border-emerald-100 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.75)]"
                : item
                ? "bg-red-950 border-red-400 text-red-200 shadow-[0_0_10px_rgba(248,113,113,0.55)]"
                : isNext
                ? "bg-orange-400 border-orange-100 text-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                : "bg-slate-900 border-slate-600 text-slate-500 opacity-70";
              return (
                <div key={item?.id || `empty-${index}`} className={`relative flex ${shotBallSize(item?.points || 0)} items-center justify-center rounded-full border-2 font-black leading-none transition-all ${madeStyle}`}>
                  {!item && <><div className="absolute inset-y-1 left-1/2 w-[2px] -translate-x-1/2 bg-orange-900/55" /><div className="absolute inset-x-1 top-1/2 h-[2px] -translate-y-1/2 bg-orange-900/55" /><div className="absolute inset-2 rounded-full border border-orange-900/40" /></>}
                  {item?.made && (
                    <div className="relative z-10 flex flex-col items-center leading-none">
                      <motion.span initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: "easeOut" }} className={`${shotBallScoreSize(item.points)}`}>+{formatNumber(item.points)}</motion.span>
                    </div>
                  )}
                  {item && !item.made && <span className="relative z-10 text-base">✕</span>}
                </div>
              );
            })}
          </div><svg className="absolute inset-0 z-0" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="courtWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d99652" /><stop offset="100%" stopColor="#c98542" /></linearGradient></defs><rect x="0" y="0" width="100" height="100" fill="url(#courtWood)" /><g opacity="0.12">{[10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90].map((y) => <line key={y} x1="10" y1={y} x2="90" y2={y} stroke="white" strokeWidth="0.35" />)}</g><g fill="none" stroke="rgba(255,255,255,0.94)" strokeLinecap="round" strokeLinejoin="round"><path d="M10 98.5 L10 4 L90 4 L90 98.5" strokeWidth="1.2" /><rect x="39" y="4" width="22" height="36" strokeWidth="1.1" /><line x1="39" y1="40" x2="61" y2="40" strokeWidth="1.1" /><path d="M39 40 A11 11 0 0 0 61 40" strokeWidth="1.1" /><path d="M45.5 18 A4.5 4.5 0 0 0 54.5 18" strokeWidth="1" /><line x1="37" y1="27" x2="39" y2="27" strokeWidth="0.8" /><line x1="37" y1="32" x2="39" y2="32" strokeWidth="0.8" /><line x1="37" y1="37" x2="39" y2="37" strokeWidth="0.8" /><line x1="61" y1="27" x2="63" y2="27" strokeWidth="0.8" /><line x1="61" y1="32" x2="63" y2="32" strokeWidth="0.8" /><line x1="61" y1="37" x2="63" y2="37" strokeWidth="0.8" /><path d="M16 4 L16 55 M84 4 L84 55 M16 55 A34 26 0 0 0 84 55" strokeWidth="1.15" /><line x1="10" y1="98.5" x2="90" y2="98.5" strokeWidth="1.2" /><path d="M43.5 98.5 A6.5 6.5 0 0 1 56.5 98.5" strokeWidth="1.1" /></g></svg><div className="absolute z-[45] pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: `${RIM.x}%`, top: `${RIM.y}%` }}><div className="absolute left-[-29px] top-[-11px] h-[10px] w-[58px] rounded-md border-2 border-white bg-gradient-to-b from-white to-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.45)]" /><div className="absolute left-[-20px] top-[-8px] h-[2px] w-[40px] rounded-full bg-white/80" /><div className="absolute left-[-7px] top-[-5px] h-[3px] w-[14px] rounded-sm border border-slate-500/60 bg-slate-100/70" /><div className="absolute left-[-3px] top-[-3px] h-[9px] w-[6px] rounded-full bg-slate-400 shadow-sm" /><div className="absolute left-[-27px] top-[0px] h-[54px] w-[54px] rounded-full border-[4px] border-orange-900/90 bg-transparent shadow-[0_2px_8px_rgba(0,0,0,0.35)]" /><div className="absolute left-[-24px] top-[3px] h-12 w-12 rounded-full border-[5px] border-orange-500 bg-transparent shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
              <div className="absolute left-[-17px] top-[12px] w-[34px] flex flex-col items-center gap-[0px] opacity-65">
                {[3, 4, 5, 4, 3].map((count, rowIndex) => (
                  <div key={`net-row-${rowIndex}`} className="flex h-[6px] items-center justify-center gap-[1px]">
                    {Array.from({ length: count }).map((_, index) => (
                      <span key={`net-x-${rowIndex}-${index}`} className="text-[9px] font-normal leading-none text-white/75">×</span>
                    ))}
                  </div>
                ))}
              </div></div><AnimatePresence>{activeShot && <motion.div key={`${activeShot.id}-${shotAnimKey}`} initial={{ left: `${activeShot.x}%`, top: `${activeShot.y}%` }} animate={activeShot.bouncedIn ? { left: [`${activeShot.x}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.x : FRONT_RIM_RIGHT.x}%`, `${activeShot.missSide === "left" ? RIM_SAVE_DEFLECT_RIGHT.x : RIM_SAVE_DEFLECT_LEFT.x}%`, `${RIM_SAVE_CENTER.x}%`, `${BACK_RIM_TARGET.x}%`, `${MAKE_DROP_TARGET.x}%`], top: [`${activeShot.y}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.y : FRONT_RIM_RIGHT.y}%`, `${activeShot.missSide === "left" ? RIM_SAVE_DEFLECT_RIGHT.y : RIM_SAVE_DEFLECT_LEFT.y}%`, `${RIM_SAVE_CENTER.y}%`, `${BACK_RIM_TARGET.y}%`, `${MAKE_DROP_TARGET.y}%`] } : activeShot.made ? { left: [`${activeShot.x}%`, `${BACK_RIM_TARGET.x}%`, `${MAKE_DROP_TARGET.x}%`], top: [`${activeShot.y}%`, `${BACK_RIM_TARGET.y}%`, `${MAKE_DROP_TARGET.y}%`] } : { left: [`${activeShot.x}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.x : FRONT_RIM_RIGHT.x}%`, `${activeShot.missSide === "left" ? MISS_DEFLECT_LEFT.x : MISS_DEFLECT_RIGHT.x}%`], top: [`${activeShot.y}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.y : FRONT_RIM_RIGHT.y}%`, `${activeShot.missSide === "left" ? MISS_DEFLECT_LEFT.y : MISS_DEFLECT_RIGHT.y}%`] }} transition={{ duration: activeShot.bouncedIn ? 2.05 : activeShot.made ? 1.55 : 1.3, times: activeShot.bouncedIn ? [0, 0.52, 0.68, 0.82, 0.91, 1] : activeShot.made ? [0, 0.72, 1] : [0, 0.7, 1], ease: "easeInOut" }} className="absolute z-[60] pointer-events-none w-10 h-10 -translate-x-1/2 -translate-y-1/2"><motion.div animate={activeShot.bouncedIn ? { scale: [1, 0.96, 0.9, 0.62, 0.32, 0.08], opacity: [1, 1, 1, 1, 0.96, 0] } : activeShot.made ? { scale: [1, 0.52, 0.1], opacity: [1, 1, 0] } : { scale: [1, 0.96, 0.88], opacity: [1, 1, 0] }} transition={{ duration: activeShot.bouncedIn ? 2.05 : activeShot.made ? 1.55 : 1.3, times: activeShot.bouncedIn ? [0, 0.52, 0.68, 0.82, 0.91, 1] : activeShot.made ? [0, 0.72, 1] : [0, 0.7, 1], ease: "easeInOut" }} className={`relative h-10 w-10 rounded-full border-4 shadow-2xl ${activeShot.superGolden ? "overflow-visible bg-yellow-100 border-yellow-300 shadow-[0_0_30px_rgba(255,255,255,0.95)]" : activeShot.golden ? "overflow-visible bg-yellow-300 border-yellow-600" : "overflow-visible bg-orange-500 border-orange-800"}`}>{activeShot.superGolden && <div className="absolute inset-[-16px] rounded-full bg-white/40 blur-xl pointer-events-none" />}{activeShot.onFire && !activeShot.superGolden && <HotHandFire />}<div className={`absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 ${activeShot.superGolden ? "bg-yellow-500/70" : activeShot.golden ? "bg-yellow-700/70" : "bg-orange-800/70"}`} /><div className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 ${activeShot.superGolden ? "bg-yellow-500/70" : activeShot.golden ? "bg-yellow-700/70" : "bg-orange-800/70"}`} /><div className={`absolute inset-1 rounded-full border ${activeShot.superGolden ? "border-yellow-500/60" : activeShot.golden ? "border-yellow-700/50" : "border-orange-800/50"}`} /></motion.div></motion.div>}</AnimatePresence>{!isShooting && !courtTripOver && shotsRemaining > 0 && availableShots.map((shot) => {
              const open = isOpenLookShot(shot.id);
              const buttonClass = open
                ? "bg-lime-500 hover:bg-lime-600 border-lime-100 text-slate-950 shadow-[0_0_22px_rgba(132,204,22,0.85)] animate-pulse"
                : "bg-orange-500 hover:bg-orange-600 border-orange-300 text-white";
              return (
                <button
                  key={shot.id}
                  type="button"
                  onClick={() => takeShot(shot)}
                  disabled={shotsRemaining <= 0}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl active:scale-95 font-black px-3.5 py-2 shadow-xl border z-30 min-w-[76px] ${buttonClass}`}
                  style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
                >
                  {open ? <span className="mb-0.5 block text-[8px] leading-none tracking-[0.16em] font-black">OPEN LOOK</span> : null}
                  <span className="block text-2xl leading-none">+{formatNumber(getDisplayedShotValue(shot))}</span>
                  <span className="mt-1 block text-[10px] leading-none opacity-90">{shot.label}</span>
                  <span className="mt-0.5 block text-[10px] leading-none opacity-80">{getDisplayedShotOdds(shot)}% make</span>
                </button>
              );
            })}{lastMadeBreakdown && <div className="absolute inset-x-8 bottom-4 z-20 flex items-center justify-center gap-1.5 text-center text-[11px] font-black leading-snug text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"><span className="text-white/75">Score Calc:</span><span className="text-white">{lastMadeBreakdown.base}</span>{lastMadeBreakdown.superGolden ? <span className="text-yellow-200 drop-shadow-[0_0_8px_rgba(250,204,21,0.85)]">×10</span> : lastMadeBreakdown.golden ? <span className="text-yellow-300">×5</span> : null}{lastMadeBreakdown.hotHandMult > 1 && <span className="text-red-300">×{lastMadeBreakdown.hotHandMult}</span>}{lastMadeBreakdown.openLook && <span className="text-lime-300">×1.25</span>}{lastMadeBreakdown.bouncedIn && <span className="text-emerald-300">✓✓</span>}<span className="text-slate-400">=</span><span className="text-green-300">+{formatNumber(lastMadeBreakdown.earned)} pts</span></div>}<AnimatePresence>{lastResult && <motion.div key={`result-${shotAnimKey}`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 ${lastResult.made ? "text-green-300 text-6xl font-black" : "text-red-400 text-7xl font-black italic tracking-tight [-webkit-text-stroke:2px_rgba(127,29,29,0.95)] drop-shadow-[0_0_18px_rgba(248,113,113,0.95)]"}`}>{lastResult.made ? "" : "CLANK!"}</motion.div>}</AnimatePresence><AnimatePresence>{pointsPop && <motion.div key={`points-${shotAnimKey}-${pointsPop}`} initial={{ opacity: 0, y: 18, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1.08 }} exit={{ opacity: 0, y: -18, scale: 0.95 }} transition={{ duration: 0.8 }} className="absolute inset-x-0 top-52 z-[65] flex justify-center pointer-events-none"><div className="rounded-xl border border-green-300/40 bg-slate-950/85 px-4 py-2 text-3xl font-black text-green-300 shadow-xl drop-shadow-[0_0_12px_rgba(134,239,172,0.9)]">+{formatNumber(pointsPop)}</div></motion.div>}</AnimatePresence><AnimatePresence>{shotCallouts && (shotCallouts.main || shotCallouts.bigScore || shotCallouts.rimSave) && <motion.div initial={{ opacity: 0, y: 24, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="absolute inset-x-0 top-24 z-[66] flex flex-col items-center gap-1.5 pointer-events-none px-4">
              {shotCallouts.main && <div className={`rounded-2xl border-2 px-5 py-2 text-2xl font-black text-center ${CALLOUT_STYLES[shotCallouts.main.style]}`}>{shotCallouts.main.text}</div>}
              {shotCallouts.bigScore && <div className={`rounded-xl border-2 px-4 py-1.5 text-base font-black text-center ${CALLOUT_STYLES.bigScore}`}>{shotCallouts.bigScore.text}</div>}
              {shotCallouts.rimSave && <div className={`rounded-full border px-3 py-1 text-xs font-black text-center ${CALLOUT_STYLES.rimSave}`}>{shotCallouts.rimSave.text}</div>}
            </motion.div>}</AnimatePresence><AnimatePresence mode="wait">{challengeFlashKey && <motion.div key={`challenge-flash-${challengeFlashKey}`} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.08 }} className="absolute inset-0 z-[80] flex items-center justify-center pointer-events-none overflow-hidden">
              <motion.div initial={{ x: "120%" }} animate={{ x: ["120%", "-120%", "120%"] }} transition={{ duration: 2.05, ease: "easeInOut" }} className="absolute top-0 h-full w-1/2 -rotate-12 bg-cyan-200/20 blur-lg" />
              <div className="absolute inset-0 bg-cyan-950/32 backdrop-blur-[1px]" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.42, 0.25, 0.48, 0.2, 0] }}
                transition={{ duration: 2.15, times: [0, 0.14, 0.32, 0.52, 0.8, 1] }}
                className="absolute inset-0 mix-blend-screen"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(34,211,238,0.18) 0px, rgba(34,211,238,0.18) 1px, transparent 1px, transparent 7px)",
                }}
              />
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: [0, 0.5, 0.2, 0.55, 0], x: [0, -8, 7, -4, 0] }}
                transition={{ duration: 2.05, times: [0, 0.2, 0.45, 0.65, 1] }}
                className="absolute inset-0 border-y-4 border-cyan-200/35"
              />
              <motion.div initial={{ scale: 0.72, rotate: -5, y: 16 }} animate={{ scale: [0.72, 1.08, 1, 1, 0.96], rotate: [-5, 2, 0, 0, 0], y: [16, -4, 0, 0, 0] }} transition={{ duration: 1.75, ease: "easeOut" }} className="relative rounded-3xl border-4 border-cyan-100/85 bg-slate-950 px-5 py-4 text-center shadow-[0_0_38px_rgba(34,211,238,0.85)]">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-cyan-100/80 bg-cyan-400/20 text-3xl">📋</div>
                <p className="text-[10px] uppercase tracking-[0.24em] font-black text-cyan-200">Coach’s Challenge</p>
                <p className="mt-1 text-4xl font-black leading-none text-white">OVERTURNED</p>
              </motion.div>
            </motion.div>}</AnimatePresence>{challengeOffer?.isFinalShot && !courtTripOver && <div className="absolute inset-x-0 bottom-20 z-[72] flex justify-center pointer-events-none">
              <button type="button" onClick={passCoachChallenge} className="pointer-events-auto rounded-2xl border-2 border-slate-300/70 bg-slate-950 px-6 py-3 text-sm font-black uppercase tracking-wide text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.9)] active:scale-[0.96]">
                End Round
              </button>
            </div>}<AnimatePresence>{lockedPrompt && <motion.div key={lockedPrompt.key} initial={{ opacity: 0, y: 12, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.22 }} className="absolute inset-x-0 bottom-28 z-[120] flex justify-center pointer-events-none">
              <div className="rounded-2xl border-2 border-slate-300 bg-slate-950 px-4 py-2 text-center text-sm font-black text-white shadow-[0_0_26px_rgba(0,0,0,1)]">
                Purchase in Locker Room
              </div>
            </motion.div>}</AnimatePresence>{courtTripOver && <motion.div initial={{ opacity: 0, y: 18, scale: 0.82 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 14 }} className="absolute inset-x-4 top-[220px] z-[70] flex justify-center pointer-events-none">
              <div className="w-full max-w-[340px] rounded-3xl border-2 border-white/25 bg-slate-950 px-5 py-4 text-center shadow-[0_0_34px_rgba(15,23,42,0.95)] backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.24em] font-black text-slate-400">Round Total</p>
                <p className="mt-1 text-5xl font-black leading-none text-green-300 drop-shadow-[0_0_14px_rgba(134,239,172,0.65)]">+{formatNumber(tripPointsEarned)}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-400">pts earned</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={runItBack} className="pointer-events-auto rounded-2xl border-2 border-orange-200/80 bg-orange-500 px-3 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_20px_rgba(249,115,22,0.55)] active:scale-[0.97]">Try Again</button>
                  <button type="button" onClick={goLockerRoom} className="pointer-events-auto rounded-2xl border-2 border-sky-200/80 bg-sky-500 px-3 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_20px_rgba(14,165,233,0.55)] active:scale-[0.97]">Hit the Showers</button>
                </div>
              </div>
            </motion.div>}</motion.div></Card><div className="rounded-xl bg-slate-950 border border-slate-700 px-2 py-1.5 shadow-xl -mt-1"><div className="flex items-center justify-between gap-2"><div><p className="text-[9px] uppercase tracking-wide text-slate-500 font-black">Scoreboard</p><p className="text-lg font-black leading-none mt-0.5">{formatNumber(currentPoints)} <span className="text-[11px] font-black text-slate-400 align-middle">pts</span></p></div><button type="button" onClick={goLockerRoom} className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-black px-2.5 py-1.5 text-[11px] shadow-lg active:scale-95">Locker Room</button></div><div className="grid grid-cols-3 gap-1.5 mt-1">

            <button type="button" onClick={challengeOffer ? useCoachChallenge : upgrades.coachChallenge <= 0 ? () => showLockedPrompt("Challenge") : undefined} disabled={false} className={`h-[60px] rounded-xl border px-2 py-1.5 text-center relative overflow-hidden transition active:scale-[0.98] flex flex-col items-center justify-center ${challengeOffer ? "bg-cyan-500/90 border-cyan-100 text-white shadow-[0_0_20px_rgba(34,211,238,0.75)] animate-pulse" : upgrades.coachChallenge > 0 ? "bg-cyan-950/60 border-cyan-400/60 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.25)]" : "bg-slate-900/80 border-slate-700 text-slate-500"}`}>
              <p className="text-[10px] uppercase tracking-wide font-black leading-none opacity-80">{upgrades.coachChallenge > 0 ? "📋 Challenge" : "Challenge"}</p>
              <p className={`mt-1 text-[13px] font-black leading-tight ${upgrades.coachChallenge > 0 || challengeOffer ? "" : "text-slate-400"}`}>{challengeOffer ? "Use Challenge" : upgrades.coachChallenge > 0 ? "Ready" : "Ask Coach 🔒"}</p>
            </button>
            <div onClick={upgrades.hotHand <= 0 ? () => showLockedPrompt("Hot Hand") : undefined} className={`col-span-2 h-[60px] rounded-xl border px-2 py-1.5 text-center relative overflow-hidden flex flex-col items-center justify-center ${(lastShotMultiplier > 1 || (upgrades.hotHand > 0 && streak >= 2)) ? "bg-gradient-to-br from-orange-950/85 via-red-950/60 to-slate-950 border-orange-300/80 shadow-[0_0_22px_rgba(251,146,60,0.62)]" : "bg-slate-900/80 border-slate-700"}`}>
              <p className="text-[10px] uppercase tracking-wide text-slate-500 font-black leading-none">Hot Hand</p>
              {upgrades.hotHand <= 0 ? <p className="mt-2 text-[13px] font-black leading-none text-slate-400">Ask Coach 🔒</p> : <div className="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-slate-500 font-black leading-none">Last</p>
                  <p className={`${lastShotMultiplier > 1 ? "text-orange-100" : "text-slate-400"} mt-1 font-black leading-none transition-transform duration-200 ${hypeTextSize(lastShotMultiplier)} ${hypePulse(lastShotMultiplier)}`}>x{lastShotMultiplier}</p>
                </div>
                <div>
                  <p className={`${nextHotHandMult >= 12 ? "text-orange-200" : "text-slate-500"} text-[9px] uppercase tracking-wide font-black leading-none`}>Next</p>
                  <p className={`${nextHotHandMult > 1 ? "text-red-100" : "text-slate-400"} mt-1 font-black leading-none transition-transform duration-200 ${hypeTextSize(nextHotHandMult)} ${hypePulse(nextHotHandMult)}`}>{nextHotHandMult > 1 ? `x${nextHotHandMult}` : "-"}</p>
                </div>
              </div>}
            </div>
            <StatBox label="Rim Rescue" value={upgrades.doubleRim > 0 ? `${doubleRimChance}%` : "Ask Coach 🔒"} color={upgrades.doubleRim > 0 ? "text-emerald-300" : "text-slate-400"} valueSize={upgrades.doubleRim > 0 ? "text-base" : "text-[13px]"} labelSize="text-[10px]" heightClass="h-[54px]" onClick={upgrades.doubleRim <= 0 ? () => showLockedPrompt("Rim Rescue") : undefined} />
            <StatBox label="Open Look" value={upgrades.courtVision > 0 ? (openLookCooldown ? "-" : `${courtVisionChance}%`) : "Ask Coach 🔒"} color={upgrades.courtVision > 0 ? (openLookCooldown ? "text-slate-500" : "text-lime-300") : "text-slate-400"} valueSize={upgrades.courtVision > 0 ? "text-base" : "text-[13px]"} labelSize="text-[10px]" heightClass="h-[54px]" onClick={upgrades.courtVision <= 0 ? () => showLockedPrompt("Open Look") : undefined} />
            <StatBox label="Golden" value={upgrades.goldenBall > 0 ? (upgrades.superGolden > 0 ? `${goldenChance}% +SG` : `${goldenChance}%`) : "Ask Coach 🔒"} color={upgrades.goldenBall > 0 ? "text-yellow-300" : "text-slate-400"} valueSize={upgrades.goldenBall > 0 ? "text-base" : "text-[13px]"} labelSize="text-[10px]" heightClass="h-[54px]" onClick={upgrades.goldenBall <= 0 ? () => showLockedPrompt("Golden Ball") : undefined} />
          </div></div></div></Shell>;
}