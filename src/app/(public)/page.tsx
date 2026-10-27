import Link from 'next/link';
import { getDeadlines, getSubjects } from '@/lib/data';
import CountdownBadge from '@/components/CountdownBadge';
import { BookOpen, CalendarClock, ChevronRight, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-static';

export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines()
  ]);

  const upcomingDeadlines = [...deadlines]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div>
      <section
        style={{
          padding: '48px 0 40px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-title)',
              marginBottom: '12px',
              letterSpacing: '-0.3px',
              lineHeight: 1.25
            }}
          >
            Class Deadline Hub
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: '0 auto 24px',
              lineHeight: 1.6
            }}
          >
            Hệ thống theo dõi và quản lý deadline bài tập, tiểu luận, thực hành và đồ án chính thức dành cho sinh viên Học viện Công nghệ Bưu chính Viễn thông.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/deadlines" className="btn btn-primary" id="btn-hero-deadlines">
              <span>Xem tất cả bài tập</span>
              <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard" className="btn btn-secondary" id="btn-hero-dashboard">
              <CheckCircle2 size={14} />
              <span>Tiến độ cá nhân</span>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              maxWidth: '780px',
              margin: '36px auto 0'
            }}
          >
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-500)' }}>
                {deadlines.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Deadline đang hoạt động
              </div>
            </div>

            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--info-text)' }}>
                {subjects.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Học phần theo dõi
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-title)' }}>
                Học phần trong kỳ
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                Chọn môn học để xem thông tin giảng viên và danh sách bài tập riêng
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}
          >
            {subjects.map((subject) => {
              const count = deadlines.filter((d) => d.subjectSlug === subject.slug).length;
              return (
                <Link
                  key={subject.slug}
                  href={`/subjects/${subject.slug}`}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '18px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="tag tag-neutral">{subject.code}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {subject.credits} tín chỉ
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-title)' }}>
                    {subject.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      flex: 1
                    }}
                  >
                    {subject.description}
                  </p>
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px'
                    }}
                  >
                    <span style={{ color: 'var(--text-tertiary)' }}>{subject.teacher}</span>
                    <span style={{ color: 'var(--info-text)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                      <span>{count} bài tập</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 56px' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-title)' }}>
                Bài tập sắp đến hạn nộp
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                Các nhiệm vụ cần lưu ý hoàn thành sớm nhất
              </p>
            </div>
            <Link href="/deadlines" className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
              <span>Xem tất cả ({deadlines.length})</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px',
                  gap: '12px'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}
                  >
                    <span className="tag tag-neutral">{deadline.subjectCode}</span>
                    <span
                      className={`tag ${deadline.priority === 'high'
                        ? 'tag-red'
                        : deadline.priority === 'medium'
                          ? 'tag-amber'
                          : 'tag-green'
                        }`}
                    >
                      {deadline.priority.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.4 }}>
                    <Link href={`/deadlines/${deadline.id}`} style={{ color: 'var(--text-title)' }}>
                      {deadline.title}
                    </Link>
                  </h3>

                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}
                  >
                    {deadline.description.length > 85
                      ? `${deadline.description.slice(0, 85)}...`
                      : deadline.description}
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
                    <span>Xem</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
