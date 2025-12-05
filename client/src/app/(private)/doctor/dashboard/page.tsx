'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, isToday, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarCheck, Play, Clock } from 'lucide-react';

// Components
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

// Hooks & Services
import { useAuth, useToast } from '@/hooks';
import { appointmentService } from '@/services/appointment.service';
import { Appointment } from '@/types/appointments';
import { AppointmentStatus } from '@/types/enums';

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'today' | 'all'>('today');

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { error: toastError } = useToast();

  // 1. Load Data
  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const result = await appointmentService.getMyAppointmentsAsDoctor();
          setAppointments(result);
        } catch (err) {
          console.error(err);
          toastError('Không thể tải lịch hẹn. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user, authLoading]);

  // 2. Filter Data
  const filteredAppointments = useMemo(() => {
    if (view === 'today') {
      return appointments.filter((app) => isToday(parseISO(app.appointmentTime)));
    }
    return appointments;
  }, [appointments, view]);

  // Loading State
  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <Spinner size="large" />
      </div>
    );
  }

  // Helper chọn màu Badge
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return 'primary';
      case AppointmentStatus.COMPLETED: return 'success';
      case AppointmentStatus.CANCELLED: return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, Dr. {user?.fullName}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <Clock size={16} />
            {format(new Date(), "'Hôm nay, ' EEEE, dd MMMM yyyy", { locale: vi })}
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('today')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              view === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* --- Danh sách --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CalendarCheck className="text-blue-600" />
          {view === 'today' ? 'Lịch khám hôm nay' : 'Toàn bộ lịch khám'}
          <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
            {filteredAppointments.length}
          </span>
        </h2>

        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <Card key={app.id} className="p-5 hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Thông tin trái */}
                <div className="flex items-center gap-4">
                  {/* Giờ khám */}
                  <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-xl w-16 h-16 flex-shrink-0">
                    <span className="text-lg font-bold leading-none">
                      {format(parseISO(app.appointmentTime), 'HH:mm')}
                    </span>
                    {view === 'all' && (
                      <span className="text-[10px] mt-1 font-medium">
                        {format(parseISO(app.appointmentTime), 'dd/MM')}
                      </span>
                    )}
                  </div>

                  {/* Info Bệnh nhân */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{app.patient?.fullName}</h3>
                      <Badge variant={getStatusBadge(app.status)} className="text-[10px] px-1.5 py-0">
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      Lý do: {app.reason || 'Không có mô tả'}
                    </p>
                  </div>
                </div>

                {/* Nút hành động */}
                {app.status === AppointmentStatus.CONFIRMED && (
                  <Button 
                    onClick={() => router.push(`/doctor/consultation/${app.id}`)}
                    className="w-full md:w-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                  >
                    <Play size={16} fill="currentColor" />
                    Bắt đầu khám
                  </Button>
                )}
                
                {app.status === AppointmentStatus.COMPLETED && (
                  <Button variant="outline" disabled className="w-full md:w-auto text-gray-400 border-gray-200">
                    Đã hoàn thành
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="bg-white p-4 rounded-full shadow-sm mb-3">
              <CalendarCheck className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium">Không có lịch hẹn nào.</p>
            <p className="text-gray-500 text-sm">Chúc bác sĩ một ngày làm việc vui vẻ!</p>
          </div>
        )}
      </div>
    </div>
  );
}