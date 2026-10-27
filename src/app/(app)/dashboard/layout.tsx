import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardSidebar from '@/components/DashboardSidebar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="container">
      <div
        style={{
          display: 'flex',
          gap: '28px',
          alignItems: 'flex-start',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        <DashboardSidebar
          userName={session.user.name}
          userRole={session.user.role}
          userEmail={session.user.email}
        />
        <div style={{ flex: 1, minWidth: '300px' }}>{children}</div>
      </div>
    </div>
  );
}
