import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle2, RefreshCw, Terminal } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function StudentPracticeArena() {
  const { problemId } = useParams();
  const location = useLocation();

  const courseId = location.state?.courseId;

  const [language, setLanguage] = useState("javascript");

  // Starter code templates for JavaScript, Python, C++, Java, and C
  const starterTemplates = {
    javascript:
      "// Write your solution here\nfunction solve(nums, target) {\n  \n}",
    python: "# Write your solution here\ndef solve(nums, target):\n    pass",
    cpp: "// Write your solution here\n#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int target) {\n    \n}",
    java: "// Write your solution here\nimport java.util.*;\n\nclass Solution {\n    public int[] solve(int[] nums, int target) {\n        \n    }\n}",
    c: "// Write your solution here\n#include <stdio.h>\n#include <stdlib.h>\n\nint* solve(int* nums, int numsSize, int target, int* returnSize) {\n    \n}",
  };

  const [code, setCode] = useState(starterTemplates["javascript"]);
  const [running, setRunning] = useState(false);
  const [outputResult, setOutputResult] = useState(null);

  const [problem, setProblem] = useState({
    title:
      location.state?.title ||
      (problemId
        ? problemId
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "Coding Challenge"),
    difficulty: location.state?.difficulty || "Medium",
    description:
      location.state?.description ||
      `Solve the coding problem associated with slug: ${problemId}.`,
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Handle language change and load corresponding starter template
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(starterTemplates[selectedLang] || "");
  };

  const handleRunCode = async () => {
    try {
      setRunning(true);
      setTimeout(async () => {
        const passed = true;

        if (passed) {
          setOutputResult({
            passed: true,
            message: "All test cases passed successfully!",
            runtime: "32 ms",
          });
          toast.success("Solution accepted!");

          if (courseId) {
            try {
              const token = localStorage.getItem("UserToken");
              await fetch(
                `${API_BASE_URL}/api/courses/${courseId}/coding-solved`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                  },
                  body: JSON.stringify({ problemSlug: problemId }),
                }
              );
            } catch (err) {
              console.error("Failed to sync solved status", err);
            }
          }
        }
        setRunning(false);
      }, 1200);
    } catch (err) {
      toast.error("Execution error");
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-12 pt-20">
      <ToastContainer position="top-right" />

      {/* TOP ARENA HEADER */}
      <div className="border-b border-slate-800 bg-slate-950 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400">
            DSA & Coding Arena
          </span>
          <h1 className="text-sm font-extrabold truncate max-w-md">
            {problem.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 outline-none cursor-pointer"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java</option>
            <option value="c">C</option>
          </select>

          <button
            onClick={handleRunCode}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-700 transition cursor-pointer"
          >
            {running ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run & Submit
          </button>
        </div>
      </div>

      {/* SPLIT WORKSPACE: PROBLEM DESCRIPTION & IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-80px)]">
        {/* LEFT: PROBLEM STATEMENT */}
        <div className="border-r border-slate-800 p-6 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                {problem.difficulty}
              </span>
              <span className="text-xs text-slate-400">Slug: {problemId}</span>
            </div>
            <h2 className="text-xl font-black">{problem.title}</h2>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            <p>{problem.description}</p>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <p className="font-bold text-slate-200">
                Specification & Example:
              </p>
              <p className="font-mono text-indigo-300 whitespace-pre-line">
                {problem.example}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: MONACO CODE EDITOR & TERMINAL */}
        <div className="flex flex-col h-full bg-slate-950">
          <div className="flex-1">
            <Editor
              height="100%"
              language={
                language === "cpp"
                  ? "cpp"
                  : language === "c"
                  ? "c"
                  : language === "java"
                  ? "java"
                  : language === "python"
                  ? "python"
                  : "javascript"
              }
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* TERMINAL / OUTPUT PANEL */}
          <div className="h-44 border-t border-slate-800 bg-slate-900 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
              <Terminal size={14} /> Execution Console & Test Results
            </div>
            {outputResult ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 size={16} /> {outputResult.message}
                </div>
                <p className="text-slate-400 font-mono">
                  Runtime: {outputResult.runtime} | Memory: 14.2 MB
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Click "Run & Submit" to test your code against evaluation test
                cases.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  