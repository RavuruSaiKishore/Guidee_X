import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  CreditCard,
  BookOpen,
  Layers,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";

const CourseStudentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State to track which student cards are expanded
  const [expandedCards, setExpandedCards] = useState({});

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Helper for absolute image / profile picture URLs
  const getImageUrl = (profileImage) => {
    if (!profileImage) return "";
    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }
    return `${API_BASE_URL}${
      profileImage.startsWith("/") ? "" : "/"
    }${profileImage}`;
  };

  useEffect(() => {
    const fetchCourseStudents = async () => {
      try {
        const token = localStorage.getItem("AdminToken");
        const response = await fetch(
          `${API_BASE_URL}/api/courses/${id}/details-with-students`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          setCourse(data.course);
          setEnrollments(data.enrollments);
        } else {
          toast.error(data.message || "Failed to load enrollment records");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Network error while loading students.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseStudents();
  }, [id, API_BASE_URL]);

  // Toggle card expansion
  const toggleCard = (enrolId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [enrolId]: !prev[enrolId],
    }));
  };

  // Filter students based on search input (name or email)
  const filteredEnrollments = enrollments.filter((enrol) => {
    const fullName = `${enrol.student?.firstName || ""} ${
      enrol.student?.lastName || ""
    }`.toLowerCase();
    const email = (enrol.student?.email || "").toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500 font-semibold text-lg animate-pulse">
        Loading student roster & financial telemetry...
      </div>
    );
  }

  // Calculate total course modules and lessons count safely
  const totalCourseModules = course?.modules?.length || 0;
  const totalCourseLessons =
    course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition mb-1 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Course Dashboard
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-emerald-600" /> Enrolled Students & Payment
            Roster
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Course:{" "}
            <span className="font-bold text-slate-800">{course?.title}</span>
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm">
          <Users size={18} /> {enrollments.length} Total Enrollments
        </div>
      </div>

      {/* Search Bar Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3.5 top-3.5 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Showing{" "}
          <span className="text-slate-900">{filteredEnrollments.length}</span>{" "}
          records
        </div>
      </div>

      {/* Full-Width Horizontal Transaction Cards */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Users size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            No enrollment records found
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            {searchTerm
              ? "Try adjusting your search query."
              : "No one has enrolled in this course yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnrollments.map((enrol) => {
            const student = enrol.student;
            const progress = enrol.progressPercentage || 0;
            const profileImgUrl = getImageUrl(student?.profileImage);
            const isExpanded = expandedCards[enrol._id];

            // Compute completed vs remaining module/lesson metrics
            const completedLessonsCount = enrol.completedLessons?.length || 0;
            const remainingLessonsCount = Math.max(
              0,
              totalCourseLessons - completedLessonsCount
            );

            const completedModulesCount =
              enrol.completedModules?.length ||
              (totalCourseModules > 0 && totalCourseLessons > 0
                ? Math.floor(
                    (completedLessonsCount / totalCourseLessons) *
                      totalCourseModules
                  )
                : 0);
            const remainingModulesCount = Math.max(
              0,
              totalCourseModules - completedModulesCount
            );

            return (
              <div
                key={enrol._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg"
              >
                {/* Compact Always-Visible Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-100 shadow-2xs">
                      {profileImgUrl ? (
                        <img
                          src={profileImgUrl}
                          alt={`${student?.firstName} avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base font-black uppercase">
                          {student?.firstName ? (
                            student.firstName[0]
                          ) : (
                            <User size={18} />
                          )}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">
                        {student?.firstName || "Unknown"}{" "}
                        {student?.lastName || ""}
                      </h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                        <Mail size={12} className="text-slate-400" />{" "}
                        {student?.email || "No email available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Compact Progress summary */}
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80 hidden md:block">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {progress}%
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        enrol.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                          : "bg-blue-50 text-blue-600 border border-blue-200/60"
                      }`}
                    >
                      {enrol.paymentStatus || "Free"}
                    </span>

                    {enrol.isProgressComplete || progress === 100 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black border border-emerald-200/60 hidden sm:inline-flex">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-black border border-amber-200/60 hidden sm:inline-flex">
                        <Clock size={13} /> In Progress
                      </span>
                    )}

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleCard(enrol._id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      {isExpanded ? (
                        <>
                          <span className="hidden sm:inline">Less</span>{" "}
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Details</span>{" "}
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Dropdown Content */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
                    {/* Middle Row: Financial & Transaction Telemetry Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                          <DollarSign size={13} className="text-emerald-600" />{" "}
                          Amount Paid
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          ₹
                          {enrol.amountPaid > 0
                            ? enrol.amountPaid
                            : course?.price || 0}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                          <Calendar size={13} className="text-blue-600" />{" "}
                          Enrollment Date
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(enrol.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                          <CreditCard size={13} className="text-indigo-600" />{" "}
                          Razorpay Order ID
                        </span>
                        <span
                          className="text-xs font-mono font-bold text-slate-800 truncate block"
                          title={enrol.razorpayOrderId || "N/A (Free)"}
                        >
                          {enrol.razorpayOrderId || "Free / No Order ID"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                          <ShieldCheck size={13} className="text-cyan-600" />{" "}
                          Razorpay Payment ID
                        </span>
                        <span
                          className="text-xs font-mono font-bold text-slate-800 truncate block"
                          title={enrol.razorpayPaymentId || "N/A"}
                        >
                          {enrol.razorpayPaymentId || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Additional Row: Module & Lesson Completion Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                            <CheckCircle size={16} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                              Completed Breakdown
                            </span>
                            <span className="text-xs font-extrabold text-slate-900">
                              {completedModulesCount} / {totalCourseModules}{" "}
                              Modules
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-xl">
                          {completedLessonsCount} Lessons Done
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                            <Layers size={16} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">
                              Remaining Breakdown
                            </span>
                            <span className="text-xs font-extrabold text-slate-900">
                              {remainingModulesCount} / {totalCourseModules}{" "}
                              Modules
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-xl">
                          {remainingLessonsCount} Lessons Left
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Detailed Course Progression Tracking Bar */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <BookOpen size={14} className="text-blue-600" />{" "}
                          Course Progression Roster
                        </span>
                        <span className="text-slate-900 font-black">
                          {progress}% Completed ({completedLessonsCount} /{" "}
                          {totalCourseLessons} Lessons Finished)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseStudentsPage;
