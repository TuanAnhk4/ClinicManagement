'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Calendar, User, Clock, FileText, Pill } from 'lucide-react';

// Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { ConsultationForm } from '@/components/forms/consultation/ConsultationForm';

// Services & Types
import { appointmentService } from '@/services/appointment.service';
import { medicalRecordService } from '@/services/medical-record.service';
import { Appointment } from '@/types/appointments';
import { MedicalRecord } from '@/types/medical-records';
import { AppointmentStatus } from '@/types/enums';
import { useToast } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { error: toastError } = useToast();

  const appointmentId = Number(params.appointmentId);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [history, setHistory] = useState<MedicalRecord[]>([]);
  const [existingRecord, setExistingRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Lấy thông tin cuộc hẹn
        const apptData = await appointmentService.getById(appointmentId);
        setAppointment(apptData);

        // 2. Nếu đã khám xong, lấy luôn kết quả khám cũ để hiển thị (Read-only)
        if (apptData.status === AppointmentStatus.COMPLETED) {
          try {
            const recordData = await medicalRecordService.getByAppointmentId(appointmentId);
            setExistingRecord(recordData);
          } catch (err) {
            console.warn("Không tìm thấy hồ sơ bệnh án dù trạng thái là Completed");
          }
        }

        // 3. Lấy lịch sử khám cũ của bệnh nhân (để bác sĩ tham khảo)
        if (apptData.patientId) {
          const historyData = await medicalRecordService.getByPatientId(apptData.patientId);
          // Lọc bỏ hồ sơ của chính cuộc hẹn này (nếu có) để tránh trùng lặp
          setHistory(historyData.filter(h => h.appointment?.id !== appointmentId));
        }

      } catch (err) {
        console.error(err);
        toastError('Không thể tải dữ liệu khám bệnh.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId]);

  const handleSuccess = () => {
    router.push('/doctor/appointments'); // Quay về danh sách chờ
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner size="large" /></div>;
  if (!appointment) return <div className="p-8 text-center text-gray-500">Không tìm thấy cuộc hẹn.</div>;

  const isCompleted = appointment.status === AppointmentStatus.COMPLETED;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* CỘT TRÁI: FORM KHÁM BỆNH (Chính) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isCompleted ? 'Chi Tiết Hồ Sơ Bệnh Án' : 'Khám Bệnh & Kê Đơn'}
          </h1>
          <Badge variant={isCompleted ? 'success' : 'primary'}>
            {isCompleted ? 'Đã hoàn thành' : 'Đang khám'}
          </Badge>
        </div>

        {isCompleted && existingRecord ? (
          // --- CHẾ ĐỘ XEM (READ-ONLY) ---
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Kết Quả Khám</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Chẩn đoán</p>
                  <p className="text-lg font-medium text-gray-900">{existingRecord.diagnosis}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Triệu chứng</p>
                    <p className="text-gray-700">{existingRecord.symptoms || '---'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Ghi chú</p>
                    <p className="text-gray-700">{existingRecord.notes || '---'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Đơn Thuốc</CardTitle></CardHeader>
              <CardContent>
                {existingRecord.medicines && existingRecord.medicines.length > 0 ? (
                  <div className="space-y-3">
                    {existingRecord.medicines.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{item.medicineName}</p>
                          <p className="text-xs text-gray-500">HDSD: {item.dosage}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{item.quantity} {item.unit}</p>
                          <p className="text-xs text-gray-400">{formatCurrency(item.amount)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t flex justify-between font-bold text-lg">
                      <span>Tổng tiền thuốc:</span>
                      <span className="text-emerald-600">{formatCurrency(existingRecord.totalCost)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Không có đơn thuốc.</p>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
            </div>
          </div>
        ) : (
          // --- CHẾ ĐỘ NHẬP LIỆU (FORM) ---
          <ConsultationForm
            appointmentId={appointmentId}
            onSuccess={handleSuccess}
          />
        )}
      </div>

      {/* CỘT PHẢI: THÔNG TIN BỆNH NHÂN & LỊCH SỬ */}
      <div className="space-y-6">

        {/* Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User size={18} /> Thông Tin Bệnh Nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Họ tên:</span>
              <span className="font-medium">{appointment.patient?.fullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Giới tính:</span>
              <span>{appointment.patient?.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">SĐT:</span>
              <span>{appointment.patient?.phoneNumber || '---'}</span>
            </div>

            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Lý do khám hiện tại</p>
              <p className="text-gray-700 italic">
                &quot;{appointment.reason}&quot;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* History Card */}
        <Card className="max-h-[500px] flex flex-col">
          <CardHeader className="pb-3 bg-gray-50 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText size={18} /> Lịch Sử Khám Bệnh
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1 p-0">
            {history.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {history.map((record) => (
                  <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-gray-800 text-sm">{record.diagnosis}</span>
                      <span className="text-xs text-gray-400">
                        {record.createdAt ? formatDate(record.createdAt) : '-'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{record.symptoms}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 text-sm">
                Chưa có lịch sử khám bệnh.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}