'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/api'; // Don't forget this import!

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

  // 🔒 Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  // 📡 Fetch user submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions/user');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Submissions</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Problem</th>
            <th className="p-2 border">Language</th>
            <th className="p-2 border">Verdict</th>
            <th className="p-2 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr key={s._id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{s.problemTitle}</td>
              <td className="p-2 border">{s.language}</td>
              <td className={`p-2 border font-semibold text-sm
                ${s.verdict === 'Accepted' ? 'text-green-600' :
                  s.verdict === 'Wrong Answer' ? 'text-red-600' :
                  s.verdict === 'TLE' ? 'text-yellow-600' : 'text-gray-600'}`}>
                {s.verdict}
              </td>
              <td className="p-2 border">{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
