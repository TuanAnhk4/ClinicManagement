'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { format, isFuture, parseISO, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  History, 
  Activity, 
  CalendarCheck, 
  User 
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

// Services & Hooks & Types
import { useAuth } from '@/hooks';
import { appointmentService } from '@/services/appointment.service';
import { Appointment } from '@/types/appointments';
import { AppointmentStatus } from '@/types/enums';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Tải dữ liệu lịch hẹn
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getMyAppointmentsAsPatient();
        setAppointments(data);
      } catch (error) {
        console.error('Lỗi tải dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // 2. Tính toán số liệu
  const stats = useMemo(() => {
    const upcoming = appointments.filter(a => 
      (a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING) &&
      isFuture(parseISO(a.appointmentTime))
    );
    
    const completed = appointments.filter(a => a.status === AppointmentStatus.COMPLETED);
    
    // Lấy lịch hẹn gần nhất sắp tới
    const nextAppointment = upcoming.sort((a, b) => 
      new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
    )[0];

    return {
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      nextAppointment,
    };
  }, [appointments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- 1. WELCOME HEADER --- */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/30 shadow-md">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random&color=fff`} />
              <AvatarFallback className="text-blue-600 bg-white font-bold text-xl">
                {user?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Xin chào, {user?.fullName}! 👋</h1>
              <p className="text-blue-100 mt-1">Chúc bạn một ngày tốt lành và tràn đầy sức khỏe.</p>
            </div>
          </div>
          
          <Link href="/patient/book-appointment">
            <Button 
              size="large" 
              className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-md font-bold group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Đặt Lịch Khám Mới
            </Button>
          </Link>
        </div>
      </div>

      {/* --- 2. STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Sắp tới */}
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Lịch hẹn sắp tới</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.upcomingCount}</h3>
          </div>
        </Card>

        {/* Card 2: Đã khám */}
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <History size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đã hoàn thành</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.completedCount}</h3>
          </div>
        </Card>

        {/* Card 3: Chỉ số sức khỏe (Placeholder cho tính năng sau này) */}
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow opacity-80">
          <div className="p-3 bg-purple-50 rounded-full text-purple-600">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">BMI hiện tại</p>
            <h3 className="text-2xl font-bold text-gray-900">{user?.bmi || '--'}</h3>
          </div>
        </Card>
      </div>

      {/* --- 3. NEXT APPOINTMENT (Lịch hẹn gần nhất) --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Lịch Hẹn Gần Nhất</h2>
          <Link href="/patient/my-appointments" className="text-sm text-blue-600 hover:underline font-medium">
            Xem tất cả
          </Link>
        </div>

        {stats.nextAppointment ? (
          <Card className="overflow-hidden border-blue-100">
            <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <Calendar size={18} />
                {format(parseISO(stats.nextAppointment.appointmentTime), "'Thứ' eeee, 'ngày' dd/MM/yyyy", { locale: vi })}
                {isToday(parseISO(stats.nextAppointment.appointmentTime)) && (
                  <Badge variant="success" className="ml-2">Hôm nay</Badge>
                )}
              </div>
              <Badge variant={stats.nextAppointment.status === 'CONFIRMED' ? 'primary' : 'warning'}>
                {stats.nextAppointment.status}
              </Badge>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4">
                   <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-lg w-16 h-16 flex-shrink-0">
                     <span className="text-xl font-bold leading-none">
                       {format(parseISO(stats.nextAppointment.appointmentTime), 'HH:mm')}
                     </span>
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900">Khám {stats.nextAppointment.doctor?.specialty?.name || 'Tổng quát'}</h3>
                     <div className="flex items-center gap-2 text-gray-600 mt-1">
                       <User size={16} /> 
                       <span>Bác sĩ: <span className="font-medium text-gray-900">{stats.nextAppointment.doctor?.fullName}</span></span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                        <MapPin size={16} /> 
                        Phòng khám HealthCare Center
                     </div>
                   </div>
                </div>
              </div>

              <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                 <p className="text-sm text-gray-500 font-medium mb-2 uppercase">Ghi chú / Triệu chứng</p>
                 <p className="text-gray-700 italic bg-gray-50 p-3 rounded-md text-sm">
                   &ldquo;{stats.nextAppointment.reason || 'Không có ghi chú'}&rdquo;
                 </p>
                 <div className="mt-4">
                    <Link href="/patient/my-appointments">
                       <Button variant="outline" size="small" className="w-full md:w-auto">Chi tiết</Button>
                    </Link>
                 </div>
              </div>
            </div>
          </Card>
        ) : (
          // Empty State
          <Card className="p-10 flex flex-col items-center justify-center text-center border-dashed border-gray-300 shadow-none bg-gray-50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <CalendarCheck className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Bạn không có lịch hẹn nào sắp tới</h3>
            <p className="text-gray-500 mt-1 mb-6 max-w-sm">
              Hãy đặt lịch khám định kỳ để theo dõi sức khỏe của bạn và gia đình tốt nhất.
            </p>
            <Link href="/patient/book-appointment">
              <Button>Đặt Lịch Ngay</Button>
            </Link>
          </Card>
        )}
      </div>

    </div>
  );
}