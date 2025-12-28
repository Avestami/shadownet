'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    levelCount: 0,
    activeSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold border-b border-green-800 pb-4">SYSTEM STATUS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/50 border border-green-800 p-6 rounded hover:bg-green-900/10 transition-colors">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Registered Users</h3>
          <p className="text-4xl font-bold mt-2 text-green-400">
            {loading ? '...' : stats.userCount}
          </p>
        </div>
        
        <div className="bg-black/50 border border-green-800 p-6 rounded hover:bg-green-900/10 transition-colors">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Mission Levels</h3>
          <p className="text-4xl font-bold mt-2 text-blue-400">
            {loading ? '...' : stats.levelCount}
          </p>
        </div>
        
        <div className="bg-black/50 border border-green-800 p-6 rounded hover:bg-green-900/10 transition-colors">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Active Sessions</h3>
          <p className="text-4xl font-bold mt-2 text-yellow-400">
            {loading ? '...' : stats.activeSessions}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-green-800 rounded p-6">
          <h2 className="text-xl font-bold mb-4 text-green-300">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/levels?new=true" className="block w-full text-center py-3 border border-green-600 bg-green-900/20 hover:bg-green-900/40 transition-colors rounded">
              Deploy New Level
            </Link>
            <Link href="/admin/users" className="block w-full text-center py-3 border border-blue-600 bg-blue-900/20 hover:bg-blue-900/40 transition-colors rounded text-blue-300">
              Manage Agents
            </Link>
          </div>
        </div>

        <div className="border border-green-800 rounded p-6">
          <h2 className="text-xl font-bold mb-4 text-green-300">System Logs</h2>
          <div className="font-mono text-sm space-y-2 h-40 overflow-y-auto opacity-70">
            <p>[SYSTEM] Admin session initiated...</p>
            <p>[SYSTEM] Dashboard loaded successfully.</p>
            <p>[SECURITY] Monitoring active connections.</p>
            <p>[DATABASE] Sync status: OPTIMAL.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
