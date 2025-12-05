'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Search, Pill } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { MedicineForm } from '@/components/forms/medicine/MedicineForm';

// Services & Types
import { medicineService } from '@/services/medicine.service';
import { Medicine } from '@/types/medicines';
import { useToast } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

export default function AdminMedicinesPage() {
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Medicine | null>(null);

  const { success, error: toastError } = useToast();

  // 1. Hàm tải dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await medicineService.getAll();
      setData(result);
    } catch (error) {
      console.error(error);
      toastError('Không thể tải danh sách thuốc.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Định nghĩa cột cho bảng
  const columns = useMemo<ColumnDef<Medicine>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => <span className="font-mono text-gray-500 text-xs">#{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Tên Thuốc',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
              <Pill size={16} />
            </div>
            <span className="font-medium text-gray-900">{info.getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: 'unit',
        header: 'Đơn vị',
        cell: (info) => (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 font-normal">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Đơn Giá',
        cell: (info) => (
          <span className="font-medium text-emerald-600">
            {formatCurrency(info.getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Mô tả / Công dụng',
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
                onClick={() => handleDelete(item.id, item.name)}
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

  // 3. Logic Lọc (Search Client-side)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter((item) =>
      item.name.toLowerCase().includes(lowerTerm) ||
      item.description?.toLowerCase().includes(lowerTerm)
    );
  }, [data, searchTerm]);

  // 4. Các hàm xử lý hành động
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Medicine) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa thuốc "${name}"? Hành động này không thể hoàn tác.`)) {
      try {
        await medicineService.delete(id);
        success('Đã xóa thuốc thành công.');
        fetchData();
      } catch (error) {
        toastError('Xóa thất bại. Có thể thuốc này đang nằm trong đơn thuốc cũ.');
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
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Kho Thuốc</h1>
          <p className="text-sm text-gray-500">Danh sách thuốc, vật tư y tế và bảng giá.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 shadow-lg shadow-blue-200">
          <Plus size={18} /> Thêm Thuốc Mới
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Tìm kiếm thuốc theo tên, công dụng..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 ml-auto hidden sm:block">
          Tổng cộng: <span className="font-bold text-gray-900">{filteredData.length}</span> loại thuốc
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

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Cập Nhật Thông Tin Thuốc' : 'Thêm Thuốc Mới'}
        size="md"
      >
        <MedicineForm 
          initialData={editingItem}
          onSave={handleSaveSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}