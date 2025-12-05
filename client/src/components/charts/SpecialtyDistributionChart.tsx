'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Định nghĩa interface khớp với dữ liệu API trả về
interface SpecialtyData {
  specialty: string;
  count: number;
  revenue?: number;
}

interface SpecialtyDistributionChartProps {
  data: SpecialtyData[];
}

// Bảng màu chuyên nghiệp hơn (Palette)
const COLORS = [
  '#3b82f6', // Blue-500
  '#10b981', // Emerald-500
  '#f59e0b', // Amber-500
  '#ef4444', // Red-500
  '#8b5cf6', // Violet-500
  '#ec4899', // Pink-500
  '#6366f1', // Indigo-500
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
        <p className="text-blue-600">
          Số lượng: <span className="font-medium">{data.value} ca</span>
        </p>
        <p className="text-gray-500 text-xs">
          (Chiếm {((data.payload.percent || 0) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export const SpecialtyDistributionChart = ({ data }: SpecialtyDistributionChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Chưa có dữ liệu chuyên khoa.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={data as any}
            cx="50%"
            cy="50%"
            innerRadius={60} // Donut Chart
            outerRadius={100}
            paddingAngle={2}
            dataKey="count"
            nameKey="specialty"
            stroke="none" // Bỏ viền trắng
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="middle" 
            align="right" // Đưa Legend sang bên phải cho cân đối
            layout="vertical" // Xếp dọc
            iconType="circle"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-600 ml-1">
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};