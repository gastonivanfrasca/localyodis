interface LoadingSpinnerProps {
  overlay?: boolean; // Make overlay prop optional
}

export const LoadingSpinner = ({ overlay = false }: LoadingSpinnerProps) => {
  const baseClasses = "flex flex-row gap-2 items-center p-2 rounded-lg animate-pulse";
  const positionClasses = overlay
    ? "absolute bottom-[120px] right-10 bg-transparent z-10" // Overlay styles (added z-index)
    : "flex justify-center items-center h-full w-full"; // Centered styles for initial load

  return (
    <div className={`${baseClasses} ${positionClasses}`}>
      <img src="/logo.png" alt="logo" className="h-8 w-8 animate-pulse" />
    </div>
  );
};
