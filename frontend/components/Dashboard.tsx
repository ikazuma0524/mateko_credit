import React from 'react';

interface DashboardProps {
  userData: any;
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, user }) => {
  return (
    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome, {userData.name}</h1>

      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">User Information</h2>
        <p className="mb-2"><strong>Name:</strong> {userData.name}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-2"><strong>Course:</strong> {userData.course}</p>
      </div>

      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Completed Subjects</h2>
        {userData.completed_subjects && userData.completed_subjects.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {userData.completed_subjects.map((subject: any, index: number) => (
              <li key={index}>{subject.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No subjects completed yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
