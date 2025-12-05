'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { DoctorScheduleForm } from '@/components/forms/schedule/DoctorScheduleForm';

// Services & Types & Hooks
import { doctorScheduleService } from '@/services/doctor-schedule.service';
import { DoctorSchedule } from '@/types/doctor-schedules';
import { useToast } from '@/hooks';

// Helper map ngày trong tuần
const DAY_MAP: Record<number, string> = {
  0: 'Chủ Nhật',
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
};

// Helper map màu cho Badge ngày
const DAY_COLOR_MAP: Record<number, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
  0: 'danger',   // CN - Đỏ
  1: 'primary',  // T2 - Xanh
  2: 'secondary',
  3: 'secondary',
  4: 'secondary',
  5: 'secondary',
  6: 'warning',  // T7 - Vàng
};

export default function DoctorSchedulePage() {
  const [data, setData] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DoctorSchedule | null>(null);

  const { success, error: toastError } = useToast();

  // 1. Tải dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await doctorScheduleService.getMySchedules();
      // Sắp xếp theo thứ tự: Ngày (0-6) -> Giờ bắt đầu
      const sortedResult = result.sort((a, b) => {
        if (a.dayOfWeek === b.dayOfWeek) {
          return a.startTime.localeCompare(b.startTime);
        }
        // Đưa Thứ 2 (1) lên đầu, Chủ Nhật (0) xuống cuối nếu muốn (Logic hiển thị VN)
        // Ở đây mình sort thuần theo số 0-6
        return a.dayOfWeek - b.dayOfWeek;
      });
      setData(sortedResult);
    } catch (error) {
      console.error(error);
      toastError('Không thể tải lịch làm việc.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Định nghĩa cột bảng
  const columns = useMemo<ColumnDef<DoctorSchedule>[]>(
    () => [
      {
        accessorKey: 'dayOfWeek',
        header: 'Ngày Trong Tuần',
        cell: (info) => {
          const day = info.getValue() as number;
          return (
            <Badge variant={DAY_COLOR_MAP[day] || 'default'}>
              {DAY_MAP[day] || 'Không xác định'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'startTime', // Cell ảo gộp cả start và end
        header: 'Khung Giờ',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Clock size={16} className="text-blue-500" />
            <span>
              {row.original.startTime.slice(0, 5)} - {row.original.endTime.slice(0, 5)}
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => handleEdit(row.original)}
              title="Sửa giờ làm"
            >
              <Pencil size={16} className="text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => handleDelete(row.original.id)}
              title="Xóa giờ làm"
            >
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // 3. Handlers
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: DoctorSchedule) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa khung giờ này không?')) {
      try {
        await doctorScheduleService.delete(id);
        success('Đã xóa khung giờ thành công.');
        fetchData();
      } catch (error) {
        toastError('Xóa thất bại. Vui lòng thử lại.');
      }
    }
  };

  const handleSaveSuccess = () => {
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch Làm Việc Của Tôi</h1>
          <p className="text-sm text-gray-500">Thiết lập các khung giờ bạn sẽ nhận khám bệnh.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={18} /> Thêm Khung Giờ
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {data.length > 0 ? (
             <Table 
               data={data} 
               columns={columns} 
               pageSize={20} // Hiện nhiều hơn vì lịch tuần chỉ có vài dòng
             />
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Chưa có lịch làm việc</h3>
              <p className="text-gray-500 mt-1 mb-4">Bạn cần thiết lập giờ làm việc để bệnh nhân có thể đặt lịch.</p>
              <Button onClick={handleCreate}>Tạo Lịch Ngay</Button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Sửa Khung Giờ' : 'Đăng Ký Giờ Làm Việc'}
        size="md"
      >
        <DoctorScheduleForm 
          initialData={editingItem}
          onSave={handleSaveSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}