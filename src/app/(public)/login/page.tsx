import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập | Class Deadline Hub',
  description: 'Đăng nhập hệ thống Class Deadline Hub khoa Công nghệ Thông tin PTIT',
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <div className="container" style={{ padding: '60px 20px 80px' }}>
      <LoginForm />
    </div>
  );
}
