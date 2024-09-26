import React from 'react';
import Layout from '../../components/Layout';
import { BookOpen, Users, FileText } from 'lucide-react';
import Link from 'next/link';


const DashboardCard: React.FC<{ title: string; content: string; icon: React.ReactNode; link: string }> = ({ title, content, icon, link }) => (
  <Link href={link} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <div className="mr-4 text-blue-500">{icon}</div>
      <h2 className="text-xl font-semibold text-blue-700">{title}</h2>
    </div>
    <p className="text-gray-600">{content}</p>
  </Link>
);

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">管理者用ダッシュボード</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="科目管理"
            content="View and manage university subjects"
            icon={<BookOpen size={24} />}
            link="/admin/subjects"
          />
          <DashboardCard
            title="ユーザー管理"
            content="Manage student information and records"
            icon={<Users size={24} />}
            link="/admin/students"
          />
          <DashboardCard
            title="単位計算"
            content="Calculate and view student credits"
            icon={<FileText size={24} />}
            link="/credits"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Latest Announcements</h2>
          <ul className="space-y-4">
            <li className="border-b pb-2">
              <h3 className="font-semibold">New Semester Registration</h3>
              <p className="text-sm text-gray-600">Registration for the upcoming semester is now open.</p>
            </li>
            <li className="border-b pb-2">
              <h3 className="font-semibold">Faculty Meeting</h3>
              <p className="text-sm text-gray-600">There will be a faculty meeting next week to discuss curriculum changes.</p>
            </li>
            <li>
              <h3 className="font-semibold">System Maintenance</h3>
              <p className="text-sm text-gray-600">The student management system will undergo maintenance this weekend.</p>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;