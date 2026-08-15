import React, { useState } from "react";
import {
  FileText,
  Map,
  Video,
  CheckSquare,
  Users,
  Sparkles,
  ArrowRight,
  Layers,
  Send,
  Loader2,
  RefreshCcw,
  Upload,
  CheckCircle2,
} from "lucide-react";

const CareerHub = () => {
  // State to track which surrounding tool is currently active/selected in the central box
  const [activeTool, setActiveTool] = useState({
    id: "overview",
    name: "AI Career Intelligence",
    description:
      "Select any surrounding module to analyze, generate, or simulate your career trajectory instantly.",
    icon: Sparkles,
  });

  // State for inputs
  const [userInput, setUserInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [interviewTopic, setInterviewTopic] = useState("");

  // State for outputs & loading
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const surroundingTools = [
    {
      id: "roadmap",
      name: "Roadmap Generator",
      description:
        "Build a custom step-by-step learning path tailored to your dream tech stack or domain.",
      icon: Map,
      color: "from-blue-500 to-indigo-600",
      badge: "Pathways",
    },
    {
      id: "interview",
      name: "Mock Interview",
      description:
        "Practice technical & behavioral questions with AI real-time feedback simulations.",
      icon: Video,
      color: "from-purple-500 to-pink-600",
      badge: "Practice",
    },
    {
      id: "resume",
      name: "Resume Analyzer",
      description:
        "Scan your resume against ATS parsers, get keyword metrics, and fix impact statements.",
      icon: FileText,
      color: "from-emerald-500 to-teal-600",
      badge: "Core AI",
    },
    {
      id: "mentors",
      name: "AI Mentor Matching",
      description:
        "Connect with verified alumni and mentors working at top companies like Google & Microsoft.",
      icon: Users,
      color: "from-amber-500 to-orange-600",
      badge: "Networking",
    },
    {
      id: "skills",
      name: "Skill Gap Test",
      description:
        "Evaluate your current technical readiness and identify topics you need to master next.",
      icon: CheckSquare,
      color: "from-cyan-500 to-blue-600",
      badge: "Assessment",
    },
    {
      id: "projects",
      name: "Project Review",
      description:
        "Get automated code and portfolio architecture reviews to make your projects stand out.",
      icon: Layers,
      color: "from-rose-500 to-red-600",
      badge: "Portfolio",
    },
  ];

  // Handler to switch tools and reset interactive states
  const handleSelectTool = (tool) => {
    setActiveTool(tool);
    setAiResponse("");
    setUserInput("");
    setSelectedFile(null);
    setInterviewTopic("");
  };

  // Function to call the Express backend endpoint
  const handleBackendRequest = async (payloadData) => {
    setLoading(true);
    setAiResponse("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/ai-hub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payloadData,
          activeTool: activeTool.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.reply);
      } else {
        setAiResponse(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setAiResponse(
        "Failed to connect to the GuideX backend server. Ensure your server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = activeTool.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Guidex 360° AI
          Career Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Your Intelligent Career Ecosystem
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Interact with our central AI engine surrounded by modular career tools
          designed to accelerate your student journey.
        </p>
      </div>

      {/* 360-Degree Layout Container */}
      <div className="relative max-w-5xl w-full mx-auto flex flex-col items-center justify-center py-6 z-10">
        {/* TOP ITEM: Roadmap Generator */}
        <div className="mb-6 z-20">
          <ToolCard
            tool={surroundingTools.find((t) => t.id === "roadmap")}
            activeToolId={activeTool.name}
            onClick={() =>
              handleSelectTool(surroundingTools.find((t) => t.id === "roadmap"))
            }
          />
        </div>

        {/* MIDDLE ROW: Left Cards, Central AI Box, Right Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-2">
          {/* Left Column (Project Review & Skill Gap) */}
          <div className="flex flex-col gap-6 items-center md:items-end">
            <ToolCard
              tool={surroundingTools.find((t) => t.id === "projects")}
              activeToolId={activeTool.name}
              onClick={() =>
                handleSelectTool(
                  surroundingTools.find((t) => t.id === "projects")
                )
              }
            />
            <ToolCard
              tool={surroundingTools.find((t) => t.id === "skills")}
              activeToolId={activeTool.name}
              onClick={() =>
                handleSelectTool(
                  surroundingTools.find((t) => t.id === "skills")
                )
              }
            />
          </div>

          {/* CENTRAL AI BOX (Dynamic based on selected tool) */}
          <div className="relative flex items-center justify-center p-1 rounded-3xl bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-slate-800 shadow-2xl shadow-blue-500/10">
            <div className="w-full bg-slate-900/95 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[360px] border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3 text-white">
                <ActiveIcon className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                Active Workspace
              </span>

              <h3 className="text-lg font-bold text-white mb-1">
                {activeTool.name}
              </h3>

              {!aiResponse ? (
                <>
                  <p className="text-xs text-slate-400 mb-4 max-w-xs leading-relaxed">
                    {activeTool.description}
                  </p>

                  {/* CASE 1: RESUME ANALYZER (File Upload UI) */}
                  {activeTool.id === "resume" && (
                    <div className="w-full flex flex-col gap-3">
                      <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-800/40 transition">
                        <Upload className="w-5 h-5 text-blue-400 mb-1" />
                        <span className="text-xs text-slate-300 font-medium truncate max-w-[200px]">
                          {selectedFile
                            ? selectedFile.name
                            : "Upload PDF/DOCX Resume"}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                      </label>
                      <button
                        type="button"
                        disabled={loading || !selectedFile}
                        onClick={() =>
                          handleBackendRequest({
                            message: `Analyze my uploaded resume file: ${selectedFile?.name}`,
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-600/30 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                            Scanning ATS...
                          </>
                        ) : (
                          <>
                            Analyze Resume{" "}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* CASE 2: MOCK INTERVIEW (Topic Selection UI) */}
                  {activeTool.id === "interview" && (
                    <div className="w-full flex flex-col gap-3">
                      <select
                        value={interviewTopic}
                        onChange={(e) => setInterviewTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                      >
                        <option value="">
                          Select Interview Topic / Domain
                        </option>
                        <option value="Frontend Engineering (React/JS)">
                          Frontend Engineering (React / JS)
                        </option>
                        <option value="Full Stack System Design">
                          Full Stack System Design
                        </option>
                        <option value="Data Structures & Algorithms">
                          Data Structures & Algorithms
                        </option>
                        <option value="HR & Behavioral Interview">
                          HR & Behavioral Interview
                        </option>
                      </select>
                      <button
                        type="button"
                        disabled={loading || !interviewTopic}
                        onClick={() =>
                          handleBackendRequest({
                            message: `Start a mock interview session for topic: ${interviewTopic}`,
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-purple-600/30 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                            Preparing Questions...
                          </>
                        ) : (
                          <>
                            Start Interview Simulation{" "}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* CASE 3: GENERAL TOOLS (Roadmap, Skills, Projects, Mentors) */}
                  {activeTool.id !== "resume" &&
                    activeTool.id !== "interview" && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!userInput.trim()) return;
                          handleBackendRequest({ message: userInput });
                        }}
                        className="w-full flex flex-col gap-2.5"
                      >
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder={`Ask about ${activeTool.name}...`}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-md shadow-blue-600/30 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                              Processing...
                            </>
                          ) : (
                            <>
                              Launch AI Query{" "}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                </>
              ) : (
                <div className="w-full flex flex-col items-start text-left mt-2 animate-fadeIn">
                  <div className="max-h-44 overflow-y-auto w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 leading-relaxed mb-3">
                    {aiResponse}
                  </div>
                  <button
                    onClick={() => {
                      setAiResponse("");
                      setSelectedFile(null);
                      setInterviewTopic("");
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                  >
                    <RefreshCcw className="w-3 h-3" /> Back to {activeTool.name}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Mock Interview & Resume Analyzer) */}
          <div className="flex flex-col gap-6 items-center md:items-start">
            <ToolCard
              tool={surroundingTools.find((t) => t.id === "interview")}
              activeToolId={activeTool.name}
              onClick={() =>
                handleSelectTool(
                  surroundingTools.find((t) => t.id === "interview")
                )
              }
            />
            <ToolCard
              tool={surroundingTools.find((t) => t.id === "resume")}
              activeToolId={activeTool.name}
              onClick={() =>
                handleSelectTool(
                  surroundingTools.find((t) => t.id === "resume")
                )
              }
            />
          </div>
        </div>

        {/* BOTTOM ITEM: AI Mentor Matching */}
        <div className="mt-6 z-20">
          <ToolCard
            tool={surroundingTools.find((t) => t.id === "mentors")}
            activeToolId={activeTool.name}
            onClick={() =>
              handleSelectTool(surroundingTools.find((t) => t.id === "mentors"))
            }
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Sub-component for Surrounding Feature Nodes
const ToolCard = ({ tool, activeToolId, onClick }) => {
  const IconComponent = tool.icon;
  const isActive = activeToolId === tool.name;

  return (
    <div
      onClick={onClick}
      className={`w-full max-w-[280px] p-4 rounded-2xl bg-slate-900/80 border transition-all duration-300 cursor-pointer backdrop-blur-md group hover:border-blue-400/50 hover:bg-slate-800/80 hover:scale-[1.02] shadow-lg ${
        isActive
          ? "border-blue-500 ring-2 ring-blue-500/20 bg-slate-800/90"
          : "border-slate-800/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shrink-0 shadow-md`}
        >
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="text-left overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
              {tool.name}
            </h4>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
              {tool.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
            {tool.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerHub;
