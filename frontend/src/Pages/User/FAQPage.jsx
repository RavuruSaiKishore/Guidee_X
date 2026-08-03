import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  HelpCircle,
  CalendarDays,
  CreditCard,
  Video,
  UserRound,
  Settings2,
  BookOpen,
  ChevronDown,
  MessageCircleQuestion,
} from "lucide-react";

const FAQPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // GET FAQ DATA FROM NAVIGATION STATE
  // ==========================================
  const faqs = location.state?.faqs || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState(null);

  // ==========================================
  // CATEGORIES
  // ==========================================
  const categories = [
    "All",
    "General",
    "Booking",
    "Cancellation",
    "Payment",
    "Meeting",
    "Mentor",
    "Account",
  ];

  // ==========================================
  // CATEGORY ICON
  // ==========================================
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

  // ==========================================
  // CATEGORY STYLE
  // ==========================================
  const getCategoryStyle = (category) => {
    switch (category) {
      case "Booking":
        return {
          wrapper: "bg-blue-50 border-blue-100",
          text: "text-blue-600",
          icon: "bg-blue-100 text-blue-600",
        };

      case "Cancellation":
        return {
          wrapper: "bg-red-50 border-red-100",
          text: "text-red-600",
          icon: "bg-red-100 text-red-600",
        };

      case "Payment":
        return {
          wrapper: "bg-emerald-50 border-emerald-100",
          text: "text-emerald-600",
          icon: "bg-emerald-100 text-emerald-600",
        };

      case "Meeting":
        return {
          wrapper: "bg-purple-50 border-purple-100",
          text: "text-purple-600",
          icon: "bg-purple-100 text-purple-600",
        };

      case "Mentor":
        return {
          wrapper: "bg-orange-50 border-orange-100",
          text: "text-orange-600",
          icon: "bg-orange-100 text-orange-600",
        };

      case "Account":
        return {
          wrapper: "bg-cyan-50 border-cyan-100",
          text: "text-cyan-600",
          icon: "bg-cyan-100 text-cyan-600",
        };

      default:
        return {
          wrapper: "bg-gray-50 border-gray-200",
          text: "text-gray-600",
          icon: "bg-gray-100 text-gray-600",
        };
    }
  };

  // ==========================================
  // FILTER FAQS
  // ==========================================
  const filteredFAQs = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return faqs.filter((faq) => {
      const question = faq.question?.toLowerCase() || "";
      const answer = faq.answer?.toLowerCase() || "";

      const matchesSearch =
        question.includes(search) || answer.includes(search);

      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  // ==========================================
  // CATEGORY COUNTS
  // ==========================================
  const getCategoryCount = (category) => {
    if (category === "All") {
      return faqs.length;
    }

    return faqs.filter((faq) => faq.category === category).length;
  };

  // ==========================================
  // TOGGLE FAQ
  // ==========================================
  const toggleFAQ = (id) => {
    setOpenFAQ((prev) => (prev === id ? null : id));
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setOpenFAQ(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =====================================================
          HERO HEADER
      ====================================================== */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* ICON */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <MessageCircleQuestion size={34} />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Find answers to common questions about booking mentors, payments,
              meetings, cancellations, and your GuideX account.
            </p>

            {/* SEARCH */}
            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search your question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/20 bg-white pl-14 pr-12 text-sm text-gray-700 shadow-xl outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 sm:text-base"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY FILTERS
      ====================================================== */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => {
              const CategoryIcon = getCategoryIcon(category);
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenFAQ(null);
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <CategoryIcon size={16} />

                  <span>{category}</span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {getCategoryCount(category)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "All"
                ? "All Frequently Asked Questions"
                : `${selectedCategory} Questions`}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredFAQs.length}{" "}
              {filteredFAQs.length === 1 ? "question" : "questions"} available
            </p>
          </div>

          {(searchTerm || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* =====================================================
            EMPTY FAQ DATA
        ====================================================== */}
        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <HelpCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No FAQs Available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              No FAQ data was found. Please return to the home page and try
              opening the FAQ section again.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        ) : filteredFAQs.length === 0 ? (
          /* =====================================================
              NO FILTER RESULTS
          ====================================================== */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <HelpCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">No FAQs Found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We couldn't find any frequently asked questions matching your
              search or selected category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View All FAQs
            </button>
          </div>
        ) : (
          /* =====================================================
              FAQ CARDS
          ====================================================== */
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredFAQs.map((faq) => {
              const CategoryIcon = getCategoryIcon(faq.category);
              const style = getCategoryStyle(faq.category);
              const isOpen = openFAQ === faq._id;

              return (
                <div
                  key={faq._id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 ${
                    isOpen
                      ? "border-blue-200 shadow-md"
                      : "border-gray-200 hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  {/* =================================================
                      CARD HEADER
                  ================================================== */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq._id)}
                    className="w-full p-5 text-left sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        {/* CATEGORY ICON */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                        >
                          <CategoryIcon size={20} />
                        </div>

                        {/* QUESTION */}
                        <div className="min-w-0">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.wrapper} ${style.text}`}
                          >
                            {faq.category || "General"}
                          </span>

                          <h3 className="mt-3 text-base font-bold leading-6 text-gray-900 sm:text-lg">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      {/* ARROW */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                          isOpen
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        <ChevronDown
                          size={19}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </button>

                  {/* =================================================
                      ANSWER
                  ================================================== */}
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      <div className="ml-0 rounded-xl bg-gray-50 p-4 sm:ml-[60px]">
                        <div className="flex gap-3">
                          <HelpCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-blue-500"
                          />

                          <p className="text-sm leading-7 text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default FAQPage;
