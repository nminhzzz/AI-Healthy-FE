import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài khoản - HealthShop AI',
  description: 'Đăng nhập hoặc đăng ký tài khoản mới tại HealthShop AI để nhận tư vấn từ AI và quản lý mua sắm.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
