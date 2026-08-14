import {
  ArrowRight,
  Play,
  Sparkles,
  Users,
  GraduationCap,
  Target,
  Star,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  Award,
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 text-white">
        {/* Background Accents matching slate/blue minimalist theme */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-blue-400 mb-6 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Powered Mentorship Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Learn.
              <br />
              Connect.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Grow.
              </span>
            </h1>

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl">
              GuideX empowers students with AI-driven mentorship, industry-ready
              courses, personalized career roadmaps, mock interviews, resume
              guidance, and direct access to professionals from leading
              companies.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="group px-7 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-blue-500 shadow-sm transition">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button className="group px-7 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-800 transition">
                <Play className="w-4 h-4 fill-slate-200" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-slate-800/80 max-w-lg">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">10K+</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Students</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">500+</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Mentors</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">4.9★</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Rating</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative hidden lg:flex justify-center">
            {/* Main Card */}
            <div className="relative w-full max-w-[480px] rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">
                  GuideX Dashboard
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-blue-600 p-5 text-white shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 text-xs font-semibold">Career Progress</p>
                      <h4 className="text-3xl font-black text-white mt-1">
                        86%
                      </h4>
                    </div>
                    <TrendingUp className="w-10 h-10 text-blue-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-4">
                    <Users className="w-7 h-7 text-blue-400 mb-3" />
                    <h5 className="text-white font-bold text-sm">Mentors</h5>
                    <p className="text-slate-400 text-xs mt-1">500+ Experts</p>
                  </div>

                  <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-4">
                    <GraduationCap className="w-7 h-7 text-indigo-400 mb-3" />
                    <h5 className="text-white font-bold text-sm">Courses</h5>
                    <p className="text-slate-400 text-xs mt-1">200+ Programs</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-white font-bold text-sm">
                        Learning Roadmap
                      </h5>
                      <p className="text-slate-400 text-xs mt-1">
                        AI Recommended
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="w-4/5 h-full rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -left-6 top-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-48">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 truncate">Top Mentor</h5>
                  <p className="text-[11px] text-slate-500">Google</p>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -right-6 bottom-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-52">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-9 h-9 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 truncate">Career Ready</h5>
                  <p className="text-[11px] text-slate-500">Resume Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="relative py-20 sm:py-24 bg-white overflow-hidden border-b border-slate-200/80">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              OUR STORY
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              We Believe Every Student Deserves Great Mentorship
            </h2>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              GuideX was built to bridge the gap between academic learning and
              industry expectations. We connect ambitious students with
              experienced professionals, practical learning resources,
              AI-powered career guidance, and opportunities that help them
              become industry-ready.
            </p>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
                alt="GuideX Team"
                className="relative rounded-3xl shadow-md border border-slate-200 object-cover aspect-[4/3] w-full"
              />

              <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-lg border border-slate-100 px-6 py-4">
                <h4 className="text-2xl font-black text-blue-600">10K+</h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Students Guided</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-blue-200 rounded-full"></div>

              <div className="space-y-8">
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    1
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    The Beginning
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    We started with one simple vision — every student should
                    have access to mentors who have already walked the path they
                    aspire to follow.
                  </p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Building Connections
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    We created a platform where students can easily connect with
                    industry experts, participate in live mentoring, and gain
                    practical career insights.
                  </p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    AI Powered Learning
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    GuideX now combines artificial intelligence with expert
                    mentorship to recommend personalized learning paths, career
                    roadmaps, and skill development plans.
                  </p>
                </div>

                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    4
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    The Future
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Our goal is to become the most trusted mentorship and career
                    development platform, empowering millions of learners around
                    the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="relative py-20 sm:py-24 bg-slate-50 overflow-hidden border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              OUR PURPOSE
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Drives GuideX
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Our Mission
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  To empower every learner through personalized mentorship,
                  practical education, and AI-driven career guidance, enabling
                  students to confidently achieve their academic and
                  professional aspirations.
                </p>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle className="text-blue-600 w-4 h-4" />
                    Personalized Learning
                  </li>
                  <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle className="text-blue-600 w-4 h-4" />
                    Industry Mentorship
                  </li>
                  <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle className="text-blue-600 w-4 h-4" />
                    Career Readiness
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div className="rounded-3xl bg-slate-900 p-8 sm:p-10 shadow-sm text-white flex flex-col justify-between border border-slate-800">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
                  To build a future where every student, regardless of
                  background, has access to world-class mentorship,
                  industry-leading education, and limitless opportunities to
                  succeed.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4">
                    <h4 className="text-2xl font-bold text-white">50+</h4>
                    <p className="mt-1 text-[11px] text-slate-400">Partner Companies</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-4">
                    <h4 className="text-2xl font-bold text-white">Global</h4>
                    <p className="mt-1 text-[11px] text-slate-400">Learning Network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY GUIDEX ================= */}
      <section className="relative py-20 sm:py-24 bg-white overflow-hidden border-b border-slate-200/80">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              WHY GUIDEX
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need For Career Success
            </h2>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              GuideX isn't just another learning platform. It's a complete
              ecosystem that helps students learn, practice, connect, and grow
              with confidence.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="xl:col-span-2 bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-between">
              <Users className="w-10 h-10 mb-6 text-blue-200" />
              <div>
                <h3 className="text-xl font-bold mb-2">Expert Mentorship</h3>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                  Connect one-on-one with professionals working at leading
                  companies, receive personalized career advice, resume reviews,
                  mock interview sessions, and continuous guidance to achieve your
                  career goals.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-sm flex flex-col justify-between border border-slate-800">
              <GraduationCap className="w-10 h-10 text-indigo-400 mb-6" />
              <div>
                <h3 className="text-xl font-bold mb-2">Premium Courses</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Learn through carefully designed, industry-focused programs with
                  real-world projects and hands-on experience.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <Sparkles className="w-10 h-10 text-blue-600 mb-6" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">AI Recommendations</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Receive personalized learning paths, mentor suggestions and
                  career recommendations powered by artificial intelligence.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <Target className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  Career Roadmap
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Build a personalized roadmap that guides your complete learning
                  journey, helping you achieve your career objectives efficiently.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="xl:col-span-2 bg-slate-900 rounded-3xl p-8 text-white shadow-sm border border-slate-800 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
                <div>
                  <h3 className="text-xl font-bold">Mock Interviews</h3>
                  <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                    Practice with experienced mentors and receive personalized
                    feedback on technical knowledge, communication, confidence,
                    and interview performance to maximize your chances of
                    success.
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <TrendingUp className="w-10 h-10 text-emerald-600 mb-6" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Placement Support</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Get resume reviews, ATS optimization, portfolio improvement,
                  placement preparation, and career guidance from experts.
                </p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <CheckCircle className="w-10 h-10 text-blue-600 mb-6" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Certifications</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Earn recognized certificates after successfully completing
                  learning paths, projects, and mentor-led programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW GUIDEX WORKS ================= */}
      <section className="relative py-20 sm:py-24 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              HOW IT WORKS
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Journey With GuideX
            </h2>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400">
              From discovering your interests to landing your dream career,
              GuideX supports every stage of your professional journey.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* STEP 1 */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-6 shadow-sm">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Create Profile
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Build your profile, select your interests, skills, goals,
                    and preferred career path to personalize your learning
                    experience.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-6 shadow-sm">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    AI Recommendations
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Receive personalized mentor suggestions, curated courses,
                    career roadmaps, and learning recommendations powered by AI.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-6 shadow-sm">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Learn & Practice
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Attend mentorship sessions, complete industry projects,
                    prepare resumes, and practice interviews with experts.
                  </p>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-6 shadow-sm">
                    04
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Achieve Success
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Become industry-ready, earn certifications, crack
                    interviews, and confidently launch your professional career.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative py-20 sm:py-24 bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              OUR IMPACT
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Numbers That Speak
            </h2>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              Thousands of learners trust GuideX to accelerate their careers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm p-8 text-center">
              <h3 className="text-4xl font-black text-blue-600">10K+</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm p-8 text-center">
              <h3 className="text-4xl font-black text-blue-600">500+</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Mentors</p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm p-8 text-center">
              <h3 className="text-4xl font-black text-blue-600">200+</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Professional Courses</p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm p-8 text-center">
              <h3 className="text-4xl font-black text-blue-600">4.9★</h3>
              <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;