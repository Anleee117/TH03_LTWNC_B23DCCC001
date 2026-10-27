import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: '403 - Quyền truy cập bị từ chối',
  robots: {
    index: false,
    follow: false
  }
};

export default function ForbiddenPage() {
  return (
    <div className="container" style={{ padding: '64px 20px', textAlign: 'center' }}>
      <div
        className="card"
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ShieldAlert size={28} />
        </div>

        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-title)', marginBottom: '8px' }}>
            Truy cập bị từ chối (403 Forbidden)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
            Khu vực này chỉ dành riêng cho tài khoản Lớp trưởng (Admin). Tài khoản sinh viên không có quyền truy cập hoặc thực hiện thao tác quản trị.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <Link href="/dashboard" className="btn btn-primary" id="btn-back-dashboard">
            <ArrowLeft size={14} />
            <span>Về Dashboard</span>
          </Link>
          <Link href="/" className="btn btn-outline" id="btn-back-home">
            <Home size={14} />
            <span>Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
