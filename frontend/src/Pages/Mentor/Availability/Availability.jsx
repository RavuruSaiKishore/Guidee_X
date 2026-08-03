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
        className="
          min-h-screen
          w-full
          overflow-x-hidden
          bg-gray-50
          px-3
          pt-20
          pb-6
          sm:px-5
          sm:pt-20
          lg:ml-64
          lg:w-[calc(100%-16rem)]
          lg:px-6
          lg:py-8
          xl:px-8
        "
      >
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-emerald-100 sm:h-16 sm:w-16" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-emerald-600 sm:h-16 sm:w-16" />
          </div>

          <p className="mt-6 text-base font-semibold text-gray-700 sm:text-lg">
            Loading Availability...
          </p>

          <p className="mt-1 max-w-xs text-center text-sm text-gray-400">
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
        className="
          min-h-screen
          w-full
          overflow-x-hidden
          bg-gray-50
          px-3
          pt-20
          pb-6
          sm:px-5
          sm:pt-20
          sm:pb-8
          lg:ml-64
          lg:w-[calc(100%-16rem)]
          lg:px-6
          lg:py-8
          xl:px-8
        "
      >
        <div className="mx-auto w-full max-w-[1600px]">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-emerald-600
                via-green-600
                to-teal-600
                p-4
                text-white
                shadow-xl
                sm:rounded-3xl
                sm:p-6
                lg:p-8
              "
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-72 sm:w-72" />

              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-5
                  sm:gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                {/* LEFT */}

                <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/20
                      bg-white/15
                      backdrop-blur-md
                      sm:h-16
                      sm:w-16
                      sm:rounded-2xl
                    "
                  >
                    <CalendarDays size={23} className="sm:h-8 sm:w-8" />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                      Mentor Availability
                    </h1>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-emerald-100 sm:mt-2 sm:text-sm sm:leading-6">
                      This is the availability students currently see while
                      booking your mentorship sessions.
                    </p>
                  </div>
                </div>

                {/* RIGHT */}

                <button
                  onClick={() => setIsEditing(true)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-emerald-700
                    shadow-lg
                    transition
                    hover:shadow-xl
                    sm:w-auto
                    sm:rounded-2xl
                    sm:px-6
                    sm:text-base
                  "
                >
                  <Pencil size={17} />
                  Edit Availability
                </button>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* OVERVIEW */}
          {/* ================================================= */}

          <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-2">
            {/* WEEKLY AVAILABILITY */}

            <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Weekly Availability
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Students can schedule sessions on these days.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
                {availability.availableDays.length > 0 ? (
                  availability.availableDays.map((day) => (
                    <span
                      key={day}
                      className="
                        rounded-full
                        bg-emerald-100
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-emerald-700
                        sm:px-4
                        sm:text-sm
                      "
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">
                    No availability selected.
                  </span>
                )}
              </div>
            </div>

            {/* SESSION INFORMATION */}

            <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Session Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your current mentoring preferences.
              </p>

              <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                {/* PREFERRED TIME */}

                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Preferred Time
                    </p>

                    <h3 className="mt-1 truncate text-base font-bold text-gray-800 sm:text-lg">
                      {availability.preferredTime || "-"}
                    </h3>
                  </div>

                  <div className="shrink-0 text-2xl sm:text-3xl">🌇</div>
                </div>

                {/* WORKING HOURS */}

                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Working Hours
                    </p>

                    <h3 className="mt-1 truncate text-base font-bold text-gray-800 sm:text-lg">
                      {availability.startTime && availability.endTime
                        ? `${availability.startTime} - ${availability.endTime}`
                        : "-"}
                    </h3>
                  </div>

                  <div className="shrink-0 text-2xl sm:text-3xl">🕐</div>
                </div>

                {/* TIMEZONE */}

                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">Timezone</p>

                    <h3 className="break-words text-sm font-bold text-gray-800 sm:text-lg">
                      {availability.timezone || "-"}
                    </h3>
                  </div>

                  <div className="shrink-0 text-2xl sm:text-3xl">🌍</div>
                </div>

                {/* DURATION */}

                <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Session Duration
                    </p>

                    <h3 className="mt-1 text-base font-bold text-gray-800 sm:text-lg">
                      {availability.sessionDuration
                        ? `${availability.sessionDuration} Minutes`
                        : "-"}
                    </h3>
                  </div>

                  <div className="shrink-0 text-2xl sm:text-3xl">⏱</div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="mt-5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:mt-6 sm:rounded-3xl sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Availability Summary
            </h2>

            <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {/* AVAILABLE DAYS */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Available Days
                </p>

                <h2 className="mt-2 text-2xl font-bold text-emerald-600 sm:text-3xl">
                  {availability.availableDays.length}
                </h2>
              </div>

              {/* PREFERRED TIME */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Preferred Time
                </p>

                <h2 className="mt-2 truncate text-lg font-bold text-blue-600 sm:text-xl">
                  {availability.preferredTime || "-"}
                </h2>
              </div>

              {/* TIMEZONE */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-xs text-gray-500 sm:text-sm">Timezone</p>

                <h2 className="mt-2 break-words text-sm font-bold text-purple-600 sm:text-base">
                  {availability.timezone || "-"}
                </h2>
              </div>

              {/* DURATION */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Session Duration
                </p>

                <h2 className="mt-2 text-xl font-bold text-orange-600 sm:text-2xl">
                  {availability.sessionDuration
                    ? `${availability.sessionDuration} min`
                    : "-"}
                </h2>
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
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-gray-50
        px-3
        pt-20
        pb-6
        sm:px-5
        sm:pt-20
        sm:pb-8
        lg:ml-64
        lg:w-[calc(100%-16rem)]
        lg:px-6
        lg:py-8
        xl:px-8
      "
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-emerald-600
              via-green-600
              to-teal-600
              p-4
              text-white
              shadow-xl
              sm:rounded-3xl
              sm:p-6
              lg:p-8
            "
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-56 sm:w-56" />

            <div
              className="
                relative
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-center
                lg:justify-between
                lg:gap-8
              "
            >
              {/* LEFT */}

              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/20
                    bg-white/15
                    backdrop-blur-md
                    sm:h-20
                    sm:w-20
                    sm:rounded-3xl
                  "
                >
                  <CalendarDays size={26} className="sm:h-9 sm:w-9" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Mentor Availability
                  </h1>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-emerald-100 sm:mt-2 sm:text-sm sm:leading-6 lg:text-base">
                    Manage your weekly schedule, preferred timings, session
                    duration and timezone so students can book sessions only
                    when you're available.
                  </p>
                </div>
              </div>

              {/* STATS */}

              <div className="grid w-full grid-cols-2 gap-2 sm:gap-4 lg:w-auto lg:min-w-[300px]">
                <div className="rounded-xl border border-white/20 bg-white/15 p-3 backdrop-blur-md sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock3 size={20} className="shrink-0 sm:h-7 sm:w-7" />

                    <div className="min-w-0">
                      <p className="text-[10px] text-emerald-100 sm:text-sm">
                        Available Days
                      </p>

                      <h2 className="text-xl font-bold sm:text-3xl">
                        {availability.availableDays.length}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/20 bg-white/15 p-3 backdrop-blur-md sm:rounded-2xl sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <TimerReset size={20} className="shrink-0 sm:h-7 sm:w-7" />

                    <div className="min-w-0">
                      <p className="text-[10px] text-emerald-100 sm:text-sm">
                        Session
                      </p>

                      <h2 className="text-xl font-bold sm:text-3xl">
                        {availability.sessionDuration}m
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:rounded-3xl sm:p-6 lg:p-8">
          {/* CONTENT HEADER */}

          <div className="mb-7 sm:mb-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Configure Your Availability
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-500">
              Select your available days, preferred time, session duration and
              timezone. Students will only be able to book during these
              available slots.
            </p>
          </div>

          {/* ================================================= */}
          {/* AVAILABLE DAYS */}
          {/* ================================================= */}

          <div className="mb-8 sm:mb-10">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                Available Days
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Choose the days when students can book sessions with you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-7">
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
                      group
                      min-w-0
                      rounded-xl
                      border
                      p-3
                      transition-all
                      duration-300
                      sm:rounded-2xl
                      sm:p-4
                      lg:p-5
                      ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          text-xs
                          font-bold
                          sm:h-14
                          sm:w-14
                          sm:text-lg
                          ${
                            selected
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-700 group-hover:bg-emerald-100"
                          }
                        `}
                      >
                        {day.short}
                      </div>

                      <p
                        className={`
                          mt-2
                          text-xs
                          font-semibold
                          sm:mt-4
                          sm:text-sm
                          ${selected ? "text-emerald-700" : "text-gray-700"}
                        `}
                      >
                        {day.key}
                      </p>

                      <div className="mt-2 sm:mt-3">
                        {selected ? (
                          <span className="rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white sm:px-3 sm:text-xs">
                            Selected
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500 sm:px-3 sm:text-xs">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* PREFERRED TIME */}
          {/* ================================================= */}

          <div className="mb-8 sm:mb-10">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                Preferred Time
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Select the time of day you usually conduct mentoring sessions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
                      min-w-0
                      rounded-xl
                      border
                      p-4
                      text-left
                      transition-all
                      duration-300
                      sm:rounded-2xl
                      sm:p-6
                      ${
                        active
                          ? "border-emerald-500 bg-emerald-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                      }
                    `}
                  >
                    <div className="text-3xl sm:text-4xl">{item.emoji}</div>

                    <h4
                      className={`
                        mt-3
                        text-base
                        font-bold
                        sm:mt-5
                        sm:text-lg
                        ${active ? "text-emerald-700" : "text-gray-800"}
                      `}
                    >
                      {item.value}
                    </h4>

                    <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                      {item.desc}
                    </p>

                    {active && (
                      <div className="mt-3 inline-flex rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white sm:mt-5 sm:px-4 sm:text-xs">
                        Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* SESSION TIMINGS */}
          {/* ================================================= */}

          <div className="mb-8 sm:mb-10">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                Session Timings
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Set the daily time window during which students can book
                sessions.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              {/* START */}

              <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-md sm:rounded-2xl sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 sm:h-12 sm:w-12">
                    <Clock3 className="text-emerald-600" size={20} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800">Start Time</h4>

                    <p className="text-xs text-gray-500 sm:text-sm">
                      Beginning of your availability.
                    </p>
                  </div>
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
                  className="
                    mt-5
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    text-gray-700
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-100
                    sm:mt-6
                    sm:h-14
                  "
                />
              </div>

              {/* END */}

              <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:shadow-md sm:rounded-2xl sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 sm:h-12 sm:w-12">
                    <Clock3 className="text-red-600" size={20} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800">End Time</h4>

                    <p className="text-xs text-gray-500 sm:text-sm">
                      Last booking time for students.
                    </p>
                  </div>
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
                  className="
                    mt-5
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    text-gray-700
                    outline-none
                    transition
                    focus:border-red-500
                    focus:ring-4
                    focus:ring-red-100
                    sm:mt-6
                    sm:h-14
                  "
                />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TIMEZONE */}
          {/* ================================================= */}

          <div className="mb-8 sm:mb-10">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                Timezone
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Students from different countries will see your schedule in this
                timezone.
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:rounded-2xl sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 sm:h-12 sm:w-12">
                  <Globe2 className="text-blue-600" size={20} />
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800">Select Timezone</h4>

                  <p className="text-xs text-gray-500 sm:text-sm">
                    Your availability will be converted automatically for
                    students.
                  </p>
                </div>
              </div>

              <select
                value={availability.timezone}
                onChange={(e) =>
                  setAvailability((prev) => ({
                    ...prev,
                    timezone: e.target.value,
                  }))
                }
                className="
                  mt-5
                  h-12
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-3
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  sm:mt-6
                  sm:h-14
                  sm:px-4
                "
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

          <div className="mb-8 sm:mb-10">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-lg font-bold text-gray-800 sm:text-xl">
                Session Duration
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Choose how long each mentoring session should last.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
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
                      min-w-0
                      rounded-xl
                      border
                      p-4
                      transition-all
                      duration-300
                      sm:rounded-2xl
                      sm:p-6
                      ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex justify-center">
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-full
                          text-sm
                          font-bold
                          sm:h-16
                          sm:w-16
                          sm:text-xl
                          ${
                            selected
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {duration}
                      </div>
                    </div>

                    <h4
                      className={`
                        mt-3
                        text-center
                        text-sm
                        font-bold
                        sm:mt-5
                        sm:text-lg
                        ${selected ? "text-emerald-700" : "text-gray-800"}
                      `}
                    >
                      {duration} Minutes
                    </h4>

                    <p className="mt-1 text-center text-xs text-gray-500 sm:mt-2 sm:text-sm">
                      Session length
                    </p>

                    {selected && (
                      <div className="mt-3 flex justify-center sm:mt-5">
                        <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white sm:px-4 sm:text-xs">
                          Selected
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-4 sm:rounded-3xl sm:p-6 lg:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white sm:h-14 sm:w-14 sm:rounded-2xl">
                <CheckCircle2 size={23} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                  Availability Summary
                </h2>

                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Review your availability before saving the changes.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {/* DAYS */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                  Available Days
                </p>

                <h3 className="mt-2 text-2xl font-bold text-emerald-600 sm:text-3xl">
                  {availability.availableDays.length}
                </h3>

                <p className="mt-2 break-words text-xs leading-5 text-gray-500 sm:text-sm">
                  {availability.availableDays.length > 0
                    ? availability.availableDays.join(", ")
                    : "No days selected"}
                </p>
              </div>

              {/* PREFERRED TIME */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                  Preferred Time
                </p>

                <h3 className="mt-2 text-xl font-bold text-blue-600 sm:text-2xl">
                  {availability.preferredTime || "--"}
                </h3>

                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  Preferred mentoring period
                </p>
              </div>

              {/* HOURS */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                  Working Hours
                </p>

                <h3 className="mt-2 break-words text-lg font-bold text-purple-600 sm:text-xl">
                  {availability.startTime || "--:--"} -{" "}
                  {availability.endTime || "--:--"}
                </h3>

                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  Daily availability
                </p>
              </div>

              {/* DURATION */}

              <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                  Session Duration
                </p>

                <h3 className="mt-2 text-2xl font-bold text-orange-600 sm:text-3xl">
                  {availability.sessionDuration}
                </h3>

                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  Minutes per session
                </p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SAVE SECTION */}
          {/* ================================================= */}

          <div className="mt-6 sm:mt-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:rounded-3xl sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Ready to Save?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm">
                    Your updated schedule will immediately be used for future
                    student bookings.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      sm:w-auto
                      sm:px-6
                      sm:py-4
                    "
                  >
                    <ArrowLeft size={18} />
                    Cancel
                  </button>

                  <button
                    onClick={saveAvailability}
                    disabled={saving}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-emerald-600
                      to-green-600
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:shadow-xl
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                      sm:w-auto
                      sm:px-8
                      sm:py-4
                      sm:text-base
                    "
                  >
                    <Save size={20} />

                    {saving ? "Saving..." : "Save Availability"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
