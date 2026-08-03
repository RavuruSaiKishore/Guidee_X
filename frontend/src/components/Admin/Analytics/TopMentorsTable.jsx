import { Star, BadgeCheck } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TopMentorsTable({ mentors = [] }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200">
      {/* Header */}

      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Top Mentors</h2>

          <p className="text-gray-500 mt-1">
            Highest performing mentors on the platform
          </p>
        </div>

        <BadgeCheck className="text-emerald-600" size={32} />
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Mentor
              </th>

              <th className="text-center px-4 py-4 font-semibold text-gray-600">
                Bookings
              </th>

              <th className="text-center px-4 py-4 font-semibold text-gray-600">
                Rating
              </th>

              <th className="text-center px-4 py-4 font-semibold text-gray-600">
                Revenue
              </th>

              <th className="text-center px-4 py-4 font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {mentors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  No mentor data available.
                </td>
              </tr>
            ) : (
              mentors.map((mentor) => (
                <tr
                  key={mentor._id}
                  className="border-b last:border-0 hover:bg-slate-50 transition"
                >
                  {/* Mentor */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          mentor.profileImage
                            ? `${API_BASE_URL}/${mentor.profileImage}`
                            : "/default-avatar.png"
                        }
                        alt={`${mentor.firstName} ${mentor.lastName}`}
                        className="w-14 h-14 rounded-2xl object-cover border"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {mentor.firstName} {mentor.lastName}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {mentor.profession}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Bookings */}

                  <td className="text-center">
                    <span className="font-bold text-blue-600 text-lg">
                      {mentor.bookings}
                    </span>
                  </td>

                  {/* Rating */}

                  <td>
                    <div className="flex justify-center items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />

                      <span className="font-semibold">
                        {mentor.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Revenue */}

                  <td className="text-center font-semibold text-green-600">
                    ₹{mentor.revenue.toLocaleString("en-IN")}
                  </td>

                  {/* Status */}

                  <td className="text-center">
                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold

                        ${
                          mentor.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {mentor.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
