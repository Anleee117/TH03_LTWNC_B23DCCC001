'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '20px',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(220, 38, 38, 0.15)',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 800
        }}
      >
        !
      </div>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Đã xảy ra lỗi
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '14px' }}>
          {error.message || 'Hệ thống không thể tải trang yêu cầu. Vui lòng thử lại.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="btn btn-primary"
        id="btn-retry"
      >
        Thử lại
      </button>
    </div>
  );
}
