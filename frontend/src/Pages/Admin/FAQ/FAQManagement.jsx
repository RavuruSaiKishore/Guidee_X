import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  HelpCircle,
  Filter,
  MessageCircleQuestion,
  BookOpen,
  CreditCard,
  Video,
  UserRound,
  CalendarDays,
  Settings2,
  Activity,
  Layers3,
  AlertTriangle,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FAQManagement = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // =====================================================
  // STATES
  // =====================================================

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);

  const [deleteFAQ, setDeleteFAQ] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
  });

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "General",
    "Booking",
    "Cancellation",
    "Payment",
    "Meeting",
    "Mentor",
    "Account",
  ];

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    return localStorage.getItem("AdminToken");
  };

  // =====================================================
  // CATEGORY ICON
  // =====================================================

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Booking":
        return CalendarDays;

      case "Cancellation":
        return X;

      case "Payment":
        return CreditCard;

      case "Meeting":
        return Video;

      case "Mentor":
        return UserRound;

      case "Account":
        return Settings2;

      default:
        return BookOpen;
    }
  };

  // =====================================================
  // CATEGORY STYLE
  // =====================================================

  const getCategoryStyle = (category) => {
    switch (category) {
      case "Booking":
        return "bg-blue-50 text-blue-600 border-blue-200";

      case "Cancellation":
        return "bg-red-50 text-red-600 border-red-200";

      case "Payment":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";

      case "Meeting":
        return "bg-purple-50 text-purple-600 border-purple-200";

      case "Mentor":
        return "bg-orange-50 text-orange-600 border-orange-200";

      case "Account":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // =====================================================
  // FETCH ALL FAQS
  // =====================================================

  const fetchFAQs = async () => {
    try {
      setLoading(true);

      const token = getAdminToken();

      const response = await fetch(`${API_BASE_URL}/api/faq/allfaq`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load FAQs");
      }

      setFaqs(data.faqs || data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);

      toast.error(error.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    fetchFAQs();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD FAQ
  // =====================================================

  const handleAddFAQ = () => {
    setEditingFAQ(null);

    setFormData({
      question: "",
      answer: "",
      category: "General",
    });

    setShowModal(true);
  };

  // =====================================================
  // EDIT FAQ
  // =====================================================

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq);

    setFormData({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "General",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE CREATE / EDIT MODAL
  // =====================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);

    setEditingFAQ(null);

    setFormData({
      question: "",
      answer: "",
      category: "General",
    });
  };

  // =====================================================
  // CREATE / UPDATE FAQ
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast.error("Please enter the FAQ question.");
      return;
    }

    if (!formData.answer.trim()) {
      toast.error("Please enter the FAQ answer.");
      return;
    }

    try {
      setSaving(true);

      const token = getAdminToken();

      const url = editingFAQ
        ? `${API_BASE_URL}/api/faq/update/${editingFAQ._id}`
        : `${API_BASE_URL}/api/faq/createfaqs`;

      const method = editingFAQ ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingFAQ ? "Failed to update FAQ." : "Failed to create FAQ.")
        );
      }

      const faq = data.faq || data;

      if (editingFAQ) {
        setFaqs((prev) =>
          prev.map((item) => (item._id === editingFAQ._id ? faq : item))
        );

        toast.success("FAQ updated successfully.");
      } else {
        setFaqs((prev) => [faq, ...prev]);

        toast.success("FAQ created successfully.");
      }

      setShowModal(false);
      setEditingFAQ(null);

      setFormData({
        question: "",
        answer: "",
        category: "General",
      });
    } catch (error) {
      console.error("Error saving FAQ:", error);

      toast.error(error.message || "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE FAQ
  // =====================================================

  const handleDeleteFAQ = async () => {
    if (!deleteFAQ) return;

    try {
      setDeleting(true);

      const token = getAdminToken();

      const response = await fetch(
        `${API_BASE_URL}/api/faq/delete/${deleteFAQ._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete FAQ.");
      }

      setFaqs((prev) => prev.filter((faq) => faq._id !== deleteFAQ._id));

      toast.success("FAQ deleted successfully.");

      setDeleteFAQ(null);
    } catch (error) {
      console.error("Error deleting FAQ:", error);

      toast.error(error.message || "Failed to delete FAQ.");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // FILTER FAQs
  // =====================================================

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        faq.question?.toLowerCase().includes(search) ||
        faq.answer?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  // =====================================================
  // STATS
  // =====================================================

  const categoryCount = new Set(faqs.map((faq) => faq.category)).size;

  const bookingFAQCount = faqs.filter(
    (faq) => faq.category === "Booking"
  ).length;

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  // =====================================================
  // LOADING UI
  // =====================================================

  if (loading) {
    return (
      <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-100" />

          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
        </div>

        <p className="mt-6 text-center text-lg font-semibold text-gray-700">
          Loading FAQ data...
        </p>

        <p className="mt-1 text-center text-sm text-gray-400">
          Please wait while we fetch the FAQ information.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 p-3 text-gray-700 sm:p-5 lg:p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-5 sm:mb-6">
        {/* HERO */}

        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 shadow-xl sm:rounded-3xl">
          <div className="flex flex-col gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}

            <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-md sm:h-16 sm:w-16 sm:rounded-2xl">
                <MessageCircleQuestion className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  FAQ Management
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                  Create, manage and organize frequently asked questions for
                  students across the GuideX platform.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-xs text-white sm:px-4 sm:text-sm">
                    <Activity size={15} />

                    <span>Showing</span>

                    <span className="font-semibold">{filteredFAQs.length}</span>

                    <span>of</span>

                    <span className="font-semibold">{faqs.length}</span>

                    <span>FAQs</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-xs text-white sm:px-4 sm:text-sm">
                    <CalendarDays size={15} />

                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT STAT */}

            <div className="hidden lg:block">
              <div className="min-w-[220px] rounded-2xl bg-white px-6 py-5 shadow-lg">
                <p className="text-sm text-gray-500">Total FAQs</p>

                <h2 className="mt-1 text-4xl font-bold text-indigo-600">
                  {faqs.length}
                </h2>

                <p className="mt-2 text-sm text-green-600">
                  Available Help Resources
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TOOLBAR
        ====================================================== */}

        <div className="mt-5 rounded-2xl border bg-white px-4 py-4 shadow-md sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search FAQs by question or answer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* ACTIONS */}

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
              {/* CATEGORY */}

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 sm:px-5"
              >
                <option value="All">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* CLEAR */}

              <button
                onClick={handleClearFilters}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                <X size={17} />

                <span>Clear</span>
              </button>

              {/* ADD */}

              <button
                onClick={handleAddFAQ}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 sm:px-6"
              >
                <Plus size={18} />

                <span>Add FAQ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total FAQs</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-800">
                {faqs.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MessageCircleQuestion size={23} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">All FAQ resources</p>
        </div>

        {/* CATEGORIES */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-800">
                {categoryCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Layers3 size={23} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">Topics covered</p>
        </div>

        {/* BOOKING */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking FAQs</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-800">
                {bookingFAQCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarDays size={23} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Session related questions
          </p>
        </div>

        {/* FILTERED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Showing</p>

              <h2 className="mt-1 text-3xl font-bold text-gray-800">
                {filteredFAQs.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Filter size={23} />
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">Matching current filters</p>
        </div>
      </div>

      {/* =====================================================
          FAQ SECTION HEADER
      ====================================================== */}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">All FAQs</h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? "FAQ" : "FAQs"}{" "}
            available
          </p>
        </div>
      </div>

      {/* =====================================================
          FAQ CARDS
      ====================================================== */}

      {filteredFAQs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
            <HelpCircle size={32} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            No FAQs Found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            No FAQs match your current search or category filter.
          </p>

          <button
            onClick={handleClearFilters}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredFAQs.map((faq, index) => {
            const CategoryIcon = getCategoryIcon(faq.category);

            return (
              <div
                key={faq._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* CARD HEADER */}

                <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getCategoryStyle(
                      faq.category
                    )}`}
                  >
                    <CategoryIcon size={14} />

                    {faq.category}
                  </div>

                  <span className="text-xs font-medium text-gray-400">
                    FAQ #{index + 1}
                  </span>
                </div>

                {/* CARD BODY */}

                <div className="p-5">
                  {/* QUESTION */}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <HelpCircle size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                        Question
                      </p>

                      <h3 className="mt-1 text-base font-bold leading-6 text-gray-800">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* ANSWER */}

                  <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Answer
                    </p>

                    <p className="text-sm leading-6 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>

                  {/* FOOTER */}

                  <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <BookOpen size={14} />
                      Student Help Center
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFAQ(faq)}
                        className="flex items-center gap-1.5 rounded-lg bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-200"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteFAQ(faq)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-200"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4">
          <div className="my-auto max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div
              className={`px-5 py-5 text-white sm:px-6 ${
                editingFAQ
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
                  : "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                    {editingFAQ ? (
                      <Edit3 size={22} />
                    ) : (
                      <MessageCircleQuestion size={22} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      {editingFAQ ? "Edit FAQ" : "Create New FAQ"}
                    </h2>

                    <p className="mt-1 text-sm text-white/80">
                      {editingFAQ
                        ? "Update FAQ information"
                        : "Create a helpful question and answer"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* FORM BODY */}

            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              <div className="space-y-5">
                {/* QUESTION */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    FAQ Question
                  </label>

                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="How do I book a mentor session?"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ANSWER */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      Answer
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.answer.length} characters
                    </span>
                  </div>

                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Provide a clear and helpful answer for students..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* PREVIEW */}

                {(formData.question || formData.answer) && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                      <HelpCircle size={17} />
                      FAQ Preview
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryStyle(
                          formData.category
                        )}`}
                      >
                        {formData.category}
                      </span>

                      <h3 className="mt-3 font-bold text-gray-800">
                        {formData.question || "Your question will appear here"}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {formData.answer || "Your answer will appear here"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t bg-gray-50 px-0 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100 disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                    editingFAQ
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                  }`}
                >
                  <Save size={17} />

                  {saving
                    ? editingFAQ
                      ? "Updating..."
                      : "Creating..."
                    : editingFAQ
                    ? "Update FAQ"
                    : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {deleteFAQ && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center gap-4 border-b border-gray-100 bg-red-50 px-5 py-5 sm:px-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">Delete FAQ?</h2>

                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* BODY */}

            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-gray-600">
                Are you sure you want to permanently delete this FAQ?
              </p>

              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <HelpCircle size={18} />
                  </div>

                  <div className="min-w-0">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getCategoryStyle(
                        deleteFAQ.category
                      )}`}
                    >
                      {deleteFAQ.category}
                    </span>

                    <p className="mt-2 break-words text-sm font-semibold leading-5 text-gray-800">
                      {deleteFAQ.question}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-red-500">
                Deleting this FAQ will remove it from the student Help Center.
              </p>
            </div>

            {/* FOOTER */}

            <div className="flex border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setDeleteFAQ(null)}
                disabled={deleting}
                className="w-1/2 rounded-bl-2xl py-3 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <div className="w-px bg-gray-200" />

              <button
                onClick={handleDeleteFAQ}
                disabled={deleting}
                className="w-1/2 rounded-br-2xl py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
