'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Định nghĩa Interface cho dữ liệu đầu vào của biểu đồ này
// (Dùng chung cho cả Giờ và Thứ)
export interface PeakChartData {
  label: string; // Ví dụ: "08:00", "Thứ 2"
  value: number; // Số lượng khách
}

interface PeakTimeChartProps {
  data: PeakChartData[];
  color?: string; // Tùy chọn màu chủ đạo
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-blue-600 font-medium">
          Lượng khách: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const PeakTimeChart = ({ data, color = "#3b82f6" }: PeakTimeChartProps) => {
  // Tìm giá trị lớn nhất để highlight cột đó
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Chưa có dữ liệu phân tích.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
          />
          
          <YAxis 
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]} // Bo tròn đầu trên của cột
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                // Highlight cột cao nhất bằng màu đậm, các cột khác nhạt hơn
                fill={entry.value === maxValue ? '#2563eb' : '#93c5fd'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};