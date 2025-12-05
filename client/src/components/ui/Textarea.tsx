import * as React from 'react';
import { cn } from '@/lib/utils';

import { TextareaProps } from '@/types/ui';

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // --- Style Cơ Bản ---
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400",
          
          // --- Style Focus ---
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          
          // --- Style Disabled ---
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
          
          // --- Style Error (Nếu có lỗi thì viền đỏ) ---
          error && "border-red-500 focus-visible:ring-red-500 placeholder:text-red-300",

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };