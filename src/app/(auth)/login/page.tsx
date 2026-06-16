'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, getMe } from '@/services/authService';
import { useAuthStore } from '@/lib/stores/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Gọi API login để lấy token
      const data = await login({ username: email, password });
      
      // 2. Tạm thời set token vào store để apiClient có thể móc ra dùng
      setAccessToken(data.access_token);

      // 3. Gọi API getMe để lấy thông tin thực tế của user (bao gồm cả role)
      const userData = await getMe();
      
      // 4. Lưu toàn bộ thông tin đầy đủ vào store
      setAuth(data.access_token, userData);

      // 5. Chuyển hướng
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'
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
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Chào mừng trở lại HealthShop AI
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
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Đăng nhập
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Tạo tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}
