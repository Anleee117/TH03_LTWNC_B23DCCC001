'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownBadgeProps {
  dueDate: string;
}

export default function CountdownBadge({ dueDate }: CountdownBadgeProps) {
  const [displayText, setDisplayText] = useState<string>('');
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(dueDate).getTime();
      const now = new Date().getTime();
      const diffMs = targetTime - now;

      if (diffMs < 0) {
        setIsOverdue(true);
        const pastDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        if (pastDays === 0) {
          const pastHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
          setDisplayText(`Quá hạn ${pastHours > 0 ? pastHours : 1} giờ`);
        } else {
          setDisplayText(`Quá hạn ${pastDays} ngày`);
        }
      } else {
        setIsOverdue(false);
        const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (remainingDays === 0) {
          const remainingHours = Math.floor(diffMs / (1000 * 60 * 60));
          setDisplayText(`Còn ${remainingHours > 0 ? remainingHours : 1} giờ`);
        } else {
          setDisplayText(`Còn ${remainingDays} ngày`);
        }
      }
    };

    calculateTime();
  }, [dueDate]);

  if (!displayText) {
    return null;
  }

  return (
    <span className={`tag ${isOverdue ? 'tag-red' : 'tag-blue'}`}>
      {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
      <span>{displayText}</span>
    </span>
  );
}
