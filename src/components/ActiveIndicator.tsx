interface ActiveIndicatorProps {
  isActive: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ActiveIndicator = ({ 
  isActive, 
  color = 'bg-blue-500', 
  size = 'sm',
  position = 'top-right' 
}: ActiveIndicatorProps) => {
  if (!isActive) return null;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} ${color} rounded-full border-2 border-white dark:border-gray-800`}
    />
  );
}; 