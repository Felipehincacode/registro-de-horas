'use client';

import { useEffect } from 'react';

export function usePullToRefresh(onRefresh: () => void) {
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const diff = e.touches[0].clientY - startY;
      if (window.scrollY === 0 && diff > 120) onRefresh();
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [onRefresh]);
}
