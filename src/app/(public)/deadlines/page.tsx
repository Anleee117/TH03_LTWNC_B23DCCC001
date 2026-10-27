import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlineFilter from '@/components/DeadlineFilter';
import { Clock } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Danh sách Deadline Học phần',
  description: 'Theo dõi toàn bộ hạn nộp bài tập lớn, bài thực hành và đồ án các môn học khoa CNTT - PTIT.'
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects()
  ]);

  return (
    <div className="container" style={{ padding: '32px 24px 56px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }} className="tag tag-red">
          <Clock size={12} />
          <span>ISR • CẬP NHẬT TỰ ĐỘNG MỖI 60 GIÂY</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-title)', marginBottom: '4px' }}>
          Danh sách Deadline Lớp học
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
          Xem và lọc toàn bộ hạn nộp bài tập theo từng học phần và mức độ ưu tiên
        </p>
      </div>

      <DeadlineFilter initialDeadlines={deadlines} subjects={subjects} />
    </div>
  );
}
