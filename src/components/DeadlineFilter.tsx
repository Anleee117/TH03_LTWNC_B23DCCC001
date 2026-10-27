'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Deadline, Subject } from '@/types';
import CountdownBadge from './CountdownBadge';
import { Search, SlidersHorizontal, BookOpen, ChevronRight, Calendar } from 'lucide-react';

interface DeadlineFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
}

export default function DeadlineFilter({
  initialDeadlines,
  subjects
}: DeadlineFilterProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = useMemo(() => {
    return initialDeadlines.filter((item) => {
      const matchSubject =
        selectedSubject === 'all' || item.subjectSlug === selectedSubject;
      const matchPriority =
        selectedPriority === 'all' || item.priority === selectedPriority;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subjectName.toLowerCase().includes(query) ||
        item.subjectCode.toLowerCase().includes(query);

      return matchSubject && matchPriority && matchQuery;
    });
  }, [initialDeadlines, selectedSubject, selectedPriority, searchQuery]);

  return (
    <div>
      <div
        className="card"
        style={{
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          padding: '16px 20px'
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="search-input" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={13} />
            <span>Tìm kiếm từ khoá</span>
          </label>
          <input
            id="search-input"
            type="text"
            className="form-input"
            placeholder="Nhập tên bài tập hoặc mã môn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="subject-select" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={13} />
            <span>Học phần</span>
          </label>
          <select
            id="subject-select"
            className="form-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">Tất cả môn học ({subjects.length})</option>
            {subjects.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="priority-select" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={13} />
            <span>Mức độ ưu tiên</span>
          </label>
          <select
            id="priority-select"
            className="form-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">Tất cả mức độ</option>
            <option value="high">Cao (High)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="low">Thấp (Low)</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '14px', color: 'var(--text-tertiary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          Hiển thị <strong style={{ color: 'var(--text-title)' }}>{filtered.length}</strong> / {initialDeadlines.length} bài tập
        </span>
        {(selectedSubject !== 'all' || selectedPriority !== 'all' || searchQuery) && (
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '3px 10px', fontSize: '12px' }}
            onClick={() => {
              setSelectedSubject('all');
              setSelectedPriority('all');
              setSearchQuery('');
            }}
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-secondary)'
          }}
        >
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>
            Không tìm thấy bài tập nào phù hợp với điều kiện tìm kiếm.
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSelectedSubject('all');
              setSelectedPriority('all');
              setSearchQuery('');
            }}
          >
            Xoá bộ lọc
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '16px'
          }}
        >
          {filtered.map((deadline) => (
            <div
              key={deadline.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                gap: '14px'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px'
                  }}
                >
                  <span className="tag tag-neutral">{deadline.subjectCode}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
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
                      {deadline.type}
                    </span>
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    marginBottom: '6px',
                    lineHeight: 1.4
                  }}
                >
                  <Link
                    href={`/deadlines/${deadline.id}`}
                    style={{ color: 'var(--text-title)' }}
                  >
                    {deadline.title}
                  </Link>
                </h3>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '10px'
                  }}
                >
                  {deadline.description.length > 100
                    ? `${deadline.description.slice(0, 100)}...`
                    : deadline.description}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} color="var(--text-tertiary)" />
                  <span style={{ fontSize: '12px', color: 'var(--text-title)', fontWeight: 500 }}>
                    {new Date(deadline.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CountdownBadge dueDate={deadline.dueDate} />
                  <Link
                    href={`/deadlines/${deadline.id}`}
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <span>Chi tiết</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
