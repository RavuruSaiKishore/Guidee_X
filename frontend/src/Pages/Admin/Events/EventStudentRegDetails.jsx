import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  ExternalLink,
  CreditCard,
  Receipt,
  UserCheck,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Calendar,
  Tag,
  Hash,
  Search,
  Filter,
  X,
  ShieldCheck,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRegistrationDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [attendanceFilter, setAttendanceFilter] = useState("All");

  const getAdminToken = () => localStorage.getItem("AdminToken");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^\/+/, "");
    const cleanBaseUrl = API_BASE_URL?.replace(/\/+$/, "");
    return cleanBaseUrl ? `${cleanBaseUrl}/${cleanPath}` : `/${cleanPath}`;
  };

  const fetchRegistrationDetails = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();

      if (!token) throw new Error("Admin authentication token not found");
      if (!eventId) throw new Error("Registration ID is missing");

      const response = await fetch(
        `${API_BASE_URL}/api/event-registration/registrations/${eventId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load registration details");
      }

      setRegistration(data.registration || null);
    } catch (error) {
      console.error("Fetch Registration Error:", error);
      toast.error(error.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchRegistrationDetails();
  }, [eventId]);

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";
    const fullName = [student.firstName, student.lastName]
      .filter(Boolean)
      .join(" ");
    return fullName || student.name || "Unknown Student";
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setPaymentFilter("All");
    setAttendanceFilter("All");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-[450px] animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
        <div className="text-center">
          <Receipt size={50} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Registration details not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const student = registration.student || {};
  const event = registration.event || {};
  const studentImage = getImageUrl(student?.profileImage || student?.avatar);

  // Filter attributes that actually exist (excluding N/A/empty ones)
  const studentAttributes = [
    { icon: Mail, label: "Email Address", value: student.email },
    { icon: Phone, label: "Phone Number", value: student.phone },
    {
      icon: GraduationCap,
      label: "Institution",
      value: student.college || student.university || student.education,
    },
    {
      icon: FileText,
      label: "Course / Branch",
      value: student.course || student.branch,
    },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: student.dob ? formatDateTime(student.dob).split(",")[0] : null,
    },
    {
      icon: UserRound,
      label: "Gender",
      value: student.gender
        ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
        : null,
    },
    {
      icon: MapPin,
      label: "Address / City",
      value: student.address || student.city,
    },
  ].filter((attr) => attr.value);

  const paymentAttributes = [
    {
      icon: DollarSign,
      label: "Pricing Model",
      value: event.isPaid ? "Paid Event" : "Free Admission",
    },
    event.isPaid && {
      icon: CreditCard,
      label: "Scheduled Ticket Price",
      value: `₹${event.ticketPrice || 0}`,
    },
    event.isPaid && {
      icon: Receipt,
      label: "Total Amount Settled",
      value: `₹${
        registration.amountPaid || registration.amount || event.ticketPrice || 0
      }`,
    },
    registration.discountApplied > 0 && {
      icon: Tag,
      label: "Discount / Coupon",
      value: `-₹${registration.discountApplied} (${
        registration.couponCode || "Applied"
      })`,
    },
    event.isPaid && {
      icon: ShieldCheck,
      label: "Gateway Status",
      value: registration.paymentStatus || "Paid",
    },
    event.isPaid && {
      icon: CreditCard,
      label: "Payment Method",
      value: registration.paymentMethod || "Online Gateway",
    },
    event.isPaid &&
      registration.paymentId && {
        icon: Hash,
        label: "Razorpay Payment ID",
        value: registration.paymentId || registration.razorpayPaymentId,
        isMono: true,
      },
    event.isPaid &&
      registration.orderId && {
        icon: Hash,
        label: "Razorpay Order ID",
        value: registration.orderId || registration.razorpayOrderId,
        isMono: true,
      },
    {
      icon: registration.attended ? CheckCircle2 : Clock3,
      label: "Live Attendance Status",
      value: registration.attended
        ? "Attended Session"
        : "Did Not Attend (Absent)",
    },
    {
      icon: CalendarDays,
      label: "Registration Timestamp",
      value: formatDateTime(
        registration.createdAt || registration.registeredAt
      ),
    },
    {
      icon: Clock3,
      label: "Virtual Room Joined At",
      value: registration.joinedAt
        ? formatDateTime(registration.joinedAt)
        : "Not joined yet",
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="mx-auto max-w-[1200px] p-4 sm:p-6 lg:p-8">
        {/* BACK NAVIGATION */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Engagements List
          </button>
        </div>

        {/* MAIN CONTAINER */}
        <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl shadow-gray-100/50">
          {/* BANNER HEADER */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-6 sm:p-8 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
                  <Hash size={13} /> Registration ID: {registration._id}
                </span>
                <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl tracking-tight">
                  {event.title || "Event Registration & Payment Dossier"}
                </h1>
                <p className="mt-1 text-xs text-indigo-200">
                  Detailed telemetry profile for student booking and financial
                  verification.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-sm ${
                    registration.status === "Registered"
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  Status: {registration.status}
                </span>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS TOOLBAR */}
          <div className="border-b border-gray-100 bg-gray-50/70 p-4 sm:px-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search parameters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs font-medium text-gray-700 outline-none focus:border-indigo-500 transition shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
                <Filter size={14} className="text-gray-400" />
                <span className="text-[11px] font-semibold text-gray-500">
                  Payment:
                </span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Free">Free</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="text-[11px] font-semibold text-gray-500">
                  Attendance:
                </span>
                <select
                  value={attendanceFilter}
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Attended">Attended</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              {(searchTerm ||
                paymentFilter !== "All" ||
                attendanceFilter !== "All") && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 rounded-xl bg-gray-200/80 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-300 transition"
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* CONTENT SECTION (FULL WIDTH HORIZONTAL CARDS LAYOUT) */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* STUDENT SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">
                    Enrolled Student Profile & Identifiers
                  </h2>
                  <p className="text-xs text-gray-500">
                    Student profile information rendered in horizontal cards
                  </p>
                </div>
              </div>

              {/* Main Student Header Card */}
              <div className="flex items-center gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100 shadow-sm">
                {studentImage ? (
                  <img
                    src={studentImage}
                    alt={getStudentName(student)}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-50 shadow-sm"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
                    <UserRound size={30} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {getStudentName(student)}
                  </h3>
                  {student?._id && (
                    <p className="text-[11px] text-gray-400 font-mono truncate">
                      ID: {student._id}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/admin/students/${student._id || student.id}`)
                    }
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                  >
                    Inspect Full Student Profile <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Horizontal Cards Grid for Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentAttributes.map((attr, idx) => {
                  const IconComp = attr.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 rounded-2xl bg-gray-50/80 p-4 border border-gray-100 shadow-xs transition hover:border-indigo-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                        <IconComp size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {attr.label}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-gray-800 truncate">
                          {attr.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PAYMENT & SESSION TELEMETRY SECTION */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">
                    Payment & Session Telemetry Logs
                  </h2>
                  <p className="text-xs text-gray-500">
                    Billing details, gateway logs, and attendance indicators
                  </p>
                </div>
              </div>

              {/* Horizontal Cards Grid for Payment & Session Telemetry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentAttributes.map((attr, idx) => {
                  const IconComp = attr.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 rounded-2xl bg-gray-50/80 p-4 border border-gray-100 shadow-xs transition hover:border-indigo-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                        <IconComp size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {attr.label}
                        </p>
                        <p
                          className={`mt-0.5 text-xs font-bold text-gray-800 truncate ${
                            attr.isMono
                              ? "font-mono select-all bg-white px-2 py-0.5 rounded border border-gray-200"
                              : ""
                          }`}
                        >
                          {attr.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationDetails;
