import { Calendar, ArrowRight, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisteredEvents = ({ events = [], loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm font-sans border border-slate-200">
        <div className="mb-6 flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-100 animate-pulse rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6 font-sans border border-slate-200">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
            Workshops & Webinars
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-black tracking-tight">
            Registered <span className="text-blue-600">Events</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
            Access your upcoming live sessions and expert webinars.
          </p>
        </div>

        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:self-auto"
        >
          Explore All Events
          <ArrowRight size={15} />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white">
          <Calendar className="mx-auto h-10 w-10 text-blue-600 mb-2" />
          <h3 className="font-bold text-black text-sm">
            No Event Registrations
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Register for upcoming tech talks and mock interview webinars.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((item) => {
            const event = item.event || item;
            const eventDate = event.startDateTime
              ? new Date(event.startDateTime).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Upcoming Date";

            return (
              <div
                key={event._id || item._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
                      <Calendar size={12} /> {eventDate}
                    </span>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                      {event.status || "Confirmed"}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-black mb-2 line-clamp-1">
                    {event.title || "Live Workshop"}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {event.description ||
                      "Join industry leaders for an exclusive interactive session."}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      <span>
                        {event.startDateTime
                          ? new Date(event.startDateTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-blue-600" />
                      <span>{event.location || "Online Virtual Room"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Speaker: {event.speaker || "Expert Panel"}
                  </span>
                  <button
                    onClick={() => navigate(`/event/${event._id}`)}
                    className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
                  >
                    View Details
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

export default RegisteredEvents;
