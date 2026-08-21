import { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaStepForward,
  FaStepBackward,
  FaTachometerAlt,
} from "react-icons/fa";

interface Props {
  src: string; // SINGLE SOURCE
  onPrevEpisode?: () => void;
  onNextEpisode?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function YouTubeStyleVideoPlayer({
  src,
  onPrevEpisode,
  onNextEpisode,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showUI, setShowUI] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [lastTap, setLastTap] = useState(0);
  const [ripple, setRipple] = useState<"left" | "right" | null>(null);

  /* ======================
     AUTO HIDE CONTROLS
  ====================== */
  const showControls = () => {
    setShowUI(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setShowUI(false);
    }, 3000);
  };

  /* ======================
     PLAY / PAUSE
  ====================== */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    playing ? v.pause() : v.play();
    setPlaying(!playing);
    showControls();
  };

  const seek = (sec: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(sec, duration));
  };

  /* ======================
     DOUBLE TAP (MOBILE)
  ====================== */
  const handleTouch = (e: React.TouchEvent) => {
    const now = Date.now();
    const diff = now - lastTap;
    setLastTap(now);

    if (diff < 300) {
      const x = e.touches[0].clientX;
      const half = window.innerWidth / 2;

      if (x < half) {
        seek(current - 10);
        setRipple("left");
      } else {
        seek(current + 10);
        setRipple("right");
      }

      window.setTimeout(() => setRipple(null), 400);
    } else {
      showControls();
    }
  };

  /* ======================
     FULLSCREEN
  ====================== */
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  /* ======================
     SPEED CONTROL
  ====================== */
  const changeSpeed = () => {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  /* ======================
     FORMAT TIME
  ====================== */
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  /* ======================
     LOAD SOURCE
  ====================== */
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.src = src;
    videoRef.current.play(); // mana handlenya njir
    setPlaying(true);
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden"
      onMouseMove={showControls}
      onTouchStart={handleTouch}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={() => setCurrent(videoRef.current!.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* RIPPLE */}
      {ripple && (
        <div className={`absolute inset-0 flex items-center ${ripple === "left" ? "justify-start" : "justify-end"}`}>
          <div className="mx-20 text-white text-4xl animate-ping">
            {ripple === "left" ? "⏪ 10s" : "10s ⏩"}
          </div>
        </div>
      )}

      {/* OVERLAY */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 transition-opacity ${
          showUI ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={togglePlay}
      >
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-6 animate-pulse">
              <FaPlay size={36} />
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="absolute bottom-0 w-full px-4 pb-3 space-y-2">
          <input
            type="range"
            min={0}
            max={duration}
            value={current}
            onChange={(e) => seek(+e.target.value)}
            className="w-full accent-red-600"
          />

          <div className="flex justify-between text-xs text-white/80">
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>

          <div className="flex justify-between items-center text-white">
            <div className="flex gap-4 items-center">
              <button onClick={onPrevEpisode}><FaStepBackward /></button>
              <button onClick={() => seek(current - 10)}><FaBackward /></button>
              <button onClick={togglePlay} className="text-xl">
                {playing ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={() => seek(current + 10)}><FaForward /></button>
              <button onClick={onNextEpisode}><FaStepForward /></button>
            </div>

            <div className="flex gap-4 items-center">
              <button onClick={changeSpeed} title="Playback speed">
                <FaTachometerAlt /> {speed}x
              </button>

              <button
                onClick={() => {
                  if (!videoRef.current) return;
                  videoRef.current.muted = !muted;
                  setMuted(!muted);
                }}
              >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>

              <button onClick={toggleFullscreen}>
                {fullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}