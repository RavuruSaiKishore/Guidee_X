import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const Contact = () => {
  const { user } = useAuth();
  console.log(user);
  const token = localStorage.getItem("UserToken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,

        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),

        email: user.email || "",

        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !user) {
      toast.error("Please login to send a message");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Message sent successfully!");

      // Clear only user-entered fields
      setFormData((prev) => ({
        ...prev,

        category: "General Inquiry",

        subject: "",

        message: "",
      }));
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur">
            <MessageSquare size={18} />
            <span className="font-medium">We'd Love to Hear From You</span>
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl font-extrabold">
            Contact GuideX
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-blue-100 leading-8">
            Whether you have questions about mentorship, bookings, technical
            support, payments, or career guidance, our team is ready to help
            you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl shadow-xl p-7 border border-slate-100 hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Mail className="text-indigo-600" />
            </div>

            <h3 className="mt-5 font-bold text-lg">Email</h3>

            <p className="mt-2 text-gray-500">support@guidex.com</p>

            <p className="text-sm text-slate-400 mt-1">
              We usually reply within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-7 border border-slate-100 hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <Phone className="text-green-600" />
            </div>

            <h3 className="mt-5 font-bold text-lg">Phone</h3>

            <p className="mt-2 text-gray-500">+91 98765 43210</p>

            <p className="text-sm text-slate-400 mt-1">Monday – Friday</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-7 border border-slate-100 hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">
              <MapPin className="text-pink-600" />
            </div>

            <h3 className="mt-5 font-bold text-lg">Address</h3>

            <p className="mt-2 text-gray-500">Hyderabad, Telangana</p>

            <p className="text-sm text-slate-400 mt-1">India</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-7 border border-slate-100 hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Clock className="text-yellow-600" />
            </div>

            <h3 className="mt-5 font-bold text-lg">Working Hours</h3>

            <p className="mt-2 text-gray-500">9:00 AM - 6:00 PM</p>

            <p className="text-sm text-slate-400 mt-1">Monday - Saturday</p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
                <HelpCircle size={18} />
                Get in Touch
              </span>

              <h2 className="text-4xl font-bold mt-6 text-slate-900 leading-tight">
                Have a question?
                <br />
                We're always happy to help.
              </h2>

              <p className="mt-6 text-slate-600 leading-8">
                Our support team is available to answer your questions regarding
                mentorship sessions, booking issues, payments, technical
                problems, career guidance, and general inquiries. Fill out the
                form and we'll get back to you as soon as possible.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Mail className="text-indigo-600" size={22} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Email Support
                    </h4>

                    <p className="text-slate-500">support@guidex.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Phone className="text-green-600" size={22} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Phone Support
                    </h4>

                    <p className="text-slate-500">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                    <Clock className="text-pink-600" size={22} />
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Response Time
                    </h4>

                    <p className="text-slate-500">Within 24 Hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold">Need Immediate Help?</h3>

                <p className="mt-3 text-indigo-100 leading-7">
                  For urgent booking or payment issues, mention your booking
                  details in the message so our support team can resolve your
                  issue faster.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[30px] shadow-2xl border border-slate-200 p-10">
              <h2 className="text-3xl font-bold text-slate-900">
                Send us a Message
              </h2>

              <p className="text-slate-500 mt-2">
                Fill in the details below and we'll respond shortly.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      disabled
                      className="
 w-full rounded-xl
 border border-slate-300
 px-4 py-3
 bg-slate-100
 cursor-not-allowed
 "
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="
 w-full rounded-xl
 border border-slate-300
 px-4 py-3
 bg-slate-100
 cursor-not-allowed
 "
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      disabled
                      className="
 w-full rounded-xl
 border border-slate-300
 px-4 py-3
 bg-slate-100
 cursor-not-allowed
 "
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-2 font-medium text-slate-700">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    >
                      <option>General Inquiry</option>
                      <option>Mentorship</option>
                      <option>Course Support</option>
                      <option>Booking Issue</option>
                      <option>Payment Issue</option>
                      <option>Technical Support</option>
                      <option>Career Guidance</option>
                      <option>Feedback / Suggestions</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block mb-2 font-medium text-slate-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    placeholder="Enter the subject"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-slate-700">
                      Message
                    </label>

                    <span className="text-xs text-slate-400">
                      {formData.message.length}/1000
                    </span>
                  </div>

                  <textarea
                    name="message"
                    rows={7}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 py-4 text-white font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
