import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Stethoscope, 
  Baby, 
  HeartPulse, 
  ScanFace, 
  Microscope, 
  Activity, 
  ArrowRight, 
  CalendarCheck, 
  FileText, 
  UserCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dịch Vụ Y Tế | HealthCare',
  description: 'Danh sách các dịch vụ khám chữa bệnh chất lượng cao tại HealthCare Clinic.',
};

// Danh sách dịch vụ (Mock Data - Có thể lấy từ API sau này)
const services = [
  {
    id: 1,
    title: 'Khám Tổng Quát',
    description: 'Kiểm tra sức khỏe định kỳ, xét nghiệm máu, nước tiểu, đo huyết áp và tư vấn lối sống.',
    price: 500000,
    icon: Stethoscope,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    id: 2,
    title: 'Nhi Khoa',
    description: 'Chăm sóc sức khỏe toàn diện cho trẻ sơ sinh, trẻ em và thanh thiếu niên.',
    price: 300000,
    icon: Baby,
    color: 'text-pink-600 bg-pink-50',
  },
  {
    id: 3,
    title: 'Tim Mạch',
    description: 'Chẩn đoán và điều trị các bệnh lý về tim mạch, điện tâm đồ (ECG), siêu âm tim.',
    price: 800000,
    icon: HeartPulse,
    color: 'text-red-600 bg-red-50',
  },
  {
    id: 4,
    title: 'Da Liễu',
    description: 'Điều trị mụn, dị ứng, các bệnh viêm da và tư vấn chăm sóc thẩm mỹ da.',
    price: 400000,
    icon: ScanFace,
    color: 'text-orange-600 bg-orange-50',
  },
  {
    id: 5,
    title: 'Xét Nghiệm',
    description: 'Hệ thống phòng Lab hiện đại, trả kết quả nhanh chóng và chính xác.',
    price: 200000,
    icon: Microscope,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    id: 6,
    title: 'Vật Lý Trị Liệu',
    description: 'Phục hồi chức năng sau chấn thương, điều trị đau nhức xương khớp.',
    price: 350000,
    icon: Activity,
    color: 'text-green-600 bg-green-50',
  },
];

// Quy trình khám bệnh
const processSteps = [
  {
    title: 'Đặt Lịch Hẹn',
    desc: 'Chọn bác sĩ và giờ khám trực tuyến.',
    icon: CalendarCheck,
  },
  {
    title: 'Khám Bệnh',
    desc: 'Gặp trực tiếp bác sĩ chuyên khoa.',
    icon: Stethoscope,
  },
  {
    title: 'Chẩn Đoán & Kê Đơn',
    desc: 'Nhận kết quả và phác đồ điều trị.',
    icon: FileText,
  },
  {
    title: 'Chăm Sóc Sau Khám',
    desc: 'Theo dõi sức khỏe và tái khám.',
    icon: UserCheck,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Dịch Vụ Y Tế <span className="text-blue-400">Chuyên Sâu</span>
          </h1>
          <p className="text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Chúng tôi cung cấp đa dạng các dịch vụ y tế với trang thiết bị hiện đại và đội ngũ chuyên gia hàng đầu, 
            cam kết mang lại trải nghiệm chăm sóc sức khỏe tốt nhất cho bạn.
          </p>
        </div>
      </section>

      {/* --- 2. SERVICES GRID --- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Các Chuyên Khoa & Dịch Vụ
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Giải pháp chăm sóc sức khỏe toàn diện cho mọi lứa tuổi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id}
                  className="group relative flex flex-col bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color}`}>
                    <Icon size={28} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Giá tham khảo</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                    <Link href="/register">
                      <Button variant="outline" size="small" className="rounded-full">
                        Đặt lịch
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 3. PROCESS (QUY TRÌNH) --- */}
      <section className="bg-blue-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Quy Trình Khám Bệnh</h2>
            <p className="mt-4 text-gray-600">Đơn giản, nhanh chóng và hiệu quả trong 4 bước.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Đường nối (chỉ hiện trên desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-blue-50 mb-6 z-10">
                    <Icon size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 px-4">{step.desc}</p>
                  
                  {/* Số bước */}
                  <div className="absolute top-0 right-1/2 translate-x-8 -translate-y-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 4. CTA --- */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
            Bạn cần tư vấn chi tiết hơn?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Đừng ngần ngại liên hệ với chúng tôi. Đội ngũ bác sĩ luôn sẵn sàng giải đáp mọi thắc mắc về sức khỏe của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="large" variant="outline" className="w-full sm:w-auto">
                Liên Hệ Tư Vấn
              </Button>
            </Link>
            <Link href="/register">
              <Button size="large" className="w-full sm:w-auto group">
                Đặt Lịch Khám Ngay
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}