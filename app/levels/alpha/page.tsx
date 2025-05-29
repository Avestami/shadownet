'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../../context/UserProvider';
import MatrixBackground from '../../components/MatrixBackground';

export default function AlphaLevel() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-green-500 relative">
      <MatrixBackground colorCode="green" density="medium" />
      
      {/* Level Lock Status Banner */}
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-900/80 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Level Navigation Panel */}
        <div className="fixed right-4 top-20 bg-black/80 border border-green-500 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-mono mb-4">Level Access Status</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center text-green-400">
              <span className="mr-2">●</span>
              <span>ALPHA - Current Level</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">🔒</span>
              <span>BETA - Locked</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">🔒</span>
              <span>GAMMA - Locked</span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">🔒</span>
              <span>More levels locked</span>
            </div>
          </div>
        </div>

        {/* Main Level Content */}
        <div className="mt-16">
          <h1 className="text-4xl font-mono mb-8">Level Alpha: Perimeter Security</h1>
          <div className="bg-black/80 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-mono mb-4">Mission Objectives</h2>
            <ul className="space-y-3 font-mono">
              <li className="flex items-center">
                <span className="mr-2">→</span>
                <span>Bypass the initial security systems</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                <span>Decrypt the first set of encrypted files</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">→</span>
                <span>Make your first crucial decision that will affect your karma</span>
              </li>
            </ul>
            
            <div className="mt-8 p-4 bg-green-900/20 rounded border border-green-500/50">
              <p className="text-sm font-mono">
                <span className="text-yellow-400">⚠ NOTE:</span> Complete this level to unlock access to Level Beta.
                Your performance and decisions here will influence your progression path.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 