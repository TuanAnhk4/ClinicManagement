import React from 'react';

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType; // Kiểu dữ liệu chuẩn cho Icon Component
}