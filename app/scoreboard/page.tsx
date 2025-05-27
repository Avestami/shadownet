'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MatrixBackground } from '../components/MatrixBackground';

interface UserScore {
  id: string;
  username: string;
  score: number;
  unlockedLevels: number;
}

export default function Scoreboard() {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch('/api/scoreboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch scoreboard data');
        }
        
        const data = await response.json();
        setScores(data.users);
      } catch (error) {
        console.error('Scoreboard error:', error);
        setError('Failed to load scoreboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchScores();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      <MatrixBackground colorCode="red" />
      
      <div className="w-full max-w-4xl p-6 bg-black/70 border border-red-600 rounded-lg shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-500 font-mono">
            SHADOWNET OPERATIVE RANKINGS
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            Top agents in the global decryption effort
          </p>
          
          {session ? (
            <p className="text-gray-300 mt-2 font-mono text-sm">
              Logged in as: <span className="text-red-400">{session.user?.username}</span>
            </p>
          ) : (
            <p className="text-gray-400 mt-4 font-mono text-xs">
              <Link href="/auth/login" className="text-red-400 hover:text-red-300">
                Login
              </Link>{' '}
              or{' '}
              <Link href="/auth/register" className="text-red-400 hover:text-red-300">
                Register
              </Link>{' '}
              to track your progress and appear on the scoreboard
            </p>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-red-500 font-mono">Loading scoreboard data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 p-4 rounded-md text-center">
            <p className="text-red-300 font-mono">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-red-800">
                  <th className="py-3 text-left font-mono text-red-400 px-4">RANK</th>
                  <th className="py-3 text-left font-mono text-red-400 px-4">AGENT</th>
                  <th className="py-3 text-left font-mono text-red-400 px-4">SCORE</th>
                  <th className="py-3 text-left font-mono text-red-400 px-4">LEVELS CLEARED</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 font-mono">
                      No agents have registered scores yet
                    </td>
                  </tr>
                ) : (
                  scores.map((user, index) => {
                    const isCurrentUser = session?.user?.id === user.id;
                    
                    return (
                      <tr 
                        key={user.id}
                        className={`${
                          isCurrentUser 
                            ? 'bg-red-900/20 border-l-2 border-red-500' 
                            : index % 2 === 0 
                              ? 'bg-black/40' 
                              : 'bg-black/20'
                        } hover:bg-red-900/10 transition-colors`}
                      >
                        <td className="py-3 px-4 font-mono text-gray-300">
                          {index + 1}
                          {index < 3 && (
                            <span className="ml-2">
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-white">
                          {user.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-red-400">(You)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-green-400">
                          {user.score}
                        </td>
                        <td className="py-3 px-4 font-mono text-blue-400">
                          {user.unlockedLevels}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/"
            className="py-2 px-4 bg-red-900 hover:bg-red-800 text-white font-mono rounded transition-colors"
          >
            Return to Main Interface
          </Link>
          
          {!session && (
            <Link
              href="/auth/login"
              className="py-2 px-4 bg-blue-900 hover:bg-blue-800 text-white font-mono rounded transition-colors"
            >
              Login to Track Progress
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 