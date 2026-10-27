'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface AuthButtonProps {
  isAuthenticated: boolean;
  loginText?: string;
  logoutText?: string;
}

export default function AuthButton({
  isAuthenticated,
  loginText = 'Đăng nhập',
  logoutText = 'Đăng xuất'
}: AuthButtonProps) {
  if (isAuthenticated) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="btn btn-secondary"
        type="button"
        id="btn-sign-out"
      >
        {logoutText}
      </button>
    );
  }

  return (
    <Link href="/login" className="btn btn-primary" id="btn-sign-in">
      {loginText}
    </Link>
  );
}
