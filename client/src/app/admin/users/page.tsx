'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Table } from '@/components/ui/Table'; // Component Table bạn đã tạo
import { Button } from '@/components/ui/Button';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/ui/Modal';
import { UserForm } from '@/components/UserForm';
import { User } from '@/types';

const columnHelper = createColumnHelper<User>();

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Hàm lấy dữ liệu từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchUsers khi component được render lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);

  // Định nghĩa các cột cho bảng
  const columns = [
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('fullName', { header: 'Họ và Tên' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('role', { header: 'Vai trò' }),
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

  // Hàm xử lý Xóa
  const handleDelete = async (userId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await api.delete(`/users/${userId}`);
        // Tải lại danh sách user sau khi xóa thành công
        fetchUsers(); 
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Xóa người dùng thất bại.');
      }
    }
  };
  
  // Hàm xử lý Sửa (sẽ làm ở bước sau)
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
    // Logic mở Modal và truyền dữ liệu user vào form
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Người Dùng</h1>
        
        {/* THAY THẾ BẰNG ĐOẠN CODE NÀY */}
        <Button onClick={() => {
          setEditingUser(null); // Đặt user đang sửa là null -> Chế độ Thêm Mới
          setIsModalOpen(true);  // Mở Modal lên
        }}>
          + Thêm Mới
        </Button>

      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <Table columns={columns} data={users} />
      </div>

      {/* Đừng quên thêm Modal vào đây để nó có thể hiển thị */}
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {/* ĐẶT USERFORM VÀO ĐÂY */}
      <UserForm
        initialData={editingUser} 
        onSave={() => {
          setIsModalOpen(false);
          fetchUsers(); // Tải lại dữ liệu sau khi lưu
        }}
        onCancel={() => setIsModalOpen(false)} // Thêm hàm để đóng modal khi nhấn Hủy
      />
    </Modal>
    </div>
  );
}