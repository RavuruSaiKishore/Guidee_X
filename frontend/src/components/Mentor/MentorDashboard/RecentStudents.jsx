import {
  Users,
  Mail,
  CalendarDays,
  BookOpenCheck,
  ArrowRight,
} from "lucide-react";

export default function RecentStudents({ students = [] }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg sm:rounded-3xl">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 border-b px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Recent Students
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Students you've recently mentored
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 sm:h-12 sm:w-12 sm:rounded-2xl">
          <Users className="text-orange-600" size={22} />
        </div>
      </div>

      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {students.length === 0 && (
        <div className="flex min-h-[260px] flex-col items-center justify-center px-4 py-10 text-center sm:min-h-[300px]">
          <Users size={50} className="text-gray-300 sm:h-[60px] sm:w-[60px]" />

          <h3 className="mt-4 text-lg font-semibold text-gray-700 sm:mt-5 sm:text-xl">
            No Students Yet
          </h3>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Students will appear here after bookings.
          </p>
        </div>
      )}

      {/* ==========================================
          MOBILE STUDENT CARDS
          Visible below md
      ========================================== */}

      {students.length > 0 && (
        <div className="space-y-4 p-4 md:hidden">
          {students.map((student) => {
            const profileImage = student.profileImage
              ? `${API_BASE_URL}/${student.profileImage}`.replace(
                  /([^:]\/)\/+/g,
                  "$1"
                )
              : "/default-avatar.png";

            return (
              <div
                key={student._id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-orange-300 hover:bg-white hover:shadow-md"
              >
                {/* Student Header */}

                <div className="flex items-start gap-3">
                  <img
                    src={profileImage}
                    alt={`${student.firstName || ""} ${student.lastName || ""}`}
                    className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="break-words font-semibold text-gray-800">
                      {student.firstName} {student.lastName}
                    </h4>

                    <p className="mt-0.5 text-xs text-gray-500">Student</p>
                  </div>

                  {/* Sessions */}

                  <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {student.totalSessions || 0} Sessions
                  </span>
                </div>

                {/* Details */}

                <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                  {/* Email */}

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 shrink-0 text-gray-400" />

                    <span className="min-w-0 break-all text-sm text-gray-600">
                      {student.email || "-"}
                    </span>
                  </div>

                  {/* Last Session */}

                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={16}
                      className="shrink-0 text-gray-400"
                    />

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">
                        Last Session
                      </span>

                      <span className="text-sm font-medium text-gray-700">
                        {student.lastSession
                          ? new Date(student.lastSession).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}

                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-[0.98]"
                >
                  View History
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================
          DESKTOP TABLE
          Visible md and above
      ========================================== */}

      {students.length > 0 && (
        <div className="hidden overflow-x-auto p-4 sm:p-6 md:block">
          <table className="min-w-full overflow-hidden rounded-xl border border-gray-200">
            {/* Table Header */}

            <thead className="bg-orange-50">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="whitespace-nowrap px-4 py-4 lg:px-5">Student</th>

                <th className="whitespace-nowrap px-4 py-4 lg:px-5">Email</th>

                <th className="whitespace-nowrap px-4 py-4 text-center lg:px-5">
                  Sessions
                </th>

                <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                  Last Session
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-center lg:px-5">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}

            <tbody className="divide-y divide-gray-200 bg-white">
              {students.map((student) => {
                const profileImage = student.profileImage
                  ? `${API_BASE_URL}/${student.profileImage}`.replace(
                      /([^:]\/)\/+/g,
                      "$1"
                    )
                  : "/default-avatar.png";

                return (
                  <tr
                    key={student._id}
                    className="transition hover:bg-orange-50"
                  >
                    {/* Student */}

                    <td className="px-4 py-4 lg:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={profileImage}
                          alt={`${student.firstName || ""} ${
                            student.lastName || ""
                          }`}
                          className="h-11 w-11 shrink-0 rounded-full border object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />

                        <div className="min-w-0">
                          <h4 className="truncate font-semibold text-gray-800">
                            {student.firstName} {student.lastName}
                          </h4>

                          <p className="text-xs text-gray-500">Student</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="max-w-[220px] px-4 py-4 text-sm text-gray-600 lg:px-5">
                      <span className="block truncate">
                        {student.email || "-"}
                      </span>
                    </td>

                    {/* Sessions */}

                    <td className="px-4 py-4 text-center lg:px-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {student.totalSessions || 0}
                      </span>
                    </td>

                    {/* Last Session */}

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 lg:px-5">
                      {student.lastSession
                        ? new Date(student.lastSession).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Action */}

                    <td className="px-4 py-4 text-center lg:px-5">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600 lg:px-4"
                      >
                        View History
                        <ArrowRight size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
