'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Hàm gộp class bạn đã tạo ở bước trước

import { Toast, ToastType, ToastContextType } from '@/types';

export const ToastContext = createContext<ToastContextType | null>(null);

// --- UI COMPONENT: Hiển thị từng cái Toast ---
const ToastItem = ({ 
  id, 
  message, 
  type, 
  onClose 
}: { 
  id: string; 
  message: string; 
  type: ToastType; 
  onClose: (id: string) => void;
}) => {
  // Cấu hình icon và màu sắc dựa trên type
  const config = {
    success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', iconColor: 'text-green-500' },
    error:   { icon: AlertCircle, bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-800',   iconColor: 'text-red-500' },
    warning: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', iconColor: 'text-yellow-500' },
    info:    { icon: Info,        bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800',   iconColor: 'text-blue-500' },
  }[type];

  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "flex items-start w-full max-w-sm p-4 mb-4 border rounded-lg shadow-lg transition-all duration-300 animate-in slide-in-from-right-full",
        config.bg, 
        config.border
      )}
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon className={cn("w-5 h-5", config.iconColor)} />
      </div>
      <div className={cn("ml-3 text-sm font-medium", config.text)}>
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className={cn("ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:ring-2 focus:ring-offset-2", config.text, "hover:bg-black/5")}
      >
        <span className="sr-only">Close</span>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- PROVIDER ---
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);

    // Tự động xóa sau thời gian duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // Các hàm helper tiện lợi
  const success = (msg: string, duration?: number) => addToast(msg, 'success', duration);
  const error = (msg: string, duration?: number) => addToast(msg, 'error', duration);
  const warning = (msg: string, duration?: number) => addToast(msg, 'warning', duration);
  const info = (msg: string, duration?: number) => addToast(msg, 'info', duration);

  const value = { toasts, addToast, removeToast, success, error, warning, info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Container hiển thị Toast (Góc trên bên phải) */}
      <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {/* pointer-events-auto để click được vào toast, còn vùng trống thì click xuyên qua */}
        <div className="pointer-events-auto">
           {toasts.map((toast) => (
             <ToastItem 
               key={toast.id} 
               {...toast} 
               onClose={removeToast} 
             />
           ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};