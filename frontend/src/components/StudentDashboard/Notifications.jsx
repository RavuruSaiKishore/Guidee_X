import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle,
  IndianRupee,
  Star,
  Video,
  XCircle,
} from "lucide-react";

const iconMap = {
  success: CheckCircle,
  session: CalendarDays,
  meeting: Video,
  cancelled: XCircle,
  mentor: Star,
  payment: IndianRupee,
};

const colorMap = {
  success: "bg-emerald-100 text-emerald-600",
  session: "bg-blue-100 text-blue-600",
  meeting: "bg-purple-100 text-purple-600",
  cancelled: "bg-red-100 text-red-600",
  mentor: "bg-yellow-100 text-yellow-600",
  payment: "bg-indigo-100 text-indigo-600",
};

const fallbackNotifications = [
  {
    id: 1,
    type: "session",
    title: "Upcoming Mentorship Session",
    message: "Your upcoming mentorship session is scheduled soon.",
    time: "Recently",
    read: false,
  },
];

const Notifications = ({ notifications = [] }) => {
  const notificationList =
    Array.isArray(notifications) && notifications.length > 0
      ? notifications
      : fallbackNotifications;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
          <Bell size={23} className="text-blue-600" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Stay Updated
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of your latest activities.
          </p>
        </div>
      </div>

      {notificationList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
          <Bell size={34} className="mx-auto text-slate-300" />

          <h3 className="mt-4 font-bold text-slate-900">No Notifications</h3>

          <p className="mt-1 text-sm text-slate-500">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificationList.map((item, index) => {
            const type = item?.type || "default";

            const Icon = iconMap[type] || AlertCircle;

            const iconColor = colorMap[type] || "bg-slate-100 text-slate-600";

            const key = item?._id || item?.id || `${type}-${index}`;

            return (
              <div
                key={key}
                className={`flex gap-4 rounded-2xl border p-4 transition hover:shadow-sm ${
                  !item?.read
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconColor}`}
                >
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-bold text-slate-900">
                      {item?.title || "Notification"}
                    </h3>

                    {!item?.read && (
                      <span className="w-fit rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item?.message || "You have a new notification."}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {item?.time || "Recently"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Notifications;
