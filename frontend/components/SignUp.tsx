import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';  // Firebase認証用
import { useRouter } from 'next/router';
import { auth } from '../firebase/config';  // Firebaseのconfigファイルからauthをインポート
import api from '../utils/api';  // FastAPIサーバーとの通信用
const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Firebase認証でユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // FastAPIサーバーにユーザー情報を送信
      await api.post('/students', {
        name,
        email,
        course,
        uid: user.uid  // FirebaseユーザーのUIDもサーバーに送信
      });

      // ユーザーダッシュボードへリダイレクト
      router.push('/user');
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 mb-4 border rounded"
          required
        />
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
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="">Select Course</option>
          <option value="A">Course A</option>
          <option value="B">Course B</option>
          <option value="C">Course C</option>
        </select>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
