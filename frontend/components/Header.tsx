import React from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('../'); // ログインページへリダイレクト
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">MyApp</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={handleSignOut} className="hover:text-red-300">
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
