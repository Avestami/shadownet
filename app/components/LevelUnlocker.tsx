'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LevelUnlocker = () => {
  const [levelId, setLevelId] = useState<string>('level1');
  const [unlockCode, setUnlockCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/unlock');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setCurrentUser('User');
        }
      } catch (error) {
        console.error('Error checking login status', error);
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!username.trim()) {
      setMessage('Error: Username is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`Login successful. Welcome, ${data.username}!`);
        setIsLoggedIn(true);
        setCurrentUser(data.username);
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      setMessage('Failed to login. Please try again.');
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unlocking a level
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!isLoggedIn) {
      setMessage('Error: You must be logged in to unlock levels');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ levelId, unlockCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`Success! Level ${data.nextLevelId} unlocked. New score: ${data.score}`);
        setTimeout(() => {
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      setMessage('Failed to unlock level. Please try again.');
      console.error('Error unlocking level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-black/80 border border-red-600 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-mono text-red-500 mb-4">LEVEL UNLOCK TERMINAL</h2>
      
      {!isLoggedIn ? (
        // Login Form
        <div>
          <p className="mb-4 text-gray-400">
            You must login to access the unlock terminal.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-mono">
                Username:
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full p-2 bg-black border border-red-700 rounded font-mono text-green-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !username}
                className={`py-2 px-4 bg-red-800 hover:bg-red-700 text-white font-mono rounded ${
                  isLoading || !username ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processing...' : 'Login / Register'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Level Unlock Form
        <div>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400">
              Logged in as: <span className="text-green-400">{currentUser}</span>
            </p>
          </div>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label htmlFor="levelId" className="block mb-1 text-sm font-mono">
                Level ID:
              </label>
              <select
                id="levelId"
                value={levelId}
                onChange={(e) => setLevelId(e.target.value)}
                className="w-full p-2 bg-black border border-red-700 rounded font-mono text-green-400"
              >
                <option value="level1">Level 1 - Tehran</option>
                <option value="level2">Level 2 - Khuzestan</option>
                <option value="level3">Level 3 - Orbital Station</option>
                <option value="level4">Level 4 - Mars</option>
              </select>
            </div>

            <div>
              <label htmlFor="unlockCode" className="block mb-1 text-sm font-mono">
                Unlock Code:
              </label>
              <input
                id="unlockCode"
                type="text"
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                placeholder="Enter unlock code..."
                className="w-full p-2 bg-black border border-red-700 rounded font-mono text-green-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !unlockCode}
                className={`py-2 px-4 bg-red-800 hover:bg-red-700 text-white font-mono rounded ${
                  isLoading || !unlockCode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processing...' : 'Unlock Level'}
              </button>
            </div>
          </form>

          {levelId === 'level1' && (
            <div className="mt-4 p-2 font-mono text-xs text-gray-400 border border-gray-700 rounded">
              <strong>Hint for Level 1:</strong> The unlock code is "AVES2100_KHUZESTAN_ACCESS" (Base64 decoded)
            </div>
          )}
        </div>
      )}

      {message && (
        <div className={`mt-4 p-2 font-mono text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LevelUnlocker; 