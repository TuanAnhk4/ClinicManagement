'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // 1. Import useRouter
import api from '@/lib/api';
import { Appointment, User, MedicalRecord } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { ConsultationForm } from '@/components/ConsultationForm'; // 2. Import ConsultationForm

export default function ConsultationPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;
  const router = useRouter(); // Khởi tạo router
  const { user } = useAuth();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patientHistory, setPatientHistory] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointmentId) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          // Lấy chi tiết cuộc hẹn (Giả sử API này tồn tại)
          const apptResponse = await api.get(`/appointments/${appointmentId}`);
          setAppointment(apptResponse.data);

          // Lấy lịch sử khám (Giả sử API này tồn tại)
          if (apptResponse.data?.patient?.id) {
            const historyResponse = await api.get(`/medical-records/patient/${apptResponse.data.patient.id}`);
            setPatientHistory(historyResponse.data);
          }
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu khám bệnh:", err);
          setError('Không thể tải thông tin cuộc hẹn.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [appointmentId]);

  // 3. Định nghĩa hàm callback khi form submit thành công
  const handleFormSubmitSuccess = () => {
    // Chuyển hướng về Dashboard sau khi lưu thành công
    router.push('/doctor/dashboard');
  };

  if (loading) return <div className="p-6">Đang tải thông tin...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!appointment) return <div className="p-6">Không tìm thấy thông tin cuộc hẹn.</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Khám Bệnh</h1>
      
      {/* Thông tin bệnh nhân */}
      <Card className="mb-6 p-4">
        <h2 className="text-xl font-semibold mb-2">Thông Tin Bệnh Nhân</h2>
        <p><strong>Họ tên:</strong> {appointment.patient.fullName}</p>
        <p><strong>Email:</strong> {appointment.patient.email}</p>
        <p><strong>Lý do khám:</strong> {appointment.reason || 'Không có'}</p>
        {/* Bạn có thể thêm phần hiển thị lịch sử khám ở đây nếu muốn */}
      </Card>

      {/* 4. Sử dụng ConsultationForm và truyền props */}
      <Card className="p-4"> {/* Bọc form trong Card cho đẹp */}
        <ConsultationForm
          appointmentId={parseInt(appointmentId, 10)} // Chuyển ID sang number
          onSubmitSuccess={handleFormSubmitSuccess}
        />
      </Card>
    </div>
  );
}