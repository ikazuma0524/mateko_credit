import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SubjectForm from '../components/SubjectForm';
import api from '../utils/api';
import { PlusIcon, BookOpenIcon } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  credit: number;
  course_categories: {
    A: string;
    B: string;
    C: string;
  };
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get<Subject[]>('/subjects');
      setSubjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      setError('Failed to load subjects. Please try again later.');
    }
  };

  const handleSubjectSubmit = async () => {
    await fetchSubjects();
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Subjects</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {showForm ? 'Close Form' : 'Add Subject'}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showForm && <SubjectForm onSubmit={handleSubjectSubmit} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <BookOpenIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">{subject.name}</h2>
              </div>
              <p className="text-gray-600 mb-2">Credits: {subject.credit}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Course Categories:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Course A: {subject.course_categories.A}</li>
                  <li>Course B: {subject.course_categories.B}</li>
                  <li>Course C: {subject.course_categories.C}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Subjects;