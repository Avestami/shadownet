'use client';

import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-green-500 animate-pulse">Scanning user database...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-400">Active Agents</h1>
        <div className="text-sm text-green-600">Total: {users.length}</div>
      </div>
      
      <div className="overflow-x-auto border border-green-800 rounded bg-black/50 backdrop-blur-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-green-900/20 text-green-300 uppercase font-mono border-b border-green-800">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Score</th>
              <th className="p-4">Current Level</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-900/30">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-green-900/10 transition-colors">
                <td className="p-4 font-mono font-bold text-green-100">{user.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    user.role === 'ADMIN' 
                      ? 'bg-red-900/20 text-red-400 border-red-800' 
                      : 'bg-blue-900/20 text-blue-400 border-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 font-mono text-yellow-500">{user.score}</td>
                <td className="p-4 uppercase font-mono text-blue-300">{user.currentLevel}</td>
                <td className="p-4 text-gray-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => alert('Edit feature coming soon')}
                    className="text-green-400 hover:text-green-200 hover:underline"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
