import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Hàm tiện ích để gộp và xử lý xung đột class Tailwind
 * Sử dụng: className={cn("text-red-500", isActive && "text-blue-500", className)}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hàm định dạng tiền tệ Việt Nam (VND)
 * Sử dụng: formatCurrency(50000) -> "50.000 ₫"
 */
export function formatCurrency(amount: number | string): string {
  const value = Number(amount);
  if (isNaN(value)) return '0 ₫';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

/**
 * Hàm định dạng ngày tháng (DD/MM/YYYY)
 * Sử dụng: formatDate("2025-10-26") -> "26/10/2025"
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN').format(date);
}