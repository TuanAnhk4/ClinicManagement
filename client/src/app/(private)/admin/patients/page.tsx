'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { UserForm } from '@/components/forms/user/UserForm';

// Services & Types & Hooks
import { userService } from '@/services/user.service';
import { User } from '@/types/users';
import { UserRole } from '@/types/enums';
import { useToast } from '@/hooks';
import { formatDate } from '@/lib/utils';

export default function AdminPatientsPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { success, error: toastError } = useToast();

  // 1. Tải danh sách bệnh nhân
  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi service lấy danh sách user có role=PATIENT
      const result = await userService.getAll({ role: UserRole.PATIENT });
      setData(result);
    } catch (error) {
      console.error(error);
      toastError('Không thể tải danh sách bệnh nhân.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Cấu hình cột cho bảng
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => <span className="font-mono text-gray-500 text-xs">#{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'fullName',
        header: 'Họ và Tên',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">{user.fullName}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'phoneNumber',
        header: 'SĐT',
        cell: (info) => <span className="text-gray-600 text-sm">{info.getValue() as string || '-'}</span>,
      },
      {
        accessorKey: 'date_of_birth',
        header: 'Ngày Sinh',
        cell: (info) => {
          const date = info.getValue() as string;
          return <span className="text-gray-600 text-sm">{date ? formatDate(date) : '-'}</span>;
        },
      },
      {
        accessorKey: 'gender',
        header: 'Giới Tính',
        cell: (info) => {
          const gender = info.getValue() as string;
          const genderMap: Record<string, string> = { 'MALE': 'Nam', 'FEMALE': 'Nữ', 'OTHER': 'Khác' };
          return <span className="text-gray-600 text-sm">{genderMap[gender] || '-'}</span>;
        },
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
              title="Sửa thông tin"
            >
              <Pencil size={16} className="text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => handleDelete(row.original.id)}
              title="Xóa bệnh nhân"
            >
              <Trash2 size={16} className="text-red-600" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // 3. Lọc dữ liệu (Client-side Search)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm))
    );
  }, [data, searchTerm]);

  // 4. Handlers
  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bệnh nhân này? Hành động này không thể hoàn tác.')) {
      try {
        await userService.delete(id);
        success('Đã xóa bệnh nhân thành công.');
        fetchData();
      } catch (error) {
        toastError('Xóa thất bại.');
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
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Bệnh Nhân</h1>
          <p className="text-sm text-gray-500">Danh sách bệnh nhân và hồ sơ sức khỏe.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={18} /> Thêm Bệnh Nhân
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Tìm kiếm theo tên, email, sđt..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Cập Nhật Bệnh Nhân' : 'Thêm Bệnh Nhân Mới'}
        size="lg"
      >
        <UserForm 
          initialData={editingUser}
          onSave={handleSaveSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}