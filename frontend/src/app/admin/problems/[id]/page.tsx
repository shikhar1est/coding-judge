'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function EditProblemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');

  // 🔐 Optional: redirect if not admin
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

  // 📡 Load existing problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        const p = res.data;
        setTitle(p.title);
        setDescription(p.description);
        setDifficulty(p.difficulty);
        setTags(p.tags.join(', '));
      } catch (err) {
        console.error('Error loading problem:', err);
        alert('Problem not found');
        router.push('/admin');
      }
    };
    fetchProblem();
  }, [id]);

  // ✅ Save changes
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/problems/${id}`, {
        title,
        description,
        difficulty,
        tags: tags.split(',').map((t) => t.trim()),
      });
      alert('Problem updated!');
      router.push('/admin');
    } catch (err) {
      console.error('Error updating problem:', err);
      alert('Update failed');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Problem</h1>
      <form onSubmit={handleUpdate} className="grid gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Problem Title"
          required
        />
        <textarea
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
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
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma separated tags"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
