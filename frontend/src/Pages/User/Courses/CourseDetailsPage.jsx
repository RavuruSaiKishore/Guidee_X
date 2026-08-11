import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  Clock,
  FileText,
  ExternalLink,
  Layers,
  Star,
  ArrowRight,
  X,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Lock,
  Database,
  Code2,
  Users2,
  Activity,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    isEnrolled: false,
    paymentStatus: null,
  });

  // State to handle PDF modal viewer popups
  const [selectedPdf, setSelectedPdf] = useState(null);

  // State to track expanded lessons within modules (stores lesson ID or index key)
  const [expandedLessons, setExpandedLessons] = useState({});

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Helper for embed URLs (YouTube)
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

  // Helper for absolute PDF URLs
  const getPdfUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }
    return `${API_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("UserToken");
        const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setCourse(data.course);
          setEnrollmentStatus({
            isEnrolled: data.isEnrolled,
            paymentStatus: data.paymentStatus,
          });
        } else {
          toast.error(data.message || "Failed to load course details.");
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        toast.error("Network error while fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, API_BASE_URL]);

 const handleEnroll = async () => {
   const token = localStorage.getItem("UserToken");
   setEnrolling(true);

   try {
     // 1. Free Course Enrollment
     if (course.price === 0) {
       const response = await fetch(
         `${API_BASE_URL}/api/courses/${id}/enroll`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             ...(token && { Authorization: `Bearer ${token}` }),
           },
           credentials: "include",
         }
       );

       const data = await response.json();
       if (response.ok && data.success) {
         toast.success("Successfully enrolled!");
         // Update state to show "Go to Classroom"
         setEnrollmentStatus({ isEnrolled: true, paymentStatus: "paid" });
       } else {
         toast.error(data.message || "Enrollment failed");
       }
       setEnrolling(false);
       return;
     }

     // 2. Paid Course - Create Order
     const orderResponse = await fetch(
       `${API_BASE_URL}/api/coursePayment/create-order`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           ...(token && { Authorization: `Bearer ${token}` }),
         },
         body: JSON.stringify({ courseId: id }),
         credentials: "include",
       }
     );

     const orderData = await orderResponse.json();

     if (!orderResponse.ok || !orderData.success) {
       toast.error(orderData.message || "Failed to initiate payment");
       setEnrolling(false);
       return;
     }

     // 3. Razorpay Options
     const options = {
       key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
       amount: orderData.order.amount,
       currency: orderData.order.currency,
       name: "Professional Learning Academy",
       description: `Enrollment for ${course.title}`,
       image: course.thumbnail,
       order_id: orderData.order.id,
       handler: async function (response) {
         try {
           const verifyResponse = await fetch(
             `${API_BASE_URL}/api/coursePayment/verify-payment`,
             {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
                 ...(token && { Authorization: `Bearer ${token}` }),
               },
               body: JSON.stringify({
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature,
                 courseId: id,
               }),
               credentials: "include",
             }
           );

           const verifyData = await verifyResponse.json();

           if (verifyResponse.ok && verifyData.success) {
             // ✅ SUCCESS: Trigger Toast and Update UI state
             toast.success("Payment successful! You are now enrolled.");

             setEnrollmentStatus({
               isEnrolled: true,
               paymentStatus: "paid",
             });
           } else {
             toast.error(verifyData.message || "Payment verification failed");
           }
         } catch (err) {
           toast.error("Something went wrong during payment verification.");
         }
       },
       prefill: {
         name: orderData.userName || "",
         email: orderData.userEmail || "",
       },
       theme: { color: "#2563eb" },
     };

     const rzp = new window.Razorpay(options);
     rzp.open();
   } catch (error) {
     toast.error("Something went wrong during enrollment.");
   } finally {
     setEnrolling(false);
   }
 };

  const toggleLessonExpand = (modIdx, lesIdx) => {
    const key = `${modIdx}-${lesIdx}`;
    setExpandedLessons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-4 bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-bold text-base tracking-wide animate-pulse">
          Loading course curriculum...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-32 bg-slate-50 min-h-[75vh] space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Course not found</h2>
        <p className="text-slate-500 text-sm">
          The course you are looking for might have been removed or is
          unavailable.
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
        >
          Explore All Courses
        </button>
      </div>
    );
  }

  const imageUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `${API_BASE_URL}${course.thumbnail}`;

  const previewEmbedUrl = getEmbedUrl(course.previewVideoUrl);
  const totalLessons =
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-32 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Immersive Course Hero Header Card */}
      <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 rounded-3xl text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
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
                {course.averageRating ? course.averageRating.toFixed(1) : "4.9"}{" "}
                Rating
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
                <img
                  src={imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between px-2">
                <div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">
                    Price
                  </span>
                  <span className="text-3xl font-black text-white">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </span>
                </div>
                {course.compareAtPrice > course.price && (
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    ${course.compareAtPrice}
                  </span>
                )}
              </div>
            </div>

            {/* CONDITIONAL BUTTON: Go to Classroom if paid/enrolled, otherwise Checkout */}
            {enrollmentStatus.isEnrolled ? (
              <button
                onClick={() => navigate(`/courses/${id}/learn`)}
                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl hover:bg-emerald-700 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <BookOpen size={18} />
                {enrollmentStatus.paymentStatus === "paid"
                  ? "Go to Classroom"
                  : "Continue Learning"}
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-xl hover:from-blue-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-sm shadow-blue-600/30"
              >
                {enrolling ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard size={18} />{" "}
                    {course.price === 0
                      ? "Enroll for Free"
                      : "Proceed to Checkout"}
                  </>
                )}
              </button>
            )}
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" /> Secure
              Razorpay Payment Gateway
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Trailer Section (Always visible as preview) */}
      {previewEmbedUrl && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <PlayCircle className="text-blue-600" /> Course Preview Trailer
          </h2>
          <div className="flex justify-center">
            <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black border shadow-inner">
              <iframe
                src={previewEmbedUrl}
                title="Course Trailer Preview"
                className="w-full h-full absolute inset-0 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* SYLLABUS LOCKED BANNER FOR NON-ENROLLED USERS */}
      {!enrollmentStatus.isEnrolled && (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Course Syllabus & Lessons Locked
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Complete your enrollment or check out via Razorpay above to unlock
            full multi-module curriculum access, video lessons, and downloadable
            PDF notes inside the classroom.
          </p>
          <button
            onClick={handleEnroll}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {course.price === 0 ? "Enroll Now for Free" : "Proceed to Payment"}
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* 🌟 COURSE BENEFITS, USES & RAW TELEMETRY PANEL */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Course Benefits & Use Cases Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-2.5 border-b pb-4 border-slate-100">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                What You Will Achieve
              </h3>
              <p className="text-xs text-slate-500">
                Key benefits and professional use cases of this program.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Industry-Standard Skill Mastery
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Build production-grade applications and master concepts
                  relevant to current job markets.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Downloadable Learning Assets
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Access structured module resource notes and cheat sheets to
                  reinforce hands-on learning.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Self-Paced Progression Tracking
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mark lessons complete, track overall curriculum progress, and
                  resume right where you left off.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Career Growth & Certification
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validate your expertise upon finishing all curriculum
                  requirements to boost your professional portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System & Course Raw Data Debugger Telemetry Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-8 space-y-6 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Course Telemetry Inspector
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live Mongoose schema payload state
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <Activity size={13} className="animate-pulse" /> Synced
              </div>
            </div>

            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li>
                <span className="text-slate-500">courseId:</span> "{course._id}"
              </li>
              <li>
                <span className="text-slate-500">category:</span> "
                {course.category}"
              </li>
              <li>
                <span className="text-slate-500">level:</span> "
                {course.level || "Beginner"}"
              </li>
              <li>
                <span className="text-slate-500">pricingType:</span>{" "}
                {course.price === 0 ? "Free" : `Paid ($${course.price})`}
              </li>
              <li>
                <span className="text-slate-500">totalModules:</span>{" "}
                {course.modules?.length || 0}
              </li>
              <li>
                <span className="text-slate-500">totalLessonsCount:</span>{" "}
                {totalLessons}
              </li>
              <li>
                <span className="text-slate-500">enrollmentState:</span>{" "}
                {enrollmentStatus.isEnrolled
                  ? "Enrolled / Paid"
                  : "Not Enrolled"}
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Secure Razorpay Gateway Active</span>
            <span>v2.4.0 Engine</span>
          </div>
        </div>
      </div>

      {/* PDF Modal Viewer Popup */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5 truncate">
                <FileText size={20} className="text-blue-600 flex-shrink-0" />
                <h3 className="font-black text-slate-900 text-base truncate">
                  {selectedPdf.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition font-bold text-xs flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> Open in Tab
                </a>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-2 rounded-xl bg-slate-200/60 text-slate-700 hover:bg-slate-300 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 w-full h-full relative">
              <iframe
                src={`${selectedPdf.url}#view=FitH`}
                title={selectedPdf.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
