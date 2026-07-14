import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';

export interface Banner {
  id: string;
  imageUrl: string;
  redirect: string;
  redirectValue: string;
}

interface PromoBannerProps {
  banners: Banner[];
  autoPlayMs?: number;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ banners, autoPlayMs = 5000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const count = banners.length;

  const goTo = (index: number) => setActiveIndex(((index % count) + count) % count);
  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovering || count <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovering, count, autoPlayMs]);

  if (count === 0) return null;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-sm"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 h-48 sm:h-72 bg-bg-soft">
            <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous banner"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
          >
            <IconChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromoBanner;
