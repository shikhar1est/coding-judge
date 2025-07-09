'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import { Editor } from '@monaco-editor/react';

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

const defaultCode: Record<string, string> = {
  cpp: `#include<iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`,
  python: `print("Hello World")`,
  javascript: `console.log("Hello World");`,
};

const monacoLangMap: Record<string, string> = {
  cpp: 'cpp',
  python: 'python',
  javascript: 'javascript',
};

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultCode.cpp);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to fetch problem:', err);
        setProblem(null);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await api.post(`/submissions`, {
        problemId: id,
        language,
        code,
      });
      const result = res.data.result || res.data.verdict || 'Submitted successfully';
      setOutput(result);
    } catch (err: any) {
      console.error('Submission error:', err);
      setOutput('⚠️ Error submitting code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <p className="p-4">Loading problem...</p>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 🧠 Problem Details */}
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <p className="text-sm text-gray-500 mb-2">Difficulty: {problem.difficulty}</p>
        <pre className="whitespace-pre-wrap text-gray-800">{problem.description}</pre>
        <div className="mt-3 space-x-2">
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

      {/* 💻 Code Editor */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value;
              setLanguage(lang);
              setCode(defaultCode[lang]);
            }}
            className="border rounded p-1"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        <Editor
          height="400px"
          language={monacoLangMap[language]}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
          options={{ fontSize: 14 }}
        />
        {output && (
          <div className="mt-4 bg-black text-green-400 p-4 rounded whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
