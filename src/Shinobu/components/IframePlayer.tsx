import { useRef } from "react";

interface Props {
  src: string; // SINGLE IFRAME SOURCE
  onPrevEpisode?: () => void;
  onNextEpisode?: () => void;
}

export default function IframeVideoPlayer({
  src
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden"
    >
      {/* IFRAME */}
      <iframe
        key={src}
        src={src}
        className="w-full h-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
      />
    </div>
  );
}