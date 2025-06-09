'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MatrixBackground } from '../../components/MatrixBackground';
import Script from 'next/script';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Don't automatically redirect on session detection to prevent loops
  // Instead, let the user explicitly log in through the form

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || redirecting) return;
    
    setLoading(true);
    setError('');
    setDebugInfo('Attempting to sign in...');

    try {
      console.log('Login attempt with username:', username);
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      console.log('SignIn result:', result);
      setDebugInfo(prev => `${prev}\nSignIn result: ${JSON.stringify(result)}`);

      if (result?.error) {
        setError('Invalid username or password');
        setDebugInfo(prev => `${prev}\nError: ${result.error}`);
      } else if (result?.ok) {
        setDebugInfo(prev => `${prev}\nLogin successful, redirecting...`);
        setRedirecting(true);
        
        // Use direct window location change after a short delay
        // Make sure we use the correct protocol and port
        setTimeout(() => {
          const baseUrl = window.location.origin;
          window.location.href = `${baseUrl}/`;
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setDebugInfo(prev => `${prev}\nException: ${JSON.stringify(error)}`);
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
              disabled={loading || redirecting}
              className={`w-full py-2 px-4 bg-blue-800 hover:bg-blue-700 text-white font-mono rounded transition-colors ${
                (loading || redirecting) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'AUTHENTICATING...' : redirecting ? 'REDIRECTING...' : 'LOGIN'}
            </button>
          </div>
        </form>
        
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-900 border border-gray-800 rounded text-gray-300 text-xs font-mono overflow-auto max-h-40">
            <pre>{debugInfo}</pre>
          </div>
        )}
        
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
      
      {/* Debug script for testing authentication */}
      <Script id="auth-debug">
        {`
        // Authentication test script
        console.log('=== Authentication Test Script ===');
        console.log('Current origin:', window.location.origin);
        
        // Check for cookies
        function checkCookies() {
          console.log('Checking cookies:');
          const cookies = document.cookie.split(';').map(c => c.trim());
          console.log('All cookies:', cookies);
          
          // Look for NextAuth cookies
          const authCookies = cookies.filter(c => 
            c.startsWith('next-auth') || 
            c.startsWith('__Secure-next-auth') || 
            c.startsWith('__Host-next-auth')
          );
          
          console.log('Auth cookies found:', authCookies);
          return authCookies.length > 0;
        }
        
        // Check session endpoint
        async function checkSession() {
          console.log('Checking session endpoint...');
          try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            console.log('Session data:', data);
            return data?.user != null;
          } catch (error) {
            console.error('Error checking session:', error);
            return false;
          }
        }
        
        // Run tests
        async function runTests() {
          const hasCookies = checkCookies();
          const hasSession = await checkSession();
          
          console.log('=== Authentication Test Results ===');
          console.log('Has auth cookies:', hasCookies);
          console.log('Has valid session:', hasSession);
        }
        
        // Run tests after page load
        setTimeout(runTests, 1000);
        `}
      </Script>
    </div>
  );
} 