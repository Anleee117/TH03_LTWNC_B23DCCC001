'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, Shield, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const safeCallbackUrl = callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
    ? callbackUrl
    : '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password: password.trim(),
        redirect: false
      });

      if (!result || result.error) {
        setError('Email hoặc mật khẩu không chính xác.');
        setLoading(false);
      } else {
        router.push(safeCallbackUrl);
        router.refresh();
      }
    } catch {
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const fillAccount = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
  };

  return (
    <div className="card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto', padding: '32px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className="brand-badge" style={{ width: '40px', height: '40px', margin: '0 auto 12px', fontSize: '16px' }}>
          PTIT
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-title)', marginBottom: '4px' }}>
          Đăng nhập hệ thống
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
          Cổng thông tin Class Deadline Hub khoa CNTT
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            color: 'var(--danger-text)',
            fontSize: '13px',
            marginBottom: '18px'
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={13} />
            <span>Email tài khoản</span>
          </label>
          <input
            id="email"
            type="email"
            required
            className="form-input"
            placeholder="vd: sv@ptit.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={13} />
            <span>Mật khẩu</span>
          </label>
          <input
            id="password"
            type="password"
            required
            className="form-input"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          id="btn-submit-login"
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '10px',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="spin-icon" />
              <span>Đang xác thực...</span>
            </>
          ) : (
            <>
              <LogIn size={15} />
              <span>Đăng nhập Credentials</span>
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>HOẶC</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        <button
          type="button"
          onClick={() => signIn('github', { callbackUrl: safeCallbackUrl })}
          className="btn btn-outline"
          id="btn-login-github"
          style={{ width: '100%', padding: '9px 12px', fontSize: '13px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>Đăng nhập với GitHub</span>
        </button>
      </form>

      <div
        style={{
          marginTop: '24px',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px'
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px', textAlign: 'center' }}>
          Tài khoản kiểm thử theo đề bài:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            onClick={() => fillAccount('admin@ptit.edu.vn', 'admin123')}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '7px 12px', justifyContent: 'space-between', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} color="var(--primary-600)" />
              <span>Lớp trưởng (Admin)</span>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>admin123</span>
          </button>

          <button
            type="button"
            onClick={() => fillAccount('sv@ptit.edu.vn', 'sv123456')}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '7px 12px', justifyContent: 'space-between', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={13} color="var(--info-text)" />
              <span>Sinh viên (User)</span>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>sv123456</span>
          </button>
        </div>
      </div>
    </div>
  );
}
