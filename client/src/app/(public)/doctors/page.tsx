'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Stethoscope, MapPin, Star, CalendarCheck } from 'lucide-react';

// Components
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

// Services & Types
import { userService } from '@/services/user.service';
import { specialtyService } from '@/services/specialty.service';
import { User } from '@/types/users';
import { Specialty } from '@/types/specialties';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  // State bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  // 1. Tải dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi song song 2 API
        const [docsData, specsData] = await Promise.all([
          userService.getDoctors(),
          specialtyService.getAll(),
        ]);
        setDoctors(docsData);
        setSpecialties(specsData);
      } catch (error) {
        console.error('Lỗi tải dữ liệu bác sĩ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Logic Lọc (Filter)
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesName = doc.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'all' || doc.specialtyId === Number(selectedSpecialty);
      return matchesName && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  // Tạo options cho Select chuyên khoa
  const specialtyOptions = [
    { label: 'Tất cả chuyên khoa', value: 'all' },
    ...specialties.map(s => ({ label: s.name, value: s.id }))
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* --- HERO HEADER --- */}
      <section className="bg-white border-b border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Đội Ngũ Chuyên Gia
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gặp gỡ những bác sĩ đầu ngành, tận tâm và giàu kinh nghiệm của HealthCare.
          </p>
        </div>
      </section>

      {/* --- FILTER BAR --- */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Tìm kiếm bác sĩ theo tên..." 
              className="pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select 
              className="h-12"
              options={specialtyOptions}
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- DOCTORS GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="large" />
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Ảnh bìa / Header Card */}
                <div className="h-24 bg-blue-600/10 relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${doc.fullName}&background=0D8ABC&color=fff&size=128`} />
                      <AvatarFallback>BS</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Nội dung Card */}
                <div className="pt-12 p-6 text-center flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {doc.fullName}
                  </h3>
                  
                  {/* Chuyên khoa */}
                  <div className="mb-3 flex justify-center">
                    {doc.specialty ? (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {doc.specialty.name}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Chưa cập nhật khoa</span>
                    )}
                  </div>

                  {/* Thông tin giả lập (Mock info để giao diện đẹp hơn) */}
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>4.9</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Hồ Chí Minh</span>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="mt-auto space-y-3">
                    <Link href="/register" className="block">
                      <Button fullWidth className="gap-2 group">
                        <CalendarCheck className="w-4 h-4 group-hover:animate-bounce" />
                        Đặt Lịch Ngay
                      </Button>
                    </Link>
                    
                    {/* Nút xem chi tiết (Tính năng nâng cao sau này) */}
                    {/* <Link href={`/doctors/${doc.id}`} className="block">
                      <Button variant="outline" fullWidth>Xem Hồ Sơ</Button>
                    </Link> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy bác sĩ</h3>
            <p className="text-gray-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc chuyên khoa.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => { setSearchTerm(''); setSelectedSpecialty('all'); }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </section>

    </div>
  );
}