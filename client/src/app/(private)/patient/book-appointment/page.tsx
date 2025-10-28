'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { User, UserRole, Appointment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AxiosError } from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export default function BookAppointmentPage() {
  // State quản lý dữ liệu
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Appointment[]>([]);
  
  // State cho lựa chọn của người dùng
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  // State quản lý UI
  const [loading, setLoading] = useState(true); // Đổi thành true để có trạng thái tải ban đầu
  const [error, setError] = useState('');

  // Lấy danh sách bác sĩ
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/users', { params: { role: UserRole.DOCTOR } });
        setDoctors(response.data);
      } catch (err) {
        setError('Không thể tải danh sách bác sĩ.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Lấy lịch đã đặt khi chọn bác sĩ
  useEffect(() => {
    if (!selectedDoctor) return;
    const fetchBookedSlots = async () => {
      try {
        const response = await api.get(`/appointments/doctor/${selectedDoctor.id}`);
        setBookedSlots(response.data);
      } catch (err) {
        setError('Không thể tải lịch trình của bác sĩ.');
      }
    };
    fetchBookedSlots();
    setSelectedTime(null);
  }, [selectedDoctor]);

  // Tính toán các khung giờ còn trống
  const availableSlots = useMemo(() => {
    if (!selectedDate || Array.isArray(selectedDate)) return [];
    const workingHours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    const bookedTimes = new Set(
      bookedSlots
        .filter(slot => new Date(slot.appointmentTime).toDateString() === selectedDate.toDateString())
        .map(slot => new Date(slot.appointmentTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
    );
    return workingHours.filter(slot => !bookedTimes.has(slot));
  }, [selectedDate, bookedSlots]);

  // --- LOGIC MỚI BẮT ĐẦU TỪ ĐÂY ---
  // Hàm xử lý việc đặt lịch
  const handleSubmit = async () => {
    // 1. Kiểm tra đầu vào
    if (!selectedDoctor || !selectedDate || Array.isArray(selectedDate) || !selectedTime) {
      setError('Vui lòng chọn đầy đủ bác sĩ, ngày và giờ khám.');
      return;
    }
    setLoading(true);
    setError('');

    // 2. Chuẩn bị dữ liệu để gửi đi
    const [hours, minutes] = selectedTime.split(':');
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    try {
      // 3. Gọi API POST để tạo lịch hẹn
      await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        appointmentTime: appointmentDateTime.toISOString(),
        reason: reason,
      });
      
      alert('Đặt lịch thành công!');
      
      // 4. Cập nhật lại giao diện sau khi thành công
      const response = await api.get(`/appointments/doctor/${selectedDoctor.id}`);
      setBookedSlots(response.data);
      setSelectedTime(null);
      setReason('');

    } catch (err) {
      // 5. Xử lý lỗi
      if (err instanceof AxiosError && err.response?.status === 409) {
        setError('Rất tiếc, khung giờ này vừa có người khác đặt. Vui lòng chọn giờ khác.');
        // Tải lại lịch trống để người dùng thấy sự thay đổi
        const response = await api.get(`/appointments/doctor/${selectedDoctor.id}`);
        setBookedSlots(response.data);
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };
  // --- KẾT THÚC LOGIC MỚI ---

  if (loading && doctors.length === 0) return <div className="p-6">Đang tải...</div>;
  if (error && doctors.length === 0) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Đặt Lịch Khám</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1: Danh sách bác sĩ */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">1. Chọn Bác Sĩ</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                onClick={() => setSelectedDoctor(doctor)}
                className={`cursor-pointer transition-all p-4 ${selectedDoctor?.id === doctor.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
              >
                <p className="font-bold">{doctor.fullName}</p>
                <p className="text-sm text-gray-600">{doctor.email}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Cột 2 & 3: Chọn lịch và xác nhận */}
        {selectedDoctor ? (
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">2. Chọn Ngày và Giờ cho Dr. {selectedDoctor.fullName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-2">
                  <Calendar 
                    onChange={setSelectedDate} 
                    value={selectedDate} 
                    minDate={new Date()}
                  />
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold text-center mb-3">Khung giờ còn trống</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto">
                    {availableSlots.length > 0 ? availableSlots.map(time => (
                      <Button 
                        key={time} 
                        variant={selectedTime === time ? 'primary' : 'secondary'}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    )) : <p className="col-span-3 text-center text-gray-500">Không có lịch trống trong ngày này.</p>}
                  </div>
                </Card>
              </div>
            </div>

            {/* --- THÊM PHẦN GIAO DIỆN NÀY VÀO --- */}
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Lý Do Khám & Xác Nhận</h2>
              <Card className="p-4">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Vui lòng mô tả ngắn gọn triệu chứng hoặc lý do khám (tùy chọn)..."
                  className="w-full h-24 p-2 border rounded-md"
                />
                <Button onClick={handleSubmit} disabled={!selectedTime || loading} className="mt-4 w-full">
                  {loading ? 'Đang xử lý...' : `Xác nhận đặt lịch lúc ${selectedTime || ''}`}
                </Button>
              </Card>
            </div>
            {/* --- KẾT THÚC PHẦN GIAO DIỆN MỚI --- */}

          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-500">Vui lòng chọn một bác sĩ để xem lịch trống.</p>
          </div>
        )}
      </div>
    </div>
  );
}