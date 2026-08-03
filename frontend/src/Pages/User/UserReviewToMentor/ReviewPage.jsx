import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Award,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ratingLabels = {
  1: {
    title: "Poor",
    color: "text-red-500",
    emoji: "😞",
    description: "The session did not meet expectations.",
  },
  2: {
    title: "Fair",
    color: "text-orange-500",
    emoji: "🙂",
    description: "Some parts were useful, but there is room for improvement.",
  },
  3: {
    title: "Good",
    color: "text-yellow-500",
    emoji: "😊",
    description: "A helpful session with useful insights.",
  },
  4: {
    title: "Very Good",
    color: "text-lime-600",
    emoji: "😍",
    description: "The mentor was knowledgeable and engaging.",
  },
  5: {
    title: "Excellent",
    color: "text-green-600",
    emoji: "🤩",
    description: "An outstanding mentoring experience!",
  },
};

const ReviewPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/review/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setMentor(data.mentor);
      } else {
        toast.error(data.message || "Unable to load mentor.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load mentor details.");
    }
  };

  const submitReview = async () => {
    if (!rating) {
      toast.warning("Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          rating,
          review,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thank you for your valuable feedback!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-3xl mx-auto">
        {/* Header */}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl mb-5">
            <Award className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800">Rate Your Mentor</h1>

          <p className="text-gray-500 mt-3 text-lg">
            Your feedback helps mentors improve and guides future students.
          </p>
        </div>

        {/* Main Card */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white overflow-hidden">
          {/* Top Gradient */}

          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

          <div className="p-10">
            {mentor && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-10">
                <div className="flex flex-col items-center">
                  <img
                    src={`${API_BASE_URL}/${mentor.profileImage}`}
                    alt={`${mentor.firstName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />

                  <h2 className="mt-6 text-3xl font-bold text-gray-800">
                    {mentor.firstName} {mentor.lastName}
                  </h2>

                  <p className="text-gray-500 mt-2 text-lg">
                    {mentor.profession}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                    <Sparkles size={18} />
                    Trusted Mentor
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}

            <div className="text-center mb-10">
              <h3 className="text-2xl font-semibold text-gray-800">
                How was your mentoring session?
              </h3>

              <p className="text-gray-500 mt-2">
                Click the stars below to rate your experience.
              </p>

              <div className="flex justify-center gap-4 mt-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={52}
                    strokeWidth={1.8}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`cursor-pointer transition-all duration-300 hover:scale-125 ${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-8">
                {rating ? (
                  <>
                    <div
                      className={`text-2xl font-bold ${ratingLabels[rating].color}`}
                    >
                      {ratingLabels[rating].emoji} {ratingLabels[rating].title}
                    </div>

                    <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                      {ratingLabels[rating].description}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 text-lg">
                    Select a rating to continue
                  </p>
                )}
              </div>
            </div>
            {/* Review Section */}

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="text-blue-600" size={22} />

                <h3 className="text-xl font-semibold text-gray-800">
                  Share Your Experience
                </h3>
              </div>

              <div className="relative">
                <textarea
                  rows={7}
                  maxLength={500}
                  placeholder="Tell us what you liked about the session, how the mentor helped you, and what future students should know..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 pr-16 text-gray-700 outline-none resize-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />

                <span className="absolute bottom-4 right-5 text-sm text-gray-400">
                  {review.length}/500
                </span>
              </div>
            </div>

            {/* Tips */}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-blue-600" size={22} />

                <h3 className="font-semibold text-blue-700">
                  Helpful Review Tips
                </h3>
              </div>

              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Was the mentor knowledgeable and well prepared?</li>

                <li>• Did they answer your questions clearly?</li>

                <li>• Was the session engaging and interactive?</li>

                <li>• Would you recommend this mentor to others?</li>
              </ul>
            </div>

            {/* Submit Button */}

            <button
              onClick={submitReview}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Review...
                </div>
              ) : (
                "Submit Review ⭐"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
