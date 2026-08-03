import { useState } from "react";
import {
  Search,
  ArrowRight,
  Users,
  BookOpen,
  Star,
  Clock3,
  PlayCircle,
} from "lucide-react";

const Courses = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const courses = [
    {
      title: "Full Stack Development",
      category: "Web Development",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
      rating: "4.9",
      students: "12K",
      duration: "42 Hours",
      price: "₹499",
      level: "Intermediate",
    },
    {
      title: "Machine Learning",
      category: "AI & ML",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900",
      rating: "4.8",
      students: "8K",
      duration: "38 Hours",
      price: "₹699",
      level: "Advanced",
    },
    {
      title: "React Masterclass",
      category: "React",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
      rating: "4.9",
      students: "15K",
      duration: "35 Hours",
      price: "₹399",
      level: "Beginner",
    },
    {
      title: "Java Programming",
      category: "Java",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900",
      rating: "4.7",
      students: "10K",
      duration: "40 Hours",
      price: "₹299",
      level: "Beginner",
    },
    {
      title: "Cloud Computing",
      category: "Cloud",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900",
      rating: "4.8",
      students: "6K",
      duration: "30 Hours",
      price: "₹799",
      level: "Advanced",
    },
    {
      title: "Python Programming",
      category: "Python",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900",
      rating: "4.8",
      students: "11K",
      duration: "36 Hours",
      price: "₹349",
      level: "Beginner",
    },
    {
      title: "UI/UX Design",
      category: "UI/UX",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900",
      rating: "4.9",
      students: "7K",
      duration: "28 Hours",
      price: "₹599",
      level: "Intermediate",
    },
    {
      title: "Data Science",
      category: "Data Science",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900",
      rating: "4.8",
      students: "9K",
      duration: "45 Hours",
      price: "₹749",
      level: "Advanced",
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">

        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <div>

              <span className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur">
                🚀 India's AI Powered Learning Platform
              </span>

              <h1 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight">
                Learn Skills That
                <span className="block text-yellow-300">
                  Build Your Career
                </span>
              </h1>

              <p className="mt-5 text-blue-100 max-w-xl leading-7">
                Learn from expert mentors through industry-ready courses, live
                projects, interview preparation, certifications and career
                guidance.
              </p>

              {/* Search */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-2 flex items-center">

                <Search className="text-gray-400 ml-3" size={20} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for courses..."
                  className="flex-1 px-4 py-2 text-gray-700 outline-none bg-transparent"
                />

                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg flex items-center gap-2 transition">
                  Search
                  <ArrowRight size={18} />
                </button>

              </div>

              {/* Popular Categories */}
              <div className="flex flex-wrap gap-3 mt-6">
                {["Web Development", "AI & ML", "Java", "React", "Python"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearch(item);
                        setSelectedCategory("All");
                      }}
                      className="bg-white/15 hover:bg-white hover:text-blue-700 px-4 py-2 rounded-full text-sm transition"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div>
                  <h2 className="text-3xl font-bold">200+</h2>
                  <p className="text-blue-100 text-sm">Courses</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">500+</h2>
                  <p className="text-blue-100 text-sm">Mentors</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">10K+</h2>
                  <p className="text-blue-100 text-sm">Students</p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex justify-center">

              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full">

                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
                  alt="Course"
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">

                  <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    ⭐ Bestseller
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-gray-800">
                    Full Stack Web Development
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    React • Node.js • Express • MongoDB
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-4">
                    <Star size={18} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">4.9</span>
                    <span className="text-gray-500 text-sm">(2,350 Reviews)</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} />
                      12K Students
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock3 size={16} />
                      42 Hours
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BookOpen size={16} />
                      Beginner
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <PlayCircle size={16} />
                      180 Lessons
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹499</span>
                      <span className="line-through text-gray-400 ml-2">₹999</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                      Enroll
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FILTER SECTION ================= */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-wrap justify-between items-center gap-4">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Explore Our Courses
            </h2>
            <p className="text-gray-500 mt-1">
              Choose from our top-rated professional courses.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {["All", "Web Development", "AI & ML", "React", "Java", "Python", "Cloud"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setSelectedCategory(item)}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedCategory === item
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

        </div>

      </section>

      {/* ================= COURSE GRID ================= */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Course Image */}
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Bestseller
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-gray-500">({course.students} Students)</span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-lg font-bold text-gray-800 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Category */}
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {course.category}
                  </p>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    Learn with practical projects, assignments, quizzes and
                    mentor support.
                  </p>

                  {/* Details */}
                  <div className="flex justify-between text-sm text-gray-500 mt-4">
                    <div className="flex items-center gap-1">
                      <Clock3 size={15} />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={15} />
                      {course.level}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center mt-5">
                    <div>
                      <p className="text-xl font-bold text-blue-600">{course.price}</p>
                      <p className="text-gray-400 line-through text-sm">₹999</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                      Enroll
                    </button>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h2 className="text-3xl font-bold text-gray-700">
                No Courses Found
              </h2>
              <p className="text-gray-500 mt-2">
                Try searching with another keyword.
              </p>
            </div>
          )}
        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 py-16 text-white">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold">Ready to Start Learning?</h2>

          <p className="mt-4 text-blue-100">
            Join thousands of students learning from industry experts on GuideX.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-blue-700 px-7 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
              Browse Courses
            </button>
            <button className="border border-white px-7 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition">
              Become a Mentor
            </button>
          </div>

        </div>

      </section>

    </div> 
  );
};

export default Courses;