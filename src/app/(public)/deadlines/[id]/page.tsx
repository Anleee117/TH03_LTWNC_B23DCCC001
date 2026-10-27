import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDeadlineById, getDeadlines } from '@/lib/data';
import CountdownBadge from '@/components/CountdownBadge';
import MarkCompleteButton from '@/components/MarkCompleteButton';
import { ChevronRight, Calendar, BookOpen, ArrowLeft, Clock } from 'lucide-react';

interface DeadlinePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id
  }));
}

export async function generateMetadata({
  params
}: DeadlinePageProps): Promise<Metadata> {
  const deadline = await getDeadlineById(params.id);
  if (!deadline) {
    return {
      title: 'Không tìm thấy deadline'
    };
  }

  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const pageUrl = `${siteUrl}/deadlines/${deadline.id}`;

  return {
    title: `${deadline.title} | ${deadline.subjectCode}`,
    description: deadline.description,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: `${deadline.title} (${deadline.subjectCode})`,
      description: deadline.description,
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: `${pageUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: deadline.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: deadline.title,
      description: deadline.description,
      images: [`${pageUrl}/opengraph-image`]
    }
  };
}

export default async function DeadlineDetailPage({ params }: DeadlinePageProps) {
  const deadline = await getDeadlineById(params.id);
  if (!deadline) {
    notFound();
  }

  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Danh sách Deadline',
        item: `${siteUrl}/deadlines`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `${siteUrl}/deadlines/${deadline.id}`
      }
    ]
  };

  return (
    <div className="container" style={{ padding: '32px 24px 56px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Trang chủ
        </Link>
        <ChevronRight size={12} />
        <Link href="/deadlines" style={{ color: 'var(--text-secondary)' }}>
          Deadlines
        </Link>
        <ChevronRight size={12} />
        <Link href={`/subjects/${deadline.subjectSlug}`} style={{ color: 'var(--text-secondary)' }}>
          {deadline.subjectCode}
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-title)', fontWeight: 500 }}>
          #{deadline.id}
        </span>
      </nav>

      <div
        className="card"
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '32px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href={`/subjects/${deadline.subjectSlug}`} className="tag tag-neutral">
              <BookOpen size={12} />
              <span>{deadline.subjectCode} • {deadline.subjectName}</span>
            </Link>
            <span className="tag tag-neutral">
              {deadline.type}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              className={`tag ${
                deadline.priority === 'high'
                  ? 'tag-red'
                  : deadline.priority === 'medium'
                  ? 'tag-amber'
                  : 'tag-green'
              }`}
            >
              Mức độ: {deadline.priority.toUpperCase()}
            </span>
            <CountdownBadge dueDate={deadline.dueDate} />
          </div>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '16px',
            color: 'var(--text-title)'
          }}
        >
          {deadline.title}
        </h1>

        <div
          style={{
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            padding: '18px',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Yêu cầu nội dung chi tiết
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-body)', whiteSpace: 'pre-line' }}>
            {deadline.description}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            padding: '16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              <Clock size={13} />
              <span>Thời gian hạn nộp</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--warning-text)', marginTop: '4px' }}>
              {new Date(deadline.dueDate).toLocaleString('vi-VN', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
              <BookOpen size={13} />
              <span>Học phần giảng dạy</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>
              <Link href={`/subjects/${deadline.subjectSlug}`} style={{ color: 'var(--info-text)' }}>
                {deadline.subjectName}
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-title)' }}>
              Trạng thái cá nhân:
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Đăng nhập tài khoản sinh viên để lưu tiến độ hoàn thành riêng biệt
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <MarkCompleteButton deadlineId={deadline.id} />
            <Link href="/deadlines" className="btn btn-outline" style={{ fontSize: '12px', padding: '7px 14px' }}>
              <ArrowLeft size={13} />
              <span>Danh sách</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
