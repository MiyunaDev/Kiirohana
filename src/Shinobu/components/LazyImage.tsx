import React, { useState, useEffect, useRef } from 'react';

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  placeholderHeight?: string;
};

const LazyImage: React.FC<LazyImageProps> = ({
  src = '',
  alt = '',
  className = '',
  fallbackSrc = '',
  placeholderHeight = '300px',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer untuk lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Load image
  const loadImage = (imageUrl: string) => {
    setLoading(true);
    setError(false);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setImageSrc(imageUrl);
      setLoading(false);
    };

    img.onerror = () => {
      if (fallbackSrc && imageUrl !== fallbackSrc) {
        loadImage(fallbackSrc);
      } else {
        setError(true);
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    if (isVisible && src) loadImage(src);
  }, [isVisible, src, retryKey]);

  return (
    <div ref={containerRef} className={`relative w-full max-w-full ${loading ? 'min-h-[300px]' : 'h-auto'} ${className}`}>
      {/* Placeholder loading */}
      {loading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 dark:bg-gray-900"
          style={{ minHeight: placeholderHeight }}
        >
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-400 rounded-full animate-spin" />
          <p className="mt-2 text-sm text-gray-300 dark:text-gray-400">Loading...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && !imageSrc && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 dark:bg-gray-900 text-center p-4"
          style={{ minHeight: placeholderHeight }}
        >
          <p className="mb-2 text-red-400">Gagal memuat gambar</p>
          <button
            onClick={() => setRetryKey((prev) => prev + 1)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-auto object-contain transition-all duration-300 ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;