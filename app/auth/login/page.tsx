'use client';

import { useState, useRef } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleSigningInRef = useRef(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      // Better error messages
      let message = err.message || 'Login failed';
      if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Try signing up first or use Google.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      }
      setError(message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleSigningInRef.current || isGoogleLoading) return;
    
    googleSigningInRef.current = true;
    setIsGoogleLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      
      // Redirect with fallback
      try {
        router.push('/dashboard');
      } catch {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request' && 
          err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setIsGoogleLoading(false);
      googleSigningInRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl border border-slate-700">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Step into the realm</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-600" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 h-px bg-slate-600" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-3 px-4 bg-slate-700 border border-slate-600 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <p className="text-center text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}