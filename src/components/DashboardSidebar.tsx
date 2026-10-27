'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { LayoutDashboard, BookOpen, Shield, ArrowLeft, GraduationCap } from 'lucide-react';

interface DashboardSidebarProps {
  userName: string;
  userRole: UserRole;
  userEmail: string;
}

export default function DashboardSidebar({
  userName,
  userRole,
  userEmail
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="card"
      style={{
        width: '100%',
        maxWidth: '260px',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '24px'
      }}
    >
      <div>
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {userRole === 'admin' ? (
              <Shield size={16} color="var(--primary-600)" />
            ) : (
              <GraduationCap size={16} color="var(--info-text)" />
            )}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-title)' }}>
              {userName}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
            {userEmail}
          </div>
          <div style={{ marginTop: '8px' }}>
            <span className={`tag ${userRole === 'admin' ? 'tag-red' : 'tag-blue'}`} style={{ fontSize: '11px' }}>
              {userRole === 'admin' ? 'Lớp trưởng (Admin)' : 'Sinh viên (User)'}
            </span>
          </div>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>
              <Link
                href="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: pathname === '/dashboard' ? 600 : 500,
                  color: pathname === '/dashboard' ? 'var(--primary-600)' : 'var(--text-secondary)',
                  backgroundColor: pathname === '/dashboard' ? 'var(--primary-50)' : 'transparent',
                  borderLeft: pathname === '/dashboard' ? '3px solid var(--primary-600)' : '3px solid transparent'
                }}
              >
                <LayoutDashboard size={15} />
                <span>Tiến độ cá nhân</span>
              </Link>
            </li>

            <li>
              <Link
                href="/deadlines"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: pathname === '/deadlines' ? 600 : 500,
                  color: pathname === '/deadlines' ? 'var(--primary-600)' : 'var(--text-secondary)',
                  backgroundColor: pathname === '/deadlines' ? 'var(--primary-50)' : 'transparent',
                  borderLeft: pathname === '/deadlines' ? '3px solid var(--primary-600)' : '3px solid transparent'
                }}
              >
                <BookOpen size={15} />
                <span>Tất cả deadline lớp</span>
              </Link>
            </li>

            {userRole === 'admin' && (
              <li>
                <Link
                  href="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: pathname === '/admin' ? 600 : 500,
                    color: pathname === '/admin' ? 'var(--primary-600)' : 'var(--text-secondary)',
                    backgroundColor: pathname === '/admin' ? 'var(--primary-50)' : 'transparent',
                    borderLeft: pathname === '/admin' ? '3px solid var(--primary-600)' : '3px solid transparent'
                  }}
                >
                  <Shield size={15} />
                  <span>Quản trị lớp</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
        <Link href="/" className="btn btn-outline" style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }}>
          <ArrowLeft size={13} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </aside>
  );
}
