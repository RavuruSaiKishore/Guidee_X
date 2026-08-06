import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Send,
  Loader2,
  Trash2,
  ShieldCheck,
  MessageSquare,
  Clock,
  UserRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminMentorChatDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("AdminToken");

  const chatRef = useRef(null);

  const [request, setRequest] = useState(null);

  const [loading, setLoading] = useState(true);

  const [reply, setReply] = useState("");

  const [status, setStatus] = useState("Pending");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  // =========================
  // FETCH CHAT
  // =========================

  const fetchRequest = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setRequest(data.contact);

      setStatus(data.contact.status || "Pending");

      setTimeout(() => {
        chatRef.current?.scrollTo({
          top: chatRef.current.scrollHeight,

          behavior: "smooth",
        });
      }, 300);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADMIN REPLY
  // =========================

  const sendReply = async () => {
    if (!reply.trim()) {
      return toast.error("Enter message");
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${id}/reply`,

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

      if (!response.ok) throw new Error(data.message);

      toast.success("Reply sent");

      setRequest((prev) => ({
        ...prev,

        status,

        conversation: [
          ...(prev.conversation || []),

          {
            _id: Date.now(),

            sender: "Admin",

            message: reply,

            sentAt: new Date(),
          },
        ],
      }));

      setReply("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE CHAT
  // =========================

  const deleteRequest = async () => {
    const confirmDelete = window.confirm("Delete this conversation?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mentor-contact/admin/${id}`,

        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Conversation deleted");

      navigate("/admin/mentor-requests");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusUI = {
    Pending: {
      icon: AlertCircle,

      color: "bg-yellow-100 text-yellow-700",
    },

    "In Progress": {
      icon: Clock,

      color: "bg-blue-100 text-blue-700",
    },

    Resolved: {
      icon: CheckCircle2,

      color: "bg-green-100 text-green-700",
    },
  };

  if (loading) {
    return (
      <div
        className="
      h-screen
      flex
      items-center
      justify-center
      bg-slate-50
      "
      >
        <Loader2
          size={45}
          className="
          animate-spin
          text-indigo-600
          "
        />
      </div>
    );
  }

  if (!request) {
    return (
      <div
        className="
      h-screen
      flex
      items-center
      justify-center
      "
      >
        <h2
          className="
        text-2xl
        font-bold
        "
        >
          Chat Not Found
        </h2>
      </div>
    );
  }

  const StatusIcon = statusUI[request.status]?.icon || Clock;

  return (
    <div
      className="
min-h-screen
bg-slate-100
p-5
"
    >
      {/* ================= HEADER ================= */}

      {/* ================= PREMIUM HEADER ================= */}

      <div
        className="
relative
overflow-hidden
bg-gradient-to-br
from-slate-950
via-indigo-950
to-purple-950
rounded-3xl
px-7
py-6
shadow-2xl
mb-5
"
      >
        {/* Background Glow */}

        <div
          className="
absolute
top-0
right-0
w-72
h-72
bg-purple-500/20
rounded-full
blur-3xl
"
        />

        <div
          className="
absolute
bottom-0
left-20
w-52
h-52
bg-indigo-500/20
rounded-full
blur-3xl
"
        />

        <div
          className="
relative
z-10
flex
items-center
justify-between
"
        >
          {/* LEFT SECTION */}

          <div
            className="
flex
items-center
gap-5
"
          >
            {/* ICON */}

            <div
              className="
w-16
h-16
rounded-2xl
bg-white/10
backdrop-blur-xl
border
border-white/20
flex
items-center
justify-center
shadow-lg
"
            >
              <MessageSquare size={32} className="text-white" />
            </div>

            <div>
              <div
                className="
flex
items-center
gap-3
"
              >
                <h1
                  className="
text-3xl
font-bold
text-white
tracking-tight
"
                >
                  Mentor Support
                </h1>

                <span
                  className="
flex
items-center
gap-2
px-3
py-1
rounded-full
text-xs
font-semibold
bg-emerald-500/20
text-emerald-300
border
border-emerald-400/20
"
                >
                  <span
                    className="
w-2
h-2
rounded-full
bg-emerald-400
animate-pulse
"
                  />
                  Active
                </span>
              </div>

              <div
                className="
flex
items-center
gap-4
mt-2
"
              >
                <p
                  className="
text-indigo-200
text-sm
"
                >
                  GuideX Mentor Communication Center
                </p>

                <span
                  className="
text-indigo-300
text-xs
"
                >
                  •
                </span>

                <p
                  className="
text-indigo-200
text-sm
"
                >
                  Ticket #{request._id?.slice(-6)}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}

          <div
            className="
flex
items-center
gap-3
"
          >
            {/* STATUS */}

            <div
              className={`
px-4
py-2
rounded-full
backdrop-blur-xl
border
font-semibold
text-sm
flex
items-center
gap-2

${statusUI[request.status]?.color}

`}
            >
              <StatusIcon size={17} />

              {request.status}
            </div>

            {/* BACK BUTTON */}

            <Link
              to="/admin/mentor-requests"
              className="
group
flex
items-center
gap-2
px-5
py-2.5
rounded-xl
bg-white/10
hover:bg-white/20
border
border-white/20
text-white
font-medium
transition-all
duration-300
hover:-translate-x-1
"
            >
              <ArrowLeft
                size={18}
                className="
group-hover:-translate-x-1
transition
"
              />
              Back
            </Link>
          </div>
        </div>

        {/* Bottom Information Bar */}

        <div
          className="
relative
z-10
mt-6
pt-5
border-t
border-white/10
flex
items-center
gap-8
"
        >
          <div>
            <p
              className="
text-xs
text-indigo-300
uppercase
font-semibold
"
            >
              Mentor
            </p>

            <p
              className="
text-white
font-medium
mt-1
"
            >
              {request.mentorId?.firstName} {request.mentorId?.lastName}
            </p>
          </div>

          <div>
            <p
              className="
text-xs
text-indigo-300
uppercase
font-semibold
"
            >
              Category
            </p>

            <p
              className="
text-white
font-medium
mt-1
"
            >
              {request.category || "General"}
            </p>
          </div>

          <div>
            <p
              className="
text-xs
text-indigo-300
uppercase
font-semibold
"
            >
              Created
            </p>

            <p
              className="
text-white
font-medium
mt-1
"
            >
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      {/* ================= MAIN CONTENT ================= */}

      <div
        className="
grid
grid-cols-12
gap-5
"
      >
        {/* ================= MENTOR PROFILE ================= */}

        <div
          className="
col-span-3
bg-white
rounded-3xl
shadow-sm
border
border-slate-200
p-5
h-fit
"
        >
          <div
            className="
flex
items-center
gap-3
pb-4
border-b
"
          >
            <div
              className="
w-14
h-14
rounded-2xl
bg-gradient-to-br
from-indigo-600
to-purple-600
text-white
flex
items-center
justify-center
font-bold
text-xl
"
            >
              {request.mentorId?.firstName?.charAt(0)}

              {request.mentorId?.lastName?.charAt(0)}
            </div>

            <div>
              <h2
                className="
font-bold
text-slate-800
"
              >
                {request.mentorId?.firstName} {request.mentorId?.lastName}
              </h2>

              <p
                className="
text-xs
text-indigo-600
font-semibold
"
              >
                Mentor
              </p>
            </div>
          </div>

          <div
            className="
mt-5
space-y-3
"
          >
            <div
              className="
flex
items-center
gap-3
bg-slate-50
rounded-xl
p-3
"
            >
              <div
                className="
w-8
h-8
rounded-lg
bg-indigo-100
flex
items-center
justify-center
text-indigo-600
"
              >
                <Mail size={16} />
              </div>

              <p
                className="
text-xs
text-slate-600
break-all
"
              >
                {request.mentorId?.email}
              </p>
            </div>

            <div
              className="
flex
items-center
gap-3
bg-slate-50
rounded-xl
p-3
"
            >
              <div
                className="
w-8
h-8
rounded-lg
bg-indigo-100
flex
items-center
justify-center
text-indigo-600
"
              >
                <Phone size={16} />
              </div>

              <p
                className="
text-sm
text-slate-600
"
              >
                {request.mentorId?.phone || "Not available"}
              </p>
            </div>

            <div
              className="
flex
items-center
gap-3
bg-slate-50
rounded-xl
p-3
"
            >
              <div
                className="
w-8
h-8
rounded-lg
bg-indigo-100
flex
items-center
justify-center
text-indigo-600
"
              >
                <Calendar size={16} />
              </div>

              <p
                className="
text-sm
text-slate-600
"
              >
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div
              className="
bg-indigo-50
rounded-xl
p-4
mt-5
"
            >
              <p
                className="
text-xs
uppercase
font-bold
text-indigo-500
"
              >
                Category
              </p>

              <h3
                className="
font-semibold
text-slate-800
mt-1
"
              >
                {request.category || "General"}
              </h3>
            </div>

            <div
              className="
bg-purple-50
rounded-xl
p-4
"
            >
              <p
                className="
text-xs
uppercase
font-bold
text-purple-500
"
              >
                Subject
              </p>

              <h3
                className="
font-semibold
text-slate-800
mt-1
"
              >
                {request.subject}
              </h3>
            </div>
          </div>
        </div>

        {/* ================= CHAT WINDOW ================= */}

        <div
          className="
col-span-9
bg-white
rounded-3xl
shadow-sm
border
border-slate-200
overflow-hidden
flex
flex-col
"
        >
          {/* CHAT TOP BAR */}

          <div
            className="
px-6
py-4
border-b
flex
items-center
justify-between
"
          >
            <div
              className="
flex
items-center
gap-3
"
            >
              <div
                className="
w-11
h-11
rounded-xl
bg-indigo-600
text-white
flex
items-center
justify-center
"
              >
                <MessageSquare size={22} />
              </div>

              <div>
                <h2
                  className="
font-bold
text-slate-800
"
                >
                  Conversation
                </h2>

                <p
                  className="
text-xs
text-slate-500
"
                >
                  {request.mentorId?.firstName} {request.mentorId?.lastName}↔
                  GuideX Admin
                </p>
              </div>
            </div>

            <p
              className="
text-xs
text-slate-400
"
            >
              {request.conversation?.length || 0}
              Messages
            </p>
          </div>

          {/* ================= MESSAGES ================= */}

          <div
            ref={chatRef}
            className="
h-[520px]
overflow-y-auto
bg-slate-50
p-6
space-y-5
"
          >
            {request.conversation?.length > 0 ? (
              request.conversation.map((chat) => (
                <div
                  key={chat._id}
                  className={`
flex
${chat.sender === "Admin" ? "justify-end" : "justify-start"}

`}
                >
                  <div
                    className={`
max-w-[70%]
rounded-2xl
p-4
shadow-sm

${
  chat.sender === "Admin"
    ? "bg-indigo-600 text-white rounded-br-none"
    : "bg-white border text-slate-700 rounded-bl-none"
}

`}
                  >
                    <div
                      className="
flex
items-center
gap-2
mb-2
"
                    >
                      <div
                        className={`
w-8
h-8
rounded-full
flex
items-center
justify-center
font-bold
text-xs

${
  chat.sender === "Admin"
    ? "bg-white/20 text-white"
    : "bg-indigo-100 text-indigo-700"
}

`}
                      >
                        {chat.sender === "Admin"
                          ? "A"
                          : request.mentorId?.firstName?.charAt(0)}
                      </div>

                      <div>
                        <p
                          className="
text-xs
font-bold
"
                        >
                          {chat.sender === "Admin" ? "GuideX Admin" : "Mentor"}
      
                        </p>

                        <p
                          className="
text-[10px]
opacity-70
"
                        >
                          {new Date(chat.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p
                      className="
text-sm
leading-6
whitespace-pre-line
"
                    >
                      {chat.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="
h-full
flex
items-center
justify-center
text-slate-400
"
              >
                No messages yet
              </div>
            )}
          </div>
          {/* ================= REPLY SECTION ================= */}

          <div
            className="
border-t
bg-white
p-5
"
          >
            <div
              className="
grid
grid-cols-12
gap-4
items-end
"
            >
              {/* STATUS */}

              <div
                className="
col-span-3
"
              >
                <label
                  className="
text-xs
font-bold
uppercase
text-slate-500
block
mb-2
"
                >
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="
w-full
border
border-slate-200
rounded-xl
px-4
py-3
text-sm
font-semibold
outline-none
focus:ring-2
focus:ring-indigo-500
"
                >
                  <option value="Pending">Pending</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* MESSAGE */}

              <div
                className="
col-span-7
"
              >
                <label
                  className="
text-xs
font-bold
uppercase
text-slate-500
block
mb-2
"
                >
                  Reply Message
                </label>

                <textarea
                  rows="2"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="
Type your response to mentor...
"
                  className="
w-full
border
border-slate-200
rounded-xl
px-4
py-3
resize-none
text-sm
outline-none
focus:ring-2
focus:ring-indigo-500
"
                ></textarea>
              </div>

              {/* BUTTONS */}

              <div
                className="
col-span-2
flex
gap-2
"
              >
                <button
                  onClick={deleteRequest}
                  className="
w-12
h-12
rounded-xl
bg-red-50
text-red-600
hover:bg-red-100
flex
items-center
justify-center
transition
"
                  title="Delete Conversation"
                >
                  <Trash2 size={20} />
                </button>

                <button
                  disabled={saving}
                  onClick={sendReply}
                  className="
flex-1
h-12
rounded-xl
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
font-semibold
flex
items-center
justify-center
gap-2
hover:scale-[1.02]
transition
disabled:opacity-50
"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}

                  {saving ? "Sending" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMentorChatDetails;
