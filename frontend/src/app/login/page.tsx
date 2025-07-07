'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      router.push('/problems');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4 w-80">
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
          className="w-full bg-blue-600 text-white p-2 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
