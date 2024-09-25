import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'next/router';
import api from '../../utils/api'; // カスタムAPIクライアントをインポート
import PrivateRoute from '../../components/PrivateRoute';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Dashboard from '../../components/Dashboard'; // ダッシュボードコンポーネントをインポート

const UserDashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // ユーザーデータのステート
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ用
  const router = useRouter();
  const user = auth.currentUser; // 現在のユーザーを取得

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // FastAPI からユーザー情報を取得
          const response = await api.get(`/students/by-uid/${user.uid}`);
          setUserData(response.data);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          setError('Failed to load user data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('../');  // 一つ上のディレクトリのindex.tsx（ログインページ）にリダイレクト
  };
  
  // ローディング状態の表示
  if (loading) {
    return <p>Loading...</p>;
  }

  // エラーメッセージの表示
  if (error) {
    return <p>{error}</p>;
  }

  // ユーザーが存在しない場合
  if (!user || !userData) {
    return <p>No user data available.</p>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center bg-gray-100 py-12">
        <Dashboard userData={userData} user={user} />
      </main>
      <Footer />
    </>
  );
};

export default UserDashboardPage;
