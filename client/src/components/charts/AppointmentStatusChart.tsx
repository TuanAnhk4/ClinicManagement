'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AppointmentStatusStat } from '@/types/dashboard';

interface AppointmentStatusChartProps {
  data: AppointmentStatusStat[];
}

// 1. Cấu hình Màu sắc cho từng trạng thái
const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981', // Emerald-500 (Xanh lá) - Thành công
  CONFIRMED: '#3b82f6', // Blue-500 (Xanh dương) - Sắp tới
  PENDING:   '#f59e0b', // Amber-500 (Vàng) - Chờ
  CANCELLED: '#ef4444', // Red-500 (Đỏ) - Hủy
};

// 2. Cấu hình Nhãn hiển thị (Việt hóa)
const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Đã khám xong',
  CONFIRMED: 'Đã xác nhận',
  PENDING:   'Chờ duyệt',
  CANCELLED: 'Đã hủy',
};

// 3. Custom Tooltip (Bỏ qua lỗi ESLint cho payload any của Recharts)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          <span className="text-gray-600">
            Số lượng: <span className="font-medium text-gray-900">{data.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const AppointmentStatusChart = ({ data }: AppointmentStatusChartProps) => {
  // 4. Chuyển đổi dữ liệu API sang format của Recharts
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      name: STATUS_LABELS[item.status] || item.status, // Tên hiển thị
      value: item.count, // Giá trị
      color: STATUS_COLORS[item.status] || '#9ca3af', // Màu (Mặc định xám)
    })).filter(item => item.value > 0); // Chỉ hiện những trạng thái có dữ liệu
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Chưa có dữ liệu trạng thái.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={chartData}
            cx="50%" // Căn giữa ngang
            cy="50%" // Căn giữa dọc
            innerRadius={60} // Bán kính trong (Tạo hiệu ứng Donut)
            outerRadius={100} // Bán kính ngoài
            paddingAngle={2} // Khoảng cách giữa các miếng
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-600 font-medium ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};