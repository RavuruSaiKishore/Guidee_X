import { toast } from "react-toastify";
import { Check, Info } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Availability = ({ formData, updateForm }) => {
  // ===============================
  // Handle Normal Inputs
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      typeof value === "string" && value.startsWith(" ")
        ? value.trimStart()
        : value;

    const updatedData = {
      ...formData,
      [name]: name === "sessionDuration" ? Number(updatedValue) : updatedValue,
    };

    if (
      updatedData.startTime &&
      updatedData.endTime &&
      updatedData.startTime >= updatedData.endTime
    ) {
      toast.dismiss("availability-time");

      toast.error("End time must be after start time.", {
        toastId: "availability-time",
      });

      return;
    }

    updateForm(updatedData);
  };

  // ===============================
  // Handle Day Selection
  // ===============================
  const toggleDay = (day) => {
    let selectedDays = [...formData.availableDays];

    if (selectedDays.includes(day)) {
      selectedDays = selectedDays.filter((d) => d !== day);
    } else {
      selectedDays = [...selectedDays, day].sort(
        (a, b) => DAYS.indexOf(a) - DAYS.indexOf(b)
      );
    }

    updateForm({
      availableDays: selectedDays,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h2 className="text-3xl font-bold text-gray-900">Availability</h2>

        <p className="mt-2 text-gray-500">
          Choose your mentoring schedule and availability preferences.
        </p>
      </div>

      {/* Main Card */}

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Available Days */}

        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Available Days
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Select the days you are available to mentor.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day) => {
              const selected = formData.availableDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 transition-all duration-200

                    ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border

                      ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                  >
                    {selected && <Check size={14} />}
                  </div>

                  <span className="text-sm font-medium">{day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue with Preferred Time */}
        {/* ============================
            FORM GRID
        ============================ */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Preferred Time */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Preferred Time
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select Preferred Time</option>

              <option value="Morning">Morning (6:00 AM - 12:00 PM)</option>

              <option value="Afternoon">Afternoon (12:00 PM - 5:00 PM)</option>

              <option value="Evening">Evening (5:00 PM - 9:00 PM)</option>

              <option value="Night">Night (9:00 PM - 12:00 AM)</option>
            </select>
          </div>

          {/* Start Time */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Start Time
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* End Time */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              End Time
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="time"
              name="endTime"
              disabled={!formData.startTime}
              value={formData.endTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Time Zone */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Time Zone
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (GMT +05:30)</option>

              <option value="Asia/Dubai">Asia/Dubai (GMT +04:00)</option>

              <option value="Asia/Singapore">
                Asia/Singapore (GMT +08:00)
              </option>

              <option value="Europe/London">Europe/London (GMT +00:00)</option>

              <option value="America/New_York">
                America/New_York (GMT -05:00)
              </option>

              <option value="Australia/Sydney">
                Australia/Sydney (GMT +10:00)
              </option>

              <option value="UTC">UTC (GMT +00:00)</option>
            </select>
          </div>

          {/* Session Duration */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Session Duration
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              name="sessionDuration"
              value={formData.sessionDuration}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value={15}>15 Minutes</option>

              <option value={30}>30 Minutes</option>

              <option value={45}>45 Minutes</option>

              <option value={60}>60 Minutes</option>

              <option value={90}>90 Minutes</option>

              <option value={120}>120 Minutes</option>
            </select>
          </div>
        </div>

        {/* Continue with Note Section */}
        {/* ============================
            INFORMATION CARD
        ============================ */}

        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <Info size={24} />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
                />
            </div>                                                                                                        

            {/* Text */}

            <div>
              <h4 className="text-lg font-semibold text-blue-800">Note</h4>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                Your availability helps students find suitable mentoring
                sessions. Choose the days and times you can consistently attend.
                You can update your schedule later from your mentor dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* ============================
            TIME VALIDATION MESSAGE
        ============================ */}

        {formData.startTime &&
          formData.endTime &&
          formData.startTime >= formData.endTime && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              End time must be later than the start time.
            </div>
          )}
      </div>
    </div>
  );
};

export default Availability;
