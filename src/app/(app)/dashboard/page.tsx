import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDeadlines, getUserCompletions } from '@/lib/data';
import CountdownBadge from '@/components/CountdownBadge';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import Link from 'next/link';
import { CheckCircle2, Clock, AlertTriangle, Calendar, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard Cá Nhân | Class Deadline Hub',
  description: 'Bảng theo dõi tiến độ hoàn thành deadline học phần cá nhân của sinh viên',
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || '';

  const [deadlines, completedIds] = await Promise.all([
    getDeadlines(),
    getUserCompletions(userId)
  ]);

  const completedSet = new Set(completedIds);
  const totalCount = deadlines.length;
  const completedCount = deadlines.filter((d) => completedSet.has(d.id)).length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }} className="tag tag-red">
          <span>SSR • DỮ LIỆU CÁ NHÂN HOÁ</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
          Tiến độ học tập: {session?.user?.name}
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
          Quản lý và đánh dấu hoàn thành các bài tập, báo cáo của riêng bạn
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <FileText size={13} />
            <span>Tổng số deadline</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-title)', marginTop: '4px' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Toàn bộ học phần
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <CheckCircle2 size={13} color="var(--success-text)" />
            <span>Đã hoàn thành</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success-text)', marginTop: '4px' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Đạt {completionPercentage}% tiến độ
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <Clock size={13} color="var(--warning-text)" />
            <span>Cần hoàn thành</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning-text)', marginTop: '4px' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Đang trong hạn nộp
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-title)' }}>Tiến độ hoàn thành nhiệm vụ</span>
          <span style={{ fontWeight: 600, color: 'var(--success-text)' }}>{completionPercentage}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${completionPercentage}%`,
              height: '100%',
              backgroundColor: 'var(--success-text)',
              borderRadius: '9999px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-title)' }}>
          Danh sách nhiệm vụ cá nhân ({deadlines.length})
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {deadlines.map((deadline) => {
          const isDone = completedSet.has(deadline.id);
          return (
            <div
              key={deadline.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                gap: '14px',
                flexWrap: 'wrap',
                borderLeft: isDone ? '3px solid var(--success-text)' : '3px solid var(--border-default)'
              }}
            >
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="tag tag-neutral">{deadline.subjectCode}</span>
                  <span className={`tag ${isDone ? 'tag-green' : 'tag-amber'}`}>
                    {isDone ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                    <span>{isDone ? 'Đã xong' : 'Chưa xong'}</span>
                  </span>
                  <span className="tag tag-neutral">
                    {deadline.type}
                  </span>
                </div>

                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  <Link
                    href={`/deadlines/${deadline.id}`}
                    style={{
                      color: isDone ? 'var(--text-tertiary)' : 'var(--text-title)',
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}
                  >
                    {deadline.title}
                  </Link>
                </h3>

                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-tertiary)', alignItems: 'center' }}>
                  <span>{deadline.subjectName}</span>
                  <span>•</span>
                  <span>
                    Hạn: {new Date(deadline.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CountdownBadge dueDate={deadline.dueDate} />
                <MarkCompleteButton
                  deadlineId={deadline.id}
                  initialCompleted={isDone}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
