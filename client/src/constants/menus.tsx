import {
  LayoutDashboard,
  UserCog,
  Users,
  CalendarDays,
  FileText,
  Settings,
  Home,
  PlusCircle,
  History,
  Stethoscope,
  CalendarClock,
  Activity // 1. Thêm icon mới cho Chuyên Khoa
} from 'lucide-react';
import { API_URLS } from './api-urls';

import { MenuItem } from '@/types';

/**
 * 1. MENU CỦA ADMIN
 * Quản lý hệ thống, người dùng và thống kê
 */
export const ADMIN_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard', // Tôi viết gọn lại cho dễ đọc (hoặc dùng logic replace cũ cũng được)
    icon: LayoutDashboard,
  },
  {
    label: 'Quản lý Bác Sĩ',
    href: '/admin/doctors',
    icon: Stethoscope,
  },
  {
    label: 'Quản lý Bệnh Nhân',
    href: '/admin/patients',
    icon: Users,
  },
  {
    // --- MỤC MỚI THÊM VÀO ---
    label: 'Quản lý Chuyên Khoa',
    href: '/admin/specialties',
    icon: Activity, 
  },
  {
    label: 'Quản lý Thuốc', // Tiện thể thêm luôn cho bạn nếu cần
    href: '/admin/medicines',
    icon: CalendarDays, // Tạm dùng icon này hoặc Pill nếu có
  },
  {
    label: 'Quản lý Lịch Hẹn', // Tiện thể thêm luôn
    href: '/admin/appointments',
    icon: CalendarClock,
  },
  // {
  //   label: 'Cài đặt hệ thống',
  //   href: '/admin/settings',
  //   icon: Settings,
  // },
];

/**
 * 2. MENU CỦA BÁC SĨ (DOCTOR)
 * Quản lý lịch làm việc, khám bệnh
 */
export const DOCTOR_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/doctor/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Lịch Làm Việc',
    href: '/doctor/schedule',
    icon: CalendarClock, 
  },
  {
    label: 'Danh sách Lịch Hẹn', // Đổi tên cho rõ nghĩa hơn
    href: '/doctor/appointments',
    icon: Users,
  },
  {
    label: 'Tài liệu / Hồ sơ',
    href: '/doctor/documents',
    icon: FileText,
  },
  {
    label: 'Cài đặt tài khoản',
    href: '/doctor/settings',
    icon: Settings,
  },
];

/**
 * 3. MENU CỦA BỆNH NHÂN (PATIENT)
 * Đặt lịch, xem lịch sử
 */
export const PATIENT_MENU: MenuItem[] = [
  {
    label: 'Tổng Quan',
    href: '/patient', 
    icon: Home,
  },
  {
    label: 'Đặt Lịch Khám',
    href: '/patient/book-appointment',
    icon: PlusCircle,
  },
  {
    label: 'Lịch Hẹn Của Tôi',
    href: '/patient/my-appointments',
    icon: History,
  },
  {
    label: 'Hồ Sơ Cá Nhân',
    href: '/patient/profile',
    icon: UserCog,
  },
];