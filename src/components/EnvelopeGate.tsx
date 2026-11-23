import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, MousePointerClick } from "lucide-react";

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 53) % 100}%`,
  size: 6 + ((i * 7) % 10),
  delay: (i * 0.7) % 8,
  dur: 9 + ((i * 3) % 7),
  char: i % 3 === 0 ? "✿" : i % 3 === 1 ? "♥" : "·",
}));

export default function EnvelopeGate({ onOpen, onUnseal }: { onOpen: () => void; onUnseal?: () => void }) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "done">("sealed");
  const [shake, setShake] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleSeal = () => {
    if (phase !== "sealed") return;
    onUnseal?.();
    setPhase("opening");
    // little crack shake
    setShake(true);
    setTimeout(() => setShake(false), 500);

    // confetti burst in warm colors
    const fire = (x: number, y: number) => confetti({
      particleCount: 90, spread: 75, startVelocity: 38, origin: { x, y },
      colors: ["#C65D3A", "#D9A441", "#E8B4B8", "#7A8B6F", "#FFF9EF"],
      scalar: 0.9, ticks: 220, zIndex: 9999,
    });
    setTimeout(() => { fire(0.5, 0.55); fire(0.3, 0.6); fire(0.7, 0.6); }, 350);
    setTimeout(() => { fire(0.5, 0.4); }, 650);

    timer.current = setTimeout(() => { setPhase("done"); onOpen(); }, 1650);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="paper-grain fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#FFF9EF] px-4"
    >
      {/* drifting petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PETALS.map((p) => (
          <span key={p.id} className="absolute bottom-[-20px] text-[#C65D3A]/40"
            style={{ left: p.left, fontSize: p.size, animation: `drift ${p.dur}s linear ${p.delay}s infinite` }}>
            {p.char}
          </span>
        ))}
      </div>

      {/* top meta */}
      <div className="absolute top-5 left-0 right-0 flex items-start justify-between px-5 sm:px-10 text-[11px] tracking-[0.25em] text-[#5C4A3A]/70 font-medium">
        <span>寄给：卜文文</span>
        <span className="hidden sm:block">2026 · 11 · 24</span>
        <span>寄件人：你的男朋友</span>
      </div>

      {/* handwritten hint */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-hand3 text-2xl sm:text-3xl text-[#2D2118] mb-2 rotate-[-2deg]"
      >
        文文，有一封信要拆开 ↓
      </motion.p>
      <p className="text-xs text-[#5C4A3A] tracking-widest mb-8">（点一下中间的火漆章就行，别点错地方）</p>

      {/* ENVELOPE */}
      <motion.div
        animate={shake ? { x: [0, -6, 6, -4, 4, 0], rotate: [0, -1, 1, -0.5, 0.5, 0] } : { x: 0, rotate: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-[min(88vw,520px)]"
        style={{ perspective: 1200 }}
      >
        {/* envelope body */}
        <div className="relative h-[300px] sm:h-[340px] w-full rounded-b-2xl rounded-t-md bg-[#FDF1DC] shadow-[0_30px_60px_-15px_rgba(45,33,24,0.35)] border border-[#2D2118]/10 overflow-hidden">
          {/* letter inside */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={phase !== "sealed" ? { y: -70, opacity: 1 } : { y: 60, opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-6 w-[86%] -translate-x-1/2 rounded-md bg-white px-5 py-4 shadow-lg border border-[#2D2118]/5"
          >
            <p className="font-hand text-xl text-[#C65D3A]">卜文文：</p>
            <p className="font-hand3 text-lg leading-snug text-[#2D2118] mt-1">11月24日，来我家坐坐？<br />信在后面，慢慢看。</p>
            <div className="mt-2 flex justify-end"><Heart className="h-4 w-4 fill-[#C65D3A] text-[#C65D3A]" /></div>
          </motion.div>

          {/* side folds */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, transparent 49.5%, rgba(45,33,24,.08) 50%, transparent 50.5%), linear-gradient(-115deg, transparent 49.5%, rgba(45,33,24,.08) 50%, transparent 50.5%)" }} />
          {/* bottom fold */}
          <div className="absolute inset-x-0 bottom-0 h-[62%]" style={{ background: "linear-gradient(to top, #F7E6C8, #FDF1DC)", clipPath: "polygon(0 100%, 50% 18%, 100% 100%)" }} />

          {/* address on envelope */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-[10px] tracking-[0.3em] text-[#5C4A3A]">TO</p>
            <p className="font-hand text-3xl text-[#2D2118] leading-none mt-1">卜文文</p>
            <p className="text-[11px] text-[#5C4A3A] mt-1 tracking-widest">亲启 · 请勿让别人先看</p>
          </div>

          {/* stamp */}
          <div className="absolute top-4 right-4 rotate-[8deg] rounded-sm bg-[#C65D3A] p-1 shadow">
            <div className="flex h-12 w-10 flex-col items-center justify-center bg-[#FFF9EF] text-[#C65D3A]">
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-[8px] font-bold tracking-widest mt-0.5">11.24</span>
            </div>
          </div>
          {/* postmark */}
          <div className="absolute top-5 left-4 rotate-[-10deg] rounded-full border-2 border-[#2D2118]/25 px-3 py-1 text-[10px] tracking-widest text-[#2D2118]/50">
            2026.11.24 · 我家
          </div>
        </div>

        {/* flap */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={phase !== "sealed" ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 h-[52%] origin-top z-20"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <div className="h-full w-full rounded-t-2xl bg-[#F7E6C8] border border-[#2D2118]/10 shadow-inner"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </motion.div>

        {/* WAX SEAL */}
        <AnimatePresence>
          {phase === "sealed" && (
            <motion.button
              onClick={handleSeal}
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.92 }}
              exit={{ scale: 0, rotate: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              aria-label="拆开火漆"
              className="group absolute left-1/2 top-[46%] z-30 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-[#A84A2B] shadow-[0_10px_25px_rgba(168,74,43,0.5),inset_0_2px_6px_rgba(255,255,255,0.35),inset_0_-4px_10px_rgba(0,0,0,0.25)]">
                <span className="absolute inset-2 rounded-full border-2 border-dashed border-[#FFF9EF]/40" />
                <span className="font-hand text-5xl text-[#FFF9EF] drop-shadow">卜</span>
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2D2118] px-3 py-1 text-[11px] text-[#FFF9EF] opacity-0 transition group-hover:opacity-100">点我拆开</span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* bottom hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex items-center gap-2 text-sm text-[#5C4A3A]">
        <MousePointerClick className="h-4 w-4 text-[#C65D3A] animate-wiggle" />
        <span>轻轻点一下火漆章，信就打开了</span>
      </motion.div>
      <p className="mt-3 text-[11px] tracking-[0.2em] text-[#5C4A3A]/60">HANDMADE WITH NERVOUS HANDS · 2026</p>
    </motion.div>
  );
}
