import { useEffect, useRef } from 'react';

interface UseAutoHideOnViewOptions {
  /** Whether auto-hide is enabled (default: true) */
  enabled?: boolean;
  /** Callback when item should be hidden */
  onHide: () => void;
}

/**
 * Hook that hides an item when it exits through the top of the viewport.
 * This prevents layout shift since items below the viewport are not affected.
 */
export const useAutoHideOnView = ({
  enabled = true,
  onHide,
}: UseAutoHideOnViewOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasBeenHiddenRef = useRef(false);
  const wasVisibleRef = useRef(false);
  
  // Store onHide in a ref to avoid re-running the effect when it changes
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;

  useEffect(() => {
    if (!enabled || hasBeenHiddenRef.current) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        if (entry.isIntersecting) {
          // Mark that we've seen this item
          wasVisibleRef.current = true;
        } else if (wasVisibleRef.current && !hasBeenHiddenRef.current) {
          // Item was visible and now it's not - check if it exited through top
          const rect = entry.boundingClientRect;
          const exitedThroughTop = rect.bottom < 0;
          
          if (exitedThroughTop) {
            hasBeenHiddenRef.current = true;
            onHideRef.current();
          }
        }
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return {
    ref: elementRef,
  };
};

