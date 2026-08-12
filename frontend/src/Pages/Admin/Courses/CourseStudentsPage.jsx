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
} from "lucide-react";
import { toast } from "react-toastify";

const CourseStudentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="space-y-6">
          {filteredEnrollments.map((enrol) => {
            const student = enrol.student;
            const progress = enrol.progressPercentage || 0;
            const profileImgUrl = getImageUrl(student?.profileImage);

            return (
              <div
                key={enrol._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 flex flex-col gap-6 hover:shadow-2xl transition-all duration-300"
              >
                {/* Top Row: Student Profile + Status Badges */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-100 shadow-inner">
                      {profileImgUrl ? (
                        <img
                          src={profileImgUrl}
                          alt={`${student?.firstName} avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black uppercase">
                          {student?.firstName ? (
                            student.firstName[0]
                          ) : (
                            <User size={22} />
                          )}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg">
                        {student?.firstName || "Unknown"}{" "}
                        {student?.lastName || ""}
                      </h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                        <Mail size={13} className="text-slate-400" />{" "}
                        {student?.email || "No email available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        enrol.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                          : "bg-blue-50 text-blue-600 border border-blue-200/60"
                      }`}
                    >
                      {enrol.paymentStatus || "Free"}
                    </span>

                    {enrol.isProgressComplete || progress === 100 ? (
                      <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black border border-emerald-200/60">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-black border border-amber-200/60">
                        <Clock size={14} /> In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Financial & Transaction Telemetry Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                      <DollarSign size={13} className="text-emerald-600" />{" "}
                      Amount Paid
                    </span>
                    <span className="text-base font-black text-slate-900">
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
                      {new Date(enrol.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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

                {/* Bottom Row: Course Progression Tracking Bar */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-blue-600" /> Course
                      Progression Roster
                    </span>
                    <span className="text-slate-900 font-black">
                      {progress}% Completed (
                      {enrol.completedLessons?.length || 0} Lessons Finished)
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseStudentsPage;
