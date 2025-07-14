'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface Submission {
  _id: string;
  problemTitle: string;
  language: string;
  verdict: string;
  createdAt: string;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Submissions</h1>
      <table className="w-full table-auto border border-gray-700">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="p-2 border border-gray-700">#</th>
            <th className="p-2 border border-gray-700">Problem</th>
            <th className="p-2 border border-gray-700">Language</th>
            <th className="p-2 border border-gray-700">Verdict</th>
            <th className="p-2 border border-gray-700">Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr key={s._id} className="border-t border-gray-700 hover:bg-gray-800 text-white">
              <td className="p-2 border border-gray-700">{i + 1}</td>
              <td className="p-2 border border-gray-700">{s.problemTitle}</td>
              <td className="p-2 border border-gray-700">{s.language}</td>
              <td className={`p-2 border border-gray-700 font-semibold text-sm
                ${s.verdict === 'Accepted' ? 'text-green-400' :
                  s.verdict === 'Wrong Answer' ? 'text-red-400' :
                  s.verdict === 'TLE' ? 'text-yellow-400' : 'text-gray-400'}`}>
                {s.verdict}
              </td>
              <td className="p-2 border border-gray-700">{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
