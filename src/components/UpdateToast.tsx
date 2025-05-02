import React, { useEffect, useState } from 'react';
import './UpdateToast.css'; // We'll create this CSS file next

interface UpdateToastProps {
  count: number | null;
  isUpToDate: boolean;
  visible: boolean;
  onDismiss: () => void; // Function to call when toast should hide
}

const UpdateToast: React.FC<UpdateToastProps> = ({ count, isUpToDate, visible, onDismiss }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    let timer: NodeJS.Timeout | null = null;
    if (visible) {
      // Automatically dismiss after 5 seconds
      timer = setTimeout(() => {
        setShow(false);
        onDismiss(); // Notify parent component to update state
      }, 5000);
    }
    // Clear timer on component unmount or when visibility changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, onDismiss]);

  if (!show) {
    return null;
  }

  const message = isUpToDate
    ? 'Feed is up to date!'
    : count !== null && count > 0
    ? `${count} new item${count > 1 ? 's' : ''} loaded.`
    : null; // Don't show if count is 0 but not explicitly "up to date"

  if (!message) return null; // Don't render if no message

  return (
    <div className={`update-toast ${isUpToDate ? 'up-to-date' : 'new-items'}`}>
      <span>{message}</span>
      <button onClick={() => { setShow(false); onDismiss(); }} className="dismiss-button">&times;</button>
    </div>
  );
};

export default UpdateToast;
