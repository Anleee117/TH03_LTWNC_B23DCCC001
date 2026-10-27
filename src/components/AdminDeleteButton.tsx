'use client';

import { useState, useTransition } from 'react';
import { deleteDeadlineAction } from '@/app/actions/deadline-actions';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface AdminDeleteButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export default function AdminDeleteButton({
  deadlineId,
  deadlineTitle
}: AdminDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xoá deadline "${deadlineTitle}" không?`);
    if (!confirmed) return;

    setError('');
    startTransition(async () => {
      const res = await deleteDeadlineAction(deadlineId);
      if (!res.success) {
        setError(res.message || 'Xoá thất bại');
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="btn btn-danger"
        style={{ padding: '6px 12px', fontSize: '12px' }}
        id={`btn-delete-${deadlineId}`}
      >
        {isPending ? (
          <>
            <Loader2 size={13} className="spin-icon" />
            <span>Đang xoá...</span>
          </>
        ) : (
          <>
            <Trash2 size={13} />
            <span>Xoá</span>
          </>
        )}
      </button>
      {error && <span style={{ fontSize: '11px', color: 'var(--danger-text)' }}>{error}</span>}
    </div>
  );
}
