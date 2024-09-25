

import React, { useState } from 'react';
import { PlusCircleIcon } from 'lucide-react';

interface CourseCategories {
  A: string;
  B: string;
  C: string;
}

interface SubjectFormProps {
  onSubmit: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [credit, setCredit] = useState<number>(0);
  const [courseCategories, setCourseCategories] = useState<CourseCategories>({ A: '', B: '', C: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subject = { name, credit, course_categories: courseCategories };
    // await api.post('/subjects', subject);
    onSubmit();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Subject Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter subject name"
          />
        </div>
        <div>
          <label htmlFor="credit" className="block text-sm font-medium text-gray-700">Credits</label>
          <input
            type="number"
            id="credit"
            value={credit}
            onChange={(e) => setCredit(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter credits"
          />
        </div>
        {Object.keys(courseCategories).map((key) => (
          <div key={key}>
            <label htmlFor={`category-${key}`} className="block text-sm font-medium text-gray-700">Course Category {key}</label>
            <input
              type="text"
              id={`category-${key}`}
              value={courseCategories[key as keyof CourseCategories]}
              onChange={(e) => setCourseCategories({ ...courseCategories, [key]: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder={`Enter category ${key}`}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Subject
        </button>
      </form>
    </div>
  );
};

export default SubjectForm;