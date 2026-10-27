import Link from 'next/link';
import UserNav from './UserNav';
import { Home, CalendarClock, LayoutDashboard, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <div className="brand-logo-mark">
            <CalendarClock size={19} strokeWidth={2.3} />
          </div>
          <span className="brand-title">Class Deadline Hub</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">
                <Home size={14} />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link href="/deadlines" className="nav-link">
                <CalendarClock size={14} />
                <span>Deadlines</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="nav-link">
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin" className="nav-link">
                <Shield size={14} />
                <span>Quản trị</span>
              </Link>
            </li>
          </ul>
        </nav>

        <UserNav />
      </div>
    </header>
  );
}
