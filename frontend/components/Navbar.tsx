// components/Navbar.tsx
import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">まてこう単位計算アプリ
        </Link>
        <div className="space-x-4">
          <Link href="/admin" className="hover:underline">Home</Link>
          <Link href="/admin/subjects" className="hover:underline">Subjects</Link>
          <Link href="/admin/students" className="hover:underline">Students</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;