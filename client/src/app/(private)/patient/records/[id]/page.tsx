'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  FileText, 
  User, 
  Calendar, 
  Pill, 
  ArrowLeft, 
  Stethoscope, 
  CreditCard,
  Printer
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

// Services & Types & Utils
import { medicalRecordService } from '@/services/medical-record.service';
import { MedicalRecord } from '@/types/medical-records';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks';

export default function PatientRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { error: toastError } = useToast();

  const appointmentId = Number(params.id);

  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) return;

    const fetchRecord = async () => {
      try {
        setLoading(true);
        // Gọi API lấy hồ sơ theo Appointment ID
        const data = await medicalRecordService.getByAppointmentId(appointmentId);
        setRecord(data);
      } catch (err) {
        console.error(err);
        // Nếu chưa có hồ sơ (404)
        setRecord(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [appointmentId]);

  // Hàm xử lý in (đơn giản)
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }

  // Trường hợp không tìm thấy hồ sơ (Có thể do bác sĩ chưa nhập xong)
  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-yellow-50 p-4 rounded-full mb-4">
          <FileText className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chưa có hồ sơ bệnh án</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Bác sĩ chưa cập nhật kết quả khám cho lịch hẹn này. Vui lòng quay lại sau hoặc liên hệ phòng khám.
        </p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Kết Quả Khám Bệnh
            <Badge variant="success">Đã hoàn thành</Badge>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Mã hồ sơ: #{record.id} • Ngày khám: {format(parseISO(record.createdAt), 'dd/MM/yyyy')}
          </p>
        </div>

        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer size={16} /> In kết quả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- CỘT TRÁI: THÔNG TIN CHUNG --- */}
        <div className="space-y-6 lg:col-span-1">
          {/* Thông tin Bác sĩ */}
          <Card>
            <CardHeader className="pb-3 bg-gray-50 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <User size={18} className="text-blue-600" /> 
                Bác Sĩ Phụ Trách
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${record.appointment?.doctor?.fullName}&background=random`} />
                  <AvatarFallback>BS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-gray-900">{record.appointment?.doctor?.fullName}</p>
                  {/* Nếu backend trả về specialty name thì hiện ở đây */}
                  <p className="text-xs text-gray-500">Chuyên khoa</p> 
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin Hành chính */}
          <Card>
            <CardHeader className="pb-3 bg-gray-50 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" /> 
                Thông Tin Lịch Hẹn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày giờ:</span>
                <span className="font-medium">
                  {record.appointment?.appointmentTime 
                    ? format(parseISO(record.appointment.appointmentTime), 'HH:mm dd/MM/yyyy')
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lý do khám:</span>
                <span className="font-medium text-right max-w-[150px] truncate">
                  {record.appointment?.reason || 'Không có'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- CỘT PHẢI: KẾT QUẢ CHI TIẾT --- */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* 1. Chẩn đoán & Triệu chứng */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope size={20} className="text-blue-600" />
                Kết Quả Lâm Sàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Chẩn đoán</h3>
                <p className="text-lg font-medium text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  {record.diagnosis}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Triệu chứng</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {record.symptoms || 'Không ghi nhận'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Lời dặn / Ghi chú</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {record.notes || 'Không có lời dặn đặc biệt'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Đơn thuốc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill size={20} className="text-emerald-600" />
                Đơn Thuốc
              </CardTitle>
            </CardHeader>
            <CardContent>
              {record.medicines && record.medicines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-2 rounded-l-lg">Tên thuốc</th>
                        <th className="px-4 py-2">Số lượng</th>
                        <th className="px-4 py-2">Cách dùng</th>
                        <th className="px-4 py-2 text-right rounded-r-lg">Đơn giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {record.medicines.map((med, index) => (
                        <tr key={index} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {med.medicineName}
                          </td>
                          <td className="px-4 py-3">
                            {med.quantity} <span className="text-gray-400 text-xs">{med.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 italic">
                            {med.dosage}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {formatCurrency(med.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 italic">Không có đơn thuốc nào.</p>
              )}
            </CardContent>
          </Card>

          {/* 3. Tổng chi phí */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard size={24} />
                <span className="font-medium">Tổng chi phí khám & thuốc</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(record.totalCost)}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}