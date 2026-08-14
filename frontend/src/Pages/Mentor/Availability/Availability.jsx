import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Globe2,
  TimerReset,
  CheckCircle2,
  Save,
  Pencil,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

const Availability = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [availability, setAvailability] = useState({
    availableDays: [],
    preferredTime: "",
    startTime: "",
    endTime: "",
    timezone: "Asia/Kolkata",
    sessionDuration: 60,
  });

  // =========================================================
  // FETCH AVAILABILITY
  // =========================================================

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/mentor/availability`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const mentorAvailability = data.mentor?.availability || {};

        setAvailability({
          availableDays: mentorAvailability.availableDays || [],
          preferredTime: mentorAvailability.preferredTime || "",
          startTime: mentorAvailability.startTime || "",
          endTime: mentorAvailability.endTime || "",
          timezone: mentorAvailability.timezone || "Asia/Kolkata",
          sessionDuration: mentorAvailability.sessionDuration || 60,
        });
      } else {
        toast.error(data.message || "Failed to load availability.");
      }
    } catch (error) {
      console.error("Fetch availability error:", error);
      toast.error("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  // =========================================================
  // SAVE AVAILABILITY
  // =========================================================

  const saveAvailability = async () => {
    if (availability.availableDays.length === 0) {
      toast.error("Please select at least one available day.");
      return;
    }

    if (!availability.startTime || !availability.endTime) {
      toast.error("Please select your start and end time.");
      return;
    }

    if (availability.startTime >= availability.endTime) {
      toast.error("End time must be later than start time.");
      return;
    }

    if (!availability.preferredTime) {
      toast.error("Please select your preferred time.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("MentorToken");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/mentor/editavailability`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(availability),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Availability updated successfully.");

        setIsEditing(false);

        await fetchAvailability();
      } else {
        toast.error(data.message || "Failed to update availability.");
      }
    } catch (error) {
      console.error("Save availability error:", error);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0 text-slate-900"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-slate-200" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>

          <p
            className="mt-5 text-center text-xs font-semibold tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Loading Availability...
          </p>

          <p
            className="mt-1 text-center text-[11px] text-slate-400 font-medium"
            style={{ fontWeight: 600 }}
          >
            Please wait while we fetch your schedule.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW MODE
  // =========================================================

  if (!isEditing) {
    return (
      <div
        className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
        style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
      >
        <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-8 text-white shadow-md">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                  style={{ fontWeight: 600 }}
                >
                  <CalendarDays size={26} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                      style={{ fontWeight: 600 }}
                    >
                      <Sparkles size={13} className="text-blue-400" />
                      Schedule Setup
                    </span>
                  </div>

                  <h1
                    className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                    style={{ fontWeight: 600 }}
                  >
                    Mentor Availability
                  </h1>

                  <p
                    className="mt-1 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                    style={{ fontWeight: 600 }}
                  >
                    This is the availability students currently see while
                    booking your mentorship sessions.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-100 px-5 py-3 text-xs font-semibold text-black shadow-xs transition shrink-0"
                style={{ fontWeight: 600 }}
              >
                <Pencil size={15} className="text-blue-600" />
                Edit Availability
              </button>
            </div>
          </div>

          {/* ================================================= */}
          {/* OVERVIEW */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* WEEKLY AVAILABILITY */}

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h2
                className="text-sm font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Weekly Availability
              </h2>

              <p
                className="mt-1 text-xs text-slate-500 font-medium"
                style={{ fontWeight: 600 }}
              >
                Students can schedule sessions on these days.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {availability.availableDays.length > 0 ? (
                  availability.availableDays.map((day) => (
                    <span
                      key={day}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700"
                      style={{ fontWeight: 600 }}
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span
                    className="text-xs text-slate-400 font-semibold"
                    style={{ fontWeight: 600 }}
                  >
                    No availability selected.
                  </span>
                )}
              </div>
            </div>

            {/* SESSION INFORMATION */}

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h2
                className="text-sm font-semibold text-slate-900 tracking-tight"
                style={{ fontWeight: 600 }}
              >
                Session Information
              </h2>

              <p
                className="mt-1 text-xs text-slate-500 font-medium"
                style={{ fontWeight: 600 }}
              >
                Your current mentoring preferences.
              </p>

              <div className="mt-5 space-y-3.5 text-xs font-semibold text-slate-700">
                {/* PREFERRED TIME */}

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span
                      className="text-slate-400 text-[10px] uppercase tracking-wider block"
                      style={{ fontWeight: 600 }}
                    >
                      Preferred Time
                    </span>
                    <span
                      className="text-slate-900 font-semibold mt-0.5 block text-xs"
                      style={{ fontWeight: 600 }}
                    >
                      {availability.preferredTime || "-"}
                    </span>
                  </div>
                  <span className="text-xl">🌇</span>
                </div>

                {/* WORKING HOURS */}

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span
                      className="text-slate-400 text-[10px] uppercase tracking-wider block"
                      style={{ fontWeight: 600 }}
                    >
                      Working Hours
                    </span>
                    <span
                      className="text-slate-900 font-semibold mt-0.5 block text-xs"
                      style={{ fontWeight: 600 }}
                    >
                      {availability.startTime && availability.endTime
                        ? `${availability.startTime} - ${availability.endTime}`
                        : "-"}
                    </span>
                  </div>
                  <span className="text-xl">🕐</span>
                </div>

                {/* TIMEZONE */}

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span
                      className="text-slate-400 text-[10px] uppercase tracking-wider block"
                      style={{ fontWeight: 600 }}
                    >
                      Timezone
                    </span>
                    <span
                      className="text-slate-900 font-semibold mt-0.5 block text-xs"
                      style={{ fontWeight: 600 }}
                    >
                      {availability.timezone || "-"}
                    </span>
                  </div>
                  <span className="text-xl">🌍</span>
                </div>

                {/* DURATION */}

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span
                      className="text-slate-400 text-[10px] uppercase tracking-wider block"
                      style={{ fontWeight: 600 }}
                    >
                      Session Duration
                    </span>
                    <span
                      className="text-slate-900 font-semibold mt-0.5 block text-xs"
                      style={{ fontWeight: 600 }}
                    >
                      {availability.sessionDuration
                        ? `${availability.sessionDuration} Minutes`
                        : "-"}
                    </span>
                  </div>
                  <span className="text-xl">⏱</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h2
              className="text-sm font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              Availability Summary
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
              {/* AVAILABLE DAYS */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Available Days
                </p>
                <h3
                  className="mt-1 text-lg font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  {availability.availableDays.length}
                </h3>
              </div>

              {/* PREFERRED TIME */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Preferred Time
                </p>
                <h3
                  className="mt-1 text-lg font-semibold text-slate-900 truncate"
                  style={{ fontWeight: 600 }}
                >
                  {availability.preferredTime || "-"}
                </h3>
              </div>

              {/* TIMEZONE */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Timezone
                </p>
                <h3
                  className="mt-1 text-sm font-semibold text-slate-900 truncate"
                  style={{ fontWeight: 600 }}
                >
                  {availability.timezone || "-"}
                </h3>
              </div>

              {/* DURATION */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p
                  className="text-[10px] uppercase tracking-wider text-slate-400"
                  style={{ fontWeight: 600 }}
                >
                  Session Duration
                </p>
                <h3
                  className="mt-1 text-lg font-semibold text-emerald-600"
                  style={{ fontWeight: 600 }}
                >
                  {availability.sessionDuration
                    ? `${availability.sessionDuration} min`
                    : "-"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // EDIT MODE DATA
  // =========================================================

  const weekDays = [
    { key: "Monday", short: "Mon" },
    { key: "Tuesday", short: "Tue" },
    { key: "Wednesday", short: "Wed" },
    { key: "Thursday", short: "Thu" },
    { key: "Friday", short: "Fri" },
    { key: "Saturday", short: "Sat" },
    { key: "Sunday", short: "Sun" },
  ];

  const timeOptions = [
    {
      value: "Morning",
      emoji: "🌅",
      desc: "06:00 AM - 12:00 PM",
    },
    {
      value: "Afternoon",
      emoji: "☀️",
      desc: "12:00 PM - 05:00 PM",
    },
    {
      value: "Evening",
      emoji: "🌇",
      desc: "05:00 PM - 09:00 PM",
    },
    {
      value: "Night",
      emoji: "🌙",
      desc: "09:00 PM onwards",
    },
  ];

  const durations = [30, 45, 60, 90, 120];

  // =========================================================
  // EDIT MODE
  // =========================================================

  return (
    <div
      className="min-h-screen bg-slate-50 pt-20 lg:ml-64 lg:pt-0 text-slate-900 pb-16"
      style={{ fontFamily: "'Poppins', sans-serif", fontStyle: "normal" }}
    >
      <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-8 text-white shadow-md">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-inner text-blue-400"
                style={{ fontWeight: 600 }}
              >
                <CalendarDays size={26} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur"
                    style={{ fontWeight: 600 }}
                  >
                    <Sparkles size={13} className="text-blue-400" />
                    Configuration Suite
                  </span>
                </div>

                <h1
                  className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white"
                  style={{ fontWeight: 600 }}
                >
                  Mentor Availability
                </h1>

                <p
                  className="mt-1 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed"
                  style={{ fontWeight: 600 }}
                >
                  Manage your weekly schedule, preferred timings, session
                  duration and timezone.
                </p>
              </div>
            </div>

            {/* STATS */}

            <div
              className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur shadow-inner shrink-0"
              style={{ fontWeight: 600 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-black shadow-xs">
                {availability.availableDays.length}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Active
                </p>
                <h3 className="text-sm font-semibold text-white">
                  Days Selected
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          {/* CONTENT HEADER */}

          <div className="border-b border-slate-100 pb-5">
            <h2
              className="text-base font-semibold text-slate-900 tracking-tight"
              style={{ fontWeight: 600 }}
            >
              Configure Your Availability
            </h2>

            <p
              className="mt-1 text-xs text-slate-500 font-medium leading-relaxed"
              style={{ fontWeight: 600 }}
            >
              Select your available days, preferred time, session duration and
              timezone.
            </p>
          </div>

          {/* ================================================= */}
          {/* AVAILABLE DAYS */}
          {/* ================================================= */}

          <div className="space-y-4">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Available Days
              </h3>

              <p
                className="mt-1 text-xs text-slate-700 font-medium"
                style={{ fontWeight: 600 }}
              >
                Choose the days when students can book sessions with you.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const selected = availability.availableDays.includes(day.key);

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        setAvailability((prev) => ({
                          ...prev,
                          availableDays: prev.availableDays.filter(
                            (d) => d !== day.key
                          ),
                        }));
                      } else {
                        setAvailability((prev) => ({
                          ...prev,
                          availableDays: [...prev.availableDays, day.key],
                        }));
                      }
                    }}
                    className={`
                      w-full rounded-2xl border p-4 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2
                      ${
                        selected
                          ? "border-black bg-black text-white shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }
                    `}
                    style={{ fontWeight: 600 }}
                  >
                    <span className="text-xs">{day.key}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full ${
                        selected
                          ? "bg-white/20 text-blue-300"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {selected ? "Selected" : "Off"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* PREFERRED TIME */}
          {/* ================================================= */}

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Preferred Time
              </h3>

              <p
                className="mt-1 text-xs text-slate-700 font-medium"
                style={{ fontWeight: 600 }}
              >
                Select the time of day you usually conduct mentoring sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {timeOptions.map((item) => {
                const active = availability.preferredTime === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setAvailability((prev) => ({
                        ...prev,
                        preferredTime: item.value,
                      }))
                    }
                    className={`
                      rounded-2xl border p-5 text-left transition-all duration-200 flex flex-col justify-between
                      ${
                        active
                          ? "border-black bg-black text-white shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                      }
                    `}
                    style={{ fontWeight: 600 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{item.emoji}</span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full ${
                          active
                            ? "bg-white/20 text-blue-300"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {active ? "Active" : "Select"}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold tracking-tight">
                        {item.value}
                      </h4>
                      <p
                        className={`text-[11px] mt-1 font-medium ${
                          active ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* SESSION TIMINGS */}
          {/* ================================================= */}

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Session Timings
              </h3>

              <p
                className="mt-1 text-xs text-slate-700 font-medium"
                style={{ fontWeight: 600 }}
              >
                Set the daily time window during which students can book
                sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* START */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Clock3 size={16} className="text-blue-600" />
                  <h4
                    className="text-xs font-semibold text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    Start Time
                  </h4>
                </div>

                <input
                  type="time"
                  value={availability.startTime}
                  onChange={(e) =>
                    setAvailability((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  style={{ fontWeight: 600 }}
                />
              </div>

              {/* END */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Clock3 size={16} className="text-blue-600" />
                  <h4
                    className="text-xs font-semibold text-slate-900"
                    style={{ fontWeight: 600 }}
                  >
                    End Time
                  </h4>
                </div>

                <input
                  type="time"
                  value={availability.endTime}
                  onChange={(e) =>
                    setAvailability((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  style={{ fontWeight: 600 }}
                />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TIMEZONE */}
          {/* ================================================= */}

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Timezone
              </h3>

              <p
                className="mt-1 text-xs text-slate-700 font-medium"
                style={{ fontWeight: 600 }}
              >
                Students from different countries will see your schedule in this
                timezone.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <Globe2 size={16} className="text-blue-600" />
                <h4
                  className="text-xs font-semibold text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  Select Timezone
                </h4>
              </div>

              <select
                value={availability.timezone}
                onChange={(e) =>
                  setAvailability((prev) => ({
                    ...prev,
                    timezone: e.target.value,
                  }))
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                style={{ fontWeight: 600 }}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">
                  America/Los_Angeles (PST)
                </option>
                <option value="Australia/Sydney">
                  Australia/Sydney (AEST)
                </option>
              </select>
            </div>
          </div>

          {/* ================================================= */}
          {/* SESSION DURATION */}
          {/* ================================================= */}

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                style={{ fontWeight: 600 }}
              >
                Session Duration
              </h3>

              <p
                className="mt-1 text-xs text-slate-700 font-medium"
                style={{ fontWeight: 600 }}
              >
                Choose how long each mentoring session should last.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {durations.map((duration) => {
                const selected = availability.sessionDuration === duration;

                return (
                  <button
                    key={duration}
                    type="button"
                    onClick={() =>
                      setAvailability((prev) => ({
                        ...prev,
                        sessionDuration: duration,
                      }))
                    }
                    className={`
                      rounded-2xl border p-4 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2
                      ${
                        selected
                          ? "border-black bg-black text-white shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                      }
                    `}
                    style={{ fontWeight: 600 }}
                  >
                    <span className="text-sm font-semibold">
                      {duration} Mins
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full ${
                        selected
                          ? "bg-white/20 text-blue-300"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {selected ? "Selected" : "Option"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <CheckCircle2 size={18} className="text-blue-400" />
              </div>
              <div>
                <h2
                  className="text-xs font-semibold uppercase tracking-wider text-slate-900"
                  style={{ fontWeight: 600 }}
                >
                  Availability Summary
                </h2>
                <p
                  className="text-[11px] text-slate-500 font-medium"
                  style={{ fontWeight: 600 }}
                >
                  Review your availability before saving the changes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Available Days
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {availability.availableDays.length} Days
                </h3>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Preferred Time
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900 truncate">
                  {availability.preferredTime || "--"}
                </h3>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Working Hours
                </p>
                <h3 className="mt-1 text-xs font-semibold text-slate-900 truncate">
                  {availability.startTime || "--"} -{" "}
                  {availability.endTime || "--"}
                </h3>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Session Duration
                </p>
                <h3 className="mt-1 text-base font-semibold text-emerald-600">
                  {availability.sessionDuration} mins
                </h3>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SAVE SECTION */}
          {/* ================================================= */}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-xs text-slate-500 font-medium"
              style={{ fontWeight: 600 }}
            >
              Changes will apply instantly to your calendar booking links.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>

              <button
                onClick={saveAvailability}
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-xs font-semibold text-white shadow-xs transition disabled:opacity-50"
                style={{ fontWeight: 600 }}
              >
                {saving ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} className="text-blue-400" />
                    Save Availability
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
