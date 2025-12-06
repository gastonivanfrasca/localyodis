import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoHideOnViewOptions {
  /** Time in milliseconds the item must be visible before marking as read (default: 1500ms) */
  visibilityDelay?: number;
  /** Intersection threshold (0-1) - percentage of element that must be visible (default: 0.6) */
  threshold?: number;
  /** Whether auto-hide is enabled (default: true) */
  enabled?: boolean;
  /** Callback when item should be hidden (called when item leaves viewport after being read) */
  onHide: () => void;
}

/**
 * Hook that marks an item as "read" after it has been visible for a specified duration,
 * then hides it when the item leaves the viewport.
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
  const hasBeenReadRef = useRef(false); // Track if item has been "read" (visible long enough)
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
          if (!timerRef.current && !hasBeenReadRef.current) {
            timerRef.current = setTimeout(() => {
              // Mark as read after visibility delay
              hasBeenReadRef.current = true;
            }, visibilityDelay);
          }
        } else {
          setIsVisible(false);
          
          // Clear timer if element leaves before being marked as read
          clearTimer();
          
          // Hide the item when it leaves the viewport IF it was already read
          if (hasBeenReadRef.current && !hasBeenHiddenRef.current) {
            hasBeenHiddenRef.current = true;
            onHide();
          }
        }
      },
      {
        threshold,
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

