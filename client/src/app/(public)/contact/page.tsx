import React from 'react';
import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export const metadata: Metadata = {
  title: 'Liên Hệ | HealthCare',
  description: 'Liên hệ với đội ngũ hỗ trợ của HealthCare. Chúng tôi luôn sẵn sàng lắng nghe bạn.',
};

export default function ContactPage() {
  // Danh sách thông tin liên hệ
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ phòng khám',
      details: ['123 Đường Nguyễn Văn Linh, Quận 7', 'TP. Hồ Chí Minh, Việt Nam'],
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Phone,
      title: 'Hotline hỗ trợ',
      details: ['+84 123 456 789', '+84 987 654 321'],
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Mail,
      title: 'Email liên hệ',
      details: ['contact@healthcare.vn', 'support@healthcare.vn'],
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      details: ['Thứ 2 - Thứ 6: 07:00 - 20:00', 'Thứ 7 - CN: 08:00 - 17:00'],
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-gray-50 py-16 sm:py-24 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-lg text-gray-600 leading-8">
            Bạn có thắc mắc về dịch vụ hay cần tư vấn sức khỏe? <br />
            Đội ngũ HealthCare luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* CỘT TRÁI: Thông tin & Bản đồ */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Liên Lạc</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${item.color}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        {item.details.map((line, i) => (
                          <p key={i} className="text-sm text-gray-600">{line}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bản đồ (Nhúng iframe Google Maps) */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[350px] w-full relative bg-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6696584237116!2d106.66488007465862!3d10.75992005949606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3a85d%3A0x96a9380720798e2b!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
              />
            </div>
          </div>

          {/* CỘT PHẢI: Form liên hệ */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gửi Tin Nhắn</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Điền vào biểu mẫu bên dưới, chúng tôi sẽ phản hồi qua email trong vòng 24 giờ.
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                  <Input placeholder="Nguyễn Văn A" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" placeholder="email@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <Input type="tel" placeholder="+84..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                <Input placeholder="VD: Tư vấn đặt lịch, Phản ánh dịch vụ..." required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung tin nhắn</label>
                <Textarea 
                  rows={4} 
                  placeholder="Nhập nội dung chi tiết..." 
                  className="resize-none"
                  required
                />
              </div>

              <Button size="large" className="w-full flex items-center justify-center gap-2">
                <Send size={18} />
                Gửi Tin Nhắn Ngay
              </Button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Bằng việc gửi tin nhắn, bạn đồng ý với chính sách bảo mật thông tin của chúng tôi.
              </p>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}