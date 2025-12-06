import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoHideOnViewOptions {
  /** Time in milliseconds the item must be visible before auto-hiding (default: 1500ms) */
  visibilityDelay?: number;
  /** Intersection threshold (0-1) - percentage of element that must be visible (default: 0.6) */
  threshold?: number;
  /** Whether auto-hide is enabled (default: true) */
  enabled?: boolean;
  /** Callback when item should be hidden */
  onHide: () => void;
}

/**
 * Hook that auto-hides an item after it has been visible in the viewport for a specified duration.
 * Uses Intersection Observer to detect visibility.
 */
export const useAutoHideOnView = ({
  visibilityDelay = 1500,
  threshold = 0.6,
  enabled = true,
  onHide,
}: UseAutoHideOnViewOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasBeenHiddenRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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
          setIsVisible(true);
          
          // Start timer when element becomes visible
          if (!timerRef.current && !hasBeenHiddenRef.current) {
            timerRef.current = setTimeout(() => {
              if (!hasBeenHiddenRef.current) {
                hasBeenHiddenRef.current = true;
                onHide();
              }
            }, visibilityDelay);
          }
        } else {
          setIsVisible(false);
          
          // Clear timer if element is no longer visible
          clearTimer();
        }
      },
      {
        threshold,
        // Use root margin to trigger slightly before/after actual viewport
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [enabled, threshold, visibilityDelay, onHide, clearTimer]);

  return {
    ref: elementRef,
    isVisible,
  };
};

