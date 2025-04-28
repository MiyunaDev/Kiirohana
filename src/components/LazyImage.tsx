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

  // Observe visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // preload 100px sebelum viewport
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

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
      setError(true);
      setLoading(false);
    };
  };

  useEffect(() => {
    if (isVisible && src) {
      loadImage(src);
    }
  }, [isVisible, src, retryKey]);

  return (
    <div ref={containerRef} className={`relative w-full ${loading ? '' : 'h-auto'}`}>
      {loading && (
        <div
          className="flex flex-col items-center justify-center text-gray-400"
          style={{ height: placeholderHeight }}
        >
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
          <p className="mt-2 text-sm">Loading...</p>
        </div>
      )}

      {error && !loading && !imageSrc && (
        <div
          className="text-center text-red-200 bg-red-50 flex flex-col items-center justify-center"
          style={{ height: placeholderHeight }}
        >
          <p className="mb-2">Gagal memuat gambar</p>
          <button
            onClick={() => setRetryKey((prev) => prev + 1)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-auto object-cover ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;