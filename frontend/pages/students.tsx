import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StudentForm from '../components/StudentForm';
import CreditSummary from '../components/CreditSummary';
import Alert from '../components/Alert';
import api from '../utils/api';
import { UserIcon, PlusIcon } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  course: string;
  completed_subjects: number[];
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get<Student[]>('/students');
      setStudents(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError('Failed to load students. Please try again later.');
    }
  };

  const handleStudentSubmit = async () => {
    await fetchStudents();
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {showForm ? 'Close Form' : 'Add Student'}
          </button>
        </div>

        {error && <Alert variant="destructive" title="Error">{error}</Alert>}

        {showForm && <StudentForm onSubmit={handleStudentSubmit} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
              </div>
              <p className="text-gray-600 mb-2">Course: {student.course}</p>
              <p className="text-gray-600 mb-4">Completed Subjects: {student.completed_subjects.length}</p>
              <button
                onClick={() => setSelectedStudent(student)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                View Credit Summary
              </button>
            </div>
          ))}
        </div>

        {selectedStudent && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Credit Summary for {selectedStudent.name}</h2>
            <CreditSummary studentId={selectedStudent.id} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Students;