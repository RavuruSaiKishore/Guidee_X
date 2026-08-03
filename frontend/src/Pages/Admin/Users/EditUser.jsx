import { useEffect, useState } from "react";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  Target,
  Camera,
  ShieldCheck,
  UserCheck,
  Ban,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";

const EditStudent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [student, setStudent] = useState(null);

  const [newProfileImage, setNewProfileImage] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  // =========================================================
  // FETCH STUDENT
  // =========================================================

  const fetchStudent = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/students/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch student");
      }

      setStudent(data.student);

      if (data.student.profileImage) {
        const image = data.student.profileImage.startsWith("http")
          ? data.student.profileImage
          : `${API_BASE_URL}${data.student.profileImage}`;

        setPreviewImage(image);
      } else {
        setPreviewImage("/default-avatar.png");
      }
    } catch (error) {
      console.error(error);

      toast.success(error.message || "Unable to load student");

      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setStudent((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");

      return;
    }

    setNewProfileImage(file);

    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  // =========================================================
  // UPDATE STUDENT
  // =========================================================

  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const token = localStorage.getItem("AdminToken");

      const formData = new FormData();

      formData.append("firstName", student.firstName || "");

      formData.append("lastName", student.lastName || "");

      formData.append("email", student.email || "");

      formData.append("phone", student.phone || "");

      formData.append("education", student.education || "");

      formData.append("careerGoal", student.careerGoal || "");

      formData.append("isVerified", String(Boolean(student.isVerified)));

      formData.append("isActive", String(Boolean(student.isActive)));

      formData.append("isBlocked", String(Boolean(student.isBlocked)));

      if (newProfileImage) {
        formData.append("profileImage", newProfileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/students/${id}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update student");
      }

      toast.success("Student updated successfully.");

      // Navigate back to User Management
      navigate("/admin/users");
    } catch (error) {
      console.error("Update student error:", error);

      toast.error(error.message || "Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={38} className="mx-auto animate-spin text-indigo-600" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading student information...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 shadow-sm">
          <div className="relative flex min-h-[130px] items-center px-5 py-6 sm:px-7">
            <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-indigo-200/30" />

            <div className="relative">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-900"
              >
                <ArrowLeft size={17} />
                Back to User Management
              </button>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 text-white shadow-lg">
                  <UserRound size={24} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Edit Student
                  </h1>

                  <p className="mt-1 text-sm text-gray-600">
                    Update student profile and account information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <form onSubmit={handleUpdateStudent}>
          {/* =================================================
              PROFILE
          ================================================== */}

          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative mx-auto sm:mx-0">
                <img
                  src={previewImage || "/default-avatar.png"}
                  alt="Student"
                  className="h-28 w-28 rounded-2xl border-4 border-gray-100 object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />

                <label
                  htmlFor="profileImage"
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700"
                >
                  <Camera size={18} />

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">{student.email}</p>

                <label
                  htmlFor="profileImage"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  <Camera size={16} />
                  Change Photo
                </label>
              </div>
            </div>
          </div>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================== */}

          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Personal Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Update the student's basic details
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* FIRST NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  First Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="firstName"
                    value={student.firstName || ""}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* LAST NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Last Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="lastName"
                    value={student.lastName || ""}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={student.email || ""}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={student.phone || ""}
                    onChange={(e) => {
                      setStudent((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/\D/g, ""),
                      }));
                    }}
                    className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              EDUCATION & CAREER
          ================================================== */}

          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <GraduationCap size={19} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Education & Career</h2>

                <p className="text-sm text-gray-500">
                  Manage academic and career information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* EDUCATION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Education
                </label>

                <div className="relative">
                  <GraduationCap
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <textarea
                    name="education"
                    value={student.education || ""}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter student's education"
                    className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* CAREER GOAL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Career Goal
                </label>

                <div className="relative">
                  <Target
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <textarea
                    name="careerGoal"
                    value={student.careerGoal || ""}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter student's career goal"
                    className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ACCOUNT STATUS
          ================================================== */}

          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Account Status</h2>

                <p className="text-sm text-gray-500">
                  Manage student account access
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* VERIFIED */}

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  student.isVerified
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className={
                      student.isVerified ? "text-emerald-600" : "text-gray-400"
                    }
                  />

                  <div>
                    <p className="text-sm font-bold text-gray-800">Verified</p>

                    <p className="text-xs text-gray-500">Email verified</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="isVerified"
                  checked={Boolean(student.isVerified)}
                  onChange={handleChange}
                  className="h-5 w-5 accent-emerald-600"
                />
              </label>

              {/* ACTIVE */}

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  student.isActive
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck
                    size={20}
                    className={
                      student.isActive ? "text-blue-600" : "text-gray-400"
                    }
                  />

                  <div>
                    <p className="text-sm font-bold text-gray-800">Active</p>

                    <p className="text-xs text-gray-500">Account enabled</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="isActive"
                  checked={Boolean(student.isActive)}
                  onChange={handleChange}
                  className="h-5 w-5 accent-blue-600"
                />
              </label>

              {/* BLOCKED */}

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  student.isBlocked
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Ban
                    size={20}
                    className={
                      student.isBlocked ? "text-red-600" : "text-gray-400"
                    }
                  />

                  <div>
                    <p className="text-sm font-bold text-gray-800">Blocked</p>

                    <p className="text-xs text-gray-500">Restrict account</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="isBlocked"
                  checked={Boolean(student.isBlocked)}
                  onChange={handleChange}
                  className="h-5 w-5 accent-red-600"
                />
              </label>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              disabled={updating}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
            >
              <ArrowLeft size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
