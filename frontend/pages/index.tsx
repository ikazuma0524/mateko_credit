import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import Link from 'next/link';
import {AdminCheckResponse} from '../utils/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // IDトークンを取得して管理者権限を確認
      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin === true;

      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button 
          type="submit" 
          className={`w-full p-2 bg-blue-500 text-white rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center">
          Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;