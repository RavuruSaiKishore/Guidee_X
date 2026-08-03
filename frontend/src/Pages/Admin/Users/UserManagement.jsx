import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  Award,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] =
    useState("All");

  const [deleteStudent, setDeleteStudent] =
    useState(null);

  const [deleting, setDeleting] = useState(false);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [adding, setAdding] = useState(false);

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token =
        localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/allstudents`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch students"
        );
      }

      const studentList = (
        data.users ||
        data.students ||
        []
      ).filter(
        (user) =>
          !user.role ||
          user.role === "student"
      );

      setStudents(studentList);
    } catch (error) {
      console.error(
        "Fetch students error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load students"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredStudents = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return students.filter((student) => {
      const fullName =
        `${student.firstName || ""} ${
          student.lastName || ""
        }`.toLowerCase();

      const email =
        student.email?.toLowerCase() || "";

      const phone =
        student.phone?.toLowerCase() || "";

      const education =
        student.education?.toLowerCase() || "";

      const careerGoal =
        student.careerGoal?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        education.includes(search) ||
        careerGoal.includes(search);

      let matchesStatus = true;

      if (statusFilter === "Active") {
        matchesStatus =
          student.isActive === true &&
          student.isBlocked !== true;
      }

      if (statusFilter === "Inactive") {
        matchesStatus =
          student.isActive !== true;
      }

      if (statusFilter === "Blocked") {
        matchesStatus =
          student.isBlocked === true;
      }

      let matchesVerification = true;

      if (
        verificationFilter ===
        "Verified"
      ) {
        matchesVerification =
          student.isVerified === true;
      }

      if (
        verificationFilter ===
        "Not Verified"
      ) {
        matchesVerification =
          student.isVerified !== true;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification
      );
    });
  }, [
    students,
    searchTerm,
    statusFilter,
    verificationFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents =
    students.length;

  const activeStudents =
    students.filter(
      (student) =>
        student.isActive === true &&
        student.isBlocked !== true
    ).length;

  const verifiedStudents =
    students.filter(
      (student) =>
        student.isVerified === true
    ).length;

  const blockedStudents =
    students.filter(
      (student) =>
        student.isBlocked === true
    ).length;

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleViewStudent = (student) => {
    navigate(
      `/admin/students/${student._id}`
    );
  };

  const handleEditStudent = (student) => {
    navigate(
      `/admin/students/${student._id}/edit`
    );
  };

  // =====================================================
  // ADD STUDENT
  // =====================================================

  const handleAddStudent = async () => {
    try {
      if (
        !newStudent.firstName.trim() ||
        !newStudent.lastName.trim() ||
        !newStudent.email.trim() ||
        !newStudent.password.trim()
      ) {
        toast.error(
          "Please fill all required fields."
        );

        return;
      }

      setAdding(true);

      const token =
        localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/addstudent`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            firstName:
              newStudent.firstName.trim(),

            lastName:
              newStudent.lastName.trim(),

            email:
              newStudent.email
                .trim()
                .toLowerCase(),

            password:
              newStudent.password,

            phone:
              newStudent.phone.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add student"
        );
      }

      toast.success(
        "Student added successfully"
      );

      setShowAddModal(false);

      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
      });

      setSearchTerm("");

      await fetchStudents(true);
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to add student"
      );
    } finally {
      setAdding(false);
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const handleDeleteStudent = async () => {
    if (!deleteStudent?._id) {
      return;
    }

    try {
      setDeleting(true);

      const token =
        localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/students/${deleteStudent._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete student"
        );
      }

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student._id !==
            deleteStudent._id
        )
      );

      toast.success(
        "Student deleted successfully"
      );

      setDeleteStudent(null);
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete student"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setVerificationFilter("All");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Never";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // GET INITIALS
  // =====================================================

  const getInitials = (student) => {
    const first =
      student.firstName
        ?.charAt(0)
        ?.toUpperCase() || "";

    const last =
      student.lastName
        ?.charAt(0)
        ?.toUpperCase() || "";

    return `${first}${last}` || "S";
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getProfileImage = (student) => {
    if (!student.profileImage) {
      return null;
    }

    if (
      student.profileImage.startsWith(
        "http"
      )
    ) {
      return student.profileImage;
    }

    return `${API_BASE_URL}${student.profileImage}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

            <RefreshCw
              size={26}
              className="animate-spin text-blue-600"
            />

          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            Loading Students
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Fetching student information...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-5 overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 shadow-sm">
        <div className="flex min-h-[130px] flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT CONTENT */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <Users size={26} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                User Management
              </h1>

              <p className="mt-1.5 text-sm text-gray-600">
                Manage and monitor all registered students
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => fetchStudents(true)}
              disabled={refreshing}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white/80 px-5 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200"
            >
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Total Students
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {totalStudents}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={19} />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Active</p>

              <h3 className="mt-1 text-2xl font-bold text-green-600">
                {activeStudents}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Activity size={19} />
            </div>
          </div>
        </div>

        {/* VERIFIED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Verified</p>

              <h3 className="mt-1 text-2xl font-bold text-purple-600">
                {verifiedStudents}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck size={19} />
            </div>
          </div>
        </div>

        {/* BLOCKED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Blocked</p>

              <h3 className="mt-1 text-2xl font-bold text-red-600">
                {blockedStudents}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Lock size={19} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH AND FILTER
      ====================================================== */}

      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, education or career goal..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Status</option>

            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>

            <option value="Blocked">Blocked</option>
          </select>

          {/* VERIFICATION */}

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Verification</option>

            <option value="Verified">Verified</option>

            <option value="Not Verified">Not Verified</option>
          </select>

          {/* CLEAR */}

          {(searchTerm ||
            statusFilter !== "All" ||
            verificationFilter !== "All") && (
            <button
              onClick={clearFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {filteredStudents.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{students.length}</span>{" "}
          students
        </div>
      </div>

      {/* =====================================================
          STUDENT CARDS
      ====================================================== */}

      {/* =====================================================
    STUDENT CARDS
====================================================== */}

      <div className="space-y-4">
        {filteredStudents.map((student) => {
          const image = getProfileImage(student);

          const fullName = `${student.firstName || ""} ${
            student.lastName || ""
          }`.trim();

          return (
            <div
              key={student._id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md sm:p-5"
            >
              <div className="flex flex-col gap-5">
                {/* =================================================
              TOP ROW
          ================================================== */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* PROFILE */}

                  <div className="flex min-w-0 items-center gap-4 lg:w-[280px]">
                    {image ? (
                      <img
                        src={image}
                        alt={fullName}
                        className="h-16 w-16 shrink-0 rounded-2xl border border-gray-200 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                        {getInitials(student)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-bold text-gray-900">
                          {fullName || "Unnamed Student"}
                        </h3>

                        {student.isVerified && (
                          <CheckCircle2
                            size={16}
                            className="shrink-0 text-blue-500"
                          />
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-gray-400">
                        ID: {student._id}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {student.isBlocked ? (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600">
                            Blocked
                          </span>
                        ) : student.isActive ? (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                            Inactive
                          </span>
                        )}

                        {student.isVerified ? (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-semibold text-yellow-600">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                CONTACT INFORMATION
            ================================================== */}

                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* EMAIL */}

                    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        <Mail size={13} />
                        Email
                      </div>

                      <p
                        className="truncate text-sm font-semibold text-gray-700"
                        title={student.email}
                      >
                        {student.email || "Not provided"}
                      </p>
                    </div>

                    {/* PHONE */}

                    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        <Phone size={13} />
                        Phone
                      </div>

                      <p className="truncate text-sm font-semibold text-gray-700">
                        {student.phone || "Not provided"}
                      </p>
                    </div>

                    {/* EDUCATION */}

                    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        <GraduationCap size={13} />
                        Education
                      </div>

                      <p
                        className="truncate text-sm font-semibold text-gray-700"
                        title={student.education}
                      >
                        {student.education || "Not provided"}
                      </p>
                    </div>

                    {/* CAREER GOAL */}

                    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        <Award size={13} />
                        Career Goal
                      </div>

                      <p
                        className="truncate text-sm font-semibold text-gray-700"
                        title={student.careerGoal}
                      >
                        {student.careerGoal || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
              BOTTOM ROW
          ================================================== */}

                <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEARNING STATS */}

                  <div className="flex flex-wrap items-center gap-2">
                    {/* XP */}

                    <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                        <Zap size={14} className="text-amber-600" />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-amber-500">
                          Experience
                        </p>

                        <p className="text-xs font-bold text-amber-700">
                          {student.learningStats?.xp || 0} XP
                        </p>
                      </div>
                    </div>

                    {/* LEVEL */}

                    <div className="flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                        <Award size={14} className="text-purple-600" />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-purple-500">
                          Level
                        </p>

                        <p className="text-xs font-bold text-purple-700">
                          {student.learningStats?.level || 1}
                        </p>
                      </div>
                    </div>

                    {/* STREAK */}

                    <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100">
                        <Activity size={14} className="text-orange-600" />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-orange-500">
                          Current Streak
                        </p>

                        <p className="text-xs font-bold text-orange-700">
                          {student.learningStats?.streak?.current || 0} Days
                        </p>
                      </div>
                    </div>

                    {/* LONGEST STREAK */}

                    <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100">
                        <Zap size={14} className="text-green-600" />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-green-500">
                          Best Streak
                        </p>

                        <p className="text-xs font-bold text-green-700">
                          {student.learningStats?.streak?.longest || 0} Days
                        </p>
                      </div>
                    </div>

                    {/* LAST LOGIN */}

                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                        <CalendarDays size={14} className="text-gray-500" />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-gray-400">
                          Last Login
                        </p>

                        <p className="text-xs font-bold text-gray-700">
                          {formatDate(student.lastLogin)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2">
                    {/* VIEW */}

                    <button
                      onClick={() => handleViewStudent(student)}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    {/* EDIT */}

                    <button
                      onClick={() => handleEditStudent(student)}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 text-sm font-semibold text-amber-600 transition hover:bg-amber-100"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() => setDeleteStudent(student)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {filteredStudents.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <UserRound size={26} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-800">
            No students found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* =====================================================
          ADD STUDENT MODAL
      ====================================================== */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-5 text-white sm:px-6">
              <div>
                <h2 className="text-xl font-bold">Add Student</h2>

                <p className="mt-1 text-sm text-blue-100">
                  Create a new student account
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-4 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    value={newStudent.firstName}
                    onChange={(e) =>
                      setNewStudent((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="First name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={newStudent.lastName}
                    onChange={(e) =>
                      setNewStudent((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Last name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="student@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  maxLength={10}
                  value={newStudent.phone}
                  onChange={(e) =>
                    setNewStudent((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 p-5 sm:flex-row sm:justify-end sm:px-6">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={adding}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleAddStudent}
                disabled={adding}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {adding ? "Creating..." : "Create Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {deleteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                Delete Student?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to permanently delete
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {deleteStudent.firstName} {deleteStudent.lastName}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {deleteStudent.email}
              </p>
            </div>

            <div className="flex gap-3 border-t bg-gray-50 p-4">
              <button
                onClick={() => setDeleteStudent(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteStudent}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
