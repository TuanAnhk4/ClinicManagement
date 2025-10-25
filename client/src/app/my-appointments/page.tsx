'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link'; // Đảm bảo đã import Link

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [view, setView] = useState<'upcoming' | 'history'>('upcoming');
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/patient/me');
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError('Không thể tải lịch hẹn của bạn. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated, authLoading]);

  const handleCancel = async (appointmentId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        await api.patch(`/appointments/${appointmentId}/cancel`);
        fetchAppointments();
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        alert('Hủy lịch hẹn thất bại. Vui lòng thử lại.');
      }
    }
  };

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    // Chuyển đổi status thành AppointmentStatus enum nếu cần, hoặc giữ nguyên string nếu backend trả về string
    if (view === 'upcoming') {
      return appointments.filter(app => new Date(app.appointmentTime) >= now && app.status === AppointmentStatus.CONFIRMED);
    }
    // Lịch sử bao gồm các trạng thái khác CONFIRMED hoặc thời gian đã qua
    return appointments.filter(app => new Date(app.appointmentTime) < now || app.status !== AppointmentStatus.CONFIRMED);
  }, [appointments, view]);


  if (authLoading) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Lịch Hẹn Của Tôi</h1>

      {/* Hệ thống Tab */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setView('upcoming')}
          className={`py-2 px-1 font-semibold transition-colors ${
            view === 'upcoming'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Sắp Tới
        </button>
        <button
          onClick={() => setView('history')}
          className={`py-2 px-1 font-semibold transition-colors ${
            view === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Lịch Sử
        </button>
      </div>

      {/* Danh sách lịch hẹn */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            
            <Card key={app.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              {/* Thông tin lịch hẹn */}
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                {/* Ảnh đại diện bác sĩ có thể thêm lại nếu muốn */}
                <div>
                  <p className="font-bold text-lg">Dr. {app.doctor.fullName}</p>
                  <p className="text-sm text-gray-600">
                    🗓️ {new Date(app.appointmentTime).toLocaleDateString('vi-VN')} -
                    🕓 {new Date(app.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Trạng thái và Hành động */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                  app.status === AppointmentStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                  app.status === AppointmentStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  app.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800' // Thêm default case
                }`}>
                  {app.status}
                </span>

                {/* Nút Hủy cho tab Sắp tới */}
                {view === 'upcoming' && (
                  <Button size="small" variant="danger" onClick={() => handleCancel(app.id)}>
                    Hủy Lịch
                  </Button>
                )}

                {/* --- SỬA Ở ĐÂY --- */}
                {/* Nút Xem Chi Tiết cho tab Lịch sử (chỉ khi đã hoàn thành) */}
                {view === 'history' && app.status === AppointmentStatus.COMPLETED && (
                  <Link href={`/my-appointments/${app.id}`}>
                    {/* Bọc Button bên trong Link để giữ nguyên giao diện */}
                    <Button size="small" variant="secondary">
                      Xem Chi Tiết
                    </Button>
                  </Link>
                )}
                {/* --- KẾT THÚC SỬA --- */}

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Bạn không có lịch hẹn nào trong mục này.</p>
        </div>
      )}
    </div>
  );
}