import React from 'react';

type SidebarButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const SidebarButton = ({ 
  icon, 
  label, 
  isActive = false, 
  onClick, 
  children 
}: SidebarButtonProps) => {
  const activeClasses = isActive
    ? "bg-blue-50 dark:bg-blue-900/20 text-[#1e7bc0] border-r-3 border-[#1e7bc0] shadow-sm"
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-gray-100";

  return (
    <button
      className={`flex items-center gap-3 w-full p-3 rounded-l-lg transition-all duration-200 relative ${activeClasses}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm font-medium truncate">
        {label}
      </span>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </button>
  );
}; 