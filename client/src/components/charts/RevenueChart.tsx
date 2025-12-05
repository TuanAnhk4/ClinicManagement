'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyStat } from '@/types/dashboard';
import { format, parseISO } from 'date-fns';

interface RevenueChartProps {
  data: DailyStat[];
}

// Format số tiền gọn cho trục Y (VD: 1.000.000 -> 1M)
const formatYAxis = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};

// Format số tiền đầy đủ cho Tooltip (VD: 1.500.000 ₫)
const formatCurrencyTooltip = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">
          {label ? format(parseISO(label), 'dd/MM/yyyy') : ''}
        </p>
        <p className="text-emerald-600 font-bold text-base">
          {formatCurrencyTooltip(payload[0].value)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Tổng doanh thu</p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data }: RevenueChartProps) => {
  // Kiểm tra dữ liệu rỗng
  const hasData = data && data.length > 0 && data.some(item => item.revenue > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Chưa có dữ liệu doanh thu.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* Định nghĩa Gradient màu xanh ngọc (Emerald) */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>

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
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={formatYAxis}
            width={40} // Đủ rộng để hiện số gọn (1M, 10M)
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1 }} />
          
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#059669" // Emerald-600 (đậm hơn fill)
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};