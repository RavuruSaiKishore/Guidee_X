import {
  CheckCircle2,
  AlertCircle,
  User,
  FileText,
  GraduationCap,
  ShieldCheck,
  Clock3,
} from "lucide-react";

export default function ProfileCompletion({ mentor, percentage = 0 }) {
  const checklist = [
    {
      title: "Profile Image",
      completed: !!mentor?.profileImage,
      icon: User,
    },
    {
      title: "Resume",
      completed: !!mentor?.resume,
      icon: FileText,
    },
    {
      title: "Degree Certificate",
      completed: !!mentor?.degreeCertificate,
      icon: GraduationCap,
    },
    {
      title: "Government ID",
      completed: !!mentor?.governmentId,
      icon: ShieldCheck,
    },
    {
      title: "Availability",
      completed: !!mentor?.availability?.availableDays?.length,
      icon: Clock3,
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
          Profile Completion
        </h2>

        <p className="mt-1 max-w-lg text-xs leading-relaxed text-gray-500 sm:text-sm">
          Complete your profile to attract more students.
        </p>
      </div>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <div className="p-4 sm:p-5 md:p-6">
        {/* ==========================================
            PROGRESS
        ========================================== */}

        <div className="flex justify-center">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28">
            <svg
              className="h-24 w-24 -rotate-90 sm:h-28 sm:w-28"
              viewBox="0 0 120 120"
            >
              {/* Background Circle */}

              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="9"
              />

              {/* Progress Circle */}

              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray="327"
                strokeDashoffset={
                  327 - (327 * Math.min(Math.max(percentage, 0), 100)) / 100
                }
                className="transition-all duration-700"
              />
            </svg>

            {/* Percentage */}

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {percentage}%
              </h3>

              <p className="text-[10px] text-gray-500 sm:text-xs">Completed</p>
            </div>
          </div>
        </div>

        {/* ==========================================
            CHECKLIST
        ========================================== */}

        <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
          {checklist.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-3 transition hover:bg-gray-50 sm:px-4"
              >
                {/* Left */}

                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  {/* Icon */}

                  <div
                    className={`shrink-0 rounded-lg p-1.5 sm:p-2 ${
                      item.completed ? "bg-green-100" : "bg-orange-100"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        item.completed ? "text-green-600" : "text-orange-600"
                      }
                    />
                  </div>

                  {/* Title */}

                  <span className="truncate text-xs font-medium text-gray-700 sm:text-sm">
                    {item.title}
                  </span>
                </div>

                {/* Status */}

                <div className="shrink-0">
                  {item.completed ? (
                    <CheckCircle2
                      size={18}
                      className="text-green-500 sm:h-5 sm:w-5"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="text-orange-500 sm:h-5 sm:w-5"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="mt-5 rounded-xl bg-amber-50 p-3.5 sm:mt-6 sm:p-4">
          <h3 className="text-xs font-semibold text-amber-700 sm:text-sm">
            Why complete your profile?
          </h3>

          <ul className="mt-2 space-y-1.5 pl-4 text-[11px] leading-relaxed text-gray-600 sm:text-xs">
            <li>Increase profile visibility.</li>
            <li>Build trust with students.</li>
            <li>Improve booking conversion.</li>
            <li>Complete verification faster.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
