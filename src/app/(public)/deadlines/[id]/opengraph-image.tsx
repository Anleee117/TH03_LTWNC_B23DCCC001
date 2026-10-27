import { ImageResponse } from 'next/og';
import { getDeadlineById } from '@/lib/data';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const deadline = await getDeadlineById(params.id);

  const title = deadline ? deadline.title : 'Chi tiết Deadline';
  const subject = deadline ? `${deadline.subjectCode} - ${deadline.subjectName}` : 'Học viện PTIT';
  const dueDate = deadline
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          backgroundColor: '#0a0f1d',
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(220, 38, 38, 0.25) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.25) 0%, transparent 40%)',
          color: '#ffffff',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '24px',
                color: '#ffffff'
              }}
            >
              CDH
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: '15px', color: '#94a3b8' }}>
                Học viện Công nghệ Bưu chính Viễn thông
              </span>
            </div>
          </div>
          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.5)',
              color: '#fca5a5',
              fontSize: '18px',
              fontWeight: 700
            }}
          >
            {subject}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{ fontSize: '20px', color: '#38bdf8', fontWeight: 600 }}>
            {deadline ? `${deadline.type} • Mức độ ${deadline.priority.toUpperCase()}` : ''}
          </span>
          <h1
            style={{
              fontSize: '44px',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              margin: 0
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', color: '#94a3b8' }}>Hạn chót nộp bài:</span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#f59e0b' }}>
              {dueDate}
            </span>
          </div>
          <span style={{ fontSize: '16px', color: '#64748b' }}>
            ptit.edu.vn • Class Deadline Hub
          </span>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
