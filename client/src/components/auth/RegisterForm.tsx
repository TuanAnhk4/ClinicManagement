'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

// Import Components chuẩn
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select'; // Component Select xịn
import { AuthWrapper } from './AuthWrapper';
import { SocialButtons } from './SocialButtons';

// Import Logic
import { authService } from '@/services/auth.service';
import { RegisterPayload } from '@/types/auth';
import { Gender } from '@/types/enums';

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm = ({ onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) => {
  // --- State ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // ML Features
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [children, setChildren] = useState(0);
  const [isSmoker, setIsSmoker] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }
    if (!termsAccepted) {
      setError('Bạn cần đồng ý với điều khoản dịch vụ.');
      return;
    }

    setLoading(true);

    try {
      // Tính BMI
      let calculatedBMI = undefined;
      if (height && weight) {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        if (h > 0) {
          calculatedBMI = parseFloat((w / (h * h)).toFixed(2));
        }
      }

      const payload: RegisterPayload = {
        fullName,
        email,
        password,
        phoneNumber,
        date_of_birth: dob || undefined,
        gender,
        bmi: calculatedBMI,
        children: Number(children),
        is_smoker: isSmoker,
      };

      // Gọi qua Service
      await authService.register(payload);

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        router.push('/login');
      }

    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Đăng ký thất bại.');
      } else {
        setError('Lỗi không xác định.');
      }
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { label: 'Nam', value: Gender.MALE },
    { label: 'Nữ', value: Gender.FEMALE },
    { label: 'Khác', value: 'OTHER' },
  ];

  return (
    <AuthWrapper
      title="Tạo Tài Khoản Mới"
      subtitle="Tham gia cùng chúng tôi để chăm sóc sức khỏe tốt hơn"
      className="max-w-2xl" // Form đăng ký dài nên cho rộng hơn chút
      footerLink={
        !onSwitchToLogin ? {
          text: "Đã có tài khoản?",
          linkText: "Đăng nhập ngay",
          href: "/login"
        } : undefined
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Họ và Tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Input type="tel" placeholder="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        {/* 2. Thông tin sức khỏe (Nhóm lại cho đẹp) */}
        <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase">Hồ Sơ Sức Khỏe</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Ngày sinh</label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} 
                className="text-sm text-left w-full block"
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Giới tính</label>
                {/* Sử dụng component Select chuẩn */}
                <Select 
                    options={genderOptions}
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input type="number" placeholder="Cao (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
            <Input type="number" placeholder="Nặng (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Input type="number" placeholder="Số con" value={children} onChange={(e) => setChildren(Number(e.target.value))} min={0} />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
             <input type="checkbox" checked={isSmoker} onChange={(e) => setIsSmoker(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
             <span className="text-sm text-gray-700">Bạn có hút thuốc không?</span>
          </label>
        </div>

        {/* 3. Mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        {/* 4. Terms */}
        <div className="flex items-center">
          <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            Tôi đồng ý với <span className="text-blue-600 hover:underline cursor-pointer">Điều khoản dịch vụ</span>
          </label>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded text-center">{error}</div>}

        <Button type="submit" size="large" className="w-full" isLoading={loading}>
          Đăng Ký Ngay
        </Button>
      </form>
      
      <SocialButtons isLoading={loading} />

      {/* Nút chuyển đổi trong Modal */}
      {onSwitchToLogin && (
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:underline">
            Đăng nhập
          </button>
        </div>
      )}
    </AuthWrapper>
  );
};