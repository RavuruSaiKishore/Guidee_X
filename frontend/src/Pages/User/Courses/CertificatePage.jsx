import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

const CertificatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem("UserToken");
        const res = await fetch(
          `${API_BASE_URL}/api/courses/${id}/certificate`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setCert(data.certificate);
        } else {
          toast.error(data.message || "Failed to load certificate");
        }
      } catch (error) {
        console.error("Certificate error:", error);
        toast.error("Network error while fetching certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id, API_BASE_URL]);

  // Open the certificate in a clean, standalone view tab using a dedicated blob URL or standalone route structure
  const handleOpenInNewTab = () => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      toast.error("Popup blocked! Please allow popups for this site.");
      return;
    }

    const certificateHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${cert?.studentName || "Student"} - Certificate</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-900 flex items-center justify-center min-h-screen p-8">
        <div class="w-full max-w-5xl bg-[#FCFBF7] text-slate-900 p-16 border-[12px] border-double border-amber-600/40 shadow-2xl relative overflow-hidden rounded-2xl flex flex-col justify-between min-h-[620px]">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">🎓</div>
              <div>
                <h1 class="text-2xl font-black tracking-tight leading-none text-slate-900">GuideX</h1>
                <p class="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold mt-0.5">Learn • Connect • Grow</p>
              </div>
            </div>
            <div class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              Verified Credential
            </div>
          </div>

          <div class="text-center py-6 space-y-4">
            <p class="text-sm font-black text-amber-700 tracking-[0.3em] uppercase">Certificate of Completion</p>
            <p class="text-sm text-slate-500 font-medium">This is proudly presented to</p>
            <h2 class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight py-2 font-serif">${
              cert?.studentName
            }</h2>
            <p class="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">For successfully completing the comprehensive professional curriculum and demonstrating mastery in</p>
            <h3 class="text-2xl font-black text-indigo-950 tracking-wide">${
              cert?.courseTitle
            }</h3>
          </div>

          <div class="grid grid-cols-3 items-end pt-8 border-t border-slate-200 mt-auto">
            <div class="text-left space-y-1">
              <div class="font-serif italic text-lg font-bold text-slate-800">${
                cert?.instructor
              }</div>
              <div class="w-36 h-[1px] bg-slate-300 my-1"></div>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lead Instructor</p>
            </div>
            <div class="flex justify-center">
              <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex flex-col items-center justify-center text-white shadow-lg border-4 border-white">
                <span class="text-xs font-black">★</span>
                <span class="text-[8px] font-black uppercase tracking-widest mt-0.5">Verified</span>
              </div>
            </div>
            <div class="text-right space-y-1">
              <div class="font-bold text-slate-800">${new Date(
                cert?.issuedAt
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}</div>
              <div class="w-36 h-[1px] bg-slate-300 my-1 ml-auto"></div>
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date of Issuance</p>
            </div>
          </div>

        </div>
      </body>
      </html>
    `;

    newWindow.document.write(certificateHTML);
    newWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-slate-300 font-semibold text-lg animate-pulse">
        Loading certificate credentials...
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="text-center py-32 space-y-4 bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-slate-800">
          Certificate Not Available
        </h2>
        <p className="text-slate-500 text-sm">
          You must complete all course modules to unlock your certificate.
        </p>
        <button
          onClick={() => navigate(`/courses/${id}/learn`)}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg hover:bg-blue-700 transition"
        >
          Return to Classroom
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center py-12 px-4 sm:px-8 mt-16">
      {/* Modern Certificate Container */}
      <div className="w-full max-w-5xl bg-[#FCFBF7] text-slate-900 p-8 sm:p-14 md:p-16 border-[12px] border-double border-amber-600/40 shadow-2xl relative overflow-hidden rounded-2xl flex flex-col justify-between min-h-[620px]">
        {/* Background Watermark/Accent Circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header: Platform Name & Cap Icon */}
        <div className="flex items-center justify-between relative z-10 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap size={26} />
            </div>
            <div className="block">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Guide
                </span>
                <span className="text-gray-900">X</span>
              </h1>
              <p className="hidden sm:block text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-500 font-semibold mt-0.5">
                Learn • Connect • Grow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-2xs">
            <ShieldCheck size={16} className="text-emerald-600" /> Verified
            Credential
          </div>
        </div>

        {/* Middle Content */}
        <div className="text-center relative z-10 py-6 space-y-4">
          <p className="text-xs sm:text-sm font-black text-amber-700 tracking-[0.3em] uppercase">
            Certificate of Completion
          </p>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            This is proudly presented to
          </p>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight py-2 font-serif">
            {cert.studentName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed pt-1">
            For successfully completing the comprehensive professional
            curriculum and demonstrating mastery in
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-wide">
            {cert.courseTitle}
          </h3>
        </div>

        {/* Bottom Signatures & Seal */}
        <div className="grid grid-cols-3 items-end pt-8 border-t border-slate-200/80 relative z-10 mt-auto">
          {/* Instructor Signature Block */}
          <div className="text-left space-y-1">
            <div className="font-serif italic text-lg sm:text-xl font-bold text-slate-800">
              {cert.instructor}
            </div>
            <div className="w-36 h-[1px] bg-slate-300 my-1"></div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lead Instructor
            </p>
          </div>

          {/* Center Official Seal */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex flex-col items-center justify-center text-white shadow-lg border-4 border-white">
              <Award size={28} className="drop-shadow-sm" />
              <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">
                Verified
              </span>
            </div>
          </div>

          {/* Date Issued Block */}
          <div className="text-right space-y-1">
            <div className="font-bold text-slate-800 text-sm sm:text-base">
              {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="w-36 h-[1px] bg-slate-300 my-1 ml-auto"></div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Date of Issuance
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Placed Down Below the Certificate */}
      <div className="w-full max-w-5xl mt-8 flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-slate-700 transition cursor-pointer"
        >
          <ArrowLeft size={18} /> Return to Course
        </button>
        <button
          onClick={handleOpenInNewTab}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <ExternalLink size={18} /> Open in New Tab
        </button>
      </div>
    </div>
  );
};

export default CertificatePage;
