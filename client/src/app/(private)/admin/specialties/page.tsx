'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Search, Activity } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { SpecialtyForm } from '@/components/forms/specialty/SpecialtyForm';

// Services, Types, Hooks, Utils
import { specialtyService } from '@/services/specialty.service';
import { Specialty } from '@/types/specialties';
import { useToast } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

export default function AdminSpecialtiesPage() {
  const [data, setData] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Specialty | null>(null);

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await specialtyService.getAll();
      setData(result);
    } catch (error) {
      console.error(error);
      toastError('Không thể tải danh sách chuyên khoa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo<ColumnDef<Specialty>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => <span className="font-mono text-gray-500 text-xs">#{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Tên Chuyên Khoa',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Activity size={16} />
            </div>
            <span className="font-medium text-gray-900">{info.getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: 'baseCost',
        header: 'Phí Khám (VNĐ)',
        cell: (info) => (
          <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs border border-emerald-100">
            {formatCurrency(info.getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Mô tả',
        cell: (info) => {
          const text = (info.getValue() as string) || '';
          return <span className="text-gray-500 text-sm truncate max-w-[250px] block" title={text}>{text || '-'}</span>;
        },
      },
      {
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => handleEdit(item)}
                title="Chỉnh sửa"
              >
                <Pencil size={16} className="text-blue-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => handleDelete(item.id)}
                title="Xóa"
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Specialty) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa chuyên khoa này? Hành động này không thể hoàn tác.')) {
      try {
        await specialtyService.delete(id);
        success('Đã xóa chuyên khoa thành công.');
        fetchData();
      } catch (error) {
        toastError('Xóa thất bại. Có thể chuyên khoa đang có bác sĩ hoạt động.');
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
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Chuyên Khoa</h1>
          <p className="text-sm text-gray-500">Danh sách các chuyên khoa và bảng giá dịch vụ.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={18} /> Thêm Chuyên Khoa
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Tìm kiếm chuyên khoa..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 ml-auto hidden sm:block">
           Tổng cộng: <span className="font-bold text-gray-900">{filteredData.length}</span> chuyên khoa
        </div>
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
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có chuyên khoa nào</h3>
          <p className="text-gray-500 mt-1 mb-6">Bắt đầu bằng cách thêm chuyên khoa đầu tiên.</p>
          <Button onClick={handleCreate} variant="outline">Thêm Mới</Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Cập Nhật Chuyên Khoa' : 'Thêm Chuyên Khoa Mới'}
        size="md"
      >
        <SpecialtyForm 
          initialData={editingItem}
          onSave={handleSaveSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}