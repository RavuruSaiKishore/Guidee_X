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
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="absolute top-20 right-0 w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[120px]" />

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-purple-600/20 blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-xl px-5 py-2 rounded-full text-blue-100 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />

              <span className="text-sm font-medium">
                AI Powered Mentorship Platform
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-tight text-white">
              Learn.
              <br />
              Connect.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Grow.
              </span>
            </h1>

            <p className="mt-8 text-lg leading-9 text-slate-300 max-w-2xl">
              GuideX empowers students with AI-driven mentorship, industry-ready
              courses, personalized career roadmaps, mock interviews, resume
              guidance, and direct access to professionals from leading
              companies.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button className="group px-8 py-4 rounded-full bg-white text-slate-900 font-semibold flex items-center gap-3 hover:scale-105 transition">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              <button className="group px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-white flex items-center gap-3 hover:bg-white/10 transition">
                <Play className="w-5 h-5 fill-white" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-8 mt-20">
              <div>
                <h2 className="text-4xl font-bold text-white">10K+</h2>

                <p className="text-slate-400 mt-2">Students</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-white">500+</h2>

                <p className="text-slate-400 mt-2">Mentors</p>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-white">4.9★</h2>

                <p className="text-slate-400 mt-2">Rating</p>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="relative hidden lg:flex justify-center">
            {/* Main Card */}

            <div className="relative w-[520px] rounded-[35px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,.4)] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">
                  GuideX Dashboard
                </h3>

                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>

                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>

                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-blue-100">Career Progress</p>

                      <h2 className="text-5xl font-bold text-white mt-2">
                        86%
                      </h2>
                    </div>

                    <TrendingUp className="w-14 h-14 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <Users className="w-10 h-10 text-cyan-400 mb-4" />

                    <h4 className="text-white font-semibold">Mentors</h4>

                    <p className="text-slate-400 text-sm mt-2">500+ Experts</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <GraduationCap className="w-10 h-10 text-purple-400 mb-4" />

                    <h4 className="text-white font-semibold">Courses</h4>

                    <p className="text-slate-400 text-sm mt-2">200+ Programs</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">
                        Learning Roadmap
                      </h4>

                      <p className="text-slate-400 text-sm mt-2">
                        AI Recommended
                      </p>
                    </div>

                    <Target className="w-12 h-12 text-cyan-400" />
                  </div>

                  <div className="mt-6 h-3 rounded-full bg-slate-700">
                    <div className="w-4/5 h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card */}

            <div className="absolute -left-10 top-10 bg-white rounded-3xl shadow-2xl p-5 w-56">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Star className="text-yellow-500 fill-yellow-500" />
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">Top Mentor</h4>

                  <p className="text-sm text-slate-500">Google</p>
                </div>
              </div>
            </div>

            {/* Floating Card */}

            <div className="absolute -right-8 bottom-16 bg-white rounded-3xl shadow-2xl p-5 w-60">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-12 h-12 text-green-500" />

                <div>
                  <h4 className="font-bold">Career Ready</h4>

                  <p className="text-sm text-slate-500">Resume Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= OUR STORY ================= */}
      <section className="relative py-28 bg-white overflow-hidden">
        <div className="absolute -left-32 top-20 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

        <div className="absolute -right-24 bottom-0 w-96 h-96 rounded-full bg-purple-100 blur-3xl opacity-70"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              OUR STORY
            </span>

            <h2 className="mt-6 text-5xl font-black text-slate-900">
              We Believe Every Student
              <span className="block text-blue-600">
                Deserves Great Mentorship
              </span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              GuideX was built to bridge the gap between academic learning and
              industry expectations. We connect ambitious students with
              experienced professionals, practical learning resources,
              AI-powered career guidance, and opportunities that help them
              become industry-ready.
            </p>
          </div>

          <div className="mt-20 grid lg:grid-cols-2 gap-20 items-center">
            {/* Image */}

            <div className="relative">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-blue-500 to-cyan-400 blur-3xl opacity-20"></div>

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
                alt="GuideX Team"
                className="relative rounded-[40px] shadow-2xl object-cover"
              />

              <div className="absolute -bottom-10 left-10 bg-white rounded-3xl shadow-xl px-8 py-6">
                <h3 className="text-4xl font-black text-blue-600">10K+</h3>

                <p className="text-slate-500 mt-1">Students Guided</p>
              </div>
            </div>

            {/* Timeline */}

            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-1 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></div>

              <div className="space-y-12">
                <div className="relative pl-16">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    1
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    The Beginning
                  </h3>

                  <p className="mt-3 text-slate-600 leading-8">
                    We started with one simple vision — every student should
                    have access to mentors who have already walked the path they
                    aspire to follow.
                  </p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    2
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    Building Connections
                  </h3>

                  <p className="mt-3 text-slate-600 leading-8">
                    We created a platform where students can easily connect with
                    industry experts, participate in live mentoring, and gain
                    practical career insights.
                  </p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                    3
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    AI Powered Learning
                  </h3>

                  <p className="mt-3 text-slate-600 leading-8">
                    GuideX now combines artificial intelligence with expert
                    mentorship to recommend personalized learning paths, career
                    roadmaps, and skill development plans.
                  </p>
                </div>

                <div className="relative pl-16">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    4
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    The Future
                  </h3>

                  <p className="mt-3 text-slate-600 leading-8">
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

      <section className="relative py-28 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              OUR PURPOSE
            </span>

            <h2 className="text-5xl font-black text-slate-900 mt-4">
              What Drives GuideX
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Mission */}

            <div className="group relative overflow-hidden rounded-[35px] bg-white p-10 shadow-xl border border-slate-200 hover:-translate-y-2 transition duration-500">
              <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center">
                  <Target className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-black mt-8 text-slate-900">
                  Our Mission
                </h3>

                <p className="mt-6 text-lg leading-9 text-slate-600">
                  To empower every learner through personalized mentorship,
                  practical education, and AI-driven career guidance, enabling
                  students to confidently achieve their academic and
                  professional aspirations.
                </p>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600" />
                    Personalized Learning
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600" />
                    Industry Mentorship
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle className="text-blue-600" />
                    Career Readiness
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision */}

            <div className="group relative overflow-hidden rounded-[35px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-10 shadow-2xl text-white hover:-translate-y-2 transition duration-500">
              <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>

              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <Sparkles className="w-10 h-10" />
                </div>

                <h3 className="text-3xl font-black mt-8">Our Vision</h3>

                <p className="mt-6 text-lg leading-9 text-blue-100">
                  To build a future where every student, regardless of
                  background, has access to world-class mentorship,
                  industry-leading education, and limitless opportunities to
                  succeed.
                </p>

                <div className="grid grid-cols-2 gap-5 mt-10">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-5">
                    <h4 className="text-3xl font-bold">50+</h4>

                    <p className="mt-2 text-blue-100">Partner Companies</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-5">
                    <h4 className="text-3xl font-bold">Global</h4>

                    <p className="mt-2 text-blue-100">Learning Network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= WHY GUIDEX ================= */}
      <section className="relative py-28 bg-white overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 -right-24 w-[450px] h-[450px] rounded-full bg-cyan-100 blur-3xl opacity-70"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              WHY GUIDEX
            </span>

            <h2 className="mt-6 text-5xl font-black text-slate-900">
              Everything You Need
              <span className="block text-blue-600">For Career Success</span>
            </h2>

            <p className="mt-8 text-lg text-slate-600 leading-9">
              GuideX isn't just another learning platform. It's a complete
              ecosystem that helps students learn, practice, connect, and grow
              with confidence.
            </p>
          </div>

          {/* Bento Grid */}

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="xl:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[32px] p-10 text-white relative overflow-hidden shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10"></div>

              <Users className="w-14 h-14 mb-8" />

              <h3 className="text-3xl font-bold mb-5">Expert Mentorship</h3>

              <p className="text-blue-100 leading-8 text-[16px] max-w-xl">
                Connect one-on-one with professionals working at leading
                companies, receive personalized career advice, resume reviews,
                mock interview sessions, and continuous guidance to achieve your
                career goals.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <GraduationCap className="w-14 h-14 text-cyan-400 mb-6" />

              <h3 className="text-2xl font-bold mb-4">Premium Courses</h3>

              <p className="text-slate-400 leading-7">
                Learn through carefully designed, industry-focused programs with
                real-world projects and hands-on experience.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <Sparkles className="w-14 h-14 mb-6" />

              <h3 className="text-2xl font-bold mb-4">AI Recommendations</h3>

              <p className="text-purple-100 leading-7">
                Receive personalized learning paths, mentor suggestions and
                career recommendations powered by artificial intelligence.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Target className="text-blue-600 w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold mt-6 text-slate-900">
                Career Roadmap
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                Build a personalized roadmap that guides your complete learning
                journey, helping you achieve your career objectives efficiently.
              </p>
            </div>

            {/* Card 5 */}
            <div className="xl:col-span-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-10 text-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col lg:flex-row justify-between gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold">Mock Interviews</h3>

                  <p className="mt-5 text-slate-300 leading-8 max-w-xl">
                    Practice with experienced mentors and receive personalized
                    feedback on technical knowledge, communication, confidence,
                    and interview performance to maximize your chances of
                    success.
                  </p>
                </div>

                <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-12 h-12 text-cyan-400 fill-cyan-400" />
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[32px] p-8 text-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <TrendingUp className="w-14 h-14 mb-6" />

              <h3 className="text-2xl font-bold mb-4">Placement Support</h3>

              <p className="text-green-100 leading-7">
                Get resume reviews, ATS optimization, portfolio improvement,
                placement preparation, and career guidance from experts.
              </p>
            </div>

            {/* Card 7 */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-[32px] p-8 text-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
              <CheckCircle className="w-14 h-14 mb-6" />

              <h3 className="text-2xl font-bold mb-4">Certifications</h3>

              <p className="text-orange-100 leading-7">
                Earn recognized certificates after successfully completing
                learning paths, projects, and mentor-led programs.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ================= HOW GUIDEX WORKS ================= */}
      <section className="relative py-28 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
        {/* Background */}
        <div className="absolute -top-24 left-0 w-96 h-96 rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-cyan-300 font-semibold">
              HOW IT WORKS
            </span>

            <h2 className="mt-6 text-5xl font-black text-white">
              Your Journey With
              <span className="block text-cyan-400">GuideX</span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-300">
              From discovering your interests to landing your dream career,
              GuideX supports every stage of your professional journey.
            </p>
          </div>

          <div className="relative mt-24">
            {/* Connection Line */}

            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full"></div>

            <div className="grid lg:grid-cols-4 gap-10 relative">
              {/* STEP 1 */}

              <div className="group relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  1
                </div>

                <div className="mt-8 rounded-[35px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:-translate-y-3 transition duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-cyan-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    Create Profile
                  </h3>

                  <p className="mt-5 text-slate-300 leading-8">
                    Build your profile, select your interests, skills, goals,
                    and preferred career path to personalize your learning
                    experience.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}

              <div className="group relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  2
                </div>

                <div className="mt-8 rounded-[35px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:-translate-y-3 transition duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-cyan-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    AI Recommendations
                  </h3>

                  <p className="mt-5 text-slate-300 leading-8">
                    Receive personalized mentor suggestions, curated courses,
                    career roadmaps, and learning recommendations powered by AI.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}

              <div className="group relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  3
                </div>

                <div className="mt-8 rounded-[35px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:-translate-y-3 transition duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                    <GraduationCap className="w-8 h-8 text-purple-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    Learn & Practice
                  </h3>

                  <p className="mt-5 text-slate-300 leading-8">
                    Attend mentorship sessions, complete industry projects,
                    prepare resumes, and practice interviews with experts.
                  </p>
                </div>
              </div>

              {/* STEP 4 */}

              <div className="group relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  4
                </div>

                <div className="mt-8 rounded-[35px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 hover:-translate-y-3 transition duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-pink-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    Achieve Success
                  </h3>

                  <p className="mt-5 text-slate-300 leading-8">
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

      <section className="relative py-28 bg-white overflow-hidden">
        <div className="absolute -left-24 top-0 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-70"></div>

        <div className="absolute -right-24 bottom-0 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-70"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-flex px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              OUR IMPACT
            </span>

            <h2 className="mt-6 text-5xl font-black text-slate-900">
              Numbers That Speak
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              Thousands of learners trust GuideX to accelerate their careers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="rounded-[35px] bg-white border border-slate-200 shadow-xl p-10 text-center hover:-translate-y-2 hover:shadow-2xl transition duration-500">
              <h3 className="text-6xl font-black text-blue-600">10K+</h3>

              <p className="mt-4 text-slate-600 text-lg">Students</p>
            </div>

            <div className="rounded-[35px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10 text-center hover:-translate-y-2 transition duration-500">
              <h3 className="text-6xl font-black">500+</h3>

              <p className="mt-4 text-blue-100 text-lg">Industry Mentors</p>
            </div>

            <div className="rounded-[35px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-10 text-center hover:-translate-y-2 transition duration-500">
              <h3 className="text-6xl font-black">200+</h3>

              <p className="mt-4 text-purple-100 text-lg">
                Professional Courses
              </p>
            </div>

            <div className="rounded-[35px] bg-slate-900 text-white p-10 text-center hover:-translate-y-2 transition duration-500">
              <h3 className="text-6xl font-black text-cyan-400">4.9★</h3>

              <p className="mt-4 text-slate-300 text-lg">Student Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
