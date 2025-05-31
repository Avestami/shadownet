'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MatrixBackground } from '../../components/MatrixBackground';

export const dynamic = 'force-dynamic';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // If already authenticated, redirect to home page
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email: email || undefined,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
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
            SHADOWNET REGISTRATION
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            Create your credentials to access the network
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

        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-800 rounded text-green-200 text-sm font-mono">
            <p className="flex items-center">
              <span className="mr-2">✓</span>
              {success}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="email" className="block text-gray-300 font-mono text-sm mb-1">
              EMAIL (OPTIONAL)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-blue-700 focus:border-blue-500 rounded font-mono text-white"
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
            <p className="text-gray-500 text-xs mt-1 font-mono">Minimum 6 characters</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 font-mono text-sm mb-1">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-blue-700 focus:border-blue-500 rounded font-mono text-white"
              required
            />
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-800 hover:bg-blue-700 text-white font-mono rounded transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'PROCESSING...' : 'REGISTER'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 font-mono text-sm">
            Already have access?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
              Login to SHADOWNET
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