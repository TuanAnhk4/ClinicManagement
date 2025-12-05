import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Users, Trophy, Building2, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi | HealthCare',
  description: 'Tìm hiểu về lịch sử, sứ mệnh và đội ngũ chuyên gia tại HealthCare Clinic.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      
      {/* --- SECTION 1: HERO BANNER --- */}
      <section className="relative bg-blue-600 py-20 sm:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-sm font-medium mb-6 border border-blue-400/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Heart size={14} className="text-red-300" fill="currentColor" />
            <span>Chăm sóc sức khỏe toàn diện</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Hành Trình Chăm Sóc <br />
            <span className="text-blue-200">Sức Khỏe Cộng Đồng</span>
          </h1>
          
          <p className="text-lg leading-8 text-blue-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Hơn 10 năm cống hiến, chúng tôi tự hào là điểm tựa y tế vững chắc, 
            mang lại nụ cười và sức khỏe cho hàng ngàn gia đình Việt.
          </p>
        </div>
      </section>

      {/* --- SECTION 2: CÂU CHUYỆN & SỨ MỆNH --- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Cột Trái: Hình ảnh */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:h-[500px]">
              <Image 
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop"
                alt="Đội ngũ bác sĩ HealthCare"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Badge nổi */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-xs border border-gray-100 hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <Trophy size={20} />
                  </div>
                  <span className="font-bold text-gray-900">Top 10 Phòng Khám</span>
                </div>
                <p className="text-xs text-gray-600">Đạt chứng nhận chất lượng y tế quốc tế năm 2024.</p>
              </div>
            </div>

            {/* Cột Phải: Nội dung */}
            <div className="lg:pl-8">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Về Chúng Tôi</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Nâng Tầm Chất Lượng Cuộc Sống
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                HealthCare được thành lập với niềm tin rằng y tế chất lượng cao phải dễ dàng tiếp cận với mọi người. 
                Chúng tôi không chỉ chữa bệnh, chúng tôi chữa lành nỗi lo âu của người bệnh bằng sự tận tâm và công nghệ hiện đại.
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Đội ngũ bác sĩ đầu ngành',
                  'Trang thiết bị chuẩn Quốc tế',
                  'Quy trình khám nhanh gọn',
                  'Chi phí minh bạch, hợp lý',
                  'Hỗ trợ đặt lịch 24/7',
                  'Hồ sơ bệnh án điện tử'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-x-6">
                <Link href="/doctors">
                  <Button variant="outline" size="large">Xem Đội Ngũ</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THỐNG KÊ ẤN TƯỢNG (STATS) --- */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Bệnh nhân tin tưởng', value: '15k+', icon: Users, color: 'text-blue-600 bg-blue-100' },
              { label: 'Năm kinh nghiệm', value: '10+', icon: Clock, color: 'text-orange-600 bg-orange-100' },
              { label: 'Giải thưởng y tế', value: '25+', icon: Trophy, color: 'text-yellow-600 bg-yellow-100' },
              { label: 'Chi nhánh', value: '05', icon: Building2, color: 'text-purple-600 bg-purple-100' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className={`mb-4 p-3 rounded-full ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <dt className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</dt>
                <dd className="text-sm font-medium text-gray-500">{stat.label}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: GIÁ TRỊ CỐT LÕI (CORE VALUES) --- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Tận Tâm', desc: 'Coi bệnh nhân như người thân, chăm sóc bằng cả trái tim.' },
              { title: 'Chuyên Nghiệp', desc: 'Tuân thủ quy trình y khoa chuẩn mực và đạo đức nghề nghiệp.' },
              { title: 'Đổi Mới', desc: 'Không ngừng cập nhật công nghệ và phương pháp điều trị mới nhất.' },
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: CTA (CALL TO ACTION) --- */}
      <section className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20">
           {/* Background Image tối màu */}
           <Image 
             src="https://images.unsplash.com/photo-1538108149393-fbbd8189718c?q=80&w=1974&auto=format&fit=crop"
             alt="Background"
             fill
             className="object-cover"
           />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Sức khỏe của bạn là ưu tiên hàng đầu
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300 mb-10">
            Đừng để bệnh tật làm phiền cuộc sống của bạn. Hãy để chúng tôi đồng hành và bảo vệ sức khỏe cho bạn ngay hôm nay.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button size="large" className="bg-white text-gray-900 hover:bg-gray-100 border-none">
                Đặt Lịch Khám Ngay
              </Button>
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-white hover:text-blue-300 transition-colors">
              Liên hệ tư vấn <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}