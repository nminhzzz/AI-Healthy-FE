'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        full_name: fullName,
      });

      router.push('/login');
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Đăng ký thất bại. Email có thể đã tồn tại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900 p-8 shadow-xl border border-slate-800">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Tạo tài khoản
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Trở thành thành viên của HealthShop AI
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="fullName"
              type="text"
              label="Họ và Tên"
              placeholder="Nguyễn Văn A"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              id="email"
              type="email"
              label="Địa chỉ Email"
              placeholder="Ví dụ: ban@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              type="password"
              label="Mật khẩu"
              placeholder="Tối thiểu 6 ký tự"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <p className="text-xs text-slate-400">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <Link href="/terms" className="text-emerald-400 hover:underline">
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link href="/privacy" className="text-emerald-400 hover:underline">
                Chính sách bảo mật
              </Link>{' '}
              của chúng tôi.
            </p>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Tạo tài khoản
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
