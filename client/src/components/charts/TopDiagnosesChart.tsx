// src/components/charts/TopDiagnosesChart.tsx
'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  diagnosis: string;
  count: number;
}

interface TopDiagnosesChartProps {
  data: ChartData[];
}

export const TopDiagnosesChart: React.FC<TopDiagnosesChartProps> = ({ data }) => {
   if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">Không có dữ liệu chẩn đoán phổ biến.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} />
        <YAxis dataKey="diagnosis" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" name="Số ca" />
      </BarChart>
    </ResponsiveContainer>
  );
};