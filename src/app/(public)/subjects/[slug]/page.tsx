import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDeadlinesBySubject, getSubjectBySlug, getSubjects } from '@/lib/data';
import CountdownBadge from '@/components/CountdownBadge';
import { ChevronRight, BookOpen, User, GraduationCap, Calendar } from 'lucide-react';

interface SubjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({
    slug: subject.slug
  }));
}

export async function generateMetadata({
  params
}: SubjectPageProps): Promise<Metadata> {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) {
    return {
      title: 'Không tìm thấy môn học'
    };
  }

  return {
    title: `${subject.name} (${subject.code})`,
    description: subject.description,
    openGraph: {
      title: `${subject.name} - Class Deadline Hub PTIT`,
      description: subject.description,
      type: 'website'
    }
  };
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(subject.slug);

  return (
    <div className="container" style={{ padding: '32px 24px 56px' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          marginBottom: '20px'
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Trang chủ
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-secondary)' }}>Môn học</span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-title)', fontWeight: 500 }}>{subject.code}</span>
      </nav>

      <div
        className="card"
        style={{
          marginBottom: '28px',
          padding: '28px',
          borderLeft: '4px solid var(--primary-600)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="tag tag-neutral">{subject.code}</span>
          <span className="tag tag-neutral">
            <GraduationCap size={12} />
            <span>{subject.credits} Tín chỉ</span>
          </span>
          <span className="tag tag-blue">
            <User size={12} />
            <span>Giảng viên: {subject.teacher}</span>
          </span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-title)' }}>
          {subject.name}
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, maxWidth: '800px' }}>
          {subject.description}
        </p>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-title)', marginBottom: '4px' }}>
          Danh sách deadline học phần ({deadlines.length})
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
          Các bài tập, báo cáo và đồ án cần hoàn thành của học phần này
        </p>
      </div>

      {deadlines.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Hiện chưa có deadline nào cho học phần này.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px', gap: '12px' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="tag tag-neutral">
                    {deadline.type}
                  </span>
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
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                  <Link href={`/deadlines/${deadline.id}`} style={{ color: 'var(--text-title)' }}>
                    {deadline.title}
                  </Link>
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {deadline.description}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <CountdownBadge dueDate={deadline.dueDate} />
                <Link
                  href={`/deadlines/${deadline.id}`}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  <span>Chi tiết</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
