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
    <div className="relative group">
      <button
        className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 relative ${activeClasses}`}
        onClick={onClick}
        title={label}
      >
        <div className="flex-shrink-0">
          {icon}
        </div>
        {children && (
          <div className="absolute -top-1 -right-1 z-10">
            {children}
          </div>
        )}
      </button>
      
      {/* Tooltip on hover */}
      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
}; 