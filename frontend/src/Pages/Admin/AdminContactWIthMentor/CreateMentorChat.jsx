import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  Send,
  Loader2,
  MessageSquare,
  UserRound,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const CreateMentorChat = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("AdminToken");

  const [mentors, setMentors] = useState([]);

  const [creating, setCreating] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mentorId: "",
    subject: "",
    category: "General",
    message: "",
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/mentors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMentors(data.mentors || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async () => {
    if (!form.mentorId || !form.subject || !form.message) {
      return toast.error("Please fill all required fields");
    }

    try {
      setCreating(true);

      const res = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/start-chat`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Conversation created successfully");

      setTimeout(() => {
        navigate("/admin/mentor-chats");
      }, 1500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HERO HEADER */}

        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-8 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                <MessageSquare size={38} className="text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white">
                    Create Mentor Chat
                  </h1>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/20">
                    Active
                  </span>
                </div>

                <p className="text-indigo-200 mt-2">
                  Start a direct communication channel with a mentor
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/mentor-chats")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        {/* FORM CARD */}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT INFO */}

          <div className="bg-white rounded-3xl border shadow-sm p-6 h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">Admin Action</h3>

                <p className="text-xs text-slate-500">
                  Secure mentor communication
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-xs text-slate-500 uppercase font-bold">
                  Purpose
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  Mentor Support
                </p>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-4">
                <p className="text-xs text-indigo-500 uppercase font-bold">
                  Available Mentors
                </p>

                <p className="text-3xl font-bold text-indigo-700 mt-1">
                  {mentors.length}
                </p>
              </div>
            </div>
          </div>

          {/* MAIN FORM */}

          <div className="lg:col-span-2 bg-white rounded-3xl border shadow-sm p-8">
            <div className="space-y-6">
              {/* Mentor */}

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Select Mentor
                </label>

                <div className="relative mt-2">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-4 text-indigo-500"
                  />

                  <select
                    value={form.mentorId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mentorId: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Choose mentor</option>

                    {mentors.map((mentor) => (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.firstName} {mentor.lastName} - {mentor.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Subject
                </label>

                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Enter conversation subject"
                  className="mt-2 w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Category
                </label>

                <div className="grid grid-cols-4 gap-3 mt-3">
                  {["General", "Technical", "Payment", "Account"].map(
                    (item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() =>
                          setForm({
                            ...form,
                            category: item,
                          })
                        }
                        className={`py-3 rounded-xl text-sm font-semibold border transition ${
                          form.category === item
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Message */}

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Initial Message
                </label>

                <textarea
                  rows="6"
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Write your first message to mentor..."
                  className="mt-2 w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              disabled={creating}
              onClick={createChat}
              className="mt-8 w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white font-bold shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
            >
              {creating ? <Loader2 className="animate-spin" /> : <Send />}

              {creating ? "Creating Conversation..." : "Create Conversation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMentorChat;
