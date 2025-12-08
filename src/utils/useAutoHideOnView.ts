import { useEffect, useRef, useCallback } from 'react';

interface UseAutoHideOnViewOptions {
  /** Whether auto-hide is enabled (default: true) */
  enabled?: boolean;
  /** Callback when item should be hidden */
  onHide: () => void;
}

// Global queue for batching hide operations to prevent layout shift
const hideQueue: Set<() => void> = new Set();
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let isScrolling = false;
let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Flush all pending hide operations
 */
const flushHideQueue = () => {
  if (hideQueue.size === 0) return;
  
  // Execute all pending hides
  hideQueue.forEach(callback => callback());
  hideQueue.clear();
};

/**
 * Schedule a hide operation to be executed when scrolling stops
 */
const scheduleHide = (callback: () => void) => {
  hideQueue.add(callback);
  
  // If not currently scrolling, flush after a short delay
  if (!isScrolling) {
    if (flushTimeout) clearTimeout(flushTimeout);
    flushTimeout = setTimeout(flushHideQueue, 150);
  }
};

/**
 * Track scroll state globally
 */
const setupGlobalScrollTracking = (scrollParent: HTMLElement) => {
  const handleScroll = () => {
    isScrolling = true;
    
    // Clear any pending flush
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
    
    // Reset scroll end detection
    if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(() => {
      isScrolling = false;
      // Flush queue when scrolling stops
      flushHideQueue();
    }, 200);
  };
  
  scrollParent.addEventListener('scroll', handleScroll, { passive: true });
  return () => scrollParent.removeEventListener('scroll', handleScroll);
};

// Track which scroll parents we've set up
const trackedScrollParents = new WeakSet<HTMLElement>();

/**
 * Find the scrollable parent of an element
 */
const getScrollParent = (element: HTMLElement): HTMLElement | null => {
  let parent = element.parentElement;
  
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  
  return null;
};

/**
 * Hook that hides an item when it exits through the top of the scroll container.
 * Batches hide operations to prevent layout shift during scrolling.
 */
export const useAutoHideOnView = ({
  enabled = true,
  onHide,
}: UseAutoHideOnViewOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasBeenHiddenRef = useRef(false);
  const wasVisibleRef = useRef(false);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  
  // Store onHide in a ref to avoid re-running the effect when it changes
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;

  const checkVisibility = useCallback(() => {
    if (!enabled || hasBeenHiddenRef.current) return;
    
    const element = elementRef.current;
    const scrollParent = scrollParentRef.current;
    
    if (!element || !scrollParent) return;
    
    const elementRect = element.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();
    
    // Check if element is currently visible within scroll parent
    const isVisible = elementRect.bottom > parentRect.top && elementRect.top < parentRect.bottom;
    
    if (isVisible) {
      wasVisibleRef.current = true;
    } else if (wasVisibleRef.current && !hasBeenHiddenRef.current) {
      // Element was visible but now it's not
      // Check if it exited through the top (element is above the scroll container)
      const exitedThroughTop = elementRect.bottom <= parentRect.top;
      
      if (exitedThroughTop) {
        hasBeenHiddenRef.current = true;
        // Schedule hide instead of executing immediately
        scheduleHide(() => onHideRef.current());
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || hasBeenHiddenRef.current) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    // Find and store the scroll parent
    const scrollParent = getScrollParent(element);
    if (!scrollParent) {
      return;
    }
    scrollParentRef.current = scrollParent;

    // Setup global scroll tracking for this scroll parent (only once per parent)
    if (!trackedScrollParents.has(scrollParent)) {
      trackedScrollParents.add(scrollParent);
      setupGlobalScrollTracking(scrollParent);
    }

    // Check initial visibility
    checkVisibility();

    // Listen to scroll events on the scroll parent
    scrollParent.addEventListener('scroll', checkVisibility, { passive: true });

    return () => {
      scrollParent.removeEventListener('scroll', checkVisibility);
    };
  }, [enabled, checkVisibility]);

  return {
    ref: elementRef,
  };
};

