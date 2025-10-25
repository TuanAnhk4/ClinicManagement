// src/components/charts/SpecialtyDistributionChart.tsx
'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Định nghĩa kiểu dữ liệu cho props - giữ nguyên để code bên ngoài rõ ràng
interface ChartData {
  specialty: string;
  count: number;
}

interface SpecialtyDistributionChartProps {
  data: ChartData[];
}

type RechartsDataObject = { [key: string]: string | number };

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Sửa ở đây: Bỏ React.FC<SpecialtyDistributionChartProps>
// Thay vào đó, khai báo kiểu trực tiếp cho props
export const SpecialtyDistributionChart = ({ data }: SpecialtyDistributionChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">Không có dữ liệu phân bổ chuyên khoa.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data as unknown as RechartsDataObject[]}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          nameKey="specialty"
          // Sửa ở đây: Ép kiểu cho percent
          label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};