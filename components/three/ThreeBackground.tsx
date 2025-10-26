'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useEffect, useState } from 'react';
import { Scene } from './Scene';

interface ThreeBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

// Detect device capability
const getDeviceCapability = () => {
  if (typeof window === 'undefined') return 'high';
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hasGPU = 'gpu' in navigator;
  
  if (isMobile) return 'low';
  if (hasGPU) return 'high';
  
  // Check performance
  const memory = (performance as { memory?: { jsHeapSizeLimit?: number } }).memory;
  if (memory && memory.jsHeapSizeLimit) {
    return memory.jsHeapSizeLimit > 2000000000 ? 'high' : 'medium';
  }
  
  return 'medium';
};

// Loading fallback component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ThreeBackground({ mousePosition, scrollProgress }: ThreeBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine particle count based on device capability
  const particleCount = useMemo(() => {
    const capability = getDeviceCapability();
    switch (capability) {
      case 'high':
        return 200;
      case 'medium':
        return 100;
      case 'low':
        return 50;
      default:
        return 100;
    }
  }, []);

  // Don't render on server or if user prefers reduced motion
  if (!isClient || prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-30" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]} // Adaptive pixel ratio
        performance={{ min: 0.5 }} // Allow frame rate to drop if needed
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Scene
            mousePosition={mousePosition}
            scrollProgress={scrollProgress}
            particleCount={particleCount}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
// Removed as part of Three.js effect revert. See __removed_three_backup/ThreeBackground.tsx.bak for backup.
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useEffect, useState } from 'react';
import { Scene } from './Scene';

interface ThreeBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

// Detect device capability
const getDeviceCapability = () => {
  if (typeof window === 'undefined') return 'high';
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hasGPU = 'gpu' in navigator;
  
  if (isMobile) return 'low';
  if (hasGPU) return 'high';
  
  // Check performance
  const memory = (performance as { memory?: { jsHeapSizeLimit?: number } }).memory;
  if (memory && memory.jsHeapSizeLimit) {
    return memory.jsHeapSizeLimit > 2000000000 ? 'high' : 'medium';
  }
  
  return 'medium';
};

// Loading fallback component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ThreeBackground({ mousePosition, scrollProgress }: ThreeBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine particle count based on device capability
  const particleCount = useMemo(() => {
    const capability = getDeviceCapability();
    switch (capability) {
      case 'high':
        return 200;
      case 'medium':
        return 100;
      case 'low':
        return 50;
      default:
        return 100;
    }
  }, []);

  // Don't render on server or if user prefers reduced motion
  if (!isClient || prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-30" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]} // Adaptive pixel ratio
        performance={{ min: 0.5 }} // Allow frame rate to drop if needed
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Scene
            mousePosition={mousePosition}
            scrollProgress={scrollProgress}
            particleCount={particleCount}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
