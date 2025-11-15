'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { DailyAppointmentsChart } from '@/components/charts/DailyAppointmentsChart';
import { TopDiagnosesChart } from '@/components/charts/TopDiagnosesChart';
import { SpecialtyDistributionChart } from '@/components/charts/SpecialtyDistributionChart';

interface ForecastData {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

// Định nghĩa kiểu dữ liệu cho state
interface DashboardData {
  dailyAppointments: { date: string; count: number }[];
  monthlyAppointments: { month: string; count: number }[]; // Mặc dù chưa vẽ biểu đồ tháng
  topDiagnoses: { diagnosis: string; count: number }[];
  specialtyDistribution: { specialty: string; count: number }[];
}

interface PeakTimeData {
  peak_hour: string;
  peak_day: string;
}

export default function AdminDashboardPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          // Gọi đồng thời tất cả API bằng Promise.all
          const [dailyRes, monthlyRes, diagnosesRes, specialtyRes,] = await Promise.all([
            api.get('/dashboard/daily-appointments'),
            api.get('/dashboard/monthly-appointments'), // Vẫn gọi để có dữ liệu nếu muốn thêm sau
            api.get('/dashboard/top-diagnoses'),
            api.get('/dashboard/specialty-distribution'),
            // Thêm API revenue nếu có
          ]);

          setData({
            dailyAppointments: dailyRes.data,
            monthlyAppointments: monthlyRes.data,
            topDiagnoses: diagnosesRes.data,
            specialtyDistribution: specialtyRes.data,
          });

        } catch (err) {
          console.error("Lỗi khi tải dữ liệu dashboard:", err);
          setError('Không thể tải dữ liệu thống kê.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, authLoading]);

  // Xử lý trạng thái loading và error
  if (authLoading || loading) {
    return <div className="p-8">Đang tải dữ liệu dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }
  if (!data) {
    return <div className="p-8">Không có dữ liệu để hiển thị.</div>;
  }

  // Render giao diện dashboard
  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Tổng Quan</h1>

      {/* Hàng 1: Biểu đồ đường + Biểu đồ tròn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Số Ca Khám Hoàn Thành (30 Ngày Qua)</h2>
          <DailyAppointmentsChart data={data.dailyAppointments} />
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Phân Bổ Theo Chuyên Khoa (30 Ngày Qua)</h2>
          <SpecialtyDistributionChart data={data.specialtyDistribution} />
        </Card>
      </div>

      {/* Hàng 2: Biểu đồ cột */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top 5 Chẩn Đoán Phổ Biến (30 Ngày Qua)</h2>
        <TopDiagnosesChart data={data.topDiagnoses} />
      </Card>

    </div>
  );
}