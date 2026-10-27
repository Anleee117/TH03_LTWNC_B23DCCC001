import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/data';
import AdminDeadlineForm from '@/components/AdminDeadlineForm';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản trị Deadline Lớp | Lớp trưởng',
  description: 'Trang quản lý, thêm và xoá deadline học tập khoa CNTT',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (!can(session.user.role, 'create')) {
    redirect('/403');
  }

  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines()
  ]);

  return (
    <div className="container" style={{ padding: '16px 20px 48px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
          <span className="tag tag-red">
            <Shield size={12} />
            <span>SSR • QUYỀN LỚP TRƯỞNG (ADMIN)</span>
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
          Quản trị Cổng Deadline Lớp
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
          Thêm nhiệm vụ học tập mới và quản lý các deadline hiện có của lớp
        </p>
      </div>

      <AdminDeadlineForm subjects={subjects} />

      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-title)' }}>
          Danh sách deadline đang quản lý ({deadlines.length})
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                <span className="tag tag-neutral">{deadline.subjectCode}</span>
                <span
                  className={`tag ${
                    deadline.priority === 'high'
                      ? 'tag-red'
                      : deadline.priority === 'medium'
                      ? 'tag-amber'
                      : 'tag-green'
                  }`}
                >
                  {deadline.priority.toUpperCase()}
                </span>
                <span className="tag tag-neutral">
                  ID: #{deadline.id}
                </span>
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                <Link href={`/deadlines/${deadline.id}`} style={{ color: 'var(--text-title)' }}>
                  {deadline.title}
                </Link>
              </h3>

              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Hạn chót: {new Date(deadline.dueDate).toLocaleString('vi-VN')} • {deadline.subjectName}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                href={`/deadlines/${deadline.id}`}
                className="btn btn-secondary"
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                <span>Xem</span>
                <ChevronRight size={12} />
              </Link>
              <AdminDeleteButton deadlineId={deadline.id} deadlineTitle={deadline.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
