import React from "react";

const MyCourses = () => {
  const courses = [
    {
      title: "React Mastery",
      mentor: "Arjun Reddy",
      progress: 80,
      status: "In Progress",
      category: "Frontend",
      duration: "12h 30m",
      level: "Intermediate",
      rating: 4.8,
      lastAccessed: "Today",
    },
    {
      title: "Node.js Backend",
      mentor: "Rahul Sharma",
      progress: 60,
      status: "In Progress",
      category: "Backend",
      duration: "10h 10m",
      level: "Advanced",
      rating: 4.7,
      lastAccessed: "2 days ago",
    },
    {
      title: "Data Structures",
      mentor: "Sneha Kumar",
      progress: 100,
      status: "Completed",
      category: "DSA",
      duration: "15h 45m",
      level: "Beginner",
      rating: 4.9,
      lastAccessed: "1 week ago",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white p-10">
        <h1 className="text-4xl font-bold">📚 My Learning Space</h1>
        <p className="text-blue-100 mt-2">
          Continue learning from where you left off
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{course.title}</h2>
                <p className="text-sm text-gray-500">Mentor: {course.mentor}</p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  course.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {course.status}
              </span>
            </div>

            {/* TAGS */}
            <div className="flex gap-2 mt-3 text-xs">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {course.category}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {course.level}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                ⭐ {course.rating}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>⏱ {course.duration}</span>
              <span>📅 {course.lastAccessed}</span>
            </div>

            {/* BUTTON */}
            <button className="mt-5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:opacity-90 transition">
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
