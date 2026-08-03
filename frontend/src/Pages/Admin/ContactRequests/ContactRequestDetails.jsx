import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Clock,
  Trash2,
  Send,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("AdminToken");

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    fetchContact();
  }, [id]);

  // ==========================
  // FETCH CONTACT
  // ==========================

  const fetchContact = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load request");
      }

      setContact(data.contact);
      setReply(data.contact.adminReply || "");
      setStatus(data.contact.status || "Pending");
    } catch (error) {
      toast.error(error.message || "Unable to load request");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SEND REPLY
  // ==========================

  const handleReply = async () => {
    if (!reply.trim()) {
      return toast.error("Please enter reply message");
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests/${id}/reply`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminReply: reply,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reply failed");
      }

      toast.success("Reply sent successfully");

      const newMessage = {
        _id: Date.now(),
        sender: "Admin",
        message: reply,
        sentAt: new Date(),
      };

      setContact((prev) => ({
        ...prev,
        status,
        replied: true,
        repliedAt: new Date(),
        adminReply: reply,
        conversation: [...(prev.conversation || []), newMessage],
      }));
    } catch (error) {
      toast.error(error.message || "Reply failed");
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // DELETE REQUEST
  // ==========================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact request?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      toast.success("Request deleted");

      navigate("/admin/contact-requests");
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  // ==========================
  // LOADING
  // ==========================

   if (loading) {
     return (
       <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-white px-4">
         <div className="relative">
           <div className="h-16 w-16 rounded-full border-4 border-blue-100" />

           <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
         </div>

         <p className="mt-6 text-center text-lg font-semibold text-gray-700">
           Loading your Contact Request Details...
         </p>

         <p className="mt-1 text-center text-sm text-gray-400">
           Please wait while we fetch the Contact Request Details.
         </p>
       </div>
     );
   }
  // ==========================
  // NOT FOUND
  // ==========================

  if (!contact) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-6 text-center">
        <Ticket size={50} className="text-slate-300 mb-4" />

        <h2 className="text-2xl font-bold text-slate-700">
          Contact request not found
        </h2>

        <Link
          to="/admin/contact-requests"
          className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* =====================================================
          HERO HEADER
      ====================================================== */}

      <section className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-700 shadow-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            {/* LEFT */}

            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Contact Request
                  </h1>

                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-semibold backdrop-blur-md">
                    #{contact._id.slice(-6)}
                  </span>
                </div>

                <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-6 sm:leading-7">
                  Review student queries, manage support requests, reply to
                  messages, and track resolution progress from one centralized
                  workspace.
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 sm:gap-4">
              {/* STATUS */}

              <span
                className={`
                  px-4 sm:px-5
                  py-2
                  rounded-xl
                  font-semibold
                  backdrop-blur-md
                  border border-white/20
                  text-xs sm:text-sm
                  ${
                    contact.status === "Pending"
                      ? "bg-yellow-400/20 text-yellow-200"
                      : contact.status === "In Progress"
                      ? "bg-blue-400/20 text-blue-200"
                      : "bg-green-400/20 text-green-200"
                  }
                `}
              >
                {contact.status}
              </span>

              {/* DATE */}

              <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm">
                <Calendar size={16} />

                <span>
                  {new Date(contact.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* BACK BUTTON */}

              <Link
                to="/admin/contact-requests"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition shadow-lg text-sm sm:text-base"
              >
                <ArrowLeft size={18} />
                Back to Requests
              </Link>
            </div>
          </div>
        </div>

        {/* TICKET INFO */}

        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-black/10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-3 text-xs sm:text-sm text-slate-200">
            <div className="flex items-start gap-2 min-w-0">
              <Ticket size={16} className="flex-shrink-0 mt-0.5" />

              <span>Ticket ID:</span>

              <span className="font-semibold text-white break-all">
                {contact._id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Tag size={16} />

              <span>Category:</span>

              <span className="font-semibold text-white">
                {contact.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User size={16} />

              <span>Student:</span>

              <span className="font-semibold text-white">
                {contact.studentId?.firstName || contact.name}{" "}
                {contact.studentId?.lastName || ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* =================================================
              STUDENT PROFILE
          ================================================== */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-6 h-fit">
            <div className="flex items-center gap-4 pb-5 sm:pb-6 border-b border-slate-200">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md">
                {contact.studentId?.profileImage ? (
                  <img
                    src={`${API_BASE_URL}${contact.studentId.profileImage}`}
                    alt={`${contact.studentId.firstName} ${contact.studentId.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {contact.studentId?.firstName?.charAt(0) || ""}
                    {contact.studentId?.lastName?.charAt(0) || ""}
                  </>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-lg sm:text-xl text-slate-800 truncate">
                  {contact.studentId?.firstName} {contact.studentId?.lastName}
                </h2>

                <p className="text-sm text-slate-500">Student</p>
              </div>
            </div>

            <div className="space-y-5 mt-5 sm:mt-6">
              <div className="flex gap-3 items-start text-slate-700">
                <Mail
                  size={18}
                  className="text-indigo-600 flex-shrink-0 mt-0.5"
                />

                <span className="text-sm break-all">
                  {contact.studentId?.email || contact.email}
                </span>
              </div>

              <div className="flex gap-3 items-center text-slate-700">
                <Phone size={18} className="text-indigo-600 flex-shrink-0" />

                <span className="text-sm sm:text-base">
                  {contact.phone || "Not provided"}
                </span>
              </div>

              <div className="flex gap-3 items-start text-slate-700">
                <User
                  size={18}
                  className="text-indigo-600 flex-shrink-0 mt-0.5"
                />

                <span className="text-sm sm:text-base">
                  Contact Person: {contact.name}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT CONTENT
          ================================================== */}

          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* =================================================
                REQUEST INFORMATION
            ================================================== */}

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Tag className="text-indigo-600" size={22} />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Request Information
                  </h2>

                  <p className="text-slate-500 text-xs sm:text-sm">
                    Ticket details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <p className="text-sm text-slate-500">Category</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {contact.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Created At</p>

                  <p className="mt-1 font-semibold flex items-center gap-2 text-slate-800">
                    <Calendar size={16} />

                    {new Date(contact.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                STUDENT MESSAGE
            ================================================== */}

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MessageSquare size={22} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Student Message
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500">
                    Original request submitted by student
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6">
                <p className="text-slate-700 leading-7 whitespace-pre-line text-sm sm:text-base">
                  {contact.message}
                </p>

                <div className="mt-5 flex items-start sm:items-center gap-2 text-xs sm:text-sm text-slate-500">
                  <Clock size={16} className="flex-shrink-0" />

                  <span>
                    Submitted on{" "}
                    {new Date(contact.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                CONVERSATION
            ================================================== */}

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              {/* SUPPORT HEADER */}

              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-6 py-5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
                      <ShieldCheck size={22} className="text-white sm:hidden" />

                      <ShieldCheck
                        size={26}
                        className="text-white hidden sm:block"
                      />
                    </div>

                    <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-white bg-green-500"></span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-xl font-bold text-slate-900">
                        GuideX Support
                      </h2>

                      <span className="rounded-full bg-green-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-green-700">
                        Verified
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></span>

                      <span className="truncate">
                        Usually replies within a few minutes
                      </span>
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end flex-shrink-0">
                  <span className="text-sm font-semibold text-slate-700">
                    Support Ticket
                  </span>

                  <span className="text-xs text-slate-500">
                    Conversation History
                  </span>
                </div>
              </div>

              {/* CONVERSATION MESSAGES */}

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {contact.conversation?.length > 0 ? (
                  contact.conversation.map((chat) => (
                    <div
                      key={chat._id}
                      className={`flex ${
                        chat.sender === "Admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          w-full
                          sm:max-w-xl
                          p-4 sm:p-5
                          rounded-2xl
                          ${
                            chat.sender === "Admin"
                              ? "bg-indigo-600 text-white rounded-tr-none"
                              : "bg-slate-100 text-slate-700 rounded-tl-none"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`
                              w-8 h-8 sm:w-9 sm:h-9
                              rounded-full
                              flex
                              items-center
                              justify-center
                              font-bold
                              flex-shrink-0
                              ${
                                chat.sender === "Admin"
                                  ? "bg-white text-indigo-600"
                                  : "bg-indigo-600 text-white"
                              }
                            `}
                          >
                            {chat.sender === "Admin"
                              ? "G"
                              : contact.name?.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base truncate">
                              {chat.sender === "Admin"
                                ? "GuideX Support"
                                : contact.name}
                            </p>

                            <p className="text-xs opacity-70">
                              {new Date(chat.sentAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <p className="leading-7 whitespace-pre-line text-sm sm:text-base">
                          {chat.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No conversation history yet.
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                ADMIN RESPONSE
            ================================================== */}

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Admin Response
                  </h2>

                  <p className="text-slate-500 mt-1 text-sm sm:text-base">
                    Reply to student's request and update ticket status
                  </p>
                </div>

                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition text-sm sm:text-base"
                >
                  <Trash2 size={18} />
                  Delete Request
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6">
                {/* STATUS */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ticket Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm sm:text-base"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>

                {/* REPLY */}

                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Message
                  </label>

                  <textarea
                    rows={6}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your response to the student..."
                    className="w-full rounded-xl border border-slate-300 p-4 sm:p-5 resize-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex justify-stretch sm:justify-end mt-6 sm:mt-8">
                <button
                  onClick={handleReply}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminContactDetails;
