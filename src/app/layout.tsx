import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap'
});

const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Class Deadline Hub | Cổng Deadline Học Tập PTIT',
    template: '%s | Class Deadline Hub'
  },
  description: 'Cổng thông tin theo dõi và quản lý deadline học tập chính thức dành cho sinh viên PTIT. Cập nhật hạn nộp bài tập, tiểu luận và đồ án.',
  keywords: ['deadline PTIT', 'quản lý deadline', 'sinh viên PTIT', 'học tập PTIT', 'Class Deadline Hub'],
  authors: [{ name: 'Ban cán sự lớp PTIT' }],
  openGraph: {
    title: 'Class Deadline Hub | Cổng Deadline Học Tập PTIT',
    description: 'Cổng thông tin theo dõi và quản lý deadline học tập dành cho sinh viên PTIT.',
    url: siteUrl,
    siteName: 'Class Deadline Hub',
    locale: 'vi_VN',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
