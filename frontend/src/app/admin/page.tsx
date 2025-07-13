"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface SampleTest {
  input: string;
  output: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}

export default function AdminPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");
  const [constraints, setConstraints] = useState("");
  const [sampleTests, setSampleTests] = useState<SampleTest[]>([]);
  const [hiddenTests, setHiddenTests] = useState<TestCase[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role !== "admin") {
        alert("Access denied");
        router.push("/problems");
      }
    } catch (err) {
      console.error("Invalid token");
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/problems");
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to load problems:", err);
      }
    };
    fetchProblems();
  }, []);

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sampleTests.length || !hiddenTests.length) {
      alert("Please add at least one sample and one hidden test case.");
      return;
    }

    try {
      const res = await api.post("/problems", {
        title,
        description,
        difficulty,
        tags: tags.split(",").map((t) => t.trim()),
        constraints,
        sampleInput: sampleTests[0]?.input || "",
        sampleOutput: sampleTests[0]?.output || "",
        testCases: hiddenTests,
      });

      setProblems((prev) => [...prev, res.data.problem]);
      // Reset form
      setTitle("");
      setDescription("");
      setDifficulty("Easy");
      setTags("");
      setConstraints("");
      setSampleTests([]);
      setHiddenTests([]);
    } catch (err) {
      console.error("Error adding problem:", err);
      alert("Failed to add problem");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting problem:", err);
      alert("Failed to delete problem");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Admin Panel: Manage Problems</h1>

      <div className="bg-black shadow-md rounded-lg p-6 mb-12">
        <h2 className="text-xl font-semibold mb-4">Add New Problem</h2>
        <form onSubmit={handleAddProblem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 rounded px-4 py-2 w-full"
            type="text"
            placeholder="Problem Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            className="border border-gray-300 rounded px-4 py-2 w-full"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <textarea
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2 w-full min-h-[120px]"
            placeholder="Problem Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <textarea
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2 w-full min-h-[80px]"
            placeholder="Constraints"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2 w-full"
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <textarea
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2"
            rows={3}
            placeholder="Sample Tests (Format: input=>output; one per line)"
            onChange={(e) => {
              const lines = e.target.value.trim().split("\n");
              setSampleTests(
                lines.map((line) => {
                  const [input, output] = line.split("=>");
                  return { input: input?.trim() || "", output: output?.trim() || "" };
                })
              );
            }}
          />
          <textarea
            className="border border-gray-300 rounded px-4 py-2 md:col-span-2"
            rows={3}
            placeholder="Hidden Test Cases (Format: input=>expectedOutput; one per line)"
            onChange={(e) => {
              const lines = e.target.value.trim().split("\n");
              setHiddenTests(
                lines.map((line) => {
                  const [input, expectedOutput] = line.split("=>");
                  return { input: input?.trim() || "", expectedOutput: expectedOutput?.trim() || "" };
                })
              );
            }}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded md:col-span-2"
          >
            ➕ Add Problem
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Difficulty</th>
              <th className="text-left px-4 py-2">Tags</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-900">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">{p.difficulty}</td>
                <td className="px-4 py-2">{p.tags.join(", ")}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => router.push(`/admin/problems/${p._id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan={4}>
                  No problems added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
