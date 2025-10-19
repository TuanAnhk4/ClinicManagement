// src/components/ui/Modal.tsx

import React from 'react';

// Định nghĩa các props mà Modal nhận vào
interface ModalProps {
  isOpen: boolean; // Trạng thái đóng/mở, được điều khiển từ bên ngoài
  onClose: () => void; // Hàm để đóng Modal, được gọi từ bên trong
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, children, className = '' }: ModalProps) => {
  // Nếu Modal không mở, không hiển thị gì cả
  if (!isOpen) return null;

  // Xử lý việc click vào vùng nền để đóng Modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Chỉ đóng nếu click trực tiếp vào vùng nền, không phải vào nội dung bên trong
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Lớp phủ nền (Overlay/Backdrop)
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      {/* Khung chứa nội dung Modal (Panel) */}
      <div
        className={`relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl ${className}`}
      >
        {/* Nút đóng Modal (dấu X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-semibold text-gray-500 hover:text-gray-800"
          aria-label="Close modal"
        >
          &times; {/* Đây là ký tự dấu 'X' */}
        </button>
        
        {/* Nội dung được truyền từ bên ngoài */}
        {children}
      </div>
    </div>
  );
};