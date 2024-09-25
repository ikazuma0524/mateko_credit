import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config'; // Firebase設定ファイルをインポート

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Firebase 認証状態の確認
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ユーザーがログインしている場合
        setAuthenticated(true);
        setLoading(false);
      } else {
        // ユーザーがログインしていない場合
        setAuthenticated(false);
        setLoading(false);
        router.push('/signin'); // ログインページにリダイレクト
      }
    });

    // Firebase Auth の監視を解除する
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    // 認証状態を確認している間はローディング状態を表示
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    // 認証されていない場合は何も表示しない（リダイレクトするため）
    return null;
  }

  // 認証されている場合のみ子要素を表示
  return <>{children}</>;
};

export default PrivateRoute;
