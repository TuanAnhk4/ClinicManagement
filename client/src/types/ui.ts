import React from 'react';

import { ColumnDef } from '@tanstack/react-table';

export interface UIContextType {
  // Quản lý Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;

  // Quản lý Global Loading
  isGlobalLoading: boolean;
  showGlobalLoading: () => void;
  hideGlobalLoading: () => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
}

// --- Input Types ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

// --- Modal Types ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// --- Select Types ---
export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: boolean;
  placeholder?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean; // Prop để hiển thị trạng thái lỗi (viền đỏ)
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'white' | 'gray';
}

// --- Badge Types ---
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

// --- Select Types ---
export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[]; // Danh sách các lựa chọn
  error?: boolean;          // Hiển thị viền đỏ khi có lỗi
  placeholder?: string;     // Dòng chữ mờ đầu tiên
}

// --- Modal Types ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// --- Table Types ---
// Lưu ý: Đây là Generic Interface (có <T>)
export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  pageSize?: number;
}