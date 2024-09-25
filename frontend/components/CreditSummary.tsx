import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Alert from './Alert';

interface CreditSummaryProps {
  studentId: number;
}

interface CreditDetails {
  compulsory: number;
  limited_elective: number;
  standard_elective: number;
  elective: number;
  total: number;
}

interface RequirementsMet {
  compulsory: boolean;
  limited_elective: boolean;
  limited_standard_elective: boolean;
  total: boolean;
}

interface Summary {
  student_id: number;
  course: string;
  credits: CreditDetails;
  requirements_met: RequirementsMet;
}

const CreditSummary: React.FC<CreditSummaryProps> = ({ studentId }) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await api.post<Summary>('/calculate_credits', { student_id: studentId });
        setSummary(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch credit summary:', err);
        setError('Failed to load credit summary. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [studentId]);

  if (loading) return <div className="text-center">Loading credit summary...</div>;
  if (error) return <Alert variant="destructive" title="Error">{error}</Alert>;
  if (!summary) return null;

  const { credits, requirements_met } = summary;
  const totalRequired = 95; // This should be fetched from the backend in a real scenario

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h3 className="text-2xl font-bold mb-4">Credit Summary for Student {summary.student_id}</h3>
      <p className="text-lg mb-2">Course: {summary.course}</p>
      
      <div className="space-y-4 mt-6">
        <CreditProgressBar label="Total Credits" current={credits.total} required={totalRequired} met={requirements_met.total} />
        <CreditProgressBar label="Compulsory" current={credits.compulsory} required={26} met={requirements_met.compulsory} />
        <CreditProgressBar label="Limited Elective" current={credits.limited_elective} required={47} met={requirements_met.limited_elective} />
        <CreditProgressBar label="Limited + Standard Elective" current={credits.limited_elective + credits.standard_elective} required={59} met={requirements_met.limited_standard_elective} />
      </div>

      <Alert 
        variant={requirements_met.total ? "default" : "destructive"}
        title={requirements_met.total ? "Congratulations!" : "Attention Required"}
      >
        {requirements_met.total 
          ? "You have met all the credit requirements for graduation." 
          : "You have not yet met all the credit requirements for graduation. Please review your course selection."}
      </Alert>
    </div>
  );
};

interface CreditProgressBarProps {
  label: string;
  current: number;
  required: number;
  met: boolean;
}

const CreditProgressBar: React.FC<CreditProgressBarProps> = ({ label, current, required, met }) => {
  const percentage = Math.min((current / required) * 100, 100);
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{current}/{required}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className={`text-xs ${met ? 'text-green-600' : 'text-red-600'}`}>
        {met ? 'Requirement met' : 'Requirement not met'}
      </span>
    </div>
  );
};

export default CreditSummary;