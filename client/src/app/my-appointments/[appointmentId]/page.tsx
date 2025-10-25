// src/app/my-appointments/[appointmentId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { MedicalRecord, PrescriptionItem } from '@/types'; // Giả sử có type PrescriptionItem
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';

export default function AppointmentDetailPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [record, setRecord] = useState<MedicalRecord | null>(null); // State lưu hồ sơ khám
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]); // State lưu đơn thuốc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated && appointmentId) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          // Gọi API lấy hồ sơ khám bệnh theo appointmentId
          const response = await api.get(`/medical-records/appointment/${appointmentId}`);
          setRecord(response.data);
          setPrescriptionItems(response.data?.prescription?.items || []);
          // Giả sử API trả về đơn thuốc lồng trong hồ sơ hoặc gọi API khác
          // setPrescriptionItems(response.data.prescription?.items || []);
        } catch (err) {
          setError('Không thể tải chi tiết lịch hẹn.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [appointmentId, isAuthenticated, authLoading]);

  if (loading || authLoading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!record) return <div className="p-6">Không tìm thấy hồ sơ khám bệnh cho lịch hẹn này.</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Chi Tiết Khám Bệnh</h1>
      {/* Hiển thị thông tin bác sĩ, ngày giờ từ `record.appointment` */}

      <Card className="mb-6 p-4">
        <h2 className="text-xl font-semibold mb-2">Kết Quả Chẩn Đoán</h2>
        <p><strong>Triệu chứng:</strong> {record.symptoms || 'Không có'}</p>
        <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
        <p><strong>Ghi chú của bác sĩ:</strong> {record.notes || 'Không có'}</p>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Đơn Thuốc</h2>
        {prescriptionItems.length > 0 ? (
          <ul>
            {prescriptionItems.map((item) => (
              <li key={item.id} className="border-b py-2">
                <p><strong>Tên thuốc:</strong> {item.medicine.name}</p>
                <p><strong>Số lượng:</strong> {item.quantity} {item.medicine.unit}</p>
                <p><strong>Cách dùng:</strong> {item.dosage}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có đơn thuốc.</p>
        )}
      </Card>
    </div>
  );
}