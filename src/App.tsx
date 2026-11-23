import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Music, VolumeX } from "lucide-react";
import EnvelopeGate from "./components/EnvelopeGate";
import Invitation from "./components/Invitation";

type Burst = { id: number; x: number; y: number; size: number; drift: number; rot: number };

/* background music: the song starts on the wax-seal click (a real user gesture) */
function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/bgm.mp3");
      audio.loop = true;
      audio.volume = 0.42;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const start = useCallback(() => {
    const audio = getAudio();
    if (!audio.paused) return;
    const p = audio.play();
    if (p) p.then(() => setOn(true)).catch(() => setOn(false));
  }, [getAudio]);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      audio.play().then(() => setOn(true)).catch(() => setOn(false));
    } else {
      audio.pause();
      setOn(false);
    }
  }, [getAudio]);

  useEffect(() => () => { audioRef.current?.pause(); audioRef.current = null; }, []);
  return { on, start, toggle };
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef(0);
  const { on: musicOn, start: startMusic, toggle: toggleMusic } = useBackgroundMusic();

  const spawnHearts = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastRef.current < 120) return;
    lastRef.current = now;
    const id = ++idRef.current;
    const b: Burst = {
      id, x: e.clientX, y: e.clientY,
      size: 12 + Math.random() * 14,
      drift: (Math.random() - 0.5) * 70,
      rot: (Math.random() - 0.5) * 60,
    };
    setBursts((prev) => [...prev.slice(-14), b]);
    setTimeout(() => setBursts((prev) => prev.filter((p) => p.id !== id)), 1100);
  }, []);

  useEffect(() => {
    if (opened) window.scrollTo({ top: 0 });
  }, [opened]);

  return (
    <div onClick={opened ? spawnHearts : undefined} className="min-h-screen">
      <AnimatePresence>{!opened && <EnvelopeGate onOpen={() => setOpened(true)} onUnseal={startMusic} />}</AnimatePresence>
      {opened && <Invitation />}

      {/* floating hearts on click */}
      {bursts.map((b) => (
        <motion.span
          key={b.id}
          initial={{ opacity: 1, x: b.x, y: b.y, scale: 0.4, rotate: 0 }}
          animate={{ opacity: 0, x: b.x + b.drift, y: b.y - 90, scale: 1.1, rotate: b.rot }}
          transition={{ duration: 1.05, ease: "easeOut" }}
          className="pointer-events-none fixed left-0 top-0 z-[9998]"
        >
          <Heart style={{ width: b.size, height: b.size }} className="fill-[#C65D3A] text-[#C65D3A]" />
        </motion.span>
      ))}

      {/* ambient toggle */}
      {opened && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMusic(); }}
          className="fixed bottom-5 right-5 z-[9997] flex items-center gap-2 rounded-full bg-[#2D2118] px-4 py-2.5 text-sm text-[#FFF9EF] shadow-xl transition hover:scale-105 active:scale-95"
          aria-label="背景音乐开关"
        >
          {musicOn ? <Music className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
          {musicOn ? "背景音乐开着" : "放点背景音乐"}
        </button>
      )}
    </div>
  );
}
