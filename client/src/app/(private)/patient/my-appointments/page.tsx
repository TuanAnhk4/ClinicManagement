'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO, isPast } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, MapPin, XCircle, Eye, FileText, Filter } from 'lucide-react';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';

// Services & Types
import { appointmentService } from '@/services/appointment.service';
import { Appointment } from '@/types/appointments';
import { AppointmentStatus } from '@/types/enums';
import { useToast } from '@/hooks';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  
  const { success, error: toastError } = useToast();

  // 1. Tải dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getMyAppointmentsAsPatient();
      // Sắp xếp: Mới nhất lên đầu
      const sortedData = data.sort((a, b) => 
        new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()
      );
      setAppointments(sortedData);
    } catch (error) {
      console.error(error);
      toastError('Không thể tải danh sách lịch hẹn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Xử lý Hủy Lịch
  const handleCancel = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        await appointmentService.cancel(id);
        success('Đã hủy lịch hẹn thành công.');
        fetchData(); // Reload lại dữ liệu
      } catch (error) {
        toastError('Hủy lịch thất bại. Vui lòng thử lại.');
      }
    }
  };

  // 3. Định nghĩa cột cho bảng
  const columns = useMemo<ColumnDef<Appointment>[]>(
    () => [
      {
        header: 'Thời Gian',
        accessorKey: 'appointmentTime',
        cell: ({ row }) => {
          const date = parseISO(row.original.appointmentTime);
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Clock size={14} />
                <span>{format(date, 'HH:mm')}</span>
              </div>
              <span className="text-xs text-gray-500 capitalize">
                {format(date, 'EEEE, dd/MM/yyyy', { locale: vi })}
              </span>
            </div>
          );
        },
      },
      {
        header: 'Bác Sĩ',
        accessorKey: 'doctor', // Backend trả về object doctor
        cell: ({ row }) => {
          const doctor = row.original.doctor;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-blue-100">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${doctor?.fullName}&background=random`} />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{doctor?.fullName}</p>
                {/* Nếu backend có trả về specialty của doctor thì hiện, ko thì thôi */}
                {/* <p className="text-xs text-gray-500">{doctor?.specialty?.name}</p> */}
              </div>
            </div>
          );
        },
      },
      {
        header: 'Trạng Thái',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status;
          
          // Map trạng thái sang màu sắc và nhãn
          const statusConfig = {
            [AppointmentStatus.PENDING]: { color: 'warning', label: 'Chờ duyệt' },
            [AppointmentStatus.CONFIRMED]: { color: 'primary', label: 'Đã xác nhận' },
            [AppointmentStatus.COMPLETED]: { color: 'success', label: 'Đã khám' },
            [AppointmentStatus.CANCELLED]: { color: 'danger', label: 'Đã hủy' },
          };
          
          // TypeScript check
          const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return <Badge variant={config.color as any}>{config.label}</Badge>;
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
          const appt = row.original;
          const isCancelable = 
            (appt.status === AppointmentStatus.PENDING || appt.status === AppointmentStatus.CONFIRMED) &&
            !isPast(parseISO(appt.appointmentTime)); // Chỉ hủy được nếu chưa qua giờ khám

          return (
            <div className="flex items-center gap-2">
              {/* Nút Hủy */}
              {isCancelable && (
                <Button 
                  variant="ghost" 
                  size="small" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleCancel(appt.id)}
                  title="Hủy lịch"
                >
                  <XCircle size={18} /> <span className="ml-1 text-xs">Hủy</span>
                </Button>
              )}

              {/* Nút Xem Kết Quả (Chỉ hiện khi đã khám xong) */}
              {appt.status === AppointmentStatus.COMPLETED && (
                <Link href={`/patient/records/${appt.id}`}> 
                  <Button variant="outline" size="small" className="flex items-center gap-1 text-xs">
                    <FileText size={14} /> Kết quả
                  </Button>
                </Link>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // 4. Lọc dữ liệu theo Tab
  const filteredData = useMemo(() => {
    if (activeTab === 'upcoming') {
      return appointments.filter(a => 
        a.status === AppointmentStatus.PENDING || 
        a.status === AppointmentStatus.CONFIRMED
      );
    } else {
      return appointments.filter(a => 
        a.status === AppointmentStatus.COMPLETED || 
        a.status === AppointmentStatus.CANCELLED
      );
    }
  }, [appointments, activeTab]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Quản Lý Lịch Hẹn
          </h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi trạng thái và lịch sử khám bệnh của bạn.</p>
        </div>
        
        <Link href="/patient/book-appointment">
          <Button className="shadow-lg shadow-blue-200">
            + Đặt Lịch Mới
          </Button>
        </Link>
      </div>

      {/* Tabs Chuyển đổi */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-4 text-sm font-medium transition-all relative ${
            activeTab === 'upcoming' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sắp tới ({appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length})
          {activeTab === 'upcoming' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-medium transition-all relative ${
            activeTab === 'history' 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Lịch sử ({appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED').length})
          {activeTab === 'history' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>
          )}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="large" />
        </div>
      ) : filteredData.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table 
            data={filteredData} 
            columns={columns} 
            pageSize={10}
          />
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có lịch hẹn nào</h3>
          <p className="text-gray-500 text-sm mb-6">
            {activeTab === 'upcoming' 
              ? 'Bạn không có lịch hẹn nào sắp tới.' 
              : 'Bạn chưa có lịch sử khám bệnh nào.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link href="/patient/book-appointment">
              <Button variant="outline">Đặt lịch ngay</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}