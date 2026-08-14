import {
  Star,
  CheckCircle,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MentorSection = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // =====================================================
  // FETCH MENTORS
  // =====================================================

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/mentor/allMentors`);
      const data = await res.json();

      if (res.ok) {
        setMentors((data.mentors || []).slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getImage = (mentor) => {
    const profileImage = mentor?.profileImage;

    if (!profileImage) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${mentor?.firstName || ""} ${mentor?.lastName || ""}`.trim()
      )}&background=000000&color=ffffff&size=200`;
    }

    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    const cleanImagePath = profileImage.replace(/^\/+/, "");

    return `${API_BASE_URL.replace(/\/+$/, "")}/${cleanImagePath}`;
  };

  const getSkills = (mentor) => {
    if (Array.isArray(mentor?.primarySkill)) {
      return mentor.primarySkill.slice(0, 1);
    }
    return mentor?.primarySkill ? [mentor.primarySkill] : [];
  };

  const getFallbackImage = (mentor) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${mentor?.firstName || ""} ${mentor?.lastName || ""}`.trim()
    )}&background=000000&color=ffffff&size=200`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20 font-sans">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider text-black uppercase">
              OUR EXPERT MENTORS
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl">
              Learn From <span className="text-black">Industry Leaders</span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
              Get personalized guidance, mock interviews, and career roadmaps
              from top professionals.
            </p>
          </div>

          {/* Desktop View All */}
          <button
            onClick={() => navigate("/mentors")}
            className="group hidden shrink-0 items-center gap-2 rounded-xl border border-black bg-white px-5 py-3 text-xs font-bold text-black shadow-sm transition-all hover:bg-black hover:text-white md:flex"
          >
            View All Mentors
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[400px] animate-pulse rounded-2xl bg-slate-100 border border-black"
              />
            ))}
          </div>
        ) : mentors.length > 0 ? (
          <>
            {/* DESKTOP / TABLET CARDS (Clean Minimalist White & Black Card UI matching your reference layout) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mentors.map((mentor) => {
                const skills = getSkills(mentor);
                const image = getImage(mentor);

                return (
                  <div
                    key={mentor._id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:block text-center"
                  >
                    <div>
                      {/* Circular Profile Image */}
                      <div className="mx-auto flex justify-center pt-2">
                        <div className="relative">
                          <img
                            src={image}
                            alt={`${mentor.firstName || ""} ${
                              mentor.lastName || ""
                            }`}
                            className="h-20 w-20 rounded-full border-2 border-black object-cover shadow-sm"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getFallbackImage(mentor);
                            }}
                          />
                          {mentor.isVerified && (
                            <span className="absolute bottom-0 right-0 rounded-full bg-black text-white p-0.5">
                              <CheckCircle size={12} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Name & Primary Role */}
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <h3 className="text-base font-bold text-black truncate max-w-[200px]">
                            {mentor.firstName} {mentor.lastName}
                          </h3>
                        </div>

                        <p className="mt-1 text-xs font-medium text-slate-600 truncate">
                          {skills[0] || mentor.category || "Technology Expert"}
                        </p>
                      </div>

                      {/* Current Professional Designation / Company Simulation */}
                      <div className="mt-6 space-y-1 py-4 border-t border-black">
                        <p className="text-xs font-bold text-black">
                          {mentor.profession ||
                            mentor.designation ||
                            "Senior Specialist"}
                        </p>
                        <p className="text-xs font-semibold text-slate-600">
                          {mentor.company || "Leading Tech Firm"}
                        </p>
                      </div>

                      {/* Transition Arrow Indicator Icon matching layout */}
                      <div className="my-2 flex justify-center text-black">
                        <div className="flex flex-col items-center">
                          <div className="w-1.5 h-1.5 bg-black rotate-45 mb-[-3px]" />
                          <div className="w-1.5 h-1.5 bg-black rotate-45 mb-[-3px]" />
                          <div className="w-1.5 h-1.5 bg-black rotate-45" />
                        </div>
                      </div>

                      {/* Current / Target Role Summary */}
                      <div className="py-2">
                        <p className="text-xs font-bold text-black">
                          {mentor.headline
                            ? mentor.headline.slice(0, 40) + "..."
                            : "Expert Mentorship & Guidance"}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {mentor.location?.city || "Global Professional"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-black flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/mentor/profile/${mentor._id}`)
                        }
                        className="flex-1 rounded-xl border border-black py-2 text-xs font-bold text-black transition hover:bg-slate-100"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/mentor/booking/${mentor._id}`)
                        }
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-black border border-black py-2 text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
                      >
                        Book
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 sm:hidden">
              {mentors.map((mentor) => {
                const image = getImage(mentor);

                return (
                  <div
                    key={mentor._id}
                    className="overflow-hidden rounded-2xl border border-black bg-white p-5 shadow-sm text-center"
                  >
                    <div className="mx-auto flex justify-center">
                      <img
                        src={image}
                        alt={`${mentor.firstName || ""} ${
                          mentor.lastName || ""
                        }`}
                        className="h-16 w-16 rounded-full border border-black object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackImage(mentor);
                        }}
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-black">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {mentor.profession || "Industry Expert"}
                    </p>

                    <div className="mt-4 pt-3 border-t border-black flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/mentor/profile/${mentor._id}`)
                        }
                        className="flex-1 rounded-xl border border-black py-2 text-xs font-bold text-black"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/mentor/booking/${mentor._id}`)
                        }
                        className="flex-1 rounded-xl bg-black border border-black py-2 text-xs font-bold text-white"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-black bg-white px-5 py-16 text-center">
            <h3 className="text-lg font-bold text-black">No mentors found</h3>
            <p className="mt-1 text-xs text-slate-600">
              Please check back later.
            </p>
          </div>
        )}

        {/* MOBILE VIEW ALL */}
        {!loading && mentors.length > 0 && (
          <div className="mt-7 text-center sm:mt-8 md:hidden">
            <button
              onClick={() => navigate("/mentors")}
              className="inline-flex items-center gap-2 rounded-xl border border-black bg-white px-5 py-3 text-xs font-bold text-black"
            >
              View All Mentors
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MentorSection;
