'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { setHours, setMinutes, isSameDay } from 'date-fns';

// Components
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Calendar } from '@/components/ui/Calendar';
import { DoctorList } from './components/DoctorList';
import { TimeSlotPicker, TimeSlot } from './components/TimeSlotPicker';
import { useToast } from '@/hooks';

// Services & Types
import { appointmentService } from '@/services/appointment.service';
import { specialtyService } from '@/services/specialty.service';
import { userService } from '@/services/user.service';
import { Specialty } from '@/types/specialties';
import { User } from '@/types/users';
import { Appointment } from '@/types/appointments';

// Schema
import { bookingSchema, BookingFormValues, defaultValues } from './schema';

interface BookingFormProps {
  onSuccess?: () => void;
}

export const BookingForm = ({ onSuccess }: BookingFormProps) => {
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  // --- DATA SOURCES ---
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [busyAppointments, setBusyAppointments] = useState<Appointment[]>([]);

  // --- UI STATE ---
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeStr, setSelectedTimeStr] = useState<string | null>(null);

  // --- FORM HOOK (Không truyền Generic Type để tránh lỗi Zod conflict) ---
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  // --- SỬA LỖI TYPE TẠI ĐÂY ---
  // Lấy giá trị raw từ form
  const rawSpecialtyId = watch('specialtyId');
  const rawDoctorId = watch('doctorId');

  // Ép kiểu an toàn về Number để dùng cho logic so sánh/lọc
  const selectedSpecialtyId = rawSpecialtyId ? Number(rawSpecialtyId) : 0;
  const selectedDoctorId = rawDoctorId ? Number(rawDoctorId) : 0;
  // -----------------------------

  // 1. INITIAL LOAD
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [specs, docs] = await Promise.all([
          specialtyService.getAll(),
          userService.getDoctors(),
        ]);
        setSpecialties(specs);
        setDoctors(docs);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        toastError('Không thể tải dữ liệu.');
      }
    };
    fetchInitialData();
  }, []);

  // 2. FETCH BUSY SLOTS
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      // Bây giờ selectedDoctorId đã là number, so sánh > 0 an toàn
      if (selectedDoctorId > 0) {
        try {
          const appointments = await appointmentService.getByDoctorId(selectedDoctorId);
          setBusyAppointments(appointments);
        } catch (error) {
          console.error('Lỗi tải lịch bác sĩ:', error);
        }
      } else {
        setBusyAppointments([]);
      }
      
      // Reset giờ khi đổi bác sĩ
      setSelectedTimeStr(null); 
      setValue('appointmentTime', ''); 
    };

    fetchDoctorSchedule();
  }, [selectedDoctorId, setValue]); 

  // 3. FILTER DOCTORS
  const filteredDoctors = useMemo(() => {
    if (selectedSpecialtyId === 0) {
      return doctors;
    }
    return doctors.filter((doc) => doc.specialtyId === selectedSpecialtyId);
  }, [doctors, selectedSpecialtyId]);

  // 4. GENERATE TIME SLOTS
  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    if (selectedDoctorId === 0) return [];

    const startHour = 8;
    const endHour = 17;
    const stepMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += stepMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const currentSlotDate = setMinutes(setHours(selectedDate, hour), minute);
        
        const isBusy = busyAppointments.some((appt) => {
          const apptStart = new Date(appt.appointmentTime);
          const apptEnd = new Date(appt.endTime);

          if (!isSameDay(apptStart, selectedDate)) return false;
          return currentSlotDate >= apptStart && currentSlotDate < apptEnd;
        });

        slots.push({ time: timeString, isBusy });
      }
    }
    return slots;
  }, [selectedDate, busyAppointments, selectedDoctorId]);

  // 5. HANDLER
  const handleTimeSelect = (time: string) => {
    setSelectedTimeStr(time);
    const [hours, minutes] = time.split(':').map(Number);
    const finalDate = setMinutes(setHours(selectedDate, hours), minutes);
    
    // Set value vào form
    setValue('appointmentTime', finalDate.toISOString(), { shouldValidate: true });
  };

  // 6. SUBMIT
  // Định nghĩa kiểu data cho onSubmit khớp với Schema
  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    setLoading(true);
    try {
      await appointmentService.create({
        doctorId: Number(data.doctorId),
        appointmentTime: data.appointmentTime,
        reason: data.reason,
      });

      success('Đặt lịch thành công! Vui lòng chờ bác sĩ xác nhận.');
      
      reset(defaultValues);
      setSelectedTimeStr(null);
      
      if (onSuccess) onSuccess();

    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toastError('Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.');
        } else {
          toastError(err.response?.data?.message || 'Đặt lịch thất bại.');
        }
      } else {
        toastError('Đã có lỗi xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* BƯỚC 1: Chọn Bác Sĩ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">1. Chọn Bác Sĩ</h3>
          <div className="w-48">
            <Select 
              {...register('specialtyId')}
              onChange={(e) => {
                register('specialtyId').onChange(e);
                setValue('doctorId', 0); // Reset bác sĩ khi đổi chuyên khoa
              }}
              options={[{ label: 'Tất cả chuyên khoa', value: 0 }, ...specialties.map(s => ({ label: s.name, value: s.id }))]}
            />
          </div>
        </div>

        <DoctorList 
          doctors={filteredDoctors} 
          selectedDoctorId={selectedDoctorId}
          onSelect={(id) => setValue('doctorId', id, { shouldValidate: true })}
        />
        {/* Ép kiểu message sang string để tránh lỗi TS */}
        {errors.doctorId && <p className="text-red-500 text-sm mt-1">Vui lòng chọn một bác sĩ.</p>}
      </section>

      {/* BƯỚC 2: Chọn Thời Gian (Chỉ hiện khi đã chọn bác sĩ) */}
      {selectedDoctorId > 0 && (
        <section className="space-y-4 border-t pt-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-semibold text-gray-800">2. Chọn Thời Gian Khám</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Calendar 
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTimeStr(null);
                  setValue('appointmentTime', '');
                }}
                minDate={new Date()}
                className="w-full border shadow-none"
              />
            </div>

            <div>
              <TimeSlotPicker 
                date={selectedDate}
                slots={timeSlots}
                selectedTime={selectedTimeStr}
                onSelect={handleTimeSelect}
              />
              {errors.appointmentTime && (
                <p className="text-red-500 text-sm mt-2">{errors.appointmentTime.message as string}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BƯỚC 3: Thông tin bổ sung (Chỉ hiện khi đã chọn giờ) */}
      {selectedTimeStr && (
        <section className="space-y-4 border-t pt-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-semibold text-gray-800">3. Thông Tin Bổ Sung</h3>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Lý do khám / Triệu chứng (Tùy chọn)
            </label>
            <Textarea 
              {...register('reason')}
              placeholder="Mô tả ngắn gọn triệu chứng của bạn (VD: Đau đầu, sốt nhẹ...)"
              rows={3}
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              size="large" 
              className="w-full md:w-auto px-8" 
              isLoading={loading}
            >
              Xác Nhận Đặt Lịch
            </Button>
          </div>
        </section>
      )}
    </form>
  );
};