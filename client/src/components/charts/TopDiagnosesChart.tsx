'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TopDiagnosis } from '@/types/dashboard';

interface TopDiagnosesChartProps {
  data: TopDiagnosis[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm max-w-[250px]">
        <p className="font-semibold text-gray-800 mb-1 truncate">{label}</p>
        <p className="text-emerald-600 font-medium">
          Số lượng: {payload[0].value} ca
        </p>
      </div>
    );
  }
  return null;
};

export const TopDiagnosesChart = ({ data }: TopDiagnosesChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        Chưa có dữ liệu chẩn đoán.
      </div>
    );
  }

  // Màu sắc gradient nhẹ cho các cột
  const BAR_COLOR = "#10b981"; // emerald-500

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          
          <XAxis type="number" allowDecimals={false} hide />
          
          <YAxis 
            dataKey="diagnosis" 
            type="category" 
            width={120} // Tăng chiều rộng cho tên bệnh
            tick={{ fill: '#4b5563', fontSize: 12 }}
            tickFormatter={(value) => {
                // Cắt ngắn tên bệnh nếu quá dài (trên 15 ký tự)
                return value.length > 15 ? `${value.substring(0, 15)}...` : value;
            }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          
          <Bar 
            dataKey="count" 
            name="Số ca" 
            radius={[0, 4, 4, 0]} // Bo tròn đầu cột phải
            barSize={32}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};