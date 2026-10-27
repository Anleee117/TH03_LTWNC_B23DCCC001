'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createDeadlineAction } from '@/app/actions/deadline-actions';
import { Subject } from '@/types';
import { Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AdminDeadlineFormProps {
  subjects: Subject[];
}

export default function AdminDeadlineForm({ subjects }: AdminDeadlineFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createDeadlineAction(formData);
      if (res.success && res.data) {
        setSuccess(`Đã thêm thành công deadline "${res.data.title}"!`);
        formRef.current?.reset();
        router.refresh();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(res.message || 'Không thể tạo deadline');
      }
    });
  };

  return (
    <div className="card" style={{ marginBottom: '28px', padding: '24px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-title)', marginBottom: '4px' }}>
        Thêm Deadline Học Phần Mới
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '18px' }}>
        Thông tin bài tập sẽ được cập nhật đến toàn thể sinh viên và đồng bộ cache tức thì
      </p>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: 'var(--danger-text)',
            fontSize: '13px',
            marginBottom: '16px'
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: 'var(--success-text)',
            fontSize: '13px',
            marginBottom: '16px'
          }}
        >
          <CheckCircle2 size={15} />
          <span>{success}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Tiêu đề bài tập / deadline *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="form-input"
              placeholder="vd: Nộp bài tập thực hành số 4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subjectSlug" className="form-label">
              Học phần *
            </label>
            <select id="subjectSlug" name="subjectSlug" required className="form-select">
              <option value="">-- Chọn môn học --</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Yêu cầu chi tiết *
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="form-textarea"
            placeholder="Nội dung, quy cách nộp bài, định dạng file..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Hạn chót *
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Mức độ ưu tiên *
            </label>
            <select id="priority" name="priority" required className="form-select" defaultValue="medium">
              <option value="low">Thấp (Low)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="high">Cao (High)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Loại hình *
            </label>
            <input
              id="type"
              name="type"
              type="text"
              required
              className="form-input"
              placeholder="Bài tập lớn, Báo cáo, Đồ án..."
              defaultValue="Bài tập lớn"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary"
          id="btn-admin-submit"
          style={{
            padding: '9px 18px',
            opacity: isPending ? 0.7 : 1,
            cursor: isPending ? 'wait' : 'pointer',
            marginTop: '4px'
          }}
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="spin-icon" />
              <span>Đang lưu và làm mới cache...</span>
            </>
          ) : (
            <>
              <Plus size={15} />
              <span>Thêm Deadline Mới</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
