'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Dùng để chuyển hướng 404
import { 
  MapPin, 
  Star, 
  Clock, 
  GraduationCap, 
  Award, 
  Stethoscope, 
  CalendarCheck,
  Share2
} from 'lucide-react';

// Components & Utils
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils';

// Services
import { userService } from '@/services/user.service';
import { User } from '@/types/users';

// Props do Next.js truyền vào cho Dynamic Route
interface PageProps {
  params: { id: string };
}

export default function DoctorDetailPage({ params }: PageProps) {
  const [doctor, setDoctor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        // Parse ID từ URL
        const doctorId = parseInt(params.id);
        if (isNaN(doctorId)) {
          notFound(); // Nếu ID không phải số -> 404
          return;
        }

        const data = await userService.getById(doctorId);
        
        // Kiểm tra xem user này có phải bác sĩ không
        if (data.role !== 'DOCTOR') {
          notFound(); // Nếu tìm thấy nhưng không phải bác sĩ -> 404
          return;
        }

        setDoctor(data);
      } catch (error) {
        console.error('Lỗi tải thông tin bác sĩ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!doctor) {
    return notFound();
  }

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) CHO GIAO DIỆN ĐẸP HƠN ---
  // (Vì DB hiện tại chưa có các trường text dài này)
  const mockBio = `Bác sĩ ${doctor.fullName} là một chuyên gia hàng đầu với hơn 15 năm kinh nghiệm trong lĩnh vực ${doctor.specialty?.name || 'Y khoa'}. Ông từng công tác tại các bệnh viện lớn trong nước và quốc tế. Với phương châm "Lương y như từ mẫu", bác sĩ luôn tận tâm lắng nghe và đưa ra phác đồ điều trị tối ưu nhất cho từng bệnh nhân.`;
  
  const mockEducation = [
    'Tiến sĩ Y khoa - Đại học Y Dược TP.HCM (2015)',
    'Thạc sĩ - Đại học Harvard Medical School (2010)',
    'Bác sĩ đa khoa - Đại học Y Hà Nội (2005)'
  ];

  const mockExperience = [
    'Trưởng khoa - Bệnh viện Chợ Rẫy (2018 - Nay)',
    'Bác sĩ điều trị - Bệnh viện Bạch Mai (2010 - 2018)',
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* --- 1. HERO HEADER (Background Profile) --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Avatar Lớn */}
            <div className="relative">
              <Avatar className="h-40 w-40 border-4 border-white shadow-xl">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${doctor.fullName}&background=0D8ABC&color=fff&size=256`} />
                <AvatarFallback className="text-2xl">BS</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 bg-green-500 h-5 w-5 rounded-full border-2 border-white" title="Đang trực tuyến"></div>
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{doctor.fullName}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {doctor.specialty?.name || 'Bác sĩ Chuyên khoa'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> TP. Hồ Chí Minh
                  </span>
                  <span className="flex items-center gap-1 text-yellow-600 font-medium">
                    <Star size={16} fill="currentColor" /> 4.9 (150+ đánh giá)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> 15 năm kinh nghiệm
                  </span>
                </div>
              </div>

              {/* Nút hành động mobile */}
              <div className="flex md:hidden gap-3 justify-center">
                 <Link href="/register" className="flex-1">
                    <Button className="w-full">Đặt Lịch Ngay</Button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CỘT TRÁI (Nội dung chi tiết - Chiếm 2 phần) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Giới thiệu */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="text-blue-600" /> Giới Thiệu
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                {mockBio}
              </p>
            </div>

            {/* Học vấn & Kinh nghiệm */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="text-blue-600" /> Học Vấn & Kinh Nghiệm
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">Quá trình đào tạo</h3>
                  <ul className="space-y-3">
                    {mockEducation.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-600 text-sm">
                        <div className="h-2 w-2 bg-gray-300 rounded-full mt-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-3">Kinh nghiệm làm việc</h3>
                  <ul className="space-y-3">
                    {mockExperience.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-600 text-sm">
                        <div className="h-2 w-2 bg-gray-300 rounded-full mt-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Giải thưởng (Optional) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="text-blue-600" /> Thành Tựu Nổi Bật
              </h2>
              <p className="text-gray-600 text-sm">
                - Bác sĩ tiêu biểu năm 2020<br/>
                - Tác giả của 10 bài báo nghiên cứu khoa học quốc tế.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI (Sidebar Đặt lịch - Chiếm 1 phần) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Booking Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Phí khám tư vấn</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatCurrency(doctor.specialty?.baseCost || 0)}
                    </span>
                    <span className="text-gray-400 mb-1">/ lượt</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/register" className="block">
                    <Button size="large" fullWidth className="shadow-blue-200 shadow-md hover:shadow-none transition-shadow">
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      Đặt Lịch Ngay
                    </Button>
                  </Link>
                  
                  <Button variant="outline" fullWidth className="text-gray-600 border-gray-300">
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ hồ sơ
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">Lịch làm việc</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Thứ 2 - Thứ 6</span>
                      <span className="font-medium">08:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Thứ 7 - CN</span>
                      <span>Nghỉ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info Small */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <p className="font-medium mb-1">Cần hỗ trợ gấp?</p>
                <p>Gọi ngay hotline: <strong>1900 1234</strong></p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}