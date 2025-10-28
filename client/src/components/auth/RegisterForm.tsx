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
  // Giữ lại các state khác nếu form của bạn có (phoneNumber, dob, gender, termsAccepted)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State cho UI
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
      // Gọi đến API /auth/register
      await api.post('/auth/register', {
        fullName,
        email,
        password,
        // Thêm các trường khác nếu API backend yêu cầu
      });

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
      {/* Cột trái */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 p-8 rounded-l-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mt-4">
          Chăm sóc sức khỏe toàn diện cho bạn và gia đình.
        </h2>
      </div>

      {/* Cột phải (Form) */}
      <div className="p-8 space-y-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">Tạo Tài Khoản Mới</h1>
          <p className="text-gray-500 text-sm">Tạo tài khoản để quản lý sức khỏe dễ dàng.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Inputs: Full Name, Email, Phone, DOB, Gender, Password, Confirm Password */}
          {/* ... (Giữ nguyên các thẻ input và select như code RegisterForm trước đó) ... */}
           {/* Full Name */}
           <div>
             <label htmlFor="reg-fullname" className="sr-only">Họ và Tên</label>
             <Input id="reg-fullname" placeholder="Họ và Tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
           </div>
           {/* Email */}
           <div>
             <label htmlFor="reg-email" className="sr-only">Email</label>
             <Input id="reg-email" type="email" placeholder="Địa chỉ Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
           </div>
            {/* Phone Number */}
           <div>
              <label htmlFor="reg-phone" className="sr-only">Số điện thoại</label>
              <Input id="reg-phone" type="tel" placeholder="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
           </div>
           {/* Date of Birth & Gender */}
           <div className="flex gap-4">
             <div className="flex-1">
               <label htmlFor="reg-dob" className="sr-only">Ngày sinh</label>
               <Input id="reg-dob" type="date" placeholder="Ngày sinh" value={dob} onChange={(e) => setDob(e.target.value)} className="text-gray-500" />
             </div>
             <div className="flex-1">
                <label htmlFor="reg-gender" className="sr-only">Giới tính</label>
                <select id="reg-gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 border rounded-md border-gray-300 h-10 text-gray-500">
                  <option value="" disabled>Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
             </div>
           </div>
           {/* Password */}
           <div>
              <label htmlFor="reg-password" className="sr-only">Mật khẩu</label>
              <Input id="reg-password" type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} required />
           </div>
           {/* Confirm Password */}
           <div>
              <label htmlFor="reg-confirm-password" className="sr-only">Xác nhận mật khẩu</label>
              <Input id="reg-confirm-password" type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
           </div>
          {/* Terms */}
          <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">Tôi đồng ý với <a href="/terms" target="_blank" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a></label>
          </div>
          {/* Error */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {/* Submit */}
          <Button type="submit" size="large" className="w-full" disabled={loading}>{loading ? 'Đang xử lý...' : 'Register'}</Button>
          {/* OR */}
          <div className="relative my-3"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div></div>
          {/* Social */}
          <div className="flex gap-4"><Button variant="secondary" className="w-full">Google</Button><Button variant="secondary" className="w-full">Facebook</Button></div>
          {/* Switch */}
          <p className="text-sm text-center text-gray-600">
            Đã có tài khoản?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">Sign in</button>
          </p>
        </form>
      </div>
    </div>
  );
};