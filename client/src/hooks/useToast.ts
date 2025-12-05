import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { ToastContextType } from '@/types';

/**
 * Custom Hook để hiển thị thông báo (Toast)
 * Sử dụng: const { success, error } = useToast();
 * toast.success('Thành công!');
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  // Kiểm tra an toàn: Đảm bảo hook được gọi bên trong <ToastProvider>
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};