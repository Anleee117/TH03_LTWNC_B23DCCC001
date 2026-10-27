import Link from 'next/link';
import { FileQuestion, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        gap: '16px',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FileQuestion size={28} />
      </div>

      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-500)', marginBottom: '4px' }}>
          LỖI 404
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-title)', marginBottom: '6px' }}>
          Không tìm thấy trang hoặc deadline
        </h2>
        <p style={{ color: 'var(--text-tertiary)', maxWidth: '440px', fontSize: '13px', lineHeight: 1.5 }}>
          Nội dung bạn đang tìm kiếm không tồn tại, đã bị xoá hoặc đường dẫn không chính xác.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        <Link href="/" className="btn btn-primary" id="btn-home-404">
          <Home size={14} />
          <span>Về trang chủ</span>
        </Link>
        <Link href="/deadlines" className="btn btn-secondary" id="btn-deadlines-404">
          <BookOpen size={14} />
          <span>Xem danh sách deadline</span>
        </Link>
      </div>
    </div>
  );
}
