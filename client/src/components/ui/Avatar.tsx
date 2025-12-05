'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';


// 1. Tạo Context để quản lý trạng thái tải ảnh
type AvatarContextValue = {
  status: 'loading' | 'error' | 'loaded';
  setStatus: React.Dispatch<React.SetStateAction<'loading' | 'error' | 'loaded'>>;
};

const AvatarContext = React.createContext<AvatarContextValue | undefined>(undefined);

// 2. Component Gốc (Wrapper)
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [status, setStatus] = React.useState<'loading' | 'error' | 'loaded'>('loading');

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

// 3. Component Ảnh (Image)
const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt, ...props }, ref) => {
  const context = React.useContext(AvatarContext);

  if (!context) {
    throw new Error("AvatarImage must be used within an Avatar component");
  }

  const { setStatus, status } = context;

  // Reset status khi src thay đổi
  React.useLayoutEffect(() => {
    if (!src) {
      setStatus('error');
    } else {
      setStatus('loading');
    }
  }, [src, setStatus]);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn(
        "aspect-square h-full w-full object-cover",
        // Ẩn ảnh nếu đang loading hoặc lỗi để hiển thị Fallback ở dưới
        status !== 'loaded' && "hidden", 
        className
      )}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

// 4. Component Dự phòng (Fallback - Hiển thị khi ảnh lỗi hoặc đang tải)
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(AvatarContext);
  
  // Nếu ảnh đã load xong thì ẩn fallback đi
  if (context && context.status === 'loaded') {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-500 font-medium",
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };