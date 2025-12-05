'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Activity 
} from 'lucide-react';

// Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DailyAppointmentsChart } from '@/components/charts/DailyAppointmentsChart';
import { TopDiagnosesChart } from '@/components/charts/TopDiagnosesChart';
import { SpecialtyDistributionChart } from '@/components/charts/SpecialtyDistributionChart';
import { RevenueChart } from '@/components/charts/RevenueChart'; // Mới
import { AppointmentStatusChart } from '@/components/charts/AppointmentStatusChart'; // Mới
import { PeakTimeChart } from '@/components/charts/PeakTimeChart'; // Mới
import { ChartSkeleton } from '@/components/charts/ChartSkeleton';
import { Spinner } from '@/components/ui/Spinner';

// Services & Types
import { dashboardService } from '@/services/dashboard.service';
import { 
  OverviewStats, 
  DailyStat, 
  TopDiagnosis, 
  AppointmentStatusStat, 
  DoctorPerformance,
  UpcomingAppointment
} from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // State dữ liệu
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topDiagnoses, setTopDiagnoses] = useState<TopDiagnosis[]>([]);
  const [statusStats, setStatusStats] = useState<AppointmentStatusStat[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [specialtyStats, setSpecialtyStats] = useState<any[]>([]); // Tạm dùng any nếu chưa có type chính xác cho cái này

  // State Peak Time (Giả lập hoặc gọi API nếu bạn đã làm endpoint getPeakTimes)
  const [peakTimeData, setPeakTimeData] = useState([
    { label: '08:00', value: 12 },
    { label: '09:00', value: 19 },
    { label: '10:00', value: 15 },
    { label: '14:00', value: 22 }, // Cao điểm
    { label: '15:00', value: 18 },
    { label: '16:00', value: 10 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          overviewData,
          dailyData,
          diagnosesData,
          statusData,
          // specialtyData (nếu có API riêng)
        ] = await Promise.all([
          dashboardService.getOverviewStats(),
          dashboardService.getDailyStats(),
          dashboardService.getTopDiagnoses(),
          dashboardService.getAppointmentStatusStats(),
        ]);

        setOverview(overviewData);
        setDailyStats(dailyData);
        setTopDiagnoses(diagnosesData);
        setStatusStats(statusData);
        
        // Fake data cho biểu đồ tròn nếu chưa có API
        setSpecialtyStats([
           { specialty: 'Tim Mạch', count: 35 },
           { specialty: 'Nha Khoa', count: 20 },
           { specialty: 'Da Liễu', count: 15 },
           { specialty: 'Nhi Khoa', count: 30 },
        ]);

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* --- 1. KPI CARDS (Tổng Quan) --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Tổng Doanh Thu" 
          value={formatCurrency(overview?.totalRevenue || 0)} 
          icon={DollarSign} 
          trend="+12.5%" 
          color="text-emerald-600"
          bg="bg-emerald-100"
        />
        <KpiCard 
          title="Tổng Lịch Hẹn" 
          value={overview?.totalAppointments || 0} 
          icon={CalendarCheck} 
          trend="+5.2%" 
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <KpiCard 
          title="Bệnh Nhân" 
          value={overview?.totalPatients || 0} 
          icon={Users} 
          trend="+8.1%" 
          color="text-purple-600"
          bg="bg-purple-100"
        />
        <KpiCard 
          title="Bác Sĩ" 
          value={overview?.totalDoctors || 0} 
          icon={User} 
          color="text-orange-600"
          bg="bg-orange-100"
        />
      </section>

      {/* --- 2. BIỂU ĐỒ TÀI CHÍNH & XU HƯỚNG --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu Hướng Doanh Thu</CardTitle>
            <CardDescription>Tổng doanh thu trong 30 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={dailyStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Số Ca Khám Hoàn Thành</CardTitle>
            <CardDescription>Thống kê lượng khách theo ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyAppointmentsChart data={dailyStats} />
          </CardContent>
        </Card>
      </div>

      {/* --- 3. PHÂN TÍCH HIỆU SUẤT & TRẠNG THÁI --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Biểu đồ Tròn: Trạng thái lịch */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tỷ Lệ Lịch Hẹn</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentStatusChart data={statusStats} />
          </CardContent>
        </Card>

        {/* Biểu đồ Cột: Giờ cao điểm */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Phân Tích Giờ Cao Điểm
            </CardTitle>
            <CardDescription>Khung giờ có lượng đặt lịch nhiều nhất (Dữ liệu giả lập)</CardDescription>
          </CardHeader>
          <CardContent>
            <PeakTimeChart data={peakTimeData} />
          </CardContent>
        </Card>
      </div>

      {/* --- 4. PHÂN TÍCH BỆNH LÝ & CHUYÊN KHOA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Bệnh Phổ Biến</CardTitle>
          </CardHeader>
          <CardContent>
            <TopDiagnosesChart data={topDiagnoses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân Bổ Theo Chuyên Khoa</CardTitle>
          </CardHeader>
          <CardContent>
            <SpecialtyDistributionChart data={specialtyStats} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

// --- Component con hiển thị thẻ KPI ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KpiCard = ({ title, value, icon: Icon, trend, color, bg }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className="text-xs font-medium text-emerald-600 flex items-center mt-2">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend} so với tháng trước
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);