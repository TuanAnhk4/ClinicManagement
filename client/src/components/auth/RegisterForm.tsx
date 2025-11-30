'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Vẫn giữ lại router cho fallback
import Link from 'next/link';
import api from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AxiosError } from 'axios';

// Props giữ nguyên
interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm = ({ onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) => {
  // --- BẮT ĐẦU PHẦN LOGIC TỪ RegisterPage CŨ ---
  // State cho các trường input
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // --- State Mới Cho ML Features ---
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE'); // Mặc định
  const [height, setHeight] = useState(''); // cm
  const [weight, setWeight] = useState(''); // kg
  const [children, setChildren] = useState(0);
  const [isSmoker, setIsSmoker] = useState(false);

  // State cho UI
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Giữ lại router cho fallback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    // Kiểm tra điều khoản (nếu giữ lại checkbox này)
    if (!termsAccepted) {
       setError('Bạn cần đồng ý với điều khoản dịch vụ.');
       return;
    }

    setError('');
    setLoading(true);

    try {
      // 1. Tính toán BMI
      let calculatedBMI = null;
      if (height && weight) {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        if (heightInMeters > 0) {
          // Công thức: kg / m^2
          calculatedBMI = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(2));
        }
      }
      // 2. Chuẩn bị Payload gửi lên API
      const payload = {
        fullName,
        email,
        password,
        phoneNumber,
        date_of_birth: dob || null,
        gender,
        bmi: calculatedBMI, // Gửi giá trị BMI đã tính
        children: Number(children),
        is_smoker: isSmoker,
      };
      // 3 goi api
      await api.post('/auth/register', { payload });

      // Xử lý khi đăng ký thành công
      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');

      // Ưu tiên gọi callback onRegisterSuccess (để đóng modal/chuyển modal)
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
         // Fallback: Tự chuyển hướng về login nếu không có callback
         router.push('/login');
      }

    } catch (err) {
      // Xử lý các lỗi từ server
      if (err instanceof AxiosError) {
        if (err.response && err.response.data && typeof err.response.data.message === 'string') {
           setError(err.response.data.message); // Hiển thị lỗi từ backend (vd: email đã tồn tại)
        } else {
           setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
      } else {
        setError('Đã có lỗi không xác định xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };
  // --- KẾT THÚC PHẦN LOGIC ---

  // --- PHẦN JSX GIỮ NGUYÊN NHƯ FILE RegisterForm TRƯỚC ---
return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Cột trái: Hình ảnh minh họa */}
      <div className="hidden md:flex flex-col items-center justify-center bg-blue-600 p-8 text-white">
        <div className="mb-6">
          {/* Placeholder cho Logo/Image */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Tham Gia Cùng Chúng Tôi</h2>
        <p className="text-center text-blue-100">
          Tạo hồ sơ sức khỏe cá nhân để nhận được sự chăm sóc tốt nhất và dự đoán chi phí chính xác.
        </p>
      </div>

      {/* Cột phải: Form đăng ký */}
      <div className="p-8 space-y-4 max-h-[80vh] overflow-y-auto"> {/* Thêm scroll nếu form dài */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">Tạo Tài Khoản Mới</h1>
          <p className="text-gray-500 text-sm">Nhập thông tin chi tiết của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* --- Thông Tin Cơ Bản --- */}
          <div className="grid grid-cols-1 gap-3">
            <Input placeholder="Họ và Tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="tel" placeholder="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          {/* --- Thông Tin Sức Khỏe & Nhân Khẩu (Mới) --- */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin sức khỏe (Quan trọng)</p>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 ml-1">Ngày sinh</label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="text-sm" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 ml-1">Giới tính</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)} 
                  className="w-full p-2 border rounded-md border-gray-300 h-10 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <Input type="number" placeholder="Chiều cao (cm)" value={height} onChange={(e) => setHeight(e.target.value)} min="0" />
              </div>
              <div className="flex-1">
                <Input type="number" placeholder="Cân nặng (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex-1">
                 <Input type="number" placeholder="Số con" value={children} onChange={(e) => setChildren(Number(e.target.value))} min="0" />
              </div>
              <div className="flex-1 flex items-center h-10 pl-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={isSmoker}
                    onChange={(e) => setIsSmoker(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Hút thuốc?</span>
                </label>
              </div>
            </div>
          </div>

          {/* --- Mật Khẩu --- */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <Input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          {/* Terms */}
          <div className="flex items-center pt-2">
            <input 
              id="terms" 
              type="checkbox" 
              checked={termsAccepted} 
              onChange={(e) => setTermsAccepted(e.target.checked)} 
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản dịch vụ</span>
            </label>
          </div>

          {/* Error & Submit */}
          {error && <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</p>}

          <Button type="submit" size="large" className="w-full" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Ngay'}
          </Button>

          {/* Switch to Login */}
          <p className="text-sm text-center text-gray-600 pt-2">
            Đã có tài khoản?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};