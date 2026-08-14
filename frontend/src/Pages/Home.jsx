import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

import HeroSection from "../components/Home/HeroSection";
import TrustedBrands from "../components/Home/TrustedBrands";
import CourseSection from "../components/Home/CourseSection";
import MentorSection from "../components/Home/MentorSection";
import HowItWorks from "../components/Home/HowItWorks";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import Testimonials from "../components/Home/Testimonials";
import BecomeMentorCTA from "../components/Home/BecomeMentor";
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

  // Prevent flash of home content if redirecting admin/mentor
  if (loading || user?.role === "admin" || user?.role === "mentor") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trusted Brands / Logo Cloud */}
      <TrustedBrands />

      {/* 3. Featured Courses */}
      <CourseSection />

      {/* 4. Top Expert Mentors */}
      <MentorSection />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Why Choose GuideX */}
      {/* <WhyChooseUs /> */}

      {/* 7. Success Stories / Testimonials */}
      <Testimonials />

      {/* 8. Become a Mentor CTA */}
      <BecomeMentorCTA />

      {/* 9. Frequently Asked Questions */}
      <FAQSection />

      {/* 10. Final Call To Action */}
      <FinalCTA />

      {/* 11. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
