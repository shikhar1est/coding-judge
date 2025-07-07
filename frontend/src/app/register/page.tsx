'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      router.push('/problems');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4 w-80">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-green-600 text-white p-2 rounded"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
}
