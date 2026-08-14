import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  PlayCircle,
  Clock,
  FileText,
  ExternalLink,
  Layers,
  Star,
  ChevronDown,
  CheckCircle2,
  Circle,
  Award,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Zap,
  Info,
  FileCheck,
  Code2,
  Lock,
  User,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";

const LearnCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add these states to your component
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "Hi! Need help with this course? Ask me anything!" },
  ]);

  const handleAskAI = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    try {
      const token = localStorage.getItem("UserToken");
      const res = await fetch(
        `${API_BASE_URL}/api/courses/doubts/ask-ai/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          body: JSON.stringify({ question: chatInput }),
        }
      );
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I'm having trouble connecting." },
      ]);
    }
  };

  // Active playing lesson state
  const [activeLesson, setActiveLesson] = useState(null);

  // Active view state: 'lesson' | 'assessment'
  const [activeView, setActiveView] = useState({ type: "lesson", data: null });

  // Quiz state when taking an assessment
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // State to track expanded modules for showing lessons in sidebar
  const [expandedModules, setExpandedModules] = useState({ 0: true });

  // Review & Rating Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("/embed/")) return url;
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("watch?v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  const getPdfUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }
    return `${API_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem("UserToken");

        const courseRes = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          credentials: "include",
        });
        const courseData = await courseRes.json();

        const enrollmentRes = await fetch(
          `${API_BASE_URL}/api/courses/${id}/enroll`,
          {
            method: "GET",
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            credentials: "include",
          }
        );
        const enrollmentData = await enrollmentRes.json();

        if (courseRes.ok && courseData.success) {
          setCourse(courseData.course);

          if (courseData.course.modules?.[0]?.lessons?.[0]) {
            setActiveLesson(courseData.course.modules[0].lessons[0]);
          }

          const allExpanded = {};
          courseData.course.modules?.forEach((_, idx) => {
            allExpanded[idx] = true;
          });
          setExpandedModules(allExpanded);
        }

        if (enrollmentRes.ok && enrollmentData.success) {
          setEnrollment(enrollmentData.enrollment);
        }
      } catch (error) {
        console.error("Failed to load learning portal:", error);
        toast.error("Network error while loading course room.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [id, API_BASE_URL]);

  const handleToggleLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem("UserToken");
      const response = await fetch(
        `${API_BASE_URL}/api/courses/${id}/progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ lessonId }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setEnrollment(data.enrollment);
        toast.success(data.message || "Progress updated!");

        // Trigger review modal automatically if course just completed
        if (data.enrollment?.isCompleted) {
          setShowReviewModal(true);
        }
      } else {
        toast.error(data.message || "Failed to load progress");
      }
    } catch (error) {
      console.error("Progress update error:", error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("UserToken");
      const response = await fetch(`${API_BASE_URL}/api/courses/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ rating, comment }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Review saved successfully!");
        setShowReviewModal(false);
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Network error while submitting review.");
    }
  };

  const toggleModuleExpand = (modIdx) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modIdx]: !prev[modIdx],
    }));
  };

  const isModuleCompleted = (mod, completedLessons) => {
    if (!mod.lessons || mod.lessons.length === 0) return true;
    return mod.lessons.every((lesson) => completedLessons.includes(lesson._id));
  };

  const handleStartAssessment = (assignment, modIdx, modTitle) => {
    const existingSubmission = enrollment?.assessmentSubmissions?.find(
      (sub) => sub.moduleIndex === modIdx
    );

    const fallbackAssignment = {
      title: assignment?.title || `${modTitle} Assessment`,
      description:
        assignment?.description || "Test your knowledge for this module.",
      questions:
        assignment?.questions?.length > 0
          ? assignment.questions
          : [
              {
                questionText:
                  "Sample MCQ: What is the core concept covered in this module?",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctOptionIndex: 0,
                explanation: "Sample explanation.",
              },
            ],
    };

    setActiveView({ type: "assessment", data: fallbackAssignment, modIdx });
    setSelectedAnswers({});

    if (existingSubmission) {
      setQuizSubmitted(true);
      setQuizScore(existingSubmission.score);
    } else {
      setQuizSubmitted(false);
      setQuizScore(0);
    }
  };

  const handleSubmitQuiz = async (questions, modIdx) => {
    let scoreCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        scoreCount++;
      }
    });
    setQuizScore(scoreCount);
    setQuizSubmitted(true);

    try {
      const token = localStorage.getItem("UserToken");
      const response = await fetch(
        `${API_BASE_URL}/api/courses/${id}/assessment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            moduleIndex: Number(modIdx),
            score: scoreCount,
            totalQuestions: questions.length,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setEnrollment(data.enrollment);
        toast.success(
          `Score: ${scoreCount} / ${questions.length} saved successfully!`
        );
      } else {
        toast.error(data.message || "Failed to save score");
      }
    } catch (error) {
      console.error("Score submission error:", error);
      toast.error("Network error while saving score.");
    }
  };

  // Helper to extract student ID from UserToken JWT
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("UserToken");
      if (!token) return null;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded.id || decoded._id;
    } catch (e) {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-4 bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-bold text-base tracking-wide animate-pulse">
          Loading secure learning classroom...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-32 bg-slate-50 text-slate-800 min-h-[75vh] space-y-4">
        <h2 className="text-2xl font-black">Classroom unavailable</h2>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const completedLessons = enrollment?.completedLessons || [];
  const progressPercentage = enrollment?.progressPercentage || 0;
  const activeEmbedUrl = getEmbedUrl(activeLesson?.videoUrl);
  const totalLessons =
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const imageUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `${API_BASE_URL}${course.thumbnail}`;

  const currentUserId = getCurrentUserId();
  const myReview = course?.reviews?.find(
    (rev) =>
      rev.student?._id?.toString() === currentUserId?.toString() ||
      rev.student?.toString() === currentUserId?.toString()
  );

  const openEditModal = () => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
    setShowReviewModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white pb-32">
      {/* ========================================== */}
      {/* 🌟 IMMERSIVE HERO HEADER */}
      {/* ========================================== */}
      <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 shadow-2xl overflow-hidden mt-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[96rem] mx-auto relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="text-xs font-bold text-slate-300 hover:text-white transition px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Course Overview
            </button>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20">
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                  Overall Progress
                </span>
                <span className="text-xs font-black text-emerald-400">
                  {progressPercentage}% Completed
                </span>
              </div>
              <div className="w-28 sm:w-40 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700 rounded-full shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              {progressPercentage === 100 && (
                <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-xl text-xs font-black">
                  <Award size={15} /> Completed
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30 shadow-md">
                  {course.category}
                </span>
                {course.subCategory && (
                  <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-400/30 shadow-md">
                    {course.subCategory}
                  </span>
                )}
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
                  {course.level || "Beginner"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-blue-200 text-base font-semibold">
                  {course.subtitle}
                </p>
              )}

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Layers size={16} className="text-indigo-400" />{" "}
                  {course.modules?.length || 0} Modules
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={16} className="text-cyan-400" />{" "}
                  {totalLessons} Total Lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />{" "}
                  {course.averageRating
                    ? course.averageRating.toFixed(1)
                    : "4.9"}{" "}
                  Rating
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl space-y-4">
              <div className="relative h-40 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
                <img
                  src={imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                <span>Access Granted</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} /> Enrolled & Paid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🎖️ CERTIFICATE UNLOCK BANNER */}
      {/* ========================================== */}
      {enrollment?.isCompleted && (
        <div className="max-w-[96rem] mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                <Award size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Certificate Unlocked!</h2>
                <p className="text-amber-100 font-bold text-sm">
                  You have officially graduated from {course.title}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openEditModal}
                className="px-6 py-4 bg-amber-700 text-white font-black rounded-2xl shadow-xl hover:bg-amber-800 transition flex items-center gap-2 cursor-pointer"
              >
                <Star size={18} /> {myReview ? "Edit Review" : "Rate Course"}
              </button>
              <Link
                to={`/student/certificate/${id}`}
                className="px-8 py-4 bg-white text-amber-700 font-black rounded-2xl shadow-xl hover:bg-slate-50 transition flex items-center gap-2"
              >
                <FileCheck size={20} /> View Certificate
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 📺 WIDER CLASSROOM CONTAINER GRID */}
      {/* ========================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-[96rem] mx-auto w-full p-4 sm:p-6 lg:p-8 gap-8">
        {/* Left Dynamic View Area: Video Player OR Assessment View (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {activeView.type === "lesson" ? (
            <>
              <div className="bg-black rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-video relative flex items-center justify-center">
                {activeEmbedUrl ? (
                  <iframe
                    src={activeEmbedUrl}
                    title={activeLesson?.title || "Lesson Video"}
                    className="w-full h-full absolute inset-0 border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center text-slate-400 space-y-3">
                    <PlayCircle
                      size={56}
                      className="mx-auto opacity-40 text-blue-500 animate-pulse"
                    />
                    <p className="text-sm font-bold text-slate-300">
                      Select a lesson from the syllabus sidebar to start
                      watching.
                    </p>
                  </div>
                )}
              </div>

              {activeLesson && (
                <div className="space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider border border-blue-100">
                          Currently Playing
                        </span>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                          <Clock size={13} className="text-blue-500" />{" "}
                          {activeLesson.duration || 10} mins
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        {activeLesson.title}
                      </h2>
                      {activeLesson.description && (
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                          {activeLesson.description}
                        </p>
                      )}
                    </div>

                    {completedLessons.includes(activeLesson._id) ? (
                      <div className="px-7 py-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs flex items-center gap-2.5 shadow-xl shadow-emerald-500/15 whitespace-nowrap">
                        <CheckCircle2 size={18} /> Lesson Completed
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleToggleLessonComplete(activeLesson._id)
                        }
                        className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center gap-2.5 transition shadow-xl shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                      >
                        <Circle size={18} /> Mark as Complete
                      </button>
                    )}
                  </div>

                  {/* 🔥 LESSON DOUBT AI SOLVING WIDGET */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                          <Zap size={16} />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900">
                            Ask AI About This Lesson
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Stuck on "{activeLesson.title}"? Get instant AI
                            explanations.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                        Course Assistant
                      </span>
                    </div>

                    {/* Chat History Box */}
                    <div className="space-y-3 max-h-60 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white ml-auto rounded-br-xs shadow-sm"
                              : "bg-white text-slate-700 mr-auto rounded-bl-xs border border-slate-200 shadow-2xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    {/* Input Box */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder={`Ask a doubt regarding "${activeLesson.title}"...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                        className="flex-1 p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        onClick={handleAskAI}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer flex items-center gap-1.5"
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔥 YOUR REVIEW DISPLAY SECTION (DIRECTLY BELOW VIDEO PLAYER) */}
              {enrollment?.isCompleted && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Star
                        size={18}
                        className="text-amber-400 fill-amber-400"
                      />{" "}
                      Your Course Review
                    </h3>
                    {myReview ? (
                      <button
                        onClick={openEditModal}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 size={14} /> Edit Review
                      </button>
                    ) : (
                      <button
                        onClick={openEditModal}
                        className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        + Add Review
                      </button>
                    )}
                  </div>

                  {myReview ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {myReview.student?.profileImage ? (
                            <img
                              src={
                                myReview.student.profileImage.startsWith("http")
                                  ? myReview.student.profileImage
                                  : `${API_BASE_URL}${myReview.student.profileImage}`
                              }
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                              {myReview.student?.firstName?.[0] || (
                                <User size={18} />
                              )}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">
                              {`${myReview.student?.firstName || ""} ${
                                myReview.student?.lastName || ""
                              }`.trim() || "You"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block">
                              Verified Student Review
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < myReview.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 italic">
                        "{myReview.comment}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                      <p>You haven't submitted a review for this course yet.</p>
                      <button
                        onClick={openEditModal}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow hover:bg-indigo-700 cursor-pointer"
                      >
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* ========================================== */
            /* 📝 MODULE ASSESSMENT MCQ VIEW */
            /* ========================================== */
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider">
                    Module Assessment
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    {activeView.data.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {activeView.data.description}
                  </p>
                </div>
                <button
                  onClick={() => setActiveView({ type: "lesson", data: null })}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer shadow-2xs"
                >
                  Back to Lessons
                </button>
              </div>

              <div className="space-y-6">
                {activeView.data.questions?.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-4"
                  >
                    <p className="text-sm font-black text-slate-900">
                      {qIdx + 1}. {q.questionText}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect =
                          quizSubmitted && q.correctOptionIndex === optIdx;
                        const isWrong =
                          quizSubmitted && isSelected && !isCorrect;

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() =>
                              setSelectedAnswers({
                                ...selectedAnswers,
                                [qIdx]: optIdx,
                              })
                            }
                            className={`p-3.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs"
                                : isWrong
                                ? "bg-red-50 border-red-300 text-red-900 shadow-2xs"
                                : isSelected
                                ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {opt} {isCorrect && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() =>
                    handleSubmitQuiz(
                      activeView.data.questions,
                      activeView.modIdx
                    )
                  }
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 cursor-pointer transition"
                >
                  Submit Assessment
                </button>
              ) : (
                <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-black text-center text-base shadow-sm">
                  🎉 Final Assessment Score: {quizScore} /{" "}
                  {activeView.data.questions.length} (
                  {(
                    (quizScore / activeView.data.questions.length) *
                    100
                  ).toFixed(0)}
                  %)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Syllabus Curriculum Drawer (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 h-fit shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers size={20} className="text-blue-600" /> Course Syllabus &
              Modules
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {course.modules?.length || 0} Modules
            </span>
          </div>

          <div className="space-y-6">
            {course.modules?.map((mod, modIdx) => {
              const isModExpanded = expandedModules[modIdx];
              const allLessonsDone = isModuleCompleted(mod, completedLessons);

              return (
                <div
                  key={modIdx}
                  className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/90 shadow-2xs"
                >
                  <div
                    onClick={() => toggleModuleExpand(modIdx)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-blue-600 transition pr-2">
                      {mod.title}
                    </h4>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                        isModExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {mod.notes && mod.notes.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {mod.notes.map((note, noteIdx) => {
                        const noteUrl = getPdfUrl(note.fileUrl);
                        return (
                          <a
                            key={noteIdx}
                            href={noteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100/70 transition text-xs font-bold text-blue-700 shadow-2xs cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5 truncate">
                              <FileText
                                size={16}
                                className="text-blue-600 flex-shrink-0"
                              />
                              <span className="truncate">
                                {note.title || `${mod.title} Notes`}
                              </span>
                            </span>
                            <ExternalLink size={14} className="flex-shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {isModExpanded && (
                    <div className="space-y-3 pt-2">
                      {mod.lessons?.map((lesson, lesIdx) => {
                        const isSelected =
                          activeView.type === "lesson" &&
                          activeLesson?._id === lesson._id;
                        const isCompleted = completedLessons.includes(
                          lesson._id
                        );

                        return (
                          <div
                            key={lesson._id || lesIdx}
                            onClick={() => {
                              setActiveLesson(lesson);
                              setActiveView({ type: "lesson", data: null });
                            }}
                            className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 border-blue-300 text-blue-900 shadow-2xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isCompleted ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-600 flex-shrink-0"
                                />
                              ) : (
                                <PlayCircle
                                  size={16}
                                  className={`flex-shrink-0 ${
                                    isSelected
                                      ? "text-blue-600"
                                      : "text-slate-400"
                                  }`}
                                />
                              )}
                              <span className="text-xs font-bold truncate">
                                {lesIdx + 1}. {lesson.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">
                              {lesson.duration || 10}m
                            </span>
                          </div>
                        );
                      })}

                      {/* 🔑 CONDITIONAL RENDERING: ONLY SHOWS IF ALL LESSONS IN THIS MODULE ARE COMPLETED */}
                      {allLessonsDone ? (
                        <>
                          {/* Module MCQ Assessment Trigger */}
                          {mod.assignment && (
                            <button
                              onClick={() =>
                                handleStartAssessment(
                                  mod.assignment,
                                  modIdx,
                                  mod.title
                                )
                              }
                              className="w-full text-left text-xs font-black text-indigo-800 bg-indigo-50/80 border border-indigo-200 p-3.5 rounded-xl flex items-center justify-between shadow-2xs hover:bg-indigo-100 transition cursor-pointer"
                            >
                              <span className="flex items-center gap-2.5 truncate">
                                <FileCheck
                                  size={16}
                                  className="text-indigo-600 shrink-0"
                                />
                                <span className="truncate">
                                  {mod.assignment.title || "Module Assessment"}
                                </span>
                              </span>
                              {enrollment?.assessmentSubmissions?.find(
                                (s) => s.moduleIndex === modIdx
                              ) ? (
                                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-bold flex-shrink-0">
                                  {
                                    enrollment.assessmentSubmissions.find(
                                      (s) => s.moduleIndex === modIdx
                                    ).score
                                  }
                                  /{mod.assignment.questions?.length || 0}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md font-bold flex-shrink-0">
                                  {mod.assignment.questions?.length || 0} Qs
                                </span>
                              )}
                            </button>
                          )}

                          {/* Coding Practice Problem Trigger */}
                          {mod.codingProblem?.problemSlug && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/student/practice/${mod.codingProblem.problemSlug}`,
                                  {
                                    state: {
                                      courseId: id,
                                      title: mod.codingProblem.title,
                                      difficulty: mod.codingProblem.difficulty,
                                      description:
                                        mod.codingProblem.description,
                                    },
                                  }
                                )
                              }
                              className="w-full text-left text-xs font-black text-emerald-900 bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between shadow-2xs hover:bg-emerald-100 transition cursor-pointer"
                            >
                              <span className="flex items-center gap-2.5 truncate">
                                <Code2
                                  size={16}
                                  className="text-emerald-600 shrink-0"
                                />
                                <span className="truncate">
                                  {mod.codingProblem.title}
                                </span>
                              </span>
                              {enrollment?.solvedCodingProblems?.includes(
                                mod.codingProblem.problemSlug
                              ) ? (
                                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold flex items-center gap-1 shrink-0">
                                  Solved ✓
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold flex-shrink-0">
                                  {mod.codingProblem.difficulty}
                                </span>
                              )}
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-slate-200/50 text-slate-500 text-xs font-bold flex items-center gap-2 border border-slate-200">
                          <Lock size={14} className="text-slate-400 shrink-0" />
                          <span>
                            Complete all lessons to unlock module assessment &
                            coding challenge.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🌟 COURSE BENEFITS & CLASSROOM INFO CARDS */}
      {/* ========================================== */}
      <div className="max-w-[96rem] mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Zap size={16} /> Program Perks & Benefits
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Everything Included in Your Enrollment
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" /> Lifetime
                access to all modules and video archives
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" />{" "}
                Downloadable PDF resource notes and lesson guides
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" /> Verified
                certificate of completion upon 100% progress
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-600" /> Secure
                progress sync across your student dashboard
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Info size={18} className="text-blue-600" /> Classroom Session
              Telemetry
            </div>
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Course Category:</span>
                <span className="font-bold text-slate-800">
                  {course.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Difficulty Level:</span>
                <span className="font-bold text-slate-800">
                  {course.level || "Beginner"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Total Curriculum Lessons:
                </span>
                <span className="font-bold text-slate-800">
                  {totalLessons} Lessons
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Completed By You:</span>
                <span className="font-bold text-emerald-600">
                  {completedLessons.length} / {totalLessons}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🌟 COURSE FEEDBACK / REVIEW MODAL */}
      {/* ========================================== */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-1">
              <Award size={48} className="text-amber-500 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">
                {myReview
                  ? "Edit Your Review"
                  : "Course Successfully Completed!"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {myReview
                  ? "Update your rating and feedback below."
                  : "Please leave a review and rating for your learning experience."}
              </p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <Star
                  key={r}
                  size={30}
                  className={`cursor-pointer transition hover:scale-110 ${
                    rating >= r
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                  onClick={() => setRating(r)}
                />
              ))}
            </div>

            <textarea
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-28 bg-slate-50"
              placeholder="Write your feedback here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-xs shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition cursor-pointer"
              >
                {myReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Chat Button */}
   

    
    </div>
  );
};

export default LearnCoursePage;
