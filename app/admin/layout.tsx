'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import MatrixBackground from '../components/MatrixBackground';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    // Check if user is logged in and has admin role
    const userRole = (session?.user as any)?.role;
    
    if (!session || userRole !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500 font-mono">
        <div>Loading Admin Interface...</div>
      </div>
    );
  }

  // Double check render protection
  const userRole = (session?.user as any)?.role;
  if (!session || userRole !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative">
      <MatrixBackground colorCode="green" density="low" />
      <div className="relative z-10">
        <nav className="border-b border-green-800 bg-black/90 p-4 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-xl font-bold flex items-center gap-2">
              <span className="text-green-400">root@shadownet</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~#</span>
            </div>
            <div className="space-x-6 text-sm">
              <Link href="/admin" className="hover:text-white transition-colors">DASHBOARD</Link>
              <Link href="/admin/users" className="hover:text-white transition-colors">USERS</Link>
              <Link href="/admin/levels" className="hover:text-white transition-colors">LEVELS</Link>
              <Link href="/" className="text-red-500 hover:text-red-300 transition-colors border border-red-900 px-3 py-1 rounded bg-red-900/20">EXIT</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
