import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import HeroSection from "../components/Home/HeroSection";
import FeaturedCourses from "../components/Home/StudentSection";
import MentorSection from "../components/Home/MentorSection";
import BecomeMentorCTA from "../components/Home/BecomeMentor";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import FAQSection from "../components/Home/FAQSection";

import FinalCTA from "../components/Home/FinalCTA";
import Footer from "../components/Common/Footer";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user?.role === "mentor") {
      navigate("/mentor/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <HeroSection />

      {/* Top Mentors */}
      <MentorSection />

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Become a Mentor */}
      <BecomeMentorCTA />

      {/* Why Choose GuideX */}
      <WhyChooseUs />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Call To Action */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
