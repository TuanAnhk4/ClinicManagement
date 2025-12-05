'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Search, Filter, Calendar, User as UserIcon, XCircle, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale'; // Format tiếng Việt

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

export default function AdminAppointmentsPage() {
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { success, error: toastError } = useToast();

  // 1. Tải dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await appointmentService.getAll();
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
        header: 'Mã Lịch',
        cell: (info) => <span className="font-mono text-xs text-gray-500">#{info.getValue() as string}</span>,
      },
      {
        header: 'Thời Gian',
        accessorKey: 'appointmentTime',
        cell: ({ row }) => {
          const date = parseISO(row.original.appointmentTime);
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {format(date, 'HH:mm')}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {format(date, 'EEEE, dd/MM/yyyy', { locale: vi })}
              </span>
            </div>
          );
        },
      },
      {
        header: 'Bác Sĩ',
        accessorKey: 'doctor',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${row.original.doctor?.fullName}&background=random`} />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900">{row.original.doctor?.fullName}</p>
              {/* Nếu có specialty thì hiện ở đây */}
            </div>
          </div>
        ),
      },
      {
        header: 'Bệnh Nhân',
        accessorKey: 'patient',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
             <Avatar className="h-8 w-8">
              <AvatarFallback>BN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{row.original.patient?.fullName}</span>
              <span className="text-xs text-gray-500">{row.original.patient?.phoneNumber || '---'}</span>
            </div>
          </div>
        ),
      },
      {
        header: 'Lý do khám',
        accessorKey: 'reason',
        cell: (info) => (
          <span className="text-sm text-gray-600 truncate max-w-[150px] block" title={info.getValue() as string}>
            {info.getValue() as string || 'Không có'}
          </span>
        ),
      },
      {
        header: 'Trạng Thái',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const statusMap: Record<string, { color: any, label: string }> = {
            [AppointmentStatus.PENDING]: { color: 'warning', label: 'Chờ duyệt' },
            [AppointmentStatus.CONFIRMED]: { color: 'primary', label: 'Đã xác nhận' },
            [AppointmentStatus.COMPLETED]: { color: 'success', label: 'Hoàn thành' },
            [AppointmentStatus.CANCELLED]: { color: 'danger', label: 'Đã hủy' },
          };
          const config = statusMap[status] || { color: 'default', label: status };
          
          return <Badge variant={config.color}>{config.label}</Badge>;
        },
      },
      {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => {
          const appt = row.original;
          // Chỉ cho phép hủy nếu chưa hoàn thành và chưa hủy
          const canCancel = appt.status === AppointmentStatus.PENDING || appt.status === AppointmentStatus.CONFIRMED;
          
          return (
            <div className="flex items-center gap-2">
              {canCancel && (
                <Button 
                  variant="ghost" 
                  size="small" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleCancel(appt.id)}
                  title="Hủy lịch hẹn"
                >
                  <XCircle size={18} />
                </Button>
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
      // Filter by Search (Tên bác sĩ hoặc tên bệnh nhân)
      const term = searchTerm.toLowerCase();
      const matchName = 
        item.doctor?.fullName.toLowerCase().includes(term) || 
        item.patient?.fullName.toLowerCase().includes(term);
      
      // Filter by Status
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchName && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  // 4. Handler Hủy Lịch
  const handleCancel = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
      try {
        await appointmentService.cancel(id);
        success('Đã hủy lịch hẹn thành công.');
        fetchData(); // Reload data
      } catch (error) {
        toastError('Hủy lịch thất bại.');
      }
    }
  };

  // Options cho Select trạng thái
  const statusOptions = [
    { label: 'Tất cả trạng thái', value: 'ALL' },
    { label: 'Chờ duyệt', value: AppointmentStatus.PENDING },
    { label: 'Đã xác nhận', value: AppointmentStatus.CONFIRMED },
    { label: 'Hoàn thành', value: AppointmentStatus.COMPLETED },
    { label: 'Đã hủy', value: AppointmentStatus.CANCELLED },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Lịch Hẹn</h1>
          <p className="text-sm text-gray-500">Theo dõi và điều phối lịch khám toàn hệ thống.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Calendar size={16} />
            Tổng số: {filteredData.length} lịch
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Tìm theo tên Bác sĩ hoặc Bệnh nhân..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter Status */}
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