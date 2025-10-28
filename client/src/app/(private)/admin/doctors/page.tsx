// src/app/admin/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { UserForm } from '@/components/UserForm'; // Tái sử dụng UserForm
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { User, UserRole } from '@/types'; // Import User và UserRole từ types chung

const columnHelper = createColumnHelper<User>();

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<User[]>([]); // State lưu danh sách bác sĩ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<User | null>(null);

  // Hàm lấy danh sách bác sĩ từ API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users', {
        params: { role: UserRole.DOCTOR }, // Lọc theo vai trò Bác sĩ
      });
      setDoctors(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bác sĩ:', err);
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchDoctors khi component được render lần đầu
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Hàm xử lý khi nhấn nút Xóa
  const handleDelete = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchDoctors(); // Tải lại danh sách sau khi xóa thành công
      } catch (err) {
        console.error('Lỗi khi xóa bác sĩ:', err);
        alert('Xóa bác sĩ thất bại.');
      }
    }
  };

  // Hàm xử lý khi nhấn nút Sửa
  const handleEdit = (doctor: User) => {
    setEditingDoctor(doctor); // Lưu thông tin bác sĩ cần sửa
    setIsModalOpen(true); // Mở modal
  };

  // Hàm xử lý khi nhấn nút Thêm Mới
  const handleAddNew = () => {
    setEditingDoctor(null); // Đặt là null để UserForm biết là thêm mới
    setIsModalOpen(true); // Mở modal
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('fullName', {
      header: 'Họ và Tên',
      cell: info => ( // Hiển thị kèm Avatar nếu muốn
        <div className="flex items-center space-x-3">
          <div className="avatar placeholder">
             <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8">
               <span className="text-xs">{info.getValue().charAt(0)}</span>
             </div>
          </div>
          <span>{info.getValue()}</span>
        </div>
      )
    }),
    columnHelper.accessor('email', { header: 'Email' }),
    // Có thể thêm cột Chuyên khoa nếu User type và API trả về
    // columnHelper.accessor('specialty.name', { header: 'Chuyên Khoa'}),
    columnHelper.display({
      id: 'actions',
      header: 'Hành động',
      cell: (props) => (
        <div className="flex space-x-2">
          <Button size="small" variant="secondary" onClick={() => handleEdit(props.row.original)}>
            Sửa
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(props.row.original.id)}>
            Xóa
          </Button>
        </div>
      ),
    }),
  ] as ColumnDef<User, unknown>[]; // Dùng unknown thay vì any

  // Xử lý giao diện khi đang tải hoặc có lỗi
  if (loading) return <p className="p-6">Đang tải danh sách bác sĩ...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // Giao diện chính của trang
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Bác Sĩ</h1>
        <Button onClick={handleAddNew}>+ Thêm Bác Sĩ Mới</Button>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <Table columns={columns} data={doctors} />
      </div>

      {/* Modal để Thêm/Sửa Bác Sĩ */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/*
          UserForm cần được cập nhật để có thể nhận một prop `defaultRole`
          để khi thêm mới, nó sẽ mặc định vai trò là DOCTOR.
        */}
        <UserForm
          initialData={editingDoctor}
          onSave={() => {
            setIsModalOpen(false); // Đóng modal
            fetchDoctors(); // Tải lại danh sách
          }}
          onCancel={() => setIsModalOpen(false)} // Đóng modal khi nhấn Hủy
          // defaultRole={UserRole.DOCTOR} // Truyền vai trò mặc định (cần cập nhật UserForm)
        />
      </Modal>
    </div>
  );
}