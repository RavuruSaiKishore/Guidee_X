import { GraduationCap, Star, CheckCircle2, Sparkles } from "lucide-react";

const StudentCard = ({ student }) => {
  const completedSessions = student?.completedSessions ?? 0;
  const averageRating = Number(student?.averageRating ?? 5).toFixed(1);

  const initials = `${student?.firstName?.charAt(0) || ""}${
    student?.lastName?.charAt(0) || ""
  }`;

  return (
    <div
      className="
        relative
        w-60
        overflow-hidden
        rounded-2xl
        bg-gradient-to-br
        from-blue-600
        via-indigo-600
        to-purple-700
        p-[1px]
        transition-all
        duration-300
        hover:-translate-y-2
        hover:scale-105
        hover:shadow-2xl
      "
    >
      <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-5">
        {/* Decorative Background */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl"></div>
        <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl"></div>

        {/* Top */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg">
            {initials}
          </div>

          <Sparkles className="text-blue-500" size={20} />
        </div>

        {/* Name */}
        <div className="mt-4 flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">
            {student?.firstName} {student?.lastName}
          </h3>

          <CheckCircle2 size={18} className="text-blue-600" />
        </div>

        <p className="mt-1 text-xs text-gray-500">GuideX Student</p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <GraduationCap size={18} className="mx-auto text-blue-600" />

            <p className="mt-2 text-xl font-bold text-gray-900">
              {completedSessions}
            </p>

            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Sessions
            </p>
          </div>

          <div className="rounded-xl bg-yellow-50 p-3 text-center">
            <Star
              size={18}
              className="mx-auto fill-yellow-500 text-yellow-500"
            />

            <p className="mt-2 text-xl font-bold text-gray-900">
              {averageRating}
            </p>

            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Rating
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-center text-xs font-semibold text-white">
          ⭐ Top Community Learner
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
