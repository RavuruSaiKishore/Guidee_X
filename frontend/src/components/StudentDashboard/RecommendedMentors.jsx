import { ArrowRight, Briefcase, IndianRupee, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RecommendedMentors = () => {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_BASE_URL = API_BASE_URL?.replace(/\/api\/?$/, "").replace(
    /\/$/,
    ""
  );

  const getProfileImage = (image, firstName, lastName) => {
    const name = `${firstName || "Mentor"} ${lastName || ""}`.trim();

    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=2563eb&color=fff`;

    if (!image) return fallback;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${BACKEND_BASE_URL}/${image.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("UserToken");

        const response = await fetch(`${API_BASE_URL}/api/mentor/allMentors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setMentors((data.mentors || []).slice(0, 4));
        }
      } catch (error) {
        console.error("Mentor fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[380px] animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Find Your Guide
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Recommended Mentors
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Connect with experienced professionals.
          </p>
        </div>

        <button
          onClick={() => navigate("/mentors")}
          className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:self-auto"
        >
          Explore All
          <ArrowRight size={16} />
        </button>
      </div>

      {mentors.length === 0 ? (
        <div className="py-10 text-center">
          <h3 className="font-bold text-slate-900">No Mentors Available</h3>

          <p className="mt-1 text-sm text-slate-500">
            Please check again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mentors.map((mentor) => {
            const image = getProfileImage(
              mentor.profileImage,
              mentor.firstName,
              mentor.lastName
            );

            const skills = mentor.primarySkill || mentor.skills || [];

            return (
              <article
                key={mentor._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                <div className="relative px-5 pb-5">
                  <img
                    src={image}
                    alt={`${mentor.firstName || ""} ${mentor.lastName || ""}`}
                    className="-mt-10 mx-auto h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
                    onError={(event) => {
                      event.currentTarget.onerror = null;

                      event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${mentor.firstName || "Mentor"} ${
                          mentor.lastName || ""
                        }`
                      )}&background=2563eb&color=fff`;
                    }}
                  />

                  <div className="mt-3 text-center">
                    <h3 className="font-bold text-slate-900">
                      {mentor.firstName} {mentor.lastName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {mentor.profession || "Mentor"}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1 text-sm">
                    <Star size={16} className="fill-amber-400 text-amber-400" />

                    <span className="font-bold">
                      {mentor.averageRating || 0}
                    </span>

                    <span className="text-slate-400">
                      ({mentor.totalReviews || 0})
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600">
                    <Briefcase size={16} className="text-blue-600" />
                    {mentor.experience || 0} Years Experience
                  </div>

                  <div className="mt-3 flex min-h-7 flex-wrap justify-center gap-1.5">
                    {skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1">
                    <IndianRupee size={17} className="text-emerald-600" />

                    <span className="text-xl font-extrabold text-emerald-600">
                      {mentor.pricing?.sessionPrice || mentor.sessionPrice || 0}
                    </span>

                    <span className="text-xs text-slate-400">/ session</span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => navigate(`/mentor/profile/${mentor._id}`)}
                      className="flex-1 rounded-xl border border-blue-600 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/mentor/booking/${mentor._id}`)}
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecommendedMentors;
