import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
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
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 font-semibold text-lg animate-pulse">
        Loading student roster...
      </div>
    );
  }

  return (
    <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition mb-1"
          >
            <ArrowLeft size={16} /> Back to Course Dashboard
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="text-emerald-600" /> Enrolled Students Roster
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Course:{" "}
            <span className="font-bold text-gray-800">{course?.title}</span>
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm">
          <Users size={18} /> {enrollments.length} Total Enrolled
        </div>
      </div>

      {/* Search Bar Controls */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3.5 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium transition"
          />
        </div>
        <div className="text-xs font-bold text-gray-500">
          Showing{" "}
          <span className="text-gray-900">{filteredEnrollments.length}</span>{" "}
          students
        </div>
      </div>

      {/* Students Data Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No students found</h3>
          <p className="text-gray-500 text-sm mt-1">
            {searchTerm
              ? "Try adjusting your search query."
              : "No one has enrolled in this course yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Student Details</th>
                  <th className="py-4 px-6">Enrollment Date</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6">Course Progress</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnrollments.map((enrol) => {
                  const student = enrol.student;
                  const progress = enrol.progressPercentage || 0;

                  return (
                    <tr
                      key={enrol._id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 uppercase shadow-inner">
                          {student?.firstName ? student.firstName[0] : "S"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {student?.firstName || "Unknown"}{" "}
                            {student?.lastName || ""}
                          </h4>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} />{" "}
                            {student?.email || "No email available"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs font-semibold text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-gray-400" />
                          {new Date(enrol.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            enrol.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {enrol.paymentStatus || "Free"}
                        </span>
                      </td>

                      <td className="py-4 px-6 w-56">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-700">
                              {progress}% Done
                            </span>
                            <span className="text-gray-400">
                              {enrol.completedLessons?.length || 0} Lessons
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {enrol.isProgressComplete || progress === 100 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 size={13} /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
                            <Clock size={13} /> In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseStudentsPage;
