import * as React from 'react';
import { cn } from '@/lib/utils';

import { SelectProps } from '@/types/ui';

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, options, error, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            // --- Style Cơ Bản ---
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400",
            
            // --- Style Focus ---
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            
            // --- Style Disabled ---
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            
            // --- Style Error ---
            error && "border-red-500 focus:ring-red-500 text-red-900",
            
            className
          )}
          ref={ref}
          {...props}
        >
          {/* Render Placeholder nếu có (làm option đầu tiên, bị disable) */}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {/* Cách 1: Truyền qua mảng options */}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : // Cách 2: Truyền qua children (thủ công)
              children}
        </select>
        
        {/* Icon mũi tên xuống (Tùy chọn: Tailwind mặc định select đã có icon, 
            nhưng nếu muốn custom thì thêm absolute div ở đây) */}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };