import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// Throttle function to limit how often a function can run
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

interface UseOptimizedAnimationsOptions {
  particleCount?: number;
  enableMouseTracking?: boolean;
  throttleMs?: number;
}

export function useOptimizedAnimations({
  particleCount = 8,
  enableMouseTracking = true,
  throttleMs = 50
}: UseOptimizedAnimationsOptions = {}) {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Memoize particles - only create once
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 5,
      opacity: 0.08 + Math.random() * 0.15
    }));
  }, [particleCount]);

  // Optimized mouse move handler with throttling and RAF
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enableMouseTracking) return;

      // Capture required values synchronously to avoid synthetic event pooling
      const target = e.currentTarget;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Cancel any pending RAF
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Use RAF for smooth updates, but use captured values inside callback
      rafId.current = requestAnimationFrame(() => {
        try {
          // Guard against element resize/removed - ensure rect has positive width
          const width = rect.width || 1;
          const height = rect.height || 1;
          setMousePos({
            x: (clientX - rect.left - width / 2) / width,
            y: (clientY - rect.top - height / 2) / height
          });
        } catch (err) {
          // If anything goes wrong, silently ignore to avoid breaking UI
          console.warn('mouse move handler error', err);
        }
      });
    },
    [enableMouseTracking]
  );

  // Throttled version for even better performance
  const throttledMouseMove = useMemo(
    () => throttle(handleMouseMove as (...args: unknown[]) => void, throttleMs) as typeof handleMouseMove,
    [handleMouseMove, throttleMs]
  );

  useEffect(() => {
    setMounted(true);
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return {
    mounted,
    mousePos,
    particles,
    handleMouseMove: throttledMouseMove
  };
}
