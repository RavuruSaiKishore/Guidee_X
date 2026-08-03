import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-50 to-indigo-100">
      <h1 className="text-5xl font-bold text-gray-800">
        Learn Skills with GuideX 🚀
      </h1>

      <p className="mt-4 text-gray-600">
        Courses + Mentors + Career Growth Platform
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/courses"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Explore Courses
        </Link>

        <Link to="/mentors" className="bg-white border px-6 py-3 rounded">
          Meet Mentors
        </Link>
      </div>
    </div>
  );
};

export default Landing;
