import { Star, MessageSquare } from "lucide-react";

export default function RatingDistribution({
  data = [],
  averageRating = 0,
  totalReviews = 0,
}) {
  // Total reviews from distribution
  const total = totalReviews || data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Rating Distribution
          </h2>

          <p className="text-gray-500 mt-1">Mentor reviews and feedback</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
          <Star className="text-yellow-500 fill-yellow-500" size={28} />
        </div>
      </div>

      {/* Overall Rating */}

      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl bg-yellow-50 p-5">
          <p className="text-gray-500 text-sm">Average Rating</p>

          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-4xl font-bold text-yellow-600">
              {Number(averageRating).toFixed(1)}
            </h2>

            <Star className="text-yellow-500 fill-yellow-500" size={24} />
          </div>
        </div>

        <div className="rounded-2xl bg-blue-50 p-5">
          <p className="text-gray-500 text-sm">Total Reviews</p>

          <div className="flex items-center gap-3 mt-2">
            <MessageSquare className="text-blue-600" size={22} />

            <h2 className="text-3xl font-bold text-blue-700">{total}</h2>
          </div>
        </div>
      </div>

      {/* Distribution */}

      <div className="space-y-5">
        {data.map((item) => {
          const percentage = total === 0 ? 0 : (item.count / total) * 100;

          return (
            <div key={item.rating}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.rating}</span>

                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                </div>

                <div className="text-sm text-gray-500">
                  {item.count} Reviews
                </div>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="text-right text-xs text-gray-500 mt-1">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
