'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export default function ProblemListPage() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get('/problems');
        setProblems(res.data);
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Problems</h1>
      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="border rounded p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{problem.title}</h2>
              <Link
                href={`/problems/${problem._id}`}
                className="text-blue-600 hover:underline"
              >
                Solve →
              </Link>
            </div>
            <p className="text-sm text-gray-500">{problem.difficulty}</p>
            <div className="mt-1 space-x-2">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
