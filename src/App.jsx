import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TROPHY_COST = 100000;
const PLAYOFF_TICKET_COST = 10000;
const DOUBLE_OR_NOTHING_UPGRADE_COST = 20000;
const SUPER_GOLDEN_COST = 5000;
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

const EXTRA_BALL_COSTS = [10, 35, 90, 225, 550, 1300, 3000, 6500];
const SPECIALIST_COSTS = [40, 120, 300, 700, 1300, 2400, 4200, 6500, 9500, 13500, 18500, 25000];
const SPECIALIST_LEVEL_CAPS = {
  layup: 2,
  freeThrow: 5,
  three: 8,
  halfCourt: 9,
};
const HOT_HAND_COSTS = [25, 90, 225, 550, 1200, 2400, 4500, 7500];
const HOT_HAND_MULTS = [2, 4, 8, 12, 18, 25, 35, 50];
const DOUBLE_RIM_COSTS = [120, 350, 900, 2200, 5000];
const GOLDEN_BALL_COSTS = [25, 100, 350, 1000, 2750];
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
  "Unconscious",
  "Someone Call Timeout",
  "White Hot",
  "Out of His Mind",
  "The Hoop Is a Swimming Pool",
  "Full Court Fever",
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
  "Rim Save",
  "Saved by the Rim",
  "The Rim Saved You",
];

const DOUBLE_OR_NOTHING_MADE_PHRASES = [
  "House Money",
  "All In And Alive",
  "Gamble Paid Off",
  "Cold Blooded",
  "That Took Nerve",
  "Big Shot Behavior",
  "Vegas Called",
  "Pressure? What Pressure?",
];

const DOUBLE_OR_NOTHING_MISS_PHRASES = [
  "House Always Wins",
  "Pack It Up",
  "Bank Closed",
  "Pain.",
  "Risk Management Failed",
  "That Was Expensive",
  "Vegas Wins Again",
  "Delete the Tape",
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
  layup: { id: "layup", label: "Layup", points: 1, baseOdds: 55, maxOdds: 80, upgradeStep: 5, costs: [10, 30, 90, 250, 700], x: 72, y: 13 },
  freeThrow: { id: "freeThrow", label: "Free Throw", points: 2, baseOdds: 45, maxOdds: 75, upgradeStep: 5, unlockCost: 20, costs: [25, 75, 180, 425, 950, 2000], x: 50, y: 35 },
  three: { id: "three", label: "Three Pointer", points: 3, baseOdds: 30, maxOdds: 65, upgradeStep: 5, unlockCost: 75, costs: [50, 150, 400, 900, 1800, 3500, 6500], x: 28, y: 55 },
  halfCourt: { id: "halfCourt", label: "Half Court", points: 5, baseOdds: 15, maxOdds: 45, upgradeStep: 5, unlockCost: 250, costs: [100, 300, 750, 1600, 3500, 7000], x: 50, y: 79 },
};

const THEME = {
  possessions: { header: "bg-sky-950/60 border-sky-400/60 text-sky-300", card: "bg-gradient-to-br from-sky-950/60 via-slate-900 to-slate-950 border-sky-400/60", title: "text-sky-200", add: "text-sky-300", button: "bg-sky-500 hover:bg-sky-600 text-white", bar: "bg-sky-400" },
  lab: { header: "bg-orange-950/60 border-orange-400/60 text-orange-300", card: "bg-gradient-to-br from-orange-950/50 via-slate-900 to-slate-950 border-orange-400/60", title: "text-orange-200", add: "text-orange-300", button: "bg-orange-500 hover:bg-orange-600 text-white", bar: "bg-orange-400" },
  hot: { header: "bg-red-950/60 border-red-400/60 text-red-300", card: "bg-gradient-to-br from-red-950/60 via-rose-950/30 to-slate-900 border-red-400/60", title: "text-red-200", add: "text-red-300", button: "bg-red-500 hover:bg-red-600 text-white", bar: "bg-red-400" },
  rim: { header: "bg-emerald-950/60 border-emerald-400/60 text-emerald-300", card: "bg-gradient-to-br from-emerald-950/60 via-teal-950/30 to-slate-900 border-emerald-400/60", title: "text-emerald-200", add: "text-emerald-300", button: "bg-emerald-500 hover:bg-emerald-600 text-white", bar: "bg-emerald-400" },
  golden: { header: "bg-yellow-950/60 border-yellow-400/60 text-yellow-300", card: "bg-gradient-to-br from-yellow-900/50 via-amber-950/40 to-slate-900 border-yellow-400/70", title: "text-yellow-200", add: "text-yellow-300", button: "bg-yellow-400 hover:bg-yellow-500 text-slate-950", bar: "bg-yellow-300" },
  mystery: { header: "border-white/20 text-white bg-[linear-gradient(90deg,rgba(168,85,247,0.18),rgba(59,130,246,0.16),rgba(16,185,129,0.14),rgba(250,204,21,0.14),rgba(244,114,182,0.16))]", card: "border-white/20 text-white bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(88,28,135,0.28),rgba(30,64,175,0.22),rgba(5,150,105,0.18),rgba(202,138,4,0.18),rgba(190,24,93,0.2))] shadow-[0_0_26px_rgba(255,255,255,0.06)]", title: "text-white", add: "text-fuchsia-200", button: "bg-white/12 hover:bg-white/18 text-white border border-white/20", bar: "bg-gradient-to-r from-fuchsia-400 via-sky-400 via-emerald-300 to-amber-300" },
  trophy: { header: "bg-gradient-to-r from-yellow-300/22 via-amber-300/18 to-orange-300/16 border-yellow-300/40 text-yellow-100", card: "bg-gradient-to-br from-yellow-300/16 via-amber-400/14 to-slate-950 border-yellow-300/45", title: "text-yellow-200", add: "text-yellow-200", button: "bg-yellow-400 hover:bg-yellow-500 text-slate-950", bar: "bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400" },
  neutral: { header: "bg-slate-900/80 border-slate-600 text-slate-300", card: "bg-slate-900 border-slate-700", title: "text-slate-100", add: "text-slate-300", button: "bg-slate-700 hover:bg-slate-600 text-white", bar: "bg-slate-400" },
};

function formatNumber(value) { return Math.floor(value || 0).toLocaleString(); }
function pickPhrase(pool, seed = 0) { return pool[Math.abs(Math.floor(seed)) % pool.length]; }
function Shell({ children }) { return <div className="min-h-screen bg-slate-950 text-white flex justify-center"><div className="w-full max-w-md min-h-screen bg-slate-950 overflow-hidden">{children}</div></div>; }
function Card({ children, className = "", ...props }) { return <div className={`rounded-3xl shadow-2xl ${className}`} {...props}>{children}</div>; }
function UpgradeButton({ children, disabled, onClick, className = "" }) { return <button type="button" disabled={disabled} onClick={onClick} className={`${className} disabled:cursor-not-allowed transition active:scale-[0.98]`}>{children}</button>; }

function StatBox({ label, value, color = "text-white", maxed = false }) {
  return <div className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-center relative overflow-hidden"><p className="text-[9px] uppercase tracking-wide text-slate-500 font-black leading-none">{label}</p><p className={`mt-1 text-base font-black leading-none ${color}`}>{value}</p>{maxed && <div className="mx-auto mt-1 w-fit rounded-full bg-emerald-400/15 border border-emerald-300/35 px-1.5 py-[1px] text-[7px] font-black leading-none text-emerald-200">MAX</div>}</div>;
}

function SingleTrackUpgradeCard({ title, theme = "lab", label, current, add, cost, level, max, onBuy, currentPoints, note = null, locked = false }) {
  const [showNote, setShowNote] = useState(false);
  const t = THEME[theme] || THEME.lab;
  const maxed = level >= max;
  const disabled = currentPoints < cost;
  const buttonClass = maxed ? "bg-emerald-700/40 text-emerald-200" : disabled ? "bg-slate-800 text-slate-500" : t.button;

  if (locked) {
    return <div className={`col-span-2 rounded-xl border shadow-sm p-3.5 ${t.card} relative overflow-hidden ${showNote ? "min-h-[205px]" : "min-h-[154px]"}`}><div className="absolute inset-0 bg-slate-950/45 z-0" /><div className="relative z-10 flex items-center justify-between gap-2"><div className="flex items-center gap-2 min-w-0"><span className="text-sm">🔒</span><p className={`text-base font-black leading-tight ${t.title}`}>{title}</p></div>{note && <button type="button" onClick={() => setShowNote((v) => !v)} className="w-6 h-6 rounded-full bg-slate-950/80 border border-slate-700 text-[13px] font-black italic text-slate-300">i</button>}</div>{note && showNote && <p className="relative z-30 mt-2 rounded-lg bg-slate-950/95 border border-slate-500 px-3 py-2 text-[12px] leading-snug text-slate-100 shadow-xl">{note}</p>}<div className="relative z-10 mt-2 rounded-xl bg-slate-950/45 border border-slate-800 px-3 py-3 opacity-55"><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p><p className="text-sm font-black text-slate-300 mt-1 leading-tight">{current}</p><div className="mt-3 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700" /><p className="text-[10px] font-black text-slate-400 w-10 text-right">0/{max}</p></div><p className="text-xs font-black mt-1 text-slate-400">{add}</p></div><div className={`${showNote ? "relative z-20 mt-3" : "absolute inset-x-0 top-16 bottom-3 z-20"} flex items-center justify-center pointer-events-none`}><button type="button" onClick={onBuy} disabled={disabled} className={`pointer-events-auto w-24 h-[88px] rounded-2xl border-2 text-xs font-black shadow-xl transition active:scale-[0.98] ${disabled ? "bg-slate-800 border-slate-700 text-slate-500" : `${t.button} border-white/30`}`}><div className="flex h-full w-full flex-col items-center justify-center"><span className="text-2xl">🔒</span><span>Unlock</span><span className="text-sm mt-1">{formatNumber(cost)} pts</span></div></button></div></div>;
  }

  return <div className={`col-span-2 rounded-xl border shadow-sm p-3.5 ${maxed ? "bg-emerald-950/40 border-emerald-500/50" : t.card}`}><div className="flex items-center justify-between gap-2"><p className={`text-base font-black leading-tight ${maxed ? "text-emerald-200" : t.title}`}>{title}</p>{note && <button type="button" onClick={() => setShowNote((v) => !v)} className="w-6 h-6 rounded-full bg-slate-950/80 border border-slate-700 text-[13px] font-black italic text-slate-300">i</button>}</div>{note && showNote && <p className="mt-2 rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-[12px] leading-snug text-slate-100">{note}</p>}<div className="mt-2 rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2"><div className="flex items-center justify-between gap-2"><div><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p><p className="text-sm font-black text-slate-100 mt-1 leading-tight">{current}</p></div><UpgradeButton onClick={onBuy} disabled={disabled || maxed} className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${buttonClass}`}>{maxed ? "Maxed" : `Upgrade ${formatNumber(cost)} pts`}</UpgradeButton></div><div className="mt-2 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700"><div className={`h-full rounded-full ${t.bar}`} style={{ width: `${Math.min(100, (level / max) * 100)}%` }} /></div><p className="text-[10px] font-black text-slate-300 w-10 text-right">{level}/{max}</p></div><p className={`text-xs font-black mt-1 ${maxed ? "text-emerald-300" : t.add}`}>{maxed ? "Maxed" : add}</p></div></div>;
}

function ShotUpgradeCard({ title, theme = "lab", accuracyCurrent, accuracyAdd, accuracyCost, accuracyLevel, accuracyMax, onBuyAccuracy, valueCurrent, valueAdd, valueCost, valueLevel, valueMax, onBuyValue, currentPoints, locked = false, unlockCost = 0, onUnlock = null }) {
  const t = THEME[theme] || THEME.lab;
  const Row = ({ label, current, add, cost, level, max, onBuy }) => {
    const maxed = level >= max;
    const disabled = currentPoints < cost;
    return <div className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-2"><div className="flex items-center justify-between gap-2"><div><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">{label}</p><p className="text-sm font-black text-slate-100 mt-1 leading-tight">{current}</p></div><UpgradeButton onClick={onBuy} disabled={disabled || maxed} className={`rounded-lg px-3 py-1.5 text-[11px] font-black ${maxed ? "bg-emerald-700/40 text-emerald-200" : disabled ? "bg-slate-800 text-slate-500" : t.button}`}>{maxed ? "Maxed" : `Upgrade ${formatNumber(cost)} pts`}</UpgradeButton></div><div className="mt-2 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-slate-700"><div className={`h-full rounded-full ${t.bar}`} style={{ width: `${Math.min(100, (level / max) * 100)}%` }} /></div><p className="text-[10px] font-black text-slate-300 w-10 text-right">{level}/{max}</p></div><p className={`text-xs font-black mt-1 ${maxed ? "text-emerald-300" : t.add}`}>{maxed ? "Maxed" : add}</p></div>;
  };

  if (locked) {
    return <div className={`col-span-2 rounded-xl border shadow-sm p-3.5 ${t.card} relative overflow-hidden min-h-[210px]`}><div className="absolute inset-0 bg-slate-950/45 z-0" /><p className={`relative z-10 text-base font-black leading-tight ${t.title}`}>{title}</p><div className="relative z-10 mt-2 grid grid-cols-1 gap-2 opacity-50"><div className="rounded-xl bg-slate-950/45 border border-slate-800 px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">Make Chance</p><p className="text-sm font-black text-slate-300 mt-1 leading-tight">{accuracyCurrent}</p><div className="mt-2 h-2 rounded-full bg-slate-800 border border-slate-700" /><p className="text-xs font-black mt-1 text-slate-400">{accuracyAdd}</p></div><div className="rounded-xl bg-slate-950/45 border border-slate-800 px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-slate-500 leading-none">Shot Value</p><p className="text-sm font-black text-slate-300 mt-1 leading-tight">{valueCurrent}</p><div className="mt-2 h-2 rounded-full bg-slate-800 border border-slate-700" /><p className="text-xs font-black mt-1 text-slate-400">{valueAdd}</p></div></div><div className="absolute inset-x-0 top-14 bottom-2 z-20 flex items-center justify-center pointer-events-none"><button type="button" onClick={onUnlock} disabled={currentPoints < unlockCost} className={`pointer-events-auto w-28 h-28 rounded-3xl border-2 text-sm font-black shadow-xl transition active:scale-[0.98] ${currentPoints < unlockCost ? "bg-slate-800 border-slate-700 text-slate-500" : `${t.button} border-white/30`}`}><div className="flex h-full w-full flex-col items-center justify-center"><span className="text-2xl">🔒</span><span>Unlock</span><span className="text-sm mt-1">{formatNumber(unlockCost)} pts</span></div></button></div></div>;
  }

  return <div className={`col-span-2 rounded-xl border shadow-sm p-3.5 ${t.card}`}><p className={`text-base font-black leading-tight ${t.title}`}>{title}</p><div className="mt-2 grid grid-cols-1 gap-2"><Row label="Make Chance" current={accuracyCurrent} add={accuracyAdd} cost={accuracyCost} level={accuracyLevel} max={accuracyMax} onBuy={onBuyAccuracy} /><Row label="Shot Value" current={valueCurrent} add={valueAdd} cost={valueCost} level={valueLevel} max={valueMax} onBuy={onBuyValue} /></div></div>;
}

function TrophyCard({ title, text, buttonText, disabled, maxed, onClick, className, titleClassName, buttonClassName }) {
  return <div className={`col-span-2 rounded-xl border shadow-sm p-3.5 ${className}`}><p className={`text-base font-black ${titleClassName}`}>{title}</p>{text ? <p className="mt-1 text-[11px] leading-snug text-slate-300">{text}</p> : null}<button type="button" disabled={disabled || maxed} onClick={onClick} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-black ${maxed ? "bg-emerald-700/40 text-emerald-200" : disabled ? "bg-slate-800 text-slate-500" : buttonClassName}`}>{maxed ? "Claimed" : buttonText}</button></div>;
}

function HotHandFire() {
  return (
    <div className="absolute inset-[-10px] pointer-events-none flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.42, 0.55, 0.46], rotate: [-4, 3, -4] }}
        transition={{ duration: 0.42, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] text-[60px] leading-none drop-shadow-[0_0_8px_rgba(249,115,22,0.45)]"
        style={{ zIndex: -1 }}
      >
        🔥
      </motion.div>
    </div>
  );
}

export default function BasketballGame() {
  const [screen, setScreen] = useState("title");
  const [transitionScreen, setTransitionScreen] = useState(null);
  const [startingPoints, setStartingPoints] = useState(0);
  const [testPointsInput, setTestPointsInput] = useState("0");
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
  const [courtRound, setCourtRound] = useState(1);
  const [hasWon, setHasWon] = useState(false);
  const [playoffShot, setPlayoffShot] = useState(null);
  const [playoffResult, setPlayoffResult] = useState(null);
  const [confirmDoubleOrNothingUpgrade, setConfirmDoubleOrNothingUpgrade] = useState(false);
  const [lockerScreen, setLockerScreen] = useState("shots");
  const [courtTripOver, setCourtTripOver] = useState(false);
  const [tripPointsEarned, setTripPointsEarned] = useState(0);
  const [missShakeKey, setMissShakeKey] = useState(0);
  const [upgrades, setUpgrades] = useState({ extraShots: 0, layup: 0, freeThrow: 0, three: 0, halfCourt: 0, freeThrowUnlocked: false, threeUnlocked: false, halfCourtUnlocked: false, layupSpecialist: 0, freeThrowSpecialist: 0, threeSpecialist: 0, halfCourtSpecialist: 0, hotHand: 0, doubleRim: 0, goldenBall: 0, moveBall: 0, playoffTicket: 0, doubleOrNothing: 0, superGolden: 0 });

  const shotsPerTrip = 2 + upgrades.extraShots;
  const shotsRemaining = Math.max(0, shotsPerTrip - attemptsUsed);
  const doubleRimChance = upgrades.doubleRim * 5;
  const goldenChance = upgrades.goldenBall * 3;
  const doubleOrNothingChance = upgrades.doubleOrNothing > 0 ? 50 : 25;
  const endTripPhrasePool = tripPointsEarned >= BAD_TRIP_THRESHOLD ? NEUTRAL_LOCKER_PHRASES : INSULT_LOCKER_PHRASES;
  const endTripPhrase = endTripPhrasePool[courtRound % endTripPhrasePool.length];
  const getShotOdds = (shotId) => Math.min(SHOT_CONFIG[shotId].maxOdds, SHOT_CONFIG[shotId].baseOdds + upgrades[shotId] * SHOT_CONFIG[shotId].upgradeStep);
  const getShotValue = (shot) => shot.points * (1 + upgrades[`${shot.id}Specialist`]);
  const availableShots = useMemo(() => Object.values(SHOT_CONFIG).filter((shot) => shot.id === "layup" || upgrades[`${shot.id}Unlocked`]).map((shot) => ({ ...shot, odds: getShotOdds(shot.id) })), [upgrades]);

  function goLockerRoom() {
    setTransitionScreen("toLocker"); setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setLastMadeBreakdown(null); setActiveShot(null); setIsShooting(false); setAttemptsUsed(0); setStreak(0); setCourtTripOver(false); setTripPointsEarned(0); setMissShakeKey(0);
    window.setTimeout(() => setScreen("lockerRoom"), 1050); window.setTimeout(() => setTransitionScreen(null), 1500);
  }
  function startCourt() {
    setTransitionScreen("toCourt"); setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setLastMadeBreakdown(null); setActiveShot(null); setIsShooting(false); setAttemptsUsed(0); setStreak(0); setCourtTripOver(false); setTripPointsEarned(0); setMissShakeKey(0);
    window.setTimeout(() => { setCourtRound((current) => current + 1); setScreen("court"); }, 1050); window.setTimeout(() => setTransitionScreen(null), 1500);
  }
  function buyUpgrade(key, cost, max) { if (currentPoints < cost || upgrades[key] >= max) return; setCurrentPoints((current) => current - cost); setUpgrades((current) => ({ ...current, [key]: current[key] + 1 })); }
  function unlockShot(shotId) { const shot = SHOT_CONFIG[shotId]; const unlockKey = `${shotId}Unlocked`; if (!shot?.unlockCost || upgrades[unlockKey] || currentPoints < shot.unlockCost) return; setCurrentPoints((current) => current - shot.unlockCost); setUpgrades((current) => ({ ...current, [unlockKey]: true })); }
  function buyDoubleOrNothingUpgrade() { if (upgrades.doubleOrNothing > 0 || currentPoints < DOUBLE_OR_NOTHING_UPGRADE_COST) return; if (!confirmDoubleOrNothingUpgrade) { setConfirmDoubleOrNothingUpgrade(true); return; } setCurrentPoints((current) => current - DOUBLE_OR_NOTHING_UPGRADE_COST); setUpgrades((current) => ({ ...current, doubleOrNothing: 1 })); setConfirmDoubleOrNothingUpgrade(false); }
  function buyTrophy() { if (currentPoints < TROPHY_COST || hasWon) return; setCurrentPoints((current) => current - TROPHY_COST); setHasWon(true); }
  function openPlayoffDoor() { setConfirmDoubleOrNothingUpgrade(false); if (currentPoints < PLAYOFF_TICKET_COST) return; setPlayoffShot(null); setPlayoffResult(null); setScreen("playoff"); }
  function takePlayoffShot() { if (playoffShot) return; const made = Math.random() * 100 < doubleOrNothingChance; setPlayoffShot({ made, key: Date.now(), missSide: Math.random() < 0.5 ? "left" : "right", phrase: pickPhrase(made ? DOUBLE_OR_NOTHING_MADE_PHRASES : DOUBLE_OR_NOTHING_MISS_PHRASES, Date.now()) }); setPlayoffResult(null); window.setTimeout(() => { setCurrentPoints((current) => (made ? current * 2 : 0)); setPlayoffResult(made ? "made" : "missed"); }, 7700); }

  function takeShot(shot) {
    if (isShooting || shotsRemaining <= 0) return;
    const madeBase = Math.random() * 100 < getShotOdds(shot.id);
    const bouncedIn = !madeBase && upgrades.doubleRim > 0 && Math.random() * 100 < doubleRimChance;
    const made = madeBase || bouncedIn;
    const golden = made && upgrades.goldenBall > 0 && Math.random() * 100 < goldenChance;
    const superGolden = golden && upgrades.superGolden > 0 && Math.random() * 100 < 33;
    const missSide = Math.random() < 0.5 ? "left" : "right";
    const nextStreak = made ? streak + 1 : 0;
    const hotHandStreakIndex = made ? Math.min(Math.max(nextStreak - 3, 0), Math.max(upgrades.hotHand - 1, 0)) : 0;
    const hotHandMult = made && nextStreak >= 3 && upgrades.hotHand > 0 ? HOT_HAND_MULTS[hotHandStreakIndex] || 1 : 1;
    const shotValue = getShotValue(shot);
    const earned = made ? Math.floor(shotValue * hotHandMult * (superGolden ? 10 : golden ? 5 : 1)) : 0;
    const madeBreakdown = made ? { base: shotValue, earned, golden, superGolden, hotHandMult, bouncedIn } : null;
    const phraseSeed = Date.now() + Math.floor(Math.random() * 1000);
    const mainCallout = superGolden
      ? { text: pickPhrase(SUPER_GOLDEN_PHRASES, phraseSeed), style: "superGolden" }
      : golden
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
      if (madeBreakdown) window.setTimeout(() => setLastMadeBreakdown(madeBreakdown), 360);
      if (earned > 0) { setCurrentPoints((current) => current + earned); setTripPointsEarned((current) => current + earned); } setStreak(nextStreak); setBestStreak((current) => Math.max(current, nextStreak)); setAttemptsUsed((current) => current + 1); setLastResult({ made, bouncedIn, golden }); if (!made) setMissShakeKey((current) => current + 1); if (earned > 0) setPointsPop(earned); setShotCallouts({ main: mainCallout, bigScore: bigScoreCallout, rimSave: rimSaveCallout }); if (superGolden) setBigShotMessage("SUPER GOLDEN x10"); else if (golden) setBigShotMessage("GOLDEN BALL x5");
      setShotHistory((current) => [{ id: `${Date.now()}-${Math.random()}`, made, points: earned, multiplier: hotHandMult, golden, superGolden, bouncedIn, round: courtRound }, ...current].slice(0, 15));
      if (attemptsUsed + 1 >= shotsPerTrip) window.setTimeout(() => setCourtTripOver(true), 3400);
    }, 900);
    window.setTimeout(() => { setLastResult(null); setPointsPop(null); setBigShotMessage(null); setShotCallouts(null); setActiveShot(null); setIsShooting(false); }, 2900);
  }

  const transitionOverlay = transitionScreen ? <AnimatePresence><motion.div key="basketball-transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-[999] overflow-hidden bg-slate-950/95 backdrop-blur-sm pointer-events-none"><div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" /><div className="absolute left-0 right-0 top-[70vh] h-[3px] bg-orange-300/25 shadow-[0_0_14px_rgba(251,146,60,0.35)]" /><motion.div initial={{ x: transitionScreen === "toCourt" ? "-28vw" : "128vw", y: "58vh", rotate: transitionScreen === "toCourt" ? -160 : 160, scale: 1 }} animate={{ x: transitionScreen === "toCourt" ? ["-28vw", "50vw", "128vw"] : ["128vw", "50vw", "-28vw"], y: ["30vh", "58vh", "30vh"], rotate: transitionScreen === "toCourt" ? [-160, 220, 620] : [160, -220, -620], scale: [1, 1.06, 1] }} transition={{ duration: 1.5, ease: [0.2, 0.7, 0.2, 1], times: [0, 0.5, 1] }} className="absolute left-0 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-[9px] border-orange-900 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 shadow-[0_0_42px_rgba(249,115,22,0.6)] overflow-hidden"><div className="absolute inset-y-0 left-1/2 w-[8px] -translate-x-1/2 bg-orange-900/80" /><div className="absolute inset-x-0 top-1/2 h-[8px] -translate-y-1/2 bg-orange-900/80" /><div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-orange-900/65" /></motion.div></motion.div></AnimatePresence> : null;
  function startNewGame() { setCurrentPoints(startingPoints); startCourt(); }
  function openSettings() { setTestPointsInput(String(startingPoints)); setScreen("settings"); }
  function saveSettings() { const parsed = Math.max(0, Math.floor(Number(testPointsInput) || 0)); setStartingPoints(parsed); setCurrentPoints(parsed); setTestPointsInput(String(parsed)); setScreen("title"); }

  const shopItems = [
    { type: "section", title: "Shots", theme: "lab" },
    { type: "singleTrack", key: "extraShots", theme: "possessions", title: "Extra Balls", label: "Balls Per Turn", current: `${shotsPerTrip} balls`, add: "+1 ball", cost: EXTRA_BALL_COSTS[upgrades.extraShots] || 0, level: upgrades.extraShots, max: EXTRA_BALL_COSTS.length, action: () => buyUpgrade("extraShots", EXTRA_BALL_COSTS[upgrades.extraShots], EXTRA_BALL_COSTS.length) },
    ...Object.values(SHOT_CONFIG).map((shot) => ({ type: "shotUpgrade", key: `${shot.id}Bundle`, title: shot.label, locked: shot.id !== "layup" && !upgrades[`${shot.id}Unlocked`], unlockCost: shot.unlockCost, unlockAction: () => unlockShot(shot.id), accuracyCurrent: shot.id === "layup" || upgrades[`${shot.id}Unlocked`] ? `${getShotOdds(shot.id)}%` : "Locked", accuracyAdd: "+5% make", accuracyCost: shot.costs[upgrades[shot.id]] || 0, accuracyLevel: upgrades[shot.id], accuracyMax: shot.costs.length, accuracyAction: () => buyUpgrade(shot.id, shot.costs[upgrades[shot.id]], shot.costs.length), valueCurrent: shot.id === "layup" || upgrades[`${shot.id}Unlocked`] ? `${getShotValue(shot)} pts` : "Locked", valueAdd: `+${shot.points} pts`, valueCost: SPECIALIST_COSTS[upgrades[`${shot.id}Specialist`]] || 0, valueLevel: upgrades[`${shot.id}Specialist`], valueMax: SPECIALIST_LEVEL_CAPS[shot.id], valueAction: () => buyUpgrade(`${shot.id}Specialist`, SPECIALIST_COSTS[upgrades[`${shot.id}Specialist`]], SPECIALIST_LEVEL_CAPS[shot.id]) })),
    { type: "section", title: "Bonus Stuff", theme: "neutral" },
    { type: "singleTrack", key: "hotHand", theme: "hot", title: "Hot Hand", label: "Streak Multiplier", locked: upgrades.hotHand === 0, current: upgrades.hotHand === 0 ? "Locked" : `Up to x${HOT_HAND_MULTS[upgrades.hotHand - 1]}`, add: upgrades.hotHand === 0 ? "Unlock x2" : upgrades.hotHand >= HOT_HAND_COSTS.length ? "Maxed" : `Unlock x${HOT_HAND_MULTS[upgrades.hotHand]}`, note: "Make 2 in a row to get hot. Starting on your 3rd straight make, your next shots get massive multipliers. Miss once and the streak resets.", cost: HOT_HAND_COSTS[upgrades.hotHand] || 0, level: upgrades.hotHand, max: HOT_HAND_COSTS.length, action: () => buyUpgrade("hotHand", HOT_HAND_COSTS[upgrades.hotHand], HOT_HAND_COSTS.length) },
    { type: "singleTrack", key: "doubleRim", theme: "rim", title: "Rim In Chance", label: "Rim In Chance", locked: upgrades.doubleRim === 0, current: upgrades.doubleRim === 0 ? "Locked" : `${doubleRimChance}%`, add: upgrades.doubleRim === 0 ? "Unlock 5%" : "+5%", note: "A miss can still bounce in. Great for saving streaks when a shot barely misses.", cost: DOUBLE_RIM_COSTS[upgrades.doubleRim] || 0, level: upgrades.doubleRim, max: DOUBLE_RIM_COSTS.length, action: () => buyUpgrade("doubleRim", DOUBLE_RIM_COSTS[upgrades.doubleRim], DOUBLE_RIM_COSTS.length) },
    { type: "singleTrack", key: "goldenBall", theme: "golden", title: "Golden Ball", label: "Golden Chance", locked: upgrades.goldenBall === 0, current: upgrades.goldenBall === 0 ? "Locked" : `${goldenChance}%`, add: upgrades.goldenBall === 0 ? "Unlock 3%" : "+3%", note: "Made shots can turn golden for x5 points. Max it out to unlock Super Golden.", cost: GOLDEN_BALL_COSTS[upgrades.goldenBall] || 0, level: upgrades.goldenBall, max: GOLDEN_BALL_COSTS.length, action: () => buyUpgrade("goldenBall", GOLDEN_BALL_COSTS[upgrades.goldenBall], GOLDEN_BALL_COSTS.length) },
    ...(upgrades.goldenBall >= GOLDEN_BALL_COSTS.length ? [{ type: "singleTrack", key: "superGolden", theme: "golden", title: "Super Golden", label: "Golden Upgrade", locked: upgrades.superGolden === 0, current: upgrades.superGolden === 0 ? "Locked" : "Unlocked", add: upgrades.superGolden === 0 ? "Unlock x10" : "Maxed", note: "Turns some golden makes into Super Golden makes. Super Golden pays x10 instead of x5.", cost: upgrades.superGolden === 0 ? SUPER_GOLDEN_COST : 0, level: upgrades.superGolden, max: 1, action: () => buyUpgrade("superGolden", SUPER_GOLDEN_COST, 1) }] : []),
    { type: "section", title: "Mystery / Trophy", theme: "mystery" }, { type: "playoff" }, { type: "trophy" },
  ];

  if (screen === "settings") return <Shell><div className="min-h-screen bg-slate-950 flex items-center justify-center p-5"><Card className="w-full border border-slate-700 bg-slate-900 p-5 shadow-2xl"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.28em] font-black text-sky-300">Settings</p><h1 className="mt-1 text-3xl font-black leading-none text-white">Test Mode</h1></div><button type="button" onClick={() => setScreen("title")} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-black text-slate-300 active:scale-[0.98]">Back</button></div><div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/80 p-4"><label className="block text-[11px] uppercase tracking-wide font-black text-slate-400">Starting pts</label><input value={testPointsInput} onChange={(event) => setTestPointsInput(event.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-3xl font-black text-white outline-none focus:border-sky-400" placeholder="0" /><p className="mt-2 text-xs font-bold text-slate-500">Use this to test upgrades. Leave it at 0 for a normal fresh run.</p></div><button type="button" onClick={saveSettings} className="mt-5 w-full rounded-2xl bg-sky-500 px-5 py-4 text-lg font-black text-white shadow-xl border border-sky-300 active:scale-[0.98] hover:bg-sky-600">Save Starting pts</button></Card></div></Shell>;

  if (screen === "title") return <Shell>{transitionOverlay}<div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4"><div className="absolute inset-0 opacity-20"><div className="absolute left-1/2 top-[-8%] h-[520px] w-[520px] -translate-x-1/2 rounded-full border-[18px] border-orange-300/20" /><div className="absolute left-[-25%] bottom-[-15%] h-72 w-72 rounded-full bg-orange-400/14 blur-3xl" /><div className="absolute right-[-25%] top-[10%] h-72 w-72 rounded-full bg-sky-400/14 blur-3xl" /></div><Card className="relative w-full border border-slate-700 bg-slate-950/88 p-5 text-center shadow-2xl overflow-hidden"><div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sky-400 via-orange-300 to-amber-300" /><button type="button" onClick={openSettings} className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-xl shadow-lg active:scale-[0.96]" aria-label="Settings">⚙️</button><div className="relative z-10 pt-4"><motion.div initial={{ y: -18, rotate: -8, scale: 0.9 }} animate={{ y: 0, rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 13 }} className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-[7px] border-orange-700 bg-gradient-to-br from-orange-300 to-orange-500 shadow-[0_0_24px_rgba(251,146,60,0.34)] overflow-hidden"><div className="absolute h-28 w-[5px] bg-orange-900/75" /><div className="absolute h-[5px] w-28 bg-orange-900/75" /><div className="h-20 w-20 rounded-full border-4 border-orange-900/60" /></motion.div><h1 className="mt-2 text-[56px] font-black leading-[0.84] tracking-tight text-white drop-shadow-xl">FULL</h1><h1 className="text-[56px] font-black leading-[0.84] tracking-tight text-orange-300 drop-shadow-xl">COURT</h1><h2 className="mt-2 text-2xl font-black leading-none text-sky-200 tracking-[0.18em]">GRIND</h2><div className="mx-auto mt-5 h-1.5 w-40 rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent" /><p className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/75 px-5 py-4 text-[15px] font-semibold leading-relaxed tracking-[-0.01em] text-slate-200 shadow-inner">Sink buckets, cash in pts, upgrade your game, and turn every trip down the court into a bigger payday.</p><button type="button" onClick={startNewGame} className="mt-7 w-full rounded-2xl bg-gradient-to-r from-sky-400 via-orange-300 to-amber-300 px-5 py-4 text-lg font-black text-slate-950 shadow-xl border-2 border-white/55 active:scale-[0.98]">START GAME</button><button type="button" onClick={() => setScreen("lockerRoom")} className="mt-3 w-full rounded-2xl bg-slate-900/90 px-5 py-3 text-sm font-black text-slate-200 shadow-lg border border-slate-700 active:scale-[0.98]">LOCKER ROOM</button></div></Card></div></Shell>;

  if (screen === "playoff") return <Shell><div className="min-h-screen bg-slate-950 p-3 flex flex-col gap-3"><Card className="border border-purple-400/50 bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/70 p-3 shadow-2xl"><div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="text-[9px] uppercase tracking-[0.22em] font-black text-purple-300 whitespace-nowrap">Double or Nothing</p><h1 className="mt-1 text-[27px] font-black leading-none text-white whitespace-nowrap">Full-Court Gamble</h1></div><button type="button" onClick={() => setScreen("lockerRoom")} className="shrink-0 rounded-xl border border-sky-300/50 bg-sky-500 px-3 py-2 text-[10px] font-black text-white shadow-lg active:scale-[0.98] hover:bg-sky-600">Locker Room</button></div><div className="mt-3 rounded-2xl border border-purple-300/25 bg-slate-950/65 p-3 text-center shadow-inner"><p className="text-[10px] uppercase tracking-[0.24em] font-black text-slate-500">Current Bank</p><p className="mt-1 text-4xl font-black leading-none text-white">{formatNumber(currentPoints)} <span className="text-base text-slate-400">pts</span></p></div><p className="mt-2 text-center text-[12px] font-black leading-tight text-slate-200">One shot. Double your bank or lose it all.</p><p className="text-center text-[10px] font-bold leading-tight text-slate-500">All bonuses are off.</p></Card><Card className="relative flex-1 min-h-[460px] overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-950 via-slate-900 to-[#c98542]"><div className="absolute left-3 top-3 z-20 rounded-2xl border border-purple-200/40 bg-slate-950/72 px-4 py-3 shadow-lg backdrop-blur-sm"><p className="text-[10px] uppercase tracking-[0.18em] font-black text-purple-200 leading-none">Make Chance</p><p className="mt-1 text-3xl font-black leading-none text-white">{doubleOrNothingChance}%</p></div>{!playoffShot && <div className="absolute left-1/2 bottom-[22%] z-10 -translate-x-1/2 pointer-events-none"><div className="relative h-14 w-14 rounded-full border-4 border-orange-900 bg-orange-500 shadow-2xl opacity-85 overflow-hidden"><div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-orange-900/75" /><div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-orange-900/75" /><div className="absolute inset-2 rounded-full border border-orange-900/60" /></div></div>}{!playoffShot && <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center"><button type="button" onClick={takePlayoffShot} className="rounded-3xl bg-purple-500 px-9 py-4 text-lg font-black text-white shadow-2xl border-2 border-purple-200 active:scale-[0.98]">Shoot</button></div>}<AnimatePresence>{playoffShot && <motion.div key={playoffShot.key} initial={{ left: "50%", top: "78%", scale: 1.35, opacity: 1, rotate: 0 }} animate={playoffShot.made ? { left: ["50%", "50%", "50%"], top: ["78%", "9%", "32%"], scale: [1.35, 0.34, 0.06], rotate: [0, 320, 500], opacity: [1, 1, 0] } : { left: ["50%", playoffShot.missSide === "left" ? "45%" : "55%", playoffShot.missSide === "left" ? "37%" : "63%"], top: ["78%", "9%", "32%"], scale: [1.35, 0.34, 0.16], rotate: [0, 320, 520], opacity: [1, 1, 0] }} transition={{ duration: 7.8, ease: "easeInOut" }} className="absolute z-30 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-900 bg-orange-500 shadow-2xl overflow-hidden"><div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-orange-900/75" /><div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-orange-900/75" /><div className="absolute inset-2 rounded-full border border-orange-900/60" /></motion.div>}</AnimatePresence><AnimatePresence>{playoffResult && <motion.div initial={{ opacity: 0, scale: 0.55, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 180, damping: 14 }} className={`absolute inset-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none ${playoffResult === "made" ? "text-green-300" : "text-red-300"}`}>{playoffResult === "made" ? <><div className="mb-3 rounded-full border-2 border-green-200/60 bg-green-400/20 px-5 py-2 text-2xl font-black text-green-100 shadow-[0_0_28px_rgba(134,239,172,0.55)]">{playoffShot?.phrase || "CASHED IT!"}</div><div className="text-5xl font-black drop-shadow-[0_0_18px_rgba(134,239,172,0.8)]">BANK DOUBLED</div></> : <><div className="mb-3 rounded-full border-2 border-red-200/60 bg-red-400/20 px-5 py-2 text-2xl font-black text-red-100 shadow-[0_0_28px_rgba(248,113,113,0.45)]">{playoffShot?.phrase || "BUST"}</div><div className="text-6xl font-black">BUST</div></>}</motion.div>}</AnimatePresence></Card></div></Shell>;

  if (screen === "lockerRoom") return <Shell>{transitionOverlay}<Card onClick={() => setConfirmDoubleOrNothingUpgrade(false)} className="h-[94vh] p-3 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col overflow-hidden touch-pan-y"><div className="shrink-0 rounded-3xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-950 p-3 shadow-xl"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black">Locker Room</p><h1 className="text-3xl font-black leading-none mt-1">{formatNumber(currentPoints)} <span className="text-sm font-black text-slate-400 align-middle">pts</span></h1></div><button type="button" onClick={startCourt} className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black px-4 py-3 shadow-xl active:scale-[0.98]">Hit the Court</button></div><div className="grid grid-cols-4 gap-1.5 mt-3"><StatBox label="Balls" value={shotsPerTrip} color="text-sky-300" maxed={upgrades.extraShots >= EXTRA_BALL_COSTS.length} /><StatBox label="Max Hot" value={upgrades.hotHand > 0 ? `x${HOT_HAND_MULTS[upgrades.hotHand - 1]}` : "-"} color="text-red-300" maxed={upgrades.hotHand >= HOT_HAND_COSTS.length} /><StatBox label="Rim" value={`${doubleRimChance}%`} color="text-emerald-300" maxed={upgrades.doubleRim >= DOUBLE_RIM_COSTS.length} /><StatBox label="Gold" value={upgrades.superGolden > 0 ? `${goldenChance}% +SG` : `${goldenChance}%`} color="text-yellow-300" maxed={upgrades.goldenBall >= GOLDEN_BALL_COSTS.length} /></div></div><div className="mt-3 grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setLockerScreen("shots")} className={`rounded-2xl border px-2 py-3 text-[11px] font-black active:scale-[0.98] ${lockerScreen === "shots" ? "bg-orange-500 border-orange-300 text-white shadow-[0_0_14px_rgba(249,115,22,0.45)]" : "bg-slate-950 border-slate-700 text-slate-400"}`}>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base leading-none">🏀</span>
                <span className="leading-none">Shot Lab</span>
              </div>
            </button>
            <button type="button" onClick={() => setLockerScreen("bonus")} className={`rounded-2xl border px-2 py-3 text-[11px] font-black active:scale-[0.98] ${lockerScreen === "bonus" ? "bg-red-500 border-red-300 text-white shadow-[0_0_14px_rgba(239,68,68,0.45)]" : "bg-slate-950 border-slate-700 text-slate-400"}`}>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base leading-none">⚡</span>
                <span className="leading-none">Power-Ups</span>
              </div>
            </button>
            <button type="button" onClick={() => setLockerScreen("mystery")} className={`rounded-2xl border px-2 py-3 text-[11px] font-black active:scale-[0.98] ${lockerScreen === "mystery" ? "bg-violet-500 border-violet-300 text-white shadow-[0_0_14px_rgba(139,92,246,0.45)]" : "bg-slate-950 border-slate-700 text-slate-400"}`}>
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-base leading-none">🎲</span>
                <span className="leading-none">High Stakes</span>
              </div>
            </button>
          </div><div className="mt-3 flex-1 min-h-0 overflow-y-scroll overscroll-contain touch-pan-y pr-1 [-webkit-overflow-scrolling:touch]"><div className="grid grid-cols-2 gap-2 pb-4">{shopItems.filter(Boolean).filter((item) => {
                if (lockerScreen === "shots") return item.key === "extraShots" || item.type === "shotUpgrade";
                if (lockerScreen === "bonus") return ["hotHand", "doubleRim", "goldenBall", "superGolden"].includes(item.key);
                if (lockerScreen === "mystery") return item.type === "playoff" || item.type === "trophy";
                return true;
              }).map((item, index) => { if (item.type === "section") { const t = THEME[item.theme] || THEME.lab; return <div key={`section-${index}`} className={`col-span-2 mt-2 first:mt-0 rounded-xl border px-3 py-2 ${t.header}`}><p className="text-[9px] uppercase tracking-[0.2em] font-black">{item.title}</p></div>; } if (item.type === "singleTrack") return <SingleTrackUpgradeCard key={item.key} {...item} onBuy={item.action} currentPoints={currentPoints} />; if (item.type === "shotUpgrade") return <ShotUpgradeCard key={item.key} title={item.title} theme="lab" accuracyCurrent={item.accuracyCurrent} accuracyAdd={item.accuracyAdd} accuracyCost={item.accuracyCost} accuracyLevel={item.accuracyLevel} accuracyMax={item.accuracyMax} onBuyAccuracy={item.accuracyAction} valueCurrent={item.valueCurrent} valueAdd={item.valueAdd} valueCost={item.valueCost} valueLevel={item.valueLevel} valueMax={item.valueMax} onBuyValue={item.valueAction} currentPoints={currentPoints} locked={!!item.locked} unlockCost={item.unlockCost ?? 0} onUnlock={item.unlockAction} />; if (item.type === "playoff") return <div key="playoff" onClick={(event) => event.stopPropagation()} className="col-span-2 rounded-xl border border-white/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(88,28,135,0.28),rgba(30,64,175,0.22),rgba(5,150,105,0.18),rgba(202,138,4,0.18),rgba(190,24,93,0.2))] p-3.5 shadow-[0_0_24px_rgba(255,255,255,0.06)]"><div className="flex items-start justify-between gap-3"><div><p className="text-base font-black text-white">Double or Nothing</p><p className="mt-1 text-[11px] leading-snug text-slate-300">One shot. Double your bank or lose it all.</p></div><div className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-center"><p className="text-lg font-black leading-none text-white">{currentPoints >= PLAYOFF_TICKET_COST ? `${doubleOrNothingChance}%` : "?"}</p><p className="text-[7px] uppercase tracking-wide font-black text-slate-300">Make</p></div></div><button type="button" disabled={currentPoints < PLAYOFF_TICKET_COST} onClick={openPlayoffDoor} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-black ${currentPoints < PLAYOFF_TICKET_COST ? "bg-slate-800 text-slate-500" : "bg-white/12 hover:bg-white/18 text-white border border-white/20"}`}>{currentPoints >= PLAYOFF_TICKET_COST ? "Enter Challenge" : `Reach ${formatNumber(PLAYOFF_TICKET_COST)} pts`}</button>{currentPoints >= PLAYOFF_TICKET_COST && <><div className="my-3 flex items-center gap-2"><div className="h-px flex-1 bg-white/12" /><span className="text-[8px] uppercase tracking-[0.18em] font-black text-slate-400">Upgrade</span><div className="h-px flex-1 bg-white/12" /></div><button type="button" disabled={upgrades.doubleOrNothing > 0 || currentPoints < DOUBLE_OR_NOTHING_UPGRADE_COST} onClick={buyDoubleOrNothingUpgrade} className={`mt-2 w-full rounded-xl px-3 py-2 text-xs font-black ${upgrades.doubleOrNothing > 0 ? "bg-emerald-700/40 text-emerald-200" : currentPoints < DOUBLE_OR_NOTHING_UPGRADE_COST ? "bg-slate-800 text-slate-500" : confirmDoubleOrNothingUpgrade ? "bg-red-500 hover:bg-red-600 text-white" : "bg-violet-500 hover:bg-violet-600 text-white"}`}>{upgrades.doubleOrNothing > 0 ? "50% Unlocked" : confirmDoubleOrNothingUpgrade ? "Are you sure? Tap again" : `Upgrade to 50% • ${formatNumber(DOUBLE_OR_NOTHING_UPGRADE_COST)} pts`}</button></>}</div>; if (item.type === "trophy") return <TrophyCard key="trophy" title="The Crown" text="The finish line. Save up, buy the crown, win the grind." buttonText={`Buy for ${formatNumber(TROPHY_COST)} pts`} disabled={currentPoints < TROPHY_COST} maxed={hasWon} onClick={buyTrophy} className="bg-gradient-to-br from-yellow-300/22 via-amber-400/22 to-orange-500/20 border-yellow-300/55 shadow-[0_0_28px_rgba(250,204,21,0.16)]" titleClassName="text-yellow-200" buttonClassName="bg-yellow-400 hover:bg-yellow-500 text-slate-950" />; return null; })}</div></div></Card></Shell>;

  return <Shell>{transitionOverlay}<div className="p-3 space-y-2 bg-slate-950 min-h-screen"><Card className="border border-slate-700 bg-slate-900"><motion.div animate={missShakeKey > 0 ? { x: missShakeKey % 2 === 0 ? [0, -8, 8, -6, 6, -3, 3, 0] : [0, 8, -8, 6, -6, 3, -3, 0], y: [0, 2, -2, 1, -1, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.42, ease: "easeOut" }} className="relative h-[485px] overflow-hidden rounded-3xl border border-amber-900/40 bg-[#c98542]"><div className="absolute right-1 top-4 z-30 flex flex-col gap-1.5 pointer-events-none">{Array.from({ length: shotsPerTrip }).map((_, index) => { const spent = index < attemptsUsed; return <div key={index} className={`relative rounded-full border-2 transition-all ${spent ? "w-5 h-5 bg-slate-700 border-slate-500 opacity-45" : "w-7 h-7 bg-orange-400 border-orange-200 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"}`}>{!spent && <><div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-orange-900/65" /><div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-orange-900/65" /></>}</div>; })}</div><div className="absolute left-2 top-2 z-30 flex flex-col items-start gap-[2px] pointer-events-none">{shotHistory.slice(0, 15).map((item, idx) => { const isCurrentRound = item.round === courtRound; const activeTextColor = item.made ? "text-green-300" : "text-red-300"; return <div key={item.id ?? idx} className={`rounded-md px-1.5 py-[1px] shadow-sm backdrop-blur-sm ${isCurrentRound ? "bg-slate-950/55 border border-slate-800/70" : "bg-slate-950/25 border border-slate-800/50 grayscale opacity-55"}`}><div className="inline-flex items-center justify-start gap-[2px] leading-none">{isCurrentRound ? <span className={`flex items-center gap-[1px] text-xs font-black leading-none drop-shadow-sm ${activeTextColor}`}>{item.points > 0 && <span>+</span>}<span>{formatNumber(item.points)}</span></span> : <span className="text-xs font-black leading-none text-slate-400 drop-shadow-sm">{item.points > 0 ? `+${formatNumber(item.points)}` : "0"}</span>}</div></div>; })}</div><svg className="absolute inset-0 z-0" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="courtWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d99652" /><stop offset="100%" stopColor="#c98542" /></linearGradient></defs><rect x="0" y="0" width="100" height="100" fill="url(#courtWood)" /><g opacity="0.12">{[10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90].map((y) => <line key={y} x1="10" y1={y} x2="90" y2={y} stroke="white" strokeWidth="0.35" />)}</g><g fill="none" stroke="rgba(255,255,255,0.94)" strokeLinecap="round" strokeLinejoin="round"><path d="M10 98.5 L10 4 L90 4 L90 98.5" strokeWidth="1.2" /><rect x="39" y="4" width="22" height="36" strokeWidth="1.1" /><line x1="39" y1="40" x2="61" y2="40" strokeWidth="1.1" /><path d="M39 40 A11 11 0 0 0 61 40" strokeWidth="1.1" /><path d="M45.5 18 A4.5 4.5 0 0 0 54.5 18" strokeWidth="1" /><line x1="37" y1="27" x2="39" y2="27" strokeWidth="0.8" /><line x1="37" y1="32" x2="39" y2="32" strokeWidth="0.8" /><line x1="37" y1="37" x2="39" y2="37" strokeWidth="0.8" /><line x1="61" y1="27" x2="63" y2="27" strokeWidth="0.8" /><line x1="61" y1="32" x2="63" y2="32" strokeWidth="0.8" /><line x1="61" y1="37" x2="63" y2="37" strokeWidth="0.8" /><path d="M16 4 L16 55 M84 4 L84 55 M16 55 A34 26 0 0 0 84 55" strokeWidth="1.15" /><line x1="10" y1="98.5" x2="90" y2="98.5" strokeWidth="1.2" /><path d="M43.5 98.5 A6.5 6.5 0 0 1 56.5 98.5" strokeWidth="1.1" /></g></svg><div className="absolute z-[45] pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: `${RIM.x}%`, top: `${RIM.y}%` }}><div className="absolute left-[-29px] top-[-11px] h-[10px] w-[58px] rounded-md border-2 border-white bg-gradient-to-b from-white to-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.45)]" /><div className="absolute left-[-20px] top-[-8px] h-[2px] w-[40px] rounded-full bg-white/80" /><div className="absolute left-[-7px] top-[-5px] h-[3px] w-[14px] rounded-sm border border-slate-500/60 bg-slate-100/70" /><div className="absolute left-[-3px] top-[-3px] h-[9px] w-[6px] rounded-full bg-slate-400 shadow-sm" /><div className="absolute left-[-27px] top-[0px] h-[54px] w-[54px] rounded-full border-[4px] border-orange-900/90 bg-transparent shadow-[0_2px_8px_rgba(0,0,0,0.35)]" /><div className="absolute left-[-24px] top-[3px] h-12 w-12 rounded-full border-[5px] border-orange-500 bg-transparent shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
              <div className="absolute left-[-17px] top-[12px] w-[34px] flex flex-col items-center gap-[0px] opacity-65">
                {[3, 4, 5, 4, 3].map((count, rowIndex) => (
                  <div key={`net-row-${rowIndex}`} className="flex h-[6px] items-center justify-center gap-[1px]">
                    {Array.from({ length: count }).map((_, index) => (
                      <span key={`net-x-${rowIndex}-${index}`} className="text-[9px] font-normal leading-none text-white/75">×</span>
                    ))}
                  </div>
                ))}
              </div></div><AnimatePresence>{activeShot && <motion.div key={`${activeShot.id}-${shotAnimKey}`} initial={{ left: `${activeShot.x}%`, top: `${activeShot.y}%`, scale: 1, opacity: 1 }} animate={activeShot.bouncedIn ? { left: [`${activeShot.x}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.x : FRONT_RIM_RIGHT.x}%`, `${activeShot.missSide === "left" ? RIM_SAVE_DEFLECT_RIGHT.x : RIM_SAVE_DEFLECT_LEFT.x}%`, `${RIM_SAVE_CENTER.x}%`, `${RIM.x}%`, `${RIM.x}%`], top: [`${activeShot.y}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.y : FRONT_RIM_RIGHT.y}%`, `${activeShot.missSide === "left" ? RIM_SAVE_DEFLECT_RIGHT.y : RIM_SAVE_DEFLECT_LEFT.y}%`, `${RIM_SAVE_CENTER.y}%`, `${RIM.y}%`, `${RIM_DROP_Y}%`], scale: [1, 0.96, 0.9, 0.62, 0.32, 0.08], opacity: [1, 1, 1, 1, 0.96, 0] } : activeShot.made ? { left: [`${activeShot.x}%`, `${RIM.x}%`, `${RIM.x}%`], top: [`${activeShot.y}%`, `${RIM.y}%`, `${RIM_DROP_Y}%`], scale: [1, 0.52, 0.1], opacity: [1, 1, 0] } : { left: [`${activeShot.x}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.x : FRONT_RIM_RIGHT.x}%`, `${activeShot.missSide === "left" ? MISS_DEFLECT_LEFT.x : MISS_DEFLECT_RIGHT.x}%`], top: [`${activeShot.y}%`, `${activeShot.missSide === "left" ? FRONT_RIM_LEFT.y : FRONT_RIM_RIGHT.y}%`, `${activeShot.missSide === "left" ? MISS_DEFLECT_LEFT.y : MISS_DEFLECT_RIGHT.y}%`], scale: [1, 0.96, 0.88], opacity: [1, 1, 0] }} transition={{ duration: activeShot.bouncedIn ? 2.05 : activeShot.made ? 1.55 : 1.3, times: activeShot.bouncedIn ? [0, 0.52, 0.68, 0.82, 0.91, 1] : activeShot.made ? [0, 0.72, 1] : [0, 0.7, 1], ease: "easeInOut" }} className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 shadow-2xl z-[60] ${activeShot.superGolden ? "overflow-visible bg-yellow-100 border-yellow-300 shadow-[0_0_30px_rgba(255,255,255,0.95)]" : activeShot.golden ? "overflow-visible bg-yellow-300 border-yellow-600" : "overflow-visible bg-orange-500 border-orange-800"}`}>{activeShot.superGolden && <div className="absolute inset-[-16px] rounded-full bg-white/40 blur-xl pointer-events-none" />}{activeShot.onFire && !activeShot.superGolden && <HotHandFire />}<div className={`absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 ${activeShot.superGolden ? "bg-yellow-500/70" : activeShot.golden ? "bg-yellow-700/70" : "bg-orange-800/70"}`} /><div className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 ${activeShot.superGolden ? "bg-yellow-500/70" : activeShot.golden ? "bg-yellow-700/70" : "bg-orange-800/70"}`} /><div className={`absolute inset-1 rounded-full border ${activeShot.superGolden ? "border-yellow-500/60" : activeShot.golden ? "border-yellow-700/50" : "border-orange-800/50"}`} /></motion.div>}</AnimatePresence>{!isShooting && !courtTripOver && shotsRemaining > 0 && availableShots.map((shot) => <button key={shot.id} type="button" onClick={() => takeShot(shot)} disabled={shotsRemaining <= 0} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black px-3.5 py-2 shadow-xl border border-orange-300 z-30 min-w-[76px]" style={{ left: `${shot.x}%`, top: `${shot.y}%` }}><span className="block text-2xl leading-none">+{getShotValue(shot)}</span><span className="mt-1 block text-[10px] leading-none opacity-90">{shot.label}</span><span className="mt-0.5 block text-[10px] leading-none opacity-80">{shot.odds}% make</span></button>)}{lastMadeBreakdown && <div className="absolute bottom-2 left-1/2 z-20 flex w-[92%] -translate-x-1/2 items-center justify-center gap-1 rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 text-center text-[10px] font-black leading-snug text-amber-200 shadow-md backdrop-blur-sm"><span className="text-slate-400">Point Breakdown:</span><span className="text-white">{lastMadeBreakdown.base}</span>{lastMadeBreakdown.superGolden ? <span className="text-yellow-200 drop-shadow-[0_0_8px_rgba(250,204,21,0.85)]">×10</span> : lastMadeBreakdown.golden ? <span className="text-yellow-300">×5</span> : null}{lastMadeBreakdown.hotHandMult > 1 && <span className="text-red-300">×{lastMadeBreakdown.hotHandMult}</span>}{lastMadeBreakdown.bouncedIn && <span className="text-emerald-300">✓✓</span>}<span className="text-slate-400">=</span><span className="text-green-300">+{formatNumber(lastMadeBreakdown.earned)} pts</span></div>}<AnimatePresence>{lastResult && <motion.div key={`result-${shotAnimKey}`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 flex items-center justify-center pointer-events-none z-50 ${lastResult.made ? "text-green-300 text-6xl font-black" : "text-red-400 text-7xl font-black italic tracking-tight drop-shadow-[0_0_18px_rgba(248,113,113,0.95)]"}`}>{lastResult.made ? (lastResult.bouncedIn ? "" : lastResult.golden ? "GOLDEN" : "") : "CLANK!"}</motion.div>}</AnimatePresence><AnimatePresence>{pointsPop && <motion.div key={`points-${shotAnimKey}-${pointsPop}`} initial={{ opacity: 0, y: 18, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1.08 }} exit={{ opacity: 0, y: -18, scale: 0.95 }} transition={{ duration: 0.8 }} className="absolute inset-x-0 top-40 z-[65] flex justify-center pointer-events-none"><div className="rounded-xl border border-green-300/40 bg-slate-950/85 px-4 py-2 text-3xl font-black text-green-300 shadow-xl drop-shadow-[0_0_12px_rgba(134,239,172,0.9)]">+{formatNumber(pointsPop)}</div></motion.div>}</AnimatePresence><AnimatePresence>{shotCallouts && (shotCallouts.main || shotCallouts.bigScore || shotCallouts.rimSave) && <motion.div initial={{ opacity: 0, y: 24, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="absolute inset-x-0 top-16 z-[66] flex flex-col items-center gap-1.5 pointer-events-none px-4">
              {shotCallouts.main && <div className={`rounded-2xl border-2 px-5 py-2 text-2xl font-black text-center ${CALLOUT_STYLES[shotCallouts.main.style]}`}>{shotCallouts.main.text}</div>}
              {shotCallouts.bigScore && <div className={`rounded-xl border-2 px-4 py-1.5 text-base font-black text-center ${CALLOUT_STYLES.bigScore}`}>{shotCallouts.bigScore.text}</div>}
              {shotCallouts.rimSave && <div className={`rounded-full border px-3 py-1 text-xs font-black text-center ${CALLOUT_STYLES.rimSave}`}>{shotCallouts.rimSave.text}</div>}
            </motion.div>}</AnimatePresence>{courtTripOver && <div className="absolute inset-x-6 bottom-16 z-[70] flex items-center justify-center pointer-events-none"><button type="button" onClick={goLockerRoom} className="pointer-events-auto w-full rounded-3xl border-4 border-sky-200/70 bg-sky-500/90 px-5 py-6 text-3xl font-black leading-tight text-white shadow-[0_0_36px_rgba(14,165,233,0.75)] active:scale-[0.98]">{endTripPhrase}</button></div>}</motion.div></Card><div className="rounded-xl bg-slate-950/85 border border-slate-700 p-2 shadow-xl -mt-1"><div className="flex items-center justify-between gap-2"><div><p className="text-[9px] uppercase tracking-wide text-slate-500 font-black">Scoreboard</p><p className="text-xl font-black leading-none mt-0.5">{formatNumber(currentPoints)} <span className="text-xs font-black text-slate-400 align-middle">pts</span></p></div><button type="button" onClick={goLockerRoom} className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black px-3 py-2 text-xs shadow-lg active:scale-95">Locker Room</button></div><div className="grid grid-cols-2 gap-1.5 mt-1.5">
            <div className={`rounded-xl border px-3 py-2 text-center relative overflow-hidden ${streak >= 2 ? "bg-red-950/70 border-red-400/70 shadow-[0_0_18px_rgba(239,68,68,0.55)]" : "bg-slate-900/80 border-slate-700"}`}>
              <p className="text-[9px] uppercase tracking-wide text-slate-500 font-black leading-none">Streak</p>
              <p className={`${streak >= 2 ? "text-red-200 drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]" : "text-red-300"} mt-1 text-base font-black leading-none`}>{streak}</p>
            </div>
            <div className={`rounded-xl border px-3 py-2 text-center relative overflow-hidden ${upgrades.hotHand > 0 && streak >= 2 ? "bg-orange-950/70 border-orange-300/70 shadow-[0_0_18px_rgba(251,146,60,0.5)]" : "bg-slate-900/80 border-slate-700"}`}>
              <p className="text-[9px] uppercase tracking-wide text-slate-500 font-black leading-none">Hot Hand: Next Shot</p>
              <p className={`${upgrades.hotHand > 0 && streak >= 2 ? "text-orange-200 drop-shadow-[0_0_8px_rgba(251,146,60,0.85)]" : "text-slate-400"} mt-1 text-base font-black leading-none`}>
                {upgrades.hotHand > 0 && streak >= 2 ? `x${HOT_HAND_MULTS[Math.min(Math.max(streak - 2, 0), upgrades.hotHand - 1)] || HOT_HAND_MULTS[upgrades.hotHand - 1]}` : "-"}
              </p>
            </div>
            <StatBox label="Rim In" value={upgrades.doubleRim > 0 ? `${doubleRimChance}%` : "Unlock in Locker Room"} color={upgrades.doubleRim > 0 ? "text-emerald-300" : "text-slate-400 text-[10px]"} />
            <StatBox label="Golden" value={upgrades.goldenBall > 0 ? (upgrades.superGolden > 0 ? `${goldenChance}% +SG` : `${goldenChance}%`) : "Unlock in Locker Room"} color={upgrades.goldenBall > 0 ? "text-yellow-300" : "text-slate-400 text-[10px]"} />
          </div></div></div></Shell>;
}
