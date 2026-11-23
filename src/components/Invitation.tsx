import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { exportReceiptAsPNG } from "../utils/receipt";
import {
  Heart, CalendarHeart, MapPin, Clock3,
  MailOpen, Fingerprint, Sparkles, ArrowDown, Check, PenLine, Home,
  Feather, Coffee, Download, Copy, Eraser
} from "lucide-react";

const TARGET = new Date("2026-11-24T00:00:00+08:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, TARGET - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/* ---------- typewriter letter ---------- */
const LETTER_LINES = [
  "文文：",
  "你要的仪式感邀请函它来了！！！",
  "11月24日，你第一次来我家。",
  "我家虽然不大，",
  "但那天家里会欢迎你的到来，",
  "把你爱吃的都备好，",
  "把家里收拾得……嗯，尽量整齐一点。",
  "说实话，我有点紧张。",
  "怕你觉得无聊，怕你冷，怕你想早点走。",
  "但更多的是期待。",
  "期待你到家的那一刻，",
  "期待这个家，第一次因为你而热闹起来。",
  "不用带东西，只需要带ber来就行。",
  "来了就当自己家。",
  "—— 小马",
];

function Letter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);
  const full = useMemo(() => LETTER_LINES.join("\n"), []);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setCount(i);
      if (i >= full.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [inView, full]);

  const shown = full.slice(0, count);
  const done = count >= full.length;

  return (
    <section ref={ref} className="relative mx-auto max-w-3xl px-4 py-20 sm:py-28">
      <motion.div {...fadeUp}>
        <p className="text-center text-[11px] tracking-[0.35em] text-[#C65D3A] font-bold">01 · 一封信</p>
        <h2 className="font-hand mt-2 text-center text-4xl sm:text-5xl text-[#2D2118]">先看信，再说话</h2>
        <p className="mt-2 text-center text-sm text-[#5C4A3A]">（这封是手敲的，不好还请见谅~）</p>
      </motion.div>

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="relative mt-10">
        <div className="washi absolute -top-3 left-10 z-10 h-7 w-28 -rotate-3 rounded-sm shadow-sm" />
        <div className="washi-rose absolute -top-3 right-10 z-10 h-7 w-24 rotate-2 rounded-sm shadow-sm" />
        <div className="ruled rounded-md bg-white/80 px-6 py-8 shadow-[0_20px_50px_-20px_rgba(45,33,24,0.35)] ring-1 ring-[#2D2118]/10 sm:px-10">
          <pre className={`whitespace-pre-wrap font-hand3 text-[22px] leading-[36px] text-[#2D2118] ${done ? "" : "caret"}`}>{shown}</pre>
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: -12 }} className="animate-stamp mt-4 flex justify-end">
                <span className="rounded-md border-[3px] border-[#C65D3A] px-4 py-1 font-hand text-2xl text-[#C65D3A]">11月24日见</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-3 text-right font-hand2 text-lg text-[#5C4A3A] rotate-[-1deg]">↑ 字是我一个一个敲的，不是复制的</p>
      </motion.div>
    </section>
  );
}

/* ---------- your call ---------- */
const VIBES = [
  { id: "movie", label: "出去看个小电影、逛逛街", desc: "私人约会，嘻嘻~" },
  { id: "cook", label: "方特之旅", desc: "超级刺激，肾上腺素爆发！！！" },
  { id: "daydream", label: "什么都不安排，在家躺平", desc: "肯定是想赖床了(●ˇ∀ˇ●)" },
  { id: "walk", label: "去岳飞庙看看（岳庙街可以买衣服）", desc: "心情美美哒~" },
];

const CRAVINGS = [
  "小黄油拿铁",
  "舒芙蕾",
  "小火锅",
  "奶茶",
  "小水果拼盘",
];

type YourCallProps = {
  vibes: string[];
  cravings: string[];
  note: string;
  onToggleVibe: (id: string) => void;
  onToggleCraving: (item: string) => void;
  onChangeNote: (val: string) => void;
};

function YourCall({ vibes, cravings, note, onToggleVibe, onToggleCraving, onChangeNote }: YourCallProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <motion.div {...fadeUp} className="text-center">
        <p className="text-[11px] tracking-[0.35em] text-[#C65D3A] font-bold">02 · 由你点单</p>
        <h2 className="font-hand mt-2 text-4xl sm:text-5xl">11月25日去干嘛，由你来点单</h2>
        <p className="mt-2 text-sm text-[#5C4A3A]">挑你喜欢的，我照着准备；那天临时改主意，也随时算数</p>
      </motion.div>

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="relative mt-10">
        <div className="washi absolute -top-3 left-10 z-10 h-7 w-28 -rotate-3 rounded-sm shadow-sm" />
        <div className="washi-rose absolute -top-3 right-10 z-10 h-7 w-24 rotate-2 rounded-sm shadow-sm" />
        <div className="rounded-md bg-white/75 px-6 py-8 shadow-[0_20px_50px_-20px_rgba(45,33,24,0.35)] ring-1 ring-[#2D2118]/10 sm:px-9">
          {/* vibe cards */}
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#5C4A3A]">
            <Feather className="h-3.5 w-3.5 text-[#C65D3A]" />
            想怎么待着？（可多选）
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {VIBES.map((v) => {
              const active = vibes.includes(v.id);
              return (
                <motion.button
                  key={v.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleVibe(v.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-md border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-[#C65D3A]/55 bg-[#C65D3A]/[0.07] shadow-[0_12px_26px_-18px_rgba(198,93,58,0.8)]"
                      : "border-[#2D2118]/12 bg-[#FFF9EF]/60 hover:border-[#2D2118]/30 hover:bg-white/85"
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-hand3 text-[22px] leading-tight text-[#2D2118]">{v.label}</span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                        active
                          ? "border-[#C65D3A] bg-[#C65D3A] text-[#FFF9EF]"
                          : "border-[#2D2118]/25 text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  </div>
                  <span className="mt-1 block text-xs text-[#5C4A3A]">{v.desc}</span>
                </motion.button>
              );
            })}
          </div>

          {/* cravings */}
          <div className="mt-7 flex items-center gap-2 border-t border-dashed border-[#2D2118]/15 pt-6 text-xs font-bold tracking-[0.2em] text-[#5C4A3A]">
            <Coffee className="h-3.5 w-3.5 text-[#C65D3A]" />
            想提前在家里备好什么？
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {CRAVINGS.map((item) => {
              const active = cravings.includes(item);
              return (
                <motion.button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleCraving(item)}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-full px-4 py-1.5 font-hand3 text-lg transition-all duration-200 ${
                    active
                      ? "bg-[#C65D3A] text-[#FFF9EF] shadow-[0_10px_22px_-12px_rgba(198,93,58,0.9)]"
                      : "bg-white/70 text-[#5C4A3A] ring-1 ring-[#2D2118]/15 hover:ring-[#2D2118]/40"
                  }`}
                >
                  {active ? `✓ ${item}` : `+ ${item}`}
                </motion.button>
              );
            })}
          </div>

          {/* personal note */}
          <div className="mt-7 border-t border-dashed border-[#2D2118]/15 pt-6">
            <label htmlFor="your-call-note" className="text-xs font-bold tracking-[0.2em] text-[#5C4A3A]">
              或者直接写下你的小任性 / 悄悄话：
            </label>
            <textarea
              id="your-call-note"
              rows={3}
              value={note}
              onChange={(e) => onChangeNote(e.target.value)}
              placeholder="比如：那天想喝珍珠奶茶、想看xx小电影、或者“多抱抱我就好”……"
              className="mt-3 w-full resize-none rounded-md border border-dashed border-[#2D2118]/20 bg-[#FFF9EF]/70 px-4 py-3 font-hand3 text-[20px] leading-relaxed text-[#2D2118] transition placeholder:font-serif-sc placeholder:text-sm placeholder:text-[#5C4A3A]/45 focus:border-[#C65D3A]/60 focus:bg-white/85 focus:outline-none"
            />
          </div>

          <p className="mt-6 text-center text-[11px] tracking-[0.15em] text-[#5C4A3A]/70">都不选也没关系，那天我随机发挥，反正你来了就好</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- three notes ---------- */
const NOTES = [
  { when: "来之前拆", color: "bg-[#FFF3D6]", text: "路上注意保暖，我就在车站等你，不需要没有目的的找哦~", icon: "✉" },
  { when: "到了拆", color: "bg-[#FFE9E4]", text: "把这里当作自己家，随便一点。", icon: "🏠" },
  { when: "走之前拆", color: "bg-[#EAF0E2]", text: "这几天过的开心吗？下次还来吗？嘻嘻~", icon: "♥" },
];

function Notes() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <motion.div {...fadeUp} className="text-center">
        <p className="text-[11px] tracking-[0.35em] text-[#C65D3A] font-bold">03 · 三张小纸条</p>
        <h2 className="font-hand mt-2 text-4xl sm:text-5xl">留给你，到时候拆</h2>
        <p className="mt-2 text-sm text-[#5C4A3A]">现在先别拆哦，点一下看看我写了什么（可以偷看，我不介意）</p>
      </motion.div>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {NOTES.map((n, i) => {
          const isOpen = open === i;
          return (
            <motion.button
              key={i}
              onClick={() => setOpen(isOpen ? null : i)}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -1 : 1 }}
              className={`relative min-h-[190px] rounded-md p-6 text-left shadow-[0_16px_35px_-15px_rgba(45,33,24,0.4)] ring-1 ring-[#2D2118]/10 ${n.color}`}
            >
              <div className="washi absolute -top-2 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2 rounded-sm" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.2em] text-[#5C4A3A]">{n.when}</span>
                <span className="text-xl">{n.icon}</span>
              </div>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.p key="t" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-hand3 mt-4 text-[22px] leading-snug text-[#2D2118]">{n.text}</motion.p>
                ) : (
                  <motion.p key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-[#5C4A3A]">封着呢，点一下拆开看看 →</motion.p>
                )}
              </AnimatePresence>
              <span className="absolute bottom-4 right-4 flex items-center gap-1 text-[11px] text-[#5C4A3A]">{isOpen ? <Check className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}{isOpen ? "已拆" : "点击拆"}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- hold heart ---------- */
type HeartBurst = { id: number; dx: number; dy: number; scale: number; rot: number; size: number; color: string };
const HEART_COLORS = ["#E8B4B8", "#C65D3A", "#D9A441", "#A84A2B"];

function HoldHeart() {
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hearts, setHearts] = useState<HeartBurst[]>([]);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartId = useRef(0);

  const stopSpawn = () => {
    if (spawnTimer.current) {
      clearInterval(spawnTimer.current);
      spawnTimer.current = null;
    }
  };

  const spawnHeart = () => {
    const id = ++heartId.current;
    const burst: HeartBurst = {
      id,
      dx: (Math.random() - 0.5) * 120,
      dy: -100 - Math.random() * 70,
      scale: 0.6 + Math.random() * 0.6,
      rot: (Math.random() - 0.5) * 70,
      size: 14 + Math.random() * 10,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    };
    setHearts((prev) => [...prev, burst]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1200);
  };

  const tick = () => {
    const p = Math.min(100, ((performance.now() - start.current) / 2200) * 100);
    setProgress(p);
    if (p >= 100) {
      stopSpawn();
      setRevealed(true);
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.65 }, colors: ["#C65D3A", "#E8B4B8", "#D9A441"] });
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    if (revealed) return;
    start.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    if (!spawnTimer.current) {
      spawnHeart();
      spawnTimer.current = setInterval(spawnHeart, 150);
    }
  };

  const cancel = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    stopSpawn();
    if (!revealed) setProgress(0);
  };

  const reset = () => {
    setRevealed(false);
    setProgress(0);
  };

  useEffect(() => () => {
    stopSpawn();
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
      <motion.div {...fadeUp}>
        <p className="text-[11px] tracking-[0.35em] text-[#C65D3A] font-bold">04 · 有句悄悄话</p>
        <h2 className="font-hand mt-2 text-4xl sm:text-5xl">按住这颗心，听我说</h2>
        <p className="mt-2 text-sm text-[#5C4A3A]">按住 2 秒左右，别松手</p>
      </motion.div>

      <motion.div {...fadeUp} className="mt-10 flex flex-col items-center">
        <button
          onPointerDown={begin} onPointerUp={cancel} onPointerLeave={cancel}
          onContextMenu={(e) => e.preventDefault()}
          className="relative flex h-36 w-36 touch-none select-none items-center justify-center rounded-full bg-[#A84A2B] shadow-[0_20px_40px_-10px_rgba(168,74,43,0.6)] active:scale-95 transition"
          aria-label="按住听悄悄话"
        >
          {/* 按住时扩散的光圈 */}
          {!revealed && progress > 0 && (
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#E8B4B8]/70"
              initial={{ scale: 1, opacity: 0.75 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          {/* 持续溢出的爱心 */}
          <span className="pointer-events-none absolute inset-0">
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                className="absolute left-1/2 top-1/2"
                style={{ marginLeft: -h.size / 2, marginTop: -h.size / 2 }}
                initial={{ opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 0 }}
                animate={{ opacity: [0, 1, 0.9, 0], scale: h.scale, x: h.dx, y: h.dy, rotate: h.rot }}
                transition={{ duration: 1.15, ease: "easeOut" }}
              >
                <Heart className="fill-current" style={{ width: h.size, height: h.size, color: h.color }} />
              </motion.span>
            ))}
          </span>

          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,249,239,.25)" strokeWidth="4" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#FFF9EF" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)} />
          </svg>
          <Heart className={`relative h-14 w-14 text-[#FFF9EF] ${revealed ? "fill-current" : "animate-heartbeat"}`} />
        </button>
        <p className="mt-4 text-xs tracking-widest text-[#5C4A3A]">{revealed ? "听到了吗？" : progress > 0 ? `按住中… ${Math.floor(progress)}%` : "按住这里"}</p>

        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mt-6 max-w-md rounded-2xl bg-[#2D2118] px-6 py-5 text-[#FFF9EF] shadow-xl">
              <p className="font-hand3 text-2xl leading-snug">其实我等这一天，等了很久了。</p>
              <p className="mt-2 text-sm text-[#FFF9EF]/70">你第一次来我家，我想把最好的都给你！！！</p>
              <button onClick={reset} className="mt-3 text-xs underline underline-offset-4 text-[#FFF9EF]/60">再按一次</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------- RSVP & keepsake pass ---------- */
type RsvpProps = { vibes: string[]; cravings: string[]; note: string; weekday: string };

function Rsvp({ vibes, cravings, note, weekday }: RsvpProps) {
  const [yes, setYes] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noText, setNoText] = useState("再想想");
  const [yesScale, setYesScale] = useState(1);
  const [signed, setSigned] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPt = useRef<{ x: number; y: number; time: number } | null>(null);
  const dodge = () => {
    setNoPos({ x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 90 });
    setYesScale((s) => Math.min(1.6, s + 0.12));
    setNoText(["再想想", "你确定？", "真的不来？", "我会哭的", "抓不到我", "点上面那个"][Math.floor(Math.random() * 6)]);
  };

  const downloadIcs = () => {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//invite//CN", "BEGIN:VEVENT", "UID:invite-20261124@love", "DTSTAMP:20260101T000000Z", "DTSTART:20261124T020000Z", "DTEND:20261124T100000Z", "SUMMARY:卜文文第一次来我家", "DESCRIPTION:11月24日，卜文文第一次来我家。别迟到，我在门口等你。", "LOCATION:我家", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a"); a.href = url; a.download = "2026-11-24-卜文文来我家.ics"; a.click();
    URL.revokeObjectURL(url);
  };

  /* 高清签名画布 */
  useEffect(() => {
    if (!yes) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2D2118";
  }, [yes]);

  const point = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    lastPt.current = { ...point(e), time: performance.now() };
    setSigned(true);
  };

  const moveDraw = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPt.current) return;
    const { x, y } = point(e);
    const now = performance.now();
    const dt = Math.max(1, now - lastPt.current.time);
    const velocity = Math.hypot(x - lastPt.current.x, y - lastPt.current.y) / dt;
    ctx.lineWidth = Math.max(1.5, Math.min(3.8, 3.5 - velocity * 1.1));
    ctx.strokeStyle = "#2D2118";
    ctx.beginPath();
    ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPt.current = { x, y, time: now };
  };

  const endDraw = () => {
    drawing.current = false;
    lastPt.current = null;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const drawPreset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2D2118";
    ctx.font = '46px "Ma Shan Zheng", "Kaiti SC", serif';
    ctx.textBaseline = "middle";
    ctx.fillText("卜文文", 24, rect.height / 2 + 2);
    setSigned(true);
  };

  const vibeLabels = vibes.map((id) => VIBES.find((v) => v.id === id)?.label).filter(Boolean) as string[];

  const copySummary = async () => {
    const lines = [
      "致 小马：",
      "2026年11月24日，我已签收这张邀请函！",
      `那天的安排：${vibeLabels.length > 0 ? vibeLabels.join("、") : "到了再随心所欲决定"}`,
      `想提前备好：${cravings.length > 0 ? cravings.join("、") : "你准备的我都喜欢"}`,
    ];
    if (note.trim()) lines.push(`悄悄话：${note.trim()}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      /* 剪贴板不可用时安静失败 */
    }
  };

  const saveReceipt = () => {
    exportReceiptAsPNG({
      guestName: "卜文文",
      hostName: "小马",
      dateLabel: "2026 · 11 · 24",
      weekday,
      vibeLabels,
      cravings,
      note,
      signatureCanvas: canvasRef.current,
      hasSigned: signed,
    });
  };

  if (yes) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
          <div className="relative rounded-md bg-white/85 px-6 pb-7 pt-8 shadow-[0_25px_60px_-20px_rgba(45,33,24,0.4)] ring-1 ring-[#2D2118]/10 sm:px-9">
            <div className="washi absolute -top-3 left-10 h-7 w-28 -rotate-2 rounded-sm shadow-sm" />
            <div className="washi-rose absolute -top-3 right-10 h-7 w-24 rotate-2 rounded-sm shadow-sm" />

            {/* 通行证抬头 */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[#2D2118]/15 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-[#C65D3A]/40 bg-[#C65D3A]/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-[#C65D3A]">NO. 001</span>
                <span className="text-[10px] tracking-[0.2em] text-[#5C4A3A]">ADMIT ONE · 仅限卜文文</span>
              </div>
              <span className="text-[10px] tracking-[0.2em] text-[#5C4A3A]">2026 · 11 · 24 · 永久有效</span>
            </div>

            <div className="mt-6 flex flex-col gap-4 text-left lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.35em] text-[#C65D3A]">邀请函回执</p>
                <h3 className="mt-1 whitespace-nowrap font-hand text-4xl leading-tight sm:text-5xl">卜文文 · 已确认</h3>
              </div>
              <div className="animate-stamp mt-3 shrink-0 self-start rounded-md border-[3px] border-[#7A8B6F] px-4 py-0.5 font-hand text-xl text-[#7A8B6F] lg:mt-0 lg:self-center">已盖章 · 盖了章就不能反悔了</div>
            </div>

            {/* 目的地 & 点单预览 */}
            <div className="mt-6 grid gap-5 border-t border-dashed border-[#2D2118]/15 pt-5 text-left sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] text-[#C65D3A]">DESTINATION · 目的地</p>
                <p className="mt-1 font-hand3 text-2xl text-[#2D2118]">小马的老家</p>
                <p className="mt-1 text-xs leading-relaxed text-[#5C4A3A]">小马亲自去车站接你哦~</p>
                <p className="mt-2 text-xs text-[#5C4A3A]">带的东西：<b className="text-[#2D2118]">ber来了就行</b></p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.28em] text-[#C65D3A]">YOUR CALL · 你的点单</p>
                <p className="mt-1 text-sm leading-relaxed text-[#2D2118]">{vibeLabels.length > 0 ? vibeLabels.join(" · ") : "还没点单，到了再随心所欲"}</p>
                {cravings.length > 0 ? (
                  <p className="mt-1 text-xs text-[#C65D3A]">已备清单：{cravings.join("、")}</p>
                ) : (
                  <p className="mt-1 text-xs text-[#5C4A3A]/70">备什么你说了算，想起来随时补一句</p>
                )}
                {note.trim() && <p className="mt-1 font-hand3 text-lg leading-snug text-[#5C4A3A]">“{note.trim()}”</p>}
              </div>
            </div>

            {/* 撕票口 */}
            <div className="relative my-6 flex items-center">
              <div className="absolute -left-8 h-6 w-6 rounded-full border border-[#2D2118]/10 bg-[#FFF9EF]" />
              <div className="w-full border-t border-dashed border-[#2D2118]/20" />
              <div className="absolute -right-8 h-6 w-6 rounded-full border border-[#2D2118]/10 bg-[#FFF9EF]" />
            </div>

            {/* 签名 */}
            <div className="text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-[0.28em] text-[#C65D3A]">SIGN HERE · 签下你的名字</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={drawPreset} className="inline-flex items-center gap-1 font-hand3 text-base text-[#A84A2B] underline decoration-[#C65D3A]/40 underline-offset-4 transition hover:text-[#C65D3A]">
                    <PenLine className="h-3 w-3" />毛笔落款「卜文文」
                  </button>
                  {signed && (
                    <button type="button" onClick={clearSignature} className="inline-flex items-center gap-1 text-xs text-[#5C4A3A] transition hover:text-[#C65D3A]">
                      <Eraser className="h-3 w-3" />重写
                    </button>
                  )}
                </div>
              </div>
              <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md border border-dashed border-[#2D2118]/20 bg-[#FFF9EF]">
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDraw}
                  onPointerMove={moveDraw}
                  onPointerUp={endDraw}
                  onPointerCancel={endDraw}
                  className="h-full w-full touch-none cursor-crosshair"
                />
                {!signed && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs tracking-[0.2em] text-[#5C4A3A]/40">
                    用手指或鼠标在这里写下名字 / 画个小心心
                  </span>
                )}
              </div>
            </div>

            {/* 回执操作 */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={downloadIcs} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C65D3A] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:bg-[#A84A2B] active:scale-95 sm:w-auto">
                <CalendarHeart className="h-4 w-4" />把这一天存进日历
              </button>
              <button onClick={saveReceipt} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2D2118] px-6 py-3 text-sm font-medium text-[#FFF9EF] shadow-lg transition hover:scale-105 hover:bg-[#3A3028] active:scale-95 sm:w-auto">
                <Download className="h-4 w-4" />保存回执照
              </button>
              <button onClick={copySummary} className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-[#5C4A3A] ring-1 ring-[#2D2118]/20 transition hover:text-[#2D2118] hover:ring-[#2D2118]/40 sm:w-auto">
                {copied ? <><Check className="h-4 w-4 text-[#7A8B6F]" />已复制，去发给他吧</> : <><Copy className="h-4 w-4" />复制心愿回执</>}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => { setYes(false); setSigned(false); }} className="text-xs text-[#5C4A3A] underline underline-offset-4 transition hover:text-[#C65D3A]">再看一遍</button>
              <span className="text-[#5C4A3A]/30">·</span>
              <p className="font-hand3 text-base text-[#5C4A3A]">这张回执只此一份，存下来就算数</p>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:py-28 text-center">
      <motion.div {...fadeUp}>
        <p className="text-[11px] tracking-[0.35em] text-[#C65D3A] font-bold">05 · 最后一步</p>
        <h2 className="font-hand mt-3 text-5xl sm:text-6xl leading-tight">Ber，<br />你愿意来吗？</h2>
        <p className="mt-3 text-sm text-[#5C4A3A]">（温馨提示：右边那个按钮有点害羞，你可能点不到）</p>
      </motion.div>
      <motion.div {...fadeUp} className="relative mt-12 flex min-h-[120px] flex-wrap items-center justify-center gap-4">
        <motion.button
          onClick={() => { setYes(true); confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors: ["#C65D3A", "#D9A441", "#E8B4B8", "#7A8B6F"] }); }}
          style={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.06 }} whileTap={{ scale: yesScale * 0.95 }}
          className="flex items-center gap-2 rounded-full bg-[#C65D3A] px-8 py-4 text-lg font-bold text-white shadow-[0_15px_35px_-10px_rgba(198,93,58,0.7)]"
        >
          <Heart className="h-5 w-5 fill-current" />愿意！！
        </motion.button>
        <motion.button
          onMouseEnter={dodge} onClick={dodge}
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="rounded-full bg-white px-6 py-3 text-sm text-[#5C4A3A] ring-1 ring-[#2D2118]/20"
        >
          {noText}
        </motion.button>
      </motion.div>
    </section>
  );
}

/* ---------- main ---------- */
export default function Invitation() {
  const { d, h, m, s } = useCountdown();
  const weekday = new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(new Date(TARGET));

  const [vibes, setVibes] = useState<string[]>([]);
  const [cravings, setCravings] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggleVibe = (id: string) =>
    setVibes((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  const toggleCraving = (item: string) =>
    setCravings((prev) => (prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]));

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="paper-grain relative min-h-screen bg-[#FFF9EF]"
    >
      {/* HERO */}
      <header className="relative overflow-hidden px-4 pt-16 pb-10 sm:pt-24">
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#D9A441]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#E8B4B8]/25 blur-3xl" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs tracking-[0.25em] text-[#5C4A3A] ring-1 ring-[#2D2118]/10">
            <Home className="h-3.5 w-3.5 text-[#C65D3A]" /> 小马的邀请 · 全是真心
          </div>

          <p className="font-hand3 mt-8 text-2xl text-[#C65D3A] rotate-[-2deg]">亲爱的</p>
          <h1 className="font-hand ink-shadow mt-1 text-[76px] leading-none text-[#2D2118] sm:text-[120px]">卜文文</h1>
          <p className="mt-3 text-lg text-[#5C4A3A] sm:text-xl">你第一次来我家，<span className="font-hand2 text-2xl text-[#C65D3A]">我想把这一天，认真地交给你。</span></p>

          {/* date card */}
          <motion.div initial={{ opacity: 0, y: 20, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -1 }} transition={{ delay: 0.45 }} className="relative mx-auto mt-10 max-w-md">
            <div className="washi absolute -top-3 left-1/2 z-10 h-7 w-32 -translate-x-1/2 -rotate-1 rounded-sm" />
            <div className="rounded-xl bg-[#2D2118] px-6 py-6 text-[#FFF9EF] shadow-[0_25px_50px_-15px_rgba(45,33,24,0.6)]">
              <p className="text-[11px] tracking-[0.4em] text-[#FFF9EF]/60">SAVE THE DATE</p>
              <p className="font-hand mt-2 text-5xl">2026 · 11 · 24</p>
              <p className="mt-1 text-sm text-[#FFF9EF]/70">{weekday} · 我家 · 等你到来</p>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#FFF9EF]/60">
                <MapPin className="h-3.5 w-3.5" /> 北店村哦~
                <Clock3 className="ml-2 h-3.5 w-3.5" /> 时间随意，我都在
              </div>
            </div>
          </motion.div>

          {/* countdown */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10">
            <p className="flex items-center justify-center gap-2 text-sm text-[#5C4A3A]"><Sparkles className="h-4 w-4 text-[#D9A441]" />距离那天还有<span className="font-hand2 text-lg text-[#C65D3A]">（我每天都在数）</span></p>
            <div className="mt-4 flex justify-center gap-2 sm:gap-3">
              {[{ v: d, l: "天" }, { v: h, l: "时" }, { v: m, l: "分" }, { v: s, l: "秒" }].map((u, i) => (
                <div key={i} className="w-[68px] rounded-lg bg-white py-3 shadow-md ring-1 ring-[#2D2118]/10 sm:w-20">
                  <p className="font-hand text-4xl leading-none text-[#2D2118] tabular-nums">{String(u.v).padStart(2, "0")}</p>
                  <p className="mt-1 text-[11px] tracking-widest text-[#5C4A3A]">{u.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.a href="#letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 inline-flex flex-col items-center gap-1 text-sm text-[#5C4A3A] hover:text-[#C65D3A]">
            往下翻，信在下面
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </motion.a>
        </motion.div>
      </header>

      <div id="letter"><Letter /></div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#2D2118]/15 to-transparent mx-8" />
      <YourCall
        vibes={vibes}
        cravings={cravings}
        note={note}
        onToggleVibe={toggleVibe}
        onToggleCraving={toggleCraving}
        onChangeNote={setNote}
      />
      <div className="h-px bg-gradient-to-r from-transparent via-[#2D2118]/15 to-transparent mx-8" />
      <Notes />
      <div className="h-px bg-gradient-to-r from-transparent via-[#2D2118]/15 to-transparent mx-8" />
      <HoldHeart />
      <div className="h-px bg-gradient-to-r from-transparent via-[#2D2118]/15 to-transparent mx-8" />
      <Rsvp vibes={vibes} cravings={cravings} note={note} weekday={weekday} />

      {/* FOOTER */}
      <footer className="px-4 pb-16 pt-6 text-center">
        <motion.div {...fadeUp}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#A84A2B] shadow-lg">
            <span className="font-hand text-2xl text-[#FFF9EF]">卜</span>
          </div>
          <p className="font-hand mt-4 text-3xl">11月24日见</p>
          <p className="mt-1 text-sm text-[#5C4A3A]">我会在车站门口等你~</p>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] tracking-[0.2em] text-[#5C4A3A]/60">
            <PenLine className="h-3.5 w-3.5" /> 本邀请函由小马亲手制作 · 没有套路 · 只有真心 · <Fingerprint className="h-3.5 w-3.5" />
          </p>
        </motion.div>
      </footer>
    </motion.main>
  );
}
