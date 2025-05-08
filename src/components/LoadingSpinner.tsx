interface LoadingSpinnerProps {
  overlay?: boolean;
}

export const LoadingSpinner = ({ overlay = false }: LoadingSpinnerProps) => {
  const baseClasses = "flex items-center justify-center";
  const overlayClasses = overlay
    ? "absolute inset-0 bg-white/50 dark:bg-neutral-900/50 z-10"
    : "w-full h-full";

  return (
    <div className={`${baseClasses} ${overlayClasses}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
    </div>
  );
};
