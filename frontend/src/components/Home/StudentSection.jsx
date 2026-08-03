import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Users, GraduationCap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentCard from "./StudentCard";

const StudentSections = () => {
  const navigate = useNavigate();

  // =========================================================
  // RAW / STATIC STUDENT DATA
  // =========================================================

  const rawStudents = [
    {
      _id: "student-1",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@example.com",
      profileImage: "https://i.pravatar.cc/300?img=12",
      bio: "Computer science student passionate about web development and AI.",
      college: "Indian Institute of Technology",
      course: "B.Tech Computer Science",
      skills: ["React", "JavaScript", "Node.js", "AI"],
      location: "Bangalore, India",
      isActive: true,
    },
    {
      _id: "student-2",
      firstName: "Priya",
      lastName: "Reddy",
      email: "priya.reddy@example.com",
      profileImage: "https://i.pravatar.cc/300?img=47",
      bio: "Aspiring software engineer exploring full-stack development.",
      college: "Osmania University",
      course: "B.Tech Information Technology",
      skills: ["React", "MongoDB", "Express", "Tailwind CSS"],
      location: "Hyderabad, India",
      isActive: true,
    },
    {
      _id: "student-3",
      firstName: "Arjun",
      lastName: "Kumar",
      email: "arjun.kumar@example.com",
      profileImage: "https://i.pravatar.cc/300?img=11",
      bio: "Tech enthusiast interested in cloud computing and backend engineering.",
      college: "Vellore Institute of Technology",
      course: "B.Tech Computer Science",
      skills: ["Node.js", "AWS", "Python", "MongoDB"],
      location: "Chennai, India",
      isActive: true,
    },
    {
      _id: "student-4",
      firstName: "Sneha",
      lastName: "Patel",
      email: "sneha.patel@example.com",
      profileImage: "https://i.pravatar.cc/300?img=32",
      bio: "UI/UX enthusiast who loves creating beautiful and user-friendly products.",
      college: "Christ University",
      course: "B.Des User Experience Design",
      skills: ["Figma", "UI/UX", "Design", "Prototyping"],
      location: "Bangalore, India",
      isActive: true,
    },
    {
      _id: "student-5",
      firstName: "Vikram",
      lastName: "Rao",
      email: "vikram.rao@example.com",
      profileImage: "https://i.pravatar.cc/300?img=14",
      bio: "Data science learner passionate about machine learning and analytics.",
      college: "IIT Hyderabad",
      course: "M.Tech Data Science",
      skills: ["Python", "Machine Learning", "SQL", "Data Science"],
      location: "Hyderabad, India",
      isActive: true,
    },
    {
      _id: "student-6",
      firstName: "Ananya",
      lastName: "Mehta",
      email: "ananya.mehta@example.com",
      profileImage: "https://i.pravatar.cc/300?img=44",
      bio: "Future product manager learning technology, strategy, and leadership.",
      college: "Delhi University",
      course: "MBA Technology Management",
      skills: ["Product Management", "Leadership", "Strategy"],
      location: "New Delhi, India",
      isActive: true,
    },
  ];

  // =========================================================
  // STATE
  // =========================================================

  const [students, setStudents] = useState(rawStudents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // BACKEND FETCH - COMMENTED FOR NOW
  // =========================================================

  /*
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE_URL}/api/user/featured-students`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await res.json();

      if (data.success) {
        setStudents(data.students || []);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error(err);

      setError("Unable to load students.");

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  */

  // =========================================================
  // TEMPORARY RETRY FUNCTION
  // =========================================================

  const fetchStudents = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      setStudents(rawStudents);
      setLoading(false);
    }, 500);
  };

  // Duplicate students for infinite marquee effect
  const marqueeStudents = [...students, ...students];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/40 py-20">
      {/* =========================================================
          BACKGROUND DECORATIONS
      ========================================================= */}

      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="mx-auto max-w-3xl text-center">
          {/* BADGE */}

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50">
              <Sparkles size={15} className="text-blue-600" />
            </span>

            <span className="text-sm font-semibold text-blue-600">
              GROW TOGETHER
            </span>
          </div>

          {/* HEADING */}

          <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            Be Part of a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Growing Community
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            Connect with ambitious students, share experiences, build your
            network, and learn together with the GuideX community.
          </p>

          {/* =========================================================
              STATS
          ========================================================= */}

          <div className="mx-auto mt-9 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* STUDENTS */}

            <div className="px-4 py-5">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Users size={18} className="text-blue-600" />
              </div>

              <h3 className="mt-2 text-xl font-bold text-gray-900">10K+</h3>

              <p className="text-xs text-gray-500">Students</p>
            </div>

            {/* MENTORS */}

            <div className="border-x border-gray-100 px-4 py-5">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                <GraduationCap size={18} className="text-green-600" />
              </div>

              <h3 className="mt-2 text-xl font-bold text-gray-900">150+</h3>

              <p className="text-xs text-gray-500">Mentors</p>
            </div>

            {/* RATING */}

            <div className="px-4 py-5">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
              </div>

              <h3 className="mt-2 text-xl font-bold text-gray-900">4.9</h3>

              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>

          {/* =========================================================
              CTA
          ========================================================= */}

          <button
            onClick={() => navigate("/login")}
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            Join the Community
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* =========================================================
            STUDENT CARDS
        ========================================================= */}

        <div className="relative mt-16">
          {/* SECTION LABEL */}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Meet Our Community
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Discover learners growing their skills with GuideX
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Active Community
            </div>
          </div>

          {/* =========================================================
              LOADING
          ========================================================= */}

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-72 min-w-[260px] animate-pulse rounded-3xl border border-gray-100 bg-white shadow-sm"
                />
              ))}
            </div>
          ) : error ? (
            /* =======================================================
               ERROR
            ======================================================= */

            <div className="rounded-3xl border border-red-100 bg-white py-14 text-center shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">
                Unable to load community
              </h3>

              <p className="mt-2 text-sm text-gray-500">{error}</p>

              <button
                onClick={fetchStudents}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : students.length === 0 ? (
            /* =======================================================
               EMPTY
            ======================================================= */

            <div className="rounded-3xl border border-gray-100 bg-white py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <Users className="text-blue-600" />
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No students yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Featured students will appear here soon.
              </p>
            </div>
          ) : (
            /* =======================================================
               STUDENT MARQUEE
            ======================================================= */

            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white/60 py-6 shadow-sm backdrop-blur-sm">
              {/* LEFT FADE */}

              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white via-white/80 to-transparent" />

              {/* RIGHT FADE */}

              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent" />

              {/* MARQUEE */}

              <div className="flex w-max gap-6 px-6 animate-marquee">
                {marqueeStudents.map((student, index) => (
                  <div
                    key={`${student._id}-${index}`}
                    className="transition-transform duration-300 hover:-translate-y-1"
                  >
                    <StudentCard student={student} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentSections;
