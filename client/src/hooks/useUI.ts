import { useContext } from 'react';
import { UIContext } from '@/contexts/UIContext';
import { UIContextType } from '@/types/ui';

/**
 * Custom Hook để điều khiển giao diện (Sidebar, Loading...)
 * Sử dụng: const { toggleSidebar, showGlobalLoading } = useUI();
 */
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);

  // Kiểm tra an toàn: Đảm bảo hook được gọi bên trong <UIProvider>
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }

  return context;
};