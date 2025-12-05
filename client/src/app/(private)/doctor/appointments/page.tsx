'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Calendar, Stethoscope, XCircle, CheckCircle, Clock } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

// Services & Types
import { appointmentService } from '@/services/appointment.service';
import { Appointment } from '@/types/appointments';
import { AppointmentStatus } from '@/types/enums';
import { useToast } from '@/hooks';

export default function DoctorAppointmentsPage() {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { success, error: toastError } = useToast();

  // 1. Tải danh sách lịch hẹn của chính Bác sĩ này
  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi API lấy lịch của "ME" (Bác sĩ đang login)
      const result = await appointmentService.getMyAppointmentsAsDoctor();
      setData(result);
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

  // 2. Định nghĩa cột
  const columns = useMemo<ColumnDef<Appointment>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Mã',
        cell: (info) => <span className="font-mono text-xs text-gray-400">#{info.getValue() as string}</span>,
      },
      {
        header: 'Thời Gian',
        accessorKey: 'appointmentTime',
        cell: ({ row }) => {
          const date = parseISO(row.original.appointmentTime);
          const isDateToday = isToday(date);
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base">
                  {format(date, 'HH:mm')}
                </span>
                {isDateToday && (
                  <Badge variant="success" className="px-1 py-0 text-[10px]">Hôm nay</Badge>
                )}
              </div>
              <span className="text-xs text-gray-500 capitalize">
                {format(date, 'EEEE, dd/MM/yyyy', { locale: vi })}
              </span>
            </div>
          );
        },
      },
      {
        header: 'Bệnh Nhân',
        accessorKey: 'patient',
        cell: ({ row }) => {
          const patient = row.original.patient;
          return (
            <div className="flex items-center gap-3">
               <Avatar className="h-9 w-9 border border-gray-200">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${patient?.fullName}&background=random`} />
                <AvatarFallback>BN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{patient?.fullName}</p>
                <p className="text-xs text-gray-500">{patient?.phoneNumber || 'Chưa cập nhật SĐT'}</p>
              </div>
            </div>
          );
        },
      },
      {
        header: 'Lý do khám',
        accessorKey: 'reason',
        cell: (info) => (
          <span className="text-sm text-gray-600 line-clamp-2 max-w-[200px]" title={info.getValue() as string}>
            {info.getValue() as string || 'Không có mô tả'}
          </span>
        ),
      },
      {
        header: 'Trạng Thái',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const statusConfig: Record<string, { color: any, label: string }> = {
            [AppointmentStatus.PENDING]: { color: 'warning', label: 'Chờ duyệt' },
            [AppointmentStatus.CONFIRMED]: { color: 'primary', label: 'Chờ khám' },
            [AppointmentStatus.COMPLETED]: { color: 'success', label: 'Đã khám' },
            [AppointmentStatus.CANCELLED]: { color: 'danger', label: 'Đã hủy' },
          };
          const config = statusConfig[status] || { color: 'default', label: status };
          
          return <Badge variant={config.color}>{config.label}</Badge>;
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
          const appt = row.original;
          const isConfirmed = appt.status === AppointmentStatus.CONFIRMED;
          const isPending = appt.status === AppointmentStatus.PENDING;

          return (
            <div className="flex items-center gap-2">
              {/* Nút BẮT ĐẦU KHÁM (Chỉ hiện khi đã xác nhận) */}
              {isConfirmed && (
                <Link href={`/doctor/consultation/${appt.id}`}>
                  <Button 
                    size="small" 
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1"
                  >
                    <Stethoscope size={16} />
                    Khám ngay
                  </Button>
                </Link>
              )}

              {/* Nút HỦY (Chỉ hiện khi chưa hoàn thành) */}
              {(isPending || isConfirmed) && (
                <Button 
                  variant="ghost" 
                  size="small" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleCancel(appt.id)}
                  title="Hủy lịch hẹn"
                >
                  <XCircle size={18} />
                </Button>
              )}

              {/* Nút XEM LẠI (Khi đã hoàn thành) */}
              {appt.status === AppointmentStatus.COMPLETED && (
                 <Link href={`/doctor/consultation/${appt.id}?mode=view`}>
                    <Button variant="outline" size="small">Xem hồ sơ</Button>
                 </Link>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // 3. Logic Lọc
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const term = searchTerm.toLowerCase();
      // Tìm theo tên bệnh nhân hoặc mã lịch
      const matchName = 
        item.patient?.fullName.toLowerCase().includes(term) ||
        item.id.toString().includes(term);
      
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchName && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  // 4. Handler Hủy
  const handleCancel = async (id: number) => {
    if (confirm('Bạn có muốn hủy lịch hẹn này không?')) {
      try {
        await appointmentService.cancel(id);
        success('Đã hủy lịch hẹn.');
        fetchData(); // Reload
      } catch (error) {
        toastError('Hủy lịch thất bại.');
      }
    }
  };

  const statusOptions = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Chờ khám (Confirmed)', value: AppointmentStatus.CONFIRMED },
    { label: 'Đã khám xong', value: AppointmentStatus.COMPLETED },
    { label: 'Chờ duyệt', value: AppointmentStatus.PENDING },
    { label: 'Đã hủy', value: AppointmentStatus.CANCELLED },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh Sách Lịch Hẹn</h1>
          <p className="text-sm text-gray-500">Quản lý bệnh nhân và bắt đầu ca khám.</p>
        </div>
        
        {/* Thống kê nhanh */}
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-100">
             <Clock size={16} />
             Hôm nay: {data.filter(i => isToday(parseISO(i.appointmentTime))).length} ca
           </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Tìm tên bệnh nhân..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select 
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table 
            data={filteredData} 
            columns={columns} 
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
}