import { useEffect, useState } from "react";
import {
Star,
CheckCircle,
ArrowRight,
Users,
Briefcase,
MapPin,
Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
const res = await fetch(
`${API_BASE_URL}/api/mentor/allMentors`
);


  const data = await res.json();

  console.log("Mentors Response:", data);

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
    `${mentor?.firstName || ""} ${
      mentor?.lastName || ""
    }`.trim()
  )}&background=dbeafe&color=2563eb&size=200`;
}

if (
  profileImage.startsWith("http://") ||
  profileImage.startsWith("https://")
) {
  return profileImage;
}

const cleanImagePath = profileImage.replace(/^\/+/, "");

return `${API_BASE_URL.replace(
  /\/+$/,
  ""
)}/${cleanImagePath}`;


};

// =====================================================
// SKILLS
// =====================================================

const getSkills = (mentor) => {
if (Array.isArray(mentor?.primarySkill)) {
return mentor.primarySkill.slice(0, 3);
}


return mentor?.primarySkill
  ? [mentor.primarySkill]
  : [];


};

// =====================================================
// LOCATION
// =====================================================

const getLocation = (mentor) => {
const city = mentor?.location?.city;
const state = mentor?.location?.state;


if (city && state) {
  return `${city}, ${state}`;
}

return city || state || "India";

};

// =====================================================
// FALLBACK IMAGE
// =====================================================

const getFallbackImage = (mentor) => {
return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${mentor?.firstName || ""} ${
mentor?.lastName || ""
}`.trim()
    )}&background=dbeafe&color=2563eb&size=200`;
};

// =====================================================
// RENDER
// =====================================================

return ( <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white py-14 sm:py-16 lg:py-20">
{/* Decorative Background */} <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl sm:h-72 sm:w-72" />

  <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl sm:h-72 sm:w-72" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* =====================================================
        HEADER
    ====================================================== */}

    <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2">
          <span className="h-2 w-2 rounded-full bg-blue-600" />

          <span className="text-xs font-bold tracking-wide text-blue-600 sm:text-sm">
            TOP MENTORS
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
          Learn From{" "}
          <span className="text-blue-600">
            Industry Experts
          </span>
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
          Connect with experienced professionals and
          get personalized guidance to accelerate your
          career.
        </p>
      </div>

      {/* Desktop View All */}
      <button
        onClick={() => navigate("/mentors")}
        className="group hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-md md:flex"
      >
        View All Mentors

        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>

    {/* =====================================================
        LOADING
    ====================================================== */}

    {loading ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[390px] animate-pulse rounded-3xl bg-gray-100 sm:h-[420px]"
          />
        ))}
      </div>
    ) : mentors.length > 0 ? (
      <>
        {/* =====================================================
            DESKTOP / TABLET CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {mentors.map((mentor) => {
            const skills = getSkills(mentor);
            const image = getImage(mentor);

            return (
              <div
                key={mentor._id}
                className="group hidden overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-100 hover:shadow-2xl sm:block"
              >
                {/* Top Banner */}
                <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[20px] border-white" />

                    <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full border-[20px] border-white" />
                  </div>

                  {/* Profile Image */}
                  <div className="absolute left-1/2 top-10 -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={image}
                        alt={`${mentor.firstName || ""} ${
                          mentor.lastName || ""
                        }`}
                        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            getFallbackImage(mentor);
                        }}
                      />

                      {mentor.isVerified && (
                        <div className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-blue-600 p-1">
                          <CheckCircle
                            size={16}
                            className="text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-5 pt-16">
                  {/* Name */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="max-w-full truncate text-lg font-bold text-gray-900">
                        {mentor.firstName}{" "}
                        {mentor.lastName}
                      </h3>

                      {mentor.isVerified && (
                        <CheckCircle
                          size={17}
                          className="shrink-0 fill-blue-50 text-blue-600"
                        />
                      )}
                    </div>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {mentor.profession ||
                        mentor.designation ||
                        "Industry Expert"}
                    </p>

                    {mentor.company && (
                      <p className="mt-1 truncate text-sm font-semibold text-blue-600">
                        {mentor.company}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mt-4 flex min-h-[28px] flex-wrap justify-center gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-y border-gray-100 py-4">
                    <div className="text-center">
                      <Briefcase
                        size={17}
                        className="mx-auto text-blue-600"
                      />

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {mentor.experience || "5+"}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Experience
                      </p>
                    </div>

                    <div className="text-center">
                      <Users
                        size={17}
                        className="mx-auto text-green-600"
                      />

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {mentor.totalStudents || "0"}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Students
                      </p>
                    </div>

                    <div className="text-center">
                      <Star
                        size={17}
                        className="mx-auto fill-yellow-400 text-yellow-400"
                      />

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {mentor.averageRating ||
                          mentor.rating ||
                          "5.0"}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Rating
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/mentor/profile/${mentor._id}`
                        )
                      }
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-gray-50"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/mentor/booking/${mentor._id}`
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Book Now
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            MOBILE CARDS
        ====================================================== */}

        <div className="space-y-4 sm:hidden">
          {mentors.map((mentor) => {
            const skills = getSkills(mentor);
            const image = getImage(mentor);

            return (
              <div
                key={mentor._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Mobile Card Header */}
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-5">
                  <div className="flex items-center gap-4">
                    {/* Profile Image */}
                    <div className="relative shrink-0">
                      <img
                        src={image}
                        alt={`${mentor.firstName || ""} ${
                          mentor.lastName || ""
                        }`}
                        className="h-20 w-20 rounded-2xl border-4 border-white/90 object-cover shadow-lg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            getFallbackImage(mentor);
                        }}
                      />

                      {mentor.isVerified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-blue-600 p-1">
                          <CheckCircle
                            size={13}
                            className="text-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* Basic Information */}
                    <div className="min-w-0 flex-1 text-white">
                      <div className="flex items-center gap-1">
                        <h3 className="truncate text-lg font-bold">
                          {mentor.firstName}{" "}
                          {mentor.lastName}
                        </h3>

                        {mentor.isVerified && (
                          <CheckCircle
                            size={16}
                            className="shrink-0 text-white"
                          />
                        )}
                      </div>

                      <p className="mt-1 truncate text-sm text-blue-100">
                        {mentor.profession ||
                          mentor.designation ||
                          "Industry Expert"}
                      </p>

                      {mentor.company && (
                        <p className="mt-1 truncate text-xs font-medium text-white/80">
                          {mentor.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Content */}
                <div className="p-4">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin
                      size={14}
                      className="shrink-0 text-blue-500"
                    />

                    <span className="truncate">
                      {getLocation(mentor)}
                    </span>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mobile Stats */}
                  <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-100 bg-gray-50 py-3">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">
                        {mentor.experience || "5+"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Experience
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">
                        {mentor.totalStudents || "0"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Students
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star
                          size={13}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <p className="text-sm font-bold text-gray-900">
                          {mentor.averageRating ||
                            mentor.rating ||
                            "5.0"}
                        </p>
                      </div>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Rating
                      </p>
                    </div>
                  </div>

                  {/* Mobile Availability */}
                  {mentor.availability?.preferredTime && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5">
                      <Clock3
                        size={15}
                        className="shrink-0 text-green-600"
                      />

                      <span className="text-xs font-medium text-green-700">
                        Available in the{" "}
                        {mentor.availability.preferredTime.toLowerCase()}
                      </span>
                    </div>
                  )}

                  {/* Mobile Buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/mentor/profile/${mentor._id}`
                        )
                      }
                      className="rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 transition active:scale-[0.98] hover:bg-gray-50"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/mentor/booking/${mentor._id}`
                        )
                      }
                      className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-blue-700"
                    >
                      Book Now
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    ) : (
      /* =====================================================
          EMPTY STATE
      ====================================================== */

      <div className="rounded-3xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <Users
            size={25}
            className="text-blue-600"
          />
        </div>

        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          No mentors found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Please check back later for available mentors.
        </p>
      </div>
    )}

    {/* =====================================================
        MOBILE VIEW ALL
    ====================================================== */}

    {!loading && mentors.length > 0 && (
      <div className="mt-7 text-center sm:mt-8 md:hidden">
        <button
          onClick={() => navigate("/mentors")}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
        >
          View All Mentors
          <ArrowRight size={17} />
        </button>
      </div>
    )}
  </div>
</section>

);
};

export default MentorSection;
