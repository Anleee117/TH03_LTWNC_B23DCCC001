'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Shield, GraduationCap, LogOut, LogIn, ChevronDown, LayoutDashboard, User } from 'lucide-react';

export default function UserNav() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ height: '36px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Đang tải...</span>
      </div>
    );
  }

  if (user) {
    const initials = user.role === 'admin' ? 'LT' : 'SV';
    const avatarBg = user.role === 'admin'
      ? 'linear-gradient(135deg, #dc2626, #991b1b)'
      : 'linear-gradient(135deg, #2563eb, #1d4ed8)';

    return (
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          id="btn-user-avatar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '3px 8px 3px 4px',
            backgroundColor: isOpen ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '9999px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: avatarBg,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                border: '2px solid #ffffff'
              }}
            >
              {initials}
            </div>
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '8px',
                height: '8px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                border: '1.5px solid #ffffff'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-title)' }}>
              {user.name}
            </span>
            <span className={`tag ${user.role === 'admin' ? 'tag-red' : 'tag-blue'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
              {user.role === 'admin' ? 'Lớp trưởng' : 'Sinh viên'}
            </span>
          </div>

          <ChevronDown
            size={14}
            color="var(--text-secondary)"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          />
        </button>

        {isOpen && (
          <div
            className="card"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '270px',
              padding: '12px',
              zIndex: 100,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid var(--border-default)',
              backgroundColor: '#ffffff'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: avatarBg,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '15px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  flexShrink: 0
                }}
              >
                {initials}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`tag ${user.role === 'admin' ? 'tag-red' : 'tag-blue'}`} style={{ fontSize: '10px', padding: '1px 5px' }}>
                    {user.role === 'admin' ? 'Lớp trưởng (Admin)' : 'Sinh viên (User)'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginBottom: '8px' }}>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--text-title)',
                  transition: 'var(--transition-fast)'
                }}
                className="hover-nav"
              >
                <LayoutDashboard size={15} color="var(--primary-600)" />
                <span>Dashboard cá nhân</span>
              </Link>

              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    color: 'var(--text-title)',
                    transition: 'var(--transition-fast)'
                  }}
                  className="hover-nav"
                >
                  <Shield size={15} color="var(--primary-600)" />
                  <span>Quản trị deadline lớp</span>
                </Link>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                id="btn-sign-out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  color: 'var(--danger-text)',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                className="hover-nav"
              >
                <LogOut size={15} />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/login" className="btn btn-primary" id="btn-sign-in" style={{ padding: '7px 14px' }}>
      <LogIn size={14} />
      <span>Đăng nhập</span>
    </Link>
  );
}
