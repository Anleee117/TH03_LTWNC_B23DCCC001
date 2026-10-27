export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '16px'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(220, 38, 38, 0.2)',
          borderTopColor: '#dc2626',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Đang tải dữ liệu deadline...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
