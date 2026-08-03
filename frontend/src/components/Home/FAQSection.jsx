import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  MessageCircleQuestion,
  BookOpen,
  CalendarDays,
  CreditCard,
  Video,
  UserRound,
  Settings2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQSection = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();

  // ==========================================
  // FETCH FAQs
  // ==========================================
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/api/user/allfaq`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load FAQs");
        }

        const faqData = data.faqs || data || [];

        // Show only 6 FAQs on Home Page
        setFaqs(faqData);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [API_BASE_URL]);

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
        return "bg-blue-50 text-blue-600 border-blue-100";

      case "Cancellation":
        return "bg-red-50 text-red-600 border-red-100";

      case "Payment":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "Meeting":
        return "bg-purple-50 text-purple-600 border-purple-100";

      case "Mentor":
        return "bg-orange-50 text-orange-600 border-orange-100";

      case "Account":
        return "bg-cyan-50 text-cyan-600 border-cyan-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // ==========================================
  // TOGGLE FAQ
  // ==========================================
  const toggleFAQ = (id) => {
    setOpenFAQ((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {/* ICON */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <MessageCircleQuestion size={28} />
          </div>

          {/* SMALL TITLE */}
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Help Center
          </p>

          {/* MAIN TITLE */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Find quick answers to common questions about mentors, bookings,
            payments, meetings, and your GuideX learning experience.
          </p>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}
        {loading ? (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          /* ==========================================
              EMPTY STATE
          ========================================== */
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <HelpCircle size={40} className="mx-auto mb-4 text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-700">
              No FAQs available
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Frequently asked questions will appear here soon.
            </p>
          </div>
        ) : (
          /* ==========================================
              FAQ CARDS
          ========================================== */
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            {faqs.slice(0, 6).map((faq, index) => {
              const CategoryIcon = getCategoryIcon(faq.category);
              const isOpen = openFAQ === faq._id;

              return (
                <div
                  key={faq._id}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-indigo-200 shadow-lg shadow-indigo-100/50"
                      : "border-gray-200 shadow-sm hover:border-indigo-100 hover:shadow-md"
                  }`}
                >
                  {/* ==================================
                      QUESTION
                  ================================== */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq._id)}
                    className="flex w-full items-start gap-4 p-5 text-left sm:p-6"
                  >
                    {/* NUMBER / ICON */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        isOpen
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {isOpen ? (
                        <HelpCircle size={20} />
                      ) : (
                        <span className="text-sm font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    {/* QUESTION CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getCategoryStyle(
                            faq.category
                          )}`}
                        >
                          <CategoryIcon size={12} />

                          {faq.category || "General"}
                        </span>
                      </div>

                      <h3
                        className={`pr-2 text-sm font-bold leading-6 transition sm:text-base ${
                          isOpen ? "text-indigo-600" : "text-gray-800"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* ARROW */}
                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                        isOpen
                          ? "rotate-180 bg-indigo-50 text-indigo-600"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {/* ==================================
                      ANSWER
                  ================================== */}
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-gray-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                        <div className="rounded-xl bg-gray-50 p-4">
                          <div className="flex gap-3">
                            <div className="mt-0.5 shrink-0">
                              <HelpCircle
                                size={18}
                                className="text-indigo-500"
                              />
                            </div>

                            <p className="text-sm leading-7 text-gray-600">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ==========================================
            VIEW ALL FAQS
        ========================================== */}
        {!loading && faqs.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() =>
                navigate("/FAQPage", {
                  state: {
                    faqs,
                  },
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
            >
              <HelpCircle size={18} />
              View All FAQs
              <ChevronDown size={17} className="-rotate-90" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
