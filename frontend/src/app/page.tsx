'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-500">Welcome to the Coding Judge 🚀</h1>
      <p className="text-gray-400 mb-6 max-w-xl">
        Practice coding problems, test your solutions, and view your submission history.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => router.push('/problems')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          🔍 View Problems
        </button>
        <button
          onClick={() => router.push('/submissions')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          📜 My Submissions
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          ⚙️ Admin Panel
        </button>
      </div>
    </div>
  );
}
