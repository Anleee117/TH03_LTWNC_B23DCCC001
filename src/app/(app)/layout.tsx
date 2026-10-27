import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main style={{ flex: 1, padding: '32px 0' }}>{children}</main>
      <Footer />
    </>
  );
}
