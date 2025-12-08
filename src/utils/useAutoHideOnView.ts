import { useCallback, useEffect, useRef } from 'react';

interface UseAutoHideOnViewOptions {
  /** Whether auto-hide is enabled (default: true) */
  enabled?: boolean;
  /** Callback when item should be marked as read */
  onMarkAsRead: () => void;
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
 * Hook that marks an item as read when it exits through the top of the scroll container.
 * The item stays visible but will be hidden on next page load.
 */
export const useAutoHideOnView = ({
  enabled = true,
  onMarkAsRead,
}: UseAutoHideOnViewOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasBeenMarkedRef = useRef(false);
  const wasVisibleRef = useRef(false);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  
  // Store callback in a ref to avoid re-running the effect when it changes
  const onMarkAsReadRef = useRef(onMarkAsRead);
  onMarkAsReadRef.current = onMarkAsRead;

  const checkVisibility = useCallback(() => {
    if (!enabled || hasBeenMarkedRef.current) return;
    
    const element = elementRef.current;
    const scrollParent = scrollParentRef.current;
    
    if (!element || !scrollParent) return;
    
    const elementRect = element.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();
    
    // Check if element is currently visible within scroll parent
    const isVisible = elementRect.bottom > parentRect.top && elementRect.top < parentRect.bottom;
    
    if (isVisible) {
      wasVisibleRef.current = true;
    } else if (wasVisibleRef.current && !hasBeenMarkedRef.current) {
      // Element was visible but now it's not
      // Check if it exited through the top (element is above the scroll container)
      const exitedThroughTop = elementRect.bottom <= parentRect.top;
      
      if (exitedThroughTop) {
        hasBeenMarkedRef.current = true;
        // Mark as read - item stays visible but won't appear on next load
        onMarkAsReadRef.current();
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || hasBeenMarkedRef.current) {
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

