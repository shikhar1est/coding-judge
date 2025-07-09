'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

export default function AdminPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');
  const router = useRouter();

  // 🔐 Check token + admin role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.role !== 'admin') {
        alert('Access denied');
        router.push('/problems');
      }
    } catch (err) {
      console.error('Invalid token');
      router.push('/login');
    }
  }, []);

  // 📡 Load all problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get('/problems');
        setProblems(res.data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      }
    };
    fetchProblems();
  }, []);

  // ➕ Add new problem
  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/problems', {
        title,
        description,
        difficulty,
        tags: tags.split(',').map((t) => t.trim()),
      });
      setProblems((prev) => [...prev, res.data]);
      setTitle('');
      setDescription('');
      setDifficulty('Easy');
      setTags('');
    } catch (err) {
      console.error('Error adding problem:', err);
      alert('Failed to add problem');
    }
  };

  // 🗑️ Delete problem
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this problem?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting problem:', err);
      alert('Failed to delete problem');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel: Manage Problems</h1>

      {/* ➕ Add Problem Form */}
      <div className="mb-10 border p-4 rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Add New Problem</h2>
        <form onSubmit={handleAddProblem} className="grid gap-4">
          <input
            className="border p-2 rounded"
            type="text"
            placeholder="Problem Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border p-2 rounded"
            placeholder="Problem Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="border p-2 rounded"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            className="border p-2 rounded"
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Add Problem
          </button>
        </form>
      </div>

      {/* 📋 Existing Problems Table */}
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Difficulty</th>
            <th className="p-2 border">Tags</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p._id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{p.title}</td>
              <td className="p-2 border">{p.difficulty}</td>
              <td className="p-2 border">{p.tags.join(', ')}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => router.push(`/admin/problems/${p._id}`)}
                  className="bg-yellow-400 px-2 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
