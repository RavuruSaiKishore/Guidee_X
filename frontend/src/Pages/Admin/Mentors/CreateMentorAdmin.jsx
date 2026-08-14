import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure you have react-toastify imported
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";


const CreateMentorAdmin = () => {
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "Male",

    city: "",
    state: "",
    country: "",

    profession: "",
    company: "",
    experience: "",
    industry: "",
    linkedin: "",

    primarySkill: "",
    category: "",
    languages: "",
    skillExperience: "",
    skillLevel: "Intermediate",

    degree: "",
    college: "",
    graduationYear: "",
    cgpa: "",
    certifications: "",

    headline: "",
    about: "",
    teachingStyle: "",

    availableDays: ["Monday", "Wednesday", "Friday"],
    preferredTime: "Evening",
    startTime: "18:00",
    endTime: "21:00",
    timezone: "Asia/Kolkata",
    sessionDuration: 60,

    sessionTypes: ["1:1 Mentoring", "Mock Interview"],
    sessionPrice: "",
    currency: "INR",
    freeTrial: false,
    pricingNote: "",
  });

  const [files, setFiles] = useState({
    profileImage: null,
    resume: null,
    governmentId: null,
    degreeCertificate: null,
  });

  const [fileNames, setFileNames] = useState({
    profileImage: "",
    resume: "",
    governmentId: "",
    degreeCertificate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loadSampleData = () => {
  setFormData({
    firstName: "Kabir",
    lastName: "Mehra",
    email: `kabir.mentor.${Date.now().toString().slice(-4)}@example.com`,
    password: "Password123",
    phone: "9876543210",
    dob: "1993-10-08",
    gender: "Male",

    city: "Bengaluru",
    state: "Karnataka",
    country: "India",

    profession: "Lead Offensive Security & Red Team Operator",
    company: "CrowdStrike",
    experience: "8",
    industry: "Cybersecurity & Ethical Hacking",
    linkedin: "https://linkedin.com/in/kabir-mehra-sample",

    primarySkill:
      "Penetration Testing, Ethical Hacking, Metasploit, Burp Suite, Network Security, Malware Analysis",
    category: "Cybersecurity & Ethical Hacking",
    languages: "English, Hindi, Punjabi",
    skillExperience: "7",
    skillLevel: "Expert",

    degree: "B.Tech in Computer Science & Information Security",
    college: "NIT Surathkal",
    graduationYear: "2016",
    cgpa: "8.9 / 10",
    certifications:
      "Offensive Security Certified Professional (OSCP), Certified Ethical Hacker (CEH), CISSP",

    headline:
      "Simulating Advanced Cyber Threats & Securing Digital Infrastructure",
    about:
      "Offensive security professional with 8+ years of experience in red teaming, web application penetration testing, and vulnerability assessment. Passionate about training aspiring cybersecurity enthusiasts on ethical hacking methodologies, CTFs, and cracking top infosec roles.",
    teachingStyle:
      "Hands-on lab simulations, exploit walkthroughs, and practical penetration testing frameworks.",

    availableDays: ["Monday", "Wednesday", "Friday"],
    preferredTime: "Night Slots",
    startTime: "21:00",
    endTime: "23:00",
    timezone: "Asia/Kolkata",
    sessionDuration: 60,

    sessionTypes: ["1:1 Mentoring", "Mock Interview", "Resume Review"],
    sessionPrice: "1899",
    currency: "INR",
    freeTrial: true,
    pricingNote:
      "Includes OSCP exam preparation roadmap and security lab guidance.",
  });

  setMessage({
    type: "success",
    text: "🔒 Cybersecurity & Ethical Hacking sample data injected successfully! Review fields and hit deploy.",
  });
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  const handleSessionTypeToggle = (type) => {
    setFormData((prev) => {
      const exists = prev.sessionTypes.includes(type);
      return {
        ...prev,
        sessionTypes: exists
          ? prev.sessionTypes.filter((t) => t !== type)
          : [...prev.sessionTypes, type],
      };
    });
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles && uploadedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: uploadedFiles[0] }));
      setFileNames((prev) => ({ ...prev, [name]: uploadedFiles[0].name }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: "", text: "" });

  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (["primarySkill", "languages", "certifications"].includes(key)) {
        const arr = formData[key]
          ? formData[key]
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [];
        data.append(key, JSON.stringify(arr));
      } else if (key === "availableDays" || key === "sessionTypes") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    const token = localStorage.getItem("AdminToken");

    const response = await fetch(`${API_BASE_URL}/api/admin/mentors/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create mentor profile.");
    }

    if (result.success) {
      toast.success("Mentor account created and auto-verified successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
       setTimeout(() => {
         navigate(`/admin/mentors`);
       }, 1500);
    }
  } catch (err) {
    const errorMessage =
      err.message || "Failed to create mentor profile. Check configuration.";
    setMessage({
      type: "error",
      text: errorMessage,
    });
    toast.error(errorMessage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Admin Console
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mt-2">
                Onboard New Mentor
              </h1>
              <p className="text-blue-100 text-sm mt-1 max-w-xl">
                Bypass standard student application lifecycle and instantiate an
                active verified mentor account directly into the platform
                cluster.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSampleData}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Load Sample Data
            </button>
          </div>
        </div>

        {/* NOTIFICATION ALERT */}
        {message.text && (
          <div
            className={`mb-8 p-4 rounded-xl flex items-start gap-3 shadow-sm border animate-fadeIn ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm font-medium">{message.text}</div>
          </div>
        )}

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CARD 1: ACCOUNT & PERSONAL */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Personal & Core Identity
                </h2>
                <p className="text-slate-500 text-xs">
                  Essential credentials linked for system sign-in and contact.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="e.g. Aarav"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="mentor@guidex.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number (10 digits) *
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2: LOCATION */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Geographic Location
                </h2>
                <p className="text-slate-500 text-xs">
                  Where is the mentor currently operating from?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="e.g. India"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: PROFESSIONAL & EXPERTISE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Professional & Industry Expertise
                </h2>
                <p className="text-slate-500 text-xs">
                  Work history, category alignment, and specialized skills.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Profession / Title *
                </label>
                <input
                  type="text"
                  name="profession"
                  required
                  placeholder="e.g. Staff Software Engineer"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  placeholder="e.g. 8"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  placeholder="e.g. Information Technology"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Software Development"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Primary Skills (Comma Separated) *
                </label>
                <input
                  type="text"
                  name="primarySkill"
                  required
                  placeholder="React, Node.js, System Design, TypeScript"
                  value={formData.primarySkill}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Languages (Comma Separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  placeholder="English, Hindi"
                  value={formData.languages}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Skill Mastery Level
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 4: EDUCATION */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Education & Certifications
                </h2>
                <p className="text-slate-500 text-xs">
                  Academic background and verified credential documents.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Degree *
                </label>
                <input
                  type="text"
                  name="degree"
                  required
                  placeholder="e.g. B.Tech in Computer Science"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  College / University *
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="e.g. IIT Bombay"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  placeholder="e.g. 2015"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  CGPA / Percentage
                </label>
                <input
                  type="text"
                  name="cgpa"
                  placeholder="e.g. 8.9 / 10"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Certifications (Comma Separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  placeholder="AWS Certified Solutions Architect, Google Cloud Professional"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 5: ABOUT & BIO */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Bio & Mentoring Philosophy
                </h2>
                <p className="text-slate-500 text-xs">
                  Public profile headline and coaching style descriptions.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Headline *
                </label>
                <input
                  type="text"
                  name="headline"
                  required
                  placeholder="e.g. Scaling Distributed Systems & Mentoring Next-Gen Engineers"
                  value={formData.headline}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  About Bio *
                </label>
                <textarea
                  name="about"
                  required
                  rows="4"
                  placeholder="Write a comprehensive background summary..."
                  value={formData.about}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Teaching Style
                </label>
                <input
                  type="text"
                  name="teachingStyle"
                  placeholder="e.g. Practical, project-driven, and focused on problem frameworks"
                  value={formData.teachingStyle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 6: AVAILABILITY & PRICING */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Availability Slots & Pricing Structure
                </h2>
                <p className="text-slate-500 text-xs">
                  Configure calendar availability windows and session tariffs.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    const isSelected = formData.availableDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Offered Session Types *
                </label>
                <div className="flex flex-wrap gap-2">
                  {["1:1 Mentoring", "Mock Interview", "Resume Review"].map(
                    (type) => {
                      const isSelected = formData.sessionTypes.includes(type);
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => handleSessionTypeToggle(type)}
                          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Session Duration
                  </label>
                  <select
                    name="sessionDuration"
                    value={formData.sessionDuration}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  >
                    {[15, 30, 45, 60, 90, 120].map((d) => (
                      <option key={d} value={d}>
                        {d} Minutes
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Session Price *
                  </label>
                  <input
                    type="number"
                    name="sessionPrice"
                    required
                    placeholder="1499"
                    value={formData.sessionPrice}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  name="freeTrial"
                  id="freeTrial"
                  checked={formData.freeTrial}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="freeTrial"
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Offer 15-minute free introductory trial session to prospective
                  mentees
                </label>
              </div>
            </div>
          </div>

          {/* CARD 7: DOCUMENT VERIFICATION */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Verification Files & Attachments *
                </h2>
                <p className="text-slate-500 text-xs">
                  Mandatory KYC, identity documents, and CV verification assets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  label: "Profile Image *",
                  name: "profileImage",
                  accept: "image/*",
                },
                {
                  label: "Professional Resume *",
                  name: "resume",
                  accept: ".pdf,.doc,.docx",
                },
                {
                  label: "Government ID Proof *",
                  name: "governmentId",
                  accept: "image/*,.pdf",
                },
                {
                  label: "Degree Certificate *",
                  name: "degreeCertificate",
                  accept: "image/*,.pdf",
                },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-5 text-center transition-all bg-slate-50/50 relative cursor-pointer"
                >
                  <input
                    type="file"
                    name={doc.name}
                    required
                    accept={doc.accept}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className="p-3 bg-white shadow-sm border border-slate-200 rounded-xl text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      {doc.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                      {fileNames[doc.name] ? (
                        <span className="text-emerald-600 font-semibold">
                          {fileNames[doc.name]}
                        </span>
                      ) : (
                        "Click or drag file to upload"
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT ACTION */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 text-base disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Provisioning Mentor Account...
                </>
              ) : (
                <>
                  Create & Verify Mentor Profile
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMentorAdmin;
