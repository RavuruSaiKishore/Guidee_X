import { CalendarDays, Clock3, UserRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpcomingEvents = ({ events = [], registrations = [] }) => {
  const navigate = useNavigate();

  const registeredEventIds = registrations.map((registration) =>
    registration.event?._id?.toString()
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            Community & Events
          </p>

          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Upcoming Events
          </h2>

          <p className="mt-2 text-gray-500">
            Learn from industry experts and grow your professional network.
          </p>
        </div>

        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
        >
          View All
          <ArrowRight size={18} />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 p-10 text-center">
          <CalendarDays className="mx-auto text-gray-400" size={40} />

          <h3 className="mt-4 font-bold text-gray-900">No Upcoming Events</h3>

          <p className="mt-1 text-gray-500">Check back later for new events.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.slice(0, 3).map((event) => {
            const isRegistered = registeredEventIds.includes(
              event._id?.toString()
            );

            return (
              <div
                key={event._id}
                className="overflow-hidden rounded-3xl border border-gray-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {event.bannerImage ? (
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                    <CalendarDays size={42} />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {event.status}
                    </span>

                    {isRegistered && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Registered
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(event.startDateTime)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {formatTime(event.startDateTime)}
                    </div>

                    <div className="flex items-center gap-2">
                      <UserRound size={16} />
                      {event.speaker}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 py-3 font-semibold text-purple-600 hover:bg-purple-50"
                  >
                    View Event
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;
