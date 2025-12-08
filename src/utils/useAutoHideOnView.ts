import { useEffect, useRef, useCallback } from 'react';

interface UseAutoHideOnViewOptions {
  /** Whether auto-hide is enabled (default: true) */
  enabled?: boolean;
  /** Callback when item should be hidden */
  onHide: () => void;
}

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
 * This prevents layout shift since items below are not affected.
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
        onHideRef.current();
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

