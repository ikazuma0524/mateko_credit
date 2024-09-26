import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import api from '../utils/api';

interface Subject {
  id: number;
  name: string;
}

interface StudentFormProps {
  onSubmit: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [course, setCourse] = useState<string>('A');
  const [completedSubjects, setCompletedSubjects] = useState<number[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get<Subject[]>('/subjects');
        setAvailableSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        setError('Failed to fetch subjects. Please try again.');
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
        completed_subjects: completedSubjects,
        uid: user.uid  // FirebaseユーザーのUIDもサーバーに送信
      });

      onSubmit();
      // Reset form after successful submission
      setName('');
      setEmail('');
      setPassword('');
      setCourse('A');
      setCompletedSubjects([]);
      setError('');
    } catch (error) {
      console.error('Failed to create student:', error);
      setError('Failed to create an account. Please try again.');
    }
  };

  const handleSubjectChange = (subjectId: number) => {
    setCompletedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
        <select
          id="course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="A">Course A</option>
          <option value="B">Course B</option>
          <option value="C">Course C</option>
        </select>
      </div>
      <div>
        <span className="block text-sm font-medium text-gray-700">Select Completed Subjects:</span>
        <div className="mt-2 space-y-2">
          {availableSubjects.map((subject) => (
            <div key={subject.id} className="flex items-center">
              <input
                type="checkbox"
                id={`subject-${subject.id}`}
                value={subject.id}
                checked={completedSubjects.includes(subject.id)}
                onChange={() => handleSubjectChange(subject.id)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor={`subject-${subject.id}`} className="ml-2 text-sm text-gray-600">
                {subject.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Account
      </button>
    </form>
  );
};

export default StudentForm;