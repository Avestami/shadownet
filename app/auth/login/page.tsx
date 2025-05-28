'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MatrixBackground } from '../../components/MatrixBackground';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // If already authenticated, redirect to home page
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/');
    }
  }, [session, status, router]);

  // Direct login function that bypasses NextAuth
  const directLogin = async () => {
    try {
      const response = await fetch('/api/debug-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('Direct login succeeded');
      window.location.href = '/';
      return true;
    } catch (error) {
      console.error('Direct login error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');

    console.log('Login attempt with:', { username });

    try {
      // Try NextAuth first
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.log('NextAuth login failed, trying direct login');
        
        // If NextAuth fails, try direct login
        const directLoginSuccess = await directLogin();
        
        if (!directLoginSuccess) {
          setError('Invalid username or password');
          setLoading(false);
        }
      } else if (result?.ok) {
        // Successful login - force reload to ensure session is updated
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Try direct login as a fallback
      console.log('Login exception caught, trying direct login');
      const directLoginSuccess = await directLogin();
      
      if (!directLoginSuccess) {
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    }
  };

  // If still checking authentication status, show loading
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-blue-500 font-mono">Authenticating...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      <MatrixBackground colorCode="blue" />
      
      <div className="w-full max-w-md p-6 bg-black/70 border border-blue-600 rounded-lg shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-500 font-mono">
            SHADOWNET ACCESS
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            Enter your credentials to continue
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-800 rounded text-blue-200 text-sm font-mono">
            <p className="flex items-center">
              <span className="mr-2">✖</span>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-300 font-mono text-sm mb-1">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-blue-700 focus:border-blue-500 rounded font-mono text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-300 font-mono text-sm mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-blue-700 focus:border-blue-500 rounded font-mono text-white"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-800 hover:bg-blue-700 text-white font-mono rounded transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 font-mono text-sm">
            No access credentials?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
              Register for SHADOWNET
            </Link>
          </p>
          
          <p className="mt-2">
            <Link href="/" className="text-gray-500 hover:text-gray-400 text-xs font-mono">
              Return to main interface
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 