'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toggleDeadlineCompleteAction } from '@/app/actions/deadline-actions';
import { CheckCircle2, Check, Loader2 } from 'lucide-react';

interface MarkCompleteButtonProps {
  deadlineId: string;
  initialCompleted?: boolean;
}

export default function MarkCompleteButton({
  deadlineId,
  initialCompleted
}: MarkCompleteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [completed, setCompleted] = useState<boolean>(initialCompleted ?? false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (initialCompleted !== undefined) {
      setCompleted(initialCompleted);
      return;
    }

    if (session?.user?.id) {
      fetch('/api/user/completions')
        .then((res) => res.json())
        .then((data: { completedIds: string[] }) => {
          if (Array.isArray(data.completedIds)) {
            setCompleted(data.completedIds.includes(deadlineId));
          }
        })
        .catch(() => {});
    }
  }, [deadlineId, initialCompleted, session]);

  const handleToggle = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    startTransition(async () => {
      const res = await toggleDeadlineCompleteAction(deadlineId);
      if (res.success && res.data) {
        setCompleted(res.data.completed);
        setFeedback(res.data.completed ? 'Đã lưu hoàn thành' : 'Đã huỷ hoàn thành');
        setTimeout(() => setFeedback(''), 3000);
      } else {
        setFeedback(res.message || 'Lỗi xử lý');
        setTimeout(() => setFeedback(''), 4000);
      }
    });
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`btn ${completed ? 'btn-success' : 'btn-outline'}`}
        id={`btn-complete-${deadlineId}`}
        style={{
          minWidth: '170px',
          opacity: isPending ? 0.7 : 1,
          cursor: isPending ? 'wait' : 'pointer',
          padding: '7px 14px',
          fontSize: '12px'
        }}
      >
        {isPending ? (
          <>
            <Loader2 size={13} className="spin-icon" />
            <span>Đang lưu...</span>
          </>
        ) : completed ? (
          <>
            <CheckCircle2 size={13} />
            <span>Đã hoàn thành</span>
          </>
        ) : (
          <>
            <Check size={13} />
            <span>Đánh dấu hoàn thành</span>
          </>
        )}
      </button>
      {feedback && (
        <span
          style={{
            fontSize: '11px',
            color: completed ? '#34d399' : 'var(--text-secondary)',
            textAlign: 'center'
          }}
        >
          {feedback}
        </span>
      )}
    </div>
  );
}
