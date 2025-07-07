'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import { Editor } from '@monaco-editor/react';

const defaultCode = {
  cpp: `#include<iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`,
  python: `print("Hello World")`,
  javascript: `console.log("Hello World");`,
};

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultCode.cpp);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to fetch problem:', err);
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
      setOutput(res.data.result || 'Submitted successfully');
    } catch (err: any) {
      console.error(err);
      setOutput('Error submitting code');
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <p className="p-4">Loading problem...</p>;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Problem Details */}
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <p className="text-sm text-gray-500 mb-2">Difficulty: {problem.difficulty}</p>
        <pre className="whitespace-pre-wrap text-gray-800">{problem.description}</pre>
        <div className="mt-3 space-x-2">
          {problem.tags?.map((tag: string) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <select
            value={language}
            onChange={(e) => {
              const selectedLang = e.target.value;
              setLanguage(selectedLang);
              setCode(defaultCode[selectedLang as keyof typeof defaultCode]);
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
          language={language}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
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
