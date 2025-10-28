// src/app/admin/patients/page.tsx
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

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<User[]>([]); // State lưu danh sách bệnh nhân
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<User | null>(null); // State cho bệnh nhân đang sửa

  // Hàm lấy danh sách bệnh nhân từ API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users', {
        params: { role: UserRole.PATIENT }, // Lọc theo vai trò Bệnh nhân
      });
      setPatients(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bệnh nhân:', err);
      setError('Không thể tải danh sách bệnh nhân. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchPatients khi component được render lần đầu
  useEffect(() => {
    fetchPatients();
  }, []);

  // Hàm xử lý khi nhấn nút Xóa
  const handleDelete = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchPatients(); // Tải lại danh sách sau khi xóa thành công
      } catch (err) {
        console.error('Lỗi khi xóa bệnh nhân:', err);
        alert('Xóa bệnh nhân thất bại.');
      }
    }
  };

  // Hàm xử lý khi nhấn nút Sửa
  const handleEdit = (patient: User) => {
    setEditingPatient(patient); // Lưu thông tin bệnh nhân cần sửa
    setIsModalOpen(true); // Mở modal
  };

  // Hàm xử lý khi nhấn nút Thêm Mới
  const handleAddNew = () => {
    setEditingPatient(null); // Đặt là null để UserForm biết là thêm mới
    setIsModalOpen(true); // Mở modal
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('fullName', {
      header: 'Họ và Tên',
      cell: info => (
        <div className="flex items-center space-x-3">
          {/* Placeholder Avatar */}
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
    // Bỏ cột Vai trò vì tất cả đều là Bệnh nhân
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
  ] as ColumnDef<User, unknown>[];

  // Xử lý giao diện khi đang tải hoặc có lỗi
  if (loading) return <p className="p-6">Đang tải danh sách bệnh nhân...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  // Giao diện chính của trang
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Bệnh Nhân</h1>
        <Button onClick={handleAddNew}>+ Thêm Bệnh Nhân Mới</Button>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        {/* Truyền patients vào data */}
        <Table columns={columns} data={patients} />
      </div>

      {/* Modal để Thêm/Sửa Bệnh Nhân */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/*
          UserForm cần được cập nhật để có thể nhận một prop `defaultRole`
          để khi thêm mới, nó sẽ mặc định vai trò là PATIENT.
        */}
        <UserForm
          initialData={editingPatient}
          onSave={() => {
            setIsModalOpen(false); // Đóng modal
            fetchPatients(); // Tải lại danh sách
          }}
          onCancel={() => setIsModalOpen(false)} // Đóng modal khi nhấn Hủy
          // defaultRole={UserRole.PATIENT} // Truyền vai trò mặc định (cần cập nhật UserForm)
        />
      </Modal>
    </div>
  );
}