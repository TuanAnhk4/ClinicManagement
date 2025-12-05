'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyStat } from '@/types/dashboard';
import { format, parseISO } from 'date-fns';

interface DailyAppointmentsChartProps {
  data: DailyStat[];
}

// --- SỬA LỖI TẠI ĐÂY ---
// Thay vì dùng TooltipProps<number, string> (dễ lỗi), ta dùng 'any' 
// Đây là cách xử lý tiêu chuẩn (standard workaround) cho Recharts Custom Tooltip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">
          {/* Format ngày: 2025-10-26 -> 26/10/2025 */}
          {label ? format(parseISO(label), 'dd/MM/yyyy') : ''}
        </p>
        <p className="text-blue-600 font-medium">
          Số ca khám: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};
// -----------------------

export const DailyAppointmentsChart = ({ data }: DailyAppointmentsChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Chưa có dữ liệu thống kê.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
            tickFormatter={(str) => {
              try {
                return format(parseISO(str), 'dd/MM');
              } catch {
                return str;
              }
            }}
          />
          
          <YAxis 
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }} />
          
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};