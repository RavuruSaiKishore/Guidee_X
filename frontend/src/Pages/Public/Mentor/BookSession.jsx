import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Star,
  Briefcase,
  MapPin,
  IndianRupee,
  FileText,
  Timer,
  Users,
  Gift,
  BookOpen,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  ;

const BookingPage = () => {
  const { mentorId } = useParams();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    sessionType: "",
    date: "",
    time: "",
    duration: 60,
    notes: "",
  });

  useEffect(() => {
    fetchMentor();
  }, []);

  const fetchMentor = async () => {
    try {
      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/mentor/${mentorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);

      setMentor(data.mentor);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="mt-5 text-gray-700 font-medium">
          Loading your bookings...
        </p>

        {/* Sub text */}
        <p className="mt-1 text-sm text-gray-400">Please wait a moment</p>
      </div>
    );
  }

  if (!mentor) {
    return <div className="text-center py-20">Mentor not found</div>;
  }

  const image = mentor.profileImage
    ? mentor.profileImage.startsWith("http")
      ? mentor.profileImage
      : `${API_BASE_URL}/${mentor.profileImage.replace(/^\/+/, "")}`
    : `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}`;

 const calculateEndTime = (startTime, duration) => {
   if (!startTime) return "";

   const [time, meridian] = startTime.trim().split(" ");
   let [hours, minutes] = time.split(":").map(Number);

   // Convert to 24-hour format
   if (meridian.toLowerCase() === "pm" && hours !== 12) {
     hours += 12;
   }

   if (meridian.toLowerCase() === "am" && hours === 12) {
     hours = 0;
   }

   const date = new Date();
   date.setHours(hours, minutes, 0, 0);

   // Add duration
   date.setMinutes(date.getMinutes() + duration);

   // Convert back to 12-hour format
   let endHours = date.getHours();
   const endMinutes = date.getMinutes();

   const endMeridian = endHours >= 12 ? "pm" : "am";

   endHours = endHours % 12;
   if (endHours === 0) endHours = 12;

   return `${endHours}:${String(endMinutes).padStart(2, "0")} ${endMeridian}`;
 };

  const endTime = calculateEndTime(booking.time, booking.duration);

  const handleBooking = async () => {
    try {
      if (!booking.sessionType) {
        return toast.error("Please select a session type.");
      }

      if (!booking.date) {
        return toast.error("Please select a date.");
      }

      if (!booking.time) {
        return toast.error("Please select a time.");
      }

      const token = localStorage.getItem("UserToken");

      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: mentor.pricing.sessionPrice,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        return toast.error("Unable to create payment order.");
      }

      openRazorpay(orderData.order);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    }
  };

  const openRazorpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "GuideX",
      description: "Mentor Booking Session",
      order_id: order.id,

      handler: async function (response) {
        try {
          toast.loading("Verifying Payment...", {
            toastId: "verify",
          });

          const token = localStorage.getItem("UserToken");

          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              mentor: mentor._id,
              sessionType: booking.sessionType,
              sessionDate: booking.date,
              startTime: booking.time,
              endTime,
              duration: booking.duration,
              amount: mentor.pricing.sessionPrice,
              notes: booking.notes,
            }),
          });

          const data = await verifyRes.json();
          console.log("the data is =", data);

          toast.dismiss("verify");

          if (data.success) {
            toast.success("Booking Confirmed Successfully!");

            // Redirect after 2 seconds
            setTimeout(() => {
              navigate("/my-bookings");
            }, 2000);
          } else {
            toast.error(data.message || "Payment Verification Failed");
          }
        } catch (err) {
          toast.dismiss("verify");
          console.log(err);
          toast.error("Payment Verification Failed");
        }
      },

      modal: {
        ondismiss: function () {
          toast.info("Payment Cancelled");
        },
      },

      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

      theme: {
        color: "#2563eb",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  };

  const convertTo24Hour = (time, preferredTime) => {
    let [hour, minute] = time.split(":").map(Number);

    if (preferredTime === "Afternoon" && hour < 12) {
      hour += 12;
    }

    if (preferredTime === "Evening" && hour < 12) {
      hour += 12;
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  
  const generateTimeSlots = (
    startTime,
    endTime,
    preferredTime,
    sessionDuration
  ) => {
    if (!startTime || !endTime) return [];

    startTime = convertTo24Hour(startTime, preferredTime);
    endTime = convertTo24Hour(endTime, preferredTime);

    const slots = [];

    let [startHour, startMinute] = startTime.split(":").map(Number);
    let [endHour, endMinute] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    while (start < end) {
      slots.push(
        start.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );

      start.setMinutes(start.getMinutes() + sessionDuration);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(
    mentor.availability?.startTime,
    mentor.availability?.endTime,
    mentor.availability?.preferredTime,
    mentor.availability?.sessionDuration
  );

  const selectedDay = booking.date
    ? new Date(booking.date).toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "";

  const isAvailableDay =
    booking.date && mentor.availability?.availableDays.includes(selectedDay);

    const sessionTypes =
      typeof mentor.pricing?.sessionTypes === "string"
        ? JSON.parse(mentor.pricing.sessionTypes)
        : mentor.pricing?.sessionTypes || [];

  return (
    <div className="min-h-screen bg-gray-100 py-10 mt-14">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">
            {/* Mentor Card */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
              <div className="flex flex-col md:flex-row">
                {/* Profile Image Section */}
                <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-10 md:w-40 md:min-h-[380px] md:py-8">
                  {/* Decorative Background */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

                  {/* Profile Image */}
                  <div className="relative">
                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                      <img
                        src={image}
                        alt={`${mentor.firstName} ${mentor.lastName}`}
                        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}&background=2563eb&color=fff`;
                        }}
                      />
                    </div>

                    {/* Online Status */}
                    <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-blue-700 bg-green-500 shadow-md" />
                  </div>
                </div>

                {/* Mentor Details */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    {/* Basic Information */}
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {mentor.firstName} {mentor.lastName}
                      </h1>

                      <p className="mt-1 text-lg text-gray-600">
                        {mentor.profession}
                      </p>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                          <Briefcase size={16} />
                          {mentor.company || "Freelancer"}
                        </span>

                        <span className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                          <MapPin size={16} />
                          {mentor.location?.city || "Location"},{" "}
                          {mentor.location?.state || ""}
                        </span>

                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                          {mentor.experience || 0}+ Years Experience
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="w-fit rounded-2xl border border-yellow-100 bg-yellow-50 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Star
                          size={19}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-xl font-bold text-gray-900">
                          {mentor.averageRating || 4.9}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {mentor.totalReviews || 0} Reviews
                      </p>
                    </div>
                  </div>

                  {/* About */}
                  <div className="mt-7 border-t border-gray-100 pt-6">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                      About Mentor
                    </h3>

                    <p className="leading-7 text-gray-600">
                      {mentor.about ||
                        "Experienced mentor passionate about helping students and professionals achieve their career goals through personalized guidance, mock interviews, resume reviews, and technical mentoring."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Session Type */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900">Session Type</h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Select the session offered by this mentor.
              </p>

              {(() => {
                let sessionTypes = mentor.pricing?.sessionTypes || [];

                if (typeof sessionTypes === "string") {
                  try {
                    sessionTypes = JSON.parse(sessionTypes);
                  } catch {
                    sessionTypes = [sessionTypes];
                  }
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessionTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setBooking({
                            ...booking,
                            sessionType: type,
                          })
                        }
                        className={`relative rounded-xl border-2 px-4 py-4 text-center font-medium transition-all duration-200
            ${
              booking.sessionType === type
                ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
            }`}
                      >
                        {type}

                        {booking.sessionType === type && (
                          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Select Date */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="text-blue-600" size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Select Date</h2>
                  <p className="text-sm text-gray-500">
                    Choose your preferred session date
                  </p>
                </div>
              </div>

              <div className="max-w-sm">
                <input
                  type="date"
                  name="date"
                  value={booking.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none
      focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            {/* Select Time */}
            {/* Select Time */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Time Slots
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select a convenient time for your session.
                </p>
              </div>

              {/* No date selected */}
              {!booking.date && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
                  Please select a date first to view the available time slots.
                </div>
              )}

              {/* Date selected but mentor unavailable */}
              {booking.date && !isAvailableDay && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-700">
                    Mentor is unavailable on this day
                  </h4>

                  <p className="mt-1 text-sm text-red-600">
                    This mentor is available only on{" "}
                    <span className="font-semibold">
                      {mentor.availability?.availableDays.join(", ")}
                    </span>
                    .
                  </p>
                </div>
              )}

              {/* Available slots */}
              {booking.date && isAvailableDay && (
                <div className="flex flex-wrap gap-3 max-w-md">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setBooking({
                            ...booking,
                            time: slot,
                          })
                        }
                        className={`min-w-[110px] px-4 py-3 rounded-xl border transition-all duration-200 font-medium
              ${
                booking.time === slot
                  ? "bg-blue-600 border-blue-600 text-white shadow-md"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
              }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
                      No time slots are available for this mentor.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Session Duration
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  This mentor offers a {mentor.availability?.sessionDuration}
                  -minute session.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() =>
                    setBooking({
                      ...booking,
                      duration: mentor.availability?.sessionDuration,
                    })
                  }
                  className={`min-w-[140px] px-5 py-3 rounded-xl border transition-all duration-200 font-medium ${
                    booking.duration === mentor.availability?.sessionDuration
                      ? "bg-blue-600 border-blue-600 text-white shadow-md"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <p className="text-lg font-semibold">
                    {mentor.availability?.sessionDuration} Minutes
                  </p>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100">
                    <FileText className="text-blue-600" size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Session Notes
                    </h2>

                    <p className="text-sm text-gray-500">
                      Let your mentor know what you'd like to discuss.
                    </p>
                  </div>
                </div>
              </div>

              <textarea
                rows={5}
                name="notes"
                value={booking.notes}
                onChange={handleChange}
                placeholder="Example:
• Resume review for product-based companies
• Mock frontend interview
• React performance optimization
• Career switch guidance"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 resize-none outline-none transition-all
    focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <div className="mt-3 flex justify-between text-xs text-gray-400">
                <span>Provide a few details so your mentor can prepare.</span>
                <span>{booking.notes.length}/500</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}

          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

              {/* Mentor */}

              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <img
                  src={image}
                  alt={`${mentor.firstName} ${mentor.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mentor.firstName} {mentor.lastName}
                  </h3>

                  <p className="text-sm text-gray-500">{mentor.profession}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ {mentor.averageRating || "4.9"}
                    </span>

                    <span className="text-blue-600 font-semibold">
                      ₹{mentor.pricing?.sessionPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-blue-600" size={18} />
                      <span className="text-gray-600">Session Type</span>
                    </div>

                    <span className="font-semibold text-gray-900">
                      {booking.sessionType || "Not Selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-blue-600" size={18} />
                      <span className="text-gray-600">Date</span>
                    </div>

                    <span className="font-semibold text-gray-900">
                      {booking.date || "Not Selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-600" size={18} />
                      <span className="text-gray-600">Time</span>
                    </div>

                    <span className="font-semibold text-gray-900">
                      {booking.time || "Not Selected"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Timer className="text-blue-600" size={18} />
                      <span className="text-gray-600">Duration</span>
                    </div>

                    <span className="font-semibold text-gray-900">
                      {booking.duration} Minutes
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t my-8"></div>

              {/* Price */}

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Session Fee</span>

                  <span>₹{mentor.pricing?.sessionPrice || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Fee</span>

                  <span>₹0</span>
                </div>
              </div>

              <div className="border-t my-6"></div>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Total</h3>

                <h3 className="text-3xl font-bold text-blue-600">
                  ₹{mentor.pricing?.sessionPrice || 0}
                </h3>
              </div>

              <button
                onClick={handleBooking}
                disabled={mentor.accountStatus === "Suspended"}
                className={`w-full mt-8 py-4 rounded-2xl font-semibold text-lg transition ${
                  mentor.accountStatus === "Suspended"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Book Session
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure payments powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
