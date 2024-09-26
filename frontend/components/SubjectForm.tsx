import React, { useState } from 'react';
import { PlusCircleIcon } from 'lucide-react';
import api from '../utils/api';  // API utility for making HTTP requests

enum SubjectCategoryEnum {
  COMPULSORY = "COMPULSORY",
  LIMITED_ELECTIVE = "LIMITED_ELECTIVE",
  STANDARD_ELECTIVE = "STANDARD_ELECTIVE",
  ELECTIVE = "ELECTIVE"
}

const categoryLabels: Record<SubjectCategoryEnum, string> = {
  [SubjectCategoryEnum.COMPULSORY]: "Compulsory",
  [SubjectCategoryEnum.LIMITED_ELECTIVE]: "Limited Elective",
  [SubjectCategoryEnum.STANDARD_ELECTIVE]: "Standard Elective",
  [SubjectCategoryEnum.ELECTIVE]: "Elective"
};

interface Category {
  course: string;
  category: SubjectCategoryEnum;
}

interface SubjectFormProps {
  onSubmit: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [credit, setCredit] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([
    { course: 'A', category: SubjectCategoryEnum.COMPULSORY },
    { course: 'B', category: SubjectCategoryEnum.COMPULSORY },
    { course: 'C', category: SubjectCategoryEnum.COMPULSORY }
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const subject = {
      name,
      credit,
      categories
    };

    try {
      await api.post('/subjects', subject);
      onSubmit();
      // Reset form
      setName('');
      setCredit(1);
      setCategories([
        { course: 'A', category: SubjectCategoryEnum.COMPULSORY },
        { course: 'B', category: SubjectCategoryEnum.COMPULSORY },
        { course: 'C', category: SubjectCategoryEnum.COMPULSORY }
      ]);
    } catch (error) {
      console.error('Failed to create subject:', error);
      setError('Failed to create subject. Please try again.');
    }
  };

  const handleCategoryChange = (course: string, category: SubjectCategoryEnum) => {
    setCategories(prev => prev.map(c => c.course === course ? { ...c, category } : c));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Subject</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
            required
          />
        </div>
        <div>
          <label htmlFor="credit" className="block text-sm font-medium text-gray-700">Credits</label>
          <input
            type="number"
            id="credit"
            value={credit}
            onChange={(e) => setCredit(Math.max(1, parseInt(e.target.value)))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="1"
            required
          />
        </div>
        {categories.map((category) => (
          <div key={category.course}>
            <label htmlFor={`category-${category.course}`} className="block text-sm font-medium text-gray-700">Course Category {category.course}</label>
            <select
              id={`category-${category.course}`}
              value={category.category}
              onChange={(e) => handleCategoryChange(category.course, e.target.value as SubjectCategoryEnum)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              {Object.values(SubjectCategoryEnum).map((cat) => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </select>
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