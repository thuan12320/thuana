import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1c1917]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1c1917]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1c1917]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1c1917]',
  };

  return (
    <div className={`relative group inline-flex ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute ${positionClasses[position]} z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-[#1c1917] rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 transform scale-95 group-hover:scale-100 pointer-events-none`}
      >
        {content}
        <div
          className={`absolute border-4 border-transparent ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
};
