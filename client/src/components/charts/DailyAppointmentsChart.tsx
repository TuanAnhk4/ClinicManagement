// src/components/charts/DailyAppointmentsChart.tsx
'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Định nghĩa kiểu dữ liệu cho props
interface ChartData {
  date: string;
  count: number;
}

interface DailyAppointmentsChartProps {
  data: ChartData[];
}

export const DailyAppointmentsChart: React.FC<DailyAppointmentsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">Không có dữ liệu số ca khám hàng ngày.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số ca khám" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};