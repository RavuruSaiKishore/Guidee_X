import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useAutoLogout from "./hooks/useAutoLogout";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Student related pages
import Home from "./Pages/Home";
import Login from "./Pages/Public/Login";
import Courses from "./Pages/Public/Courses";
import Mentors from "./Pages/Public/Mentors";
import Pricing from "./Pages/Public/Pricing";
import Profile from "./Pages/User/Profile";
import About from "./Pages/Public/About";
import Contact from "./Pages/Public/Contact";
import Dashboard from "./Pages/User/Dashboard";
import Mycourses from "./Pages/User/My-courses";
import MyBookinsg from "./Pages/User/MyBookings";
import UserLayout from "./layouts/UserLayout";
import MentorRegistration from "./Pages/Mentor/MentorRegistration";
import MentorProfile from "./Pages/Public/Mentor/MentorProfile";
import BookSession from "./Pages/Public/Mentor/BookSession";
import Badges from "./Pages/User/Badges";
import MeetingPage from "./Pages/Meeting/MeetingPage";
import SupportInbox from "./Pages/User/SupportInbox";
import SupportDetails from "./Pages/User/SupportDetails";
import MentorRegistraionLandingPage from "./components/Mentor/MentorRegistration/FormFirstPage";
import ReviewPage from "./Pages/User/UserReviewToMentor/ReviewPage";
import Blogs from "./Pages/Public/Blogs";
import StudentBlogDetails from "./Pages/Public/StudentBlogDetails";
import FAQPage from "./Pages/User/FAQPage";
import UpcomingEvents from "./Pages/User/UpComing Events/UpcomingEvents";
import EventDetails from "./Pages/User/UpComing Events/EventDetails";
import MyRegistrations from "./Pages/User/Registrations/my-registrations";
import RegistrationDetails from "./Pages/User/Registrations/RegistrationDetails";
import CareerResources from "./Pages/User/CareerResource/CareerResources";
import ResourceDetails from "./Pages/User/CareerResource/ResourceDetails";
import RescheduleRequests from "./Pages/User/RescheduleSession/RescheduleSessin";
import StudentAnalytics from "./Pages/User/StudentAnalytics/StudentAnalytics"



// mentor routes
import MentorLayout from "./Pages/Mentor/Layout/MentorLayout";
import MentorDashboard from "./Pages/Mentor/Dashboard/MentorDashboard";
import TodaySession from "./Pages/Mentor/TodaySessions/TodaySession";
import UpcomingSession from "./Pages/Mentor/UpcomingSessions/UpcomingSession";
import Bookings from "./Pages/Mentor/Bookings/Bookings";
import Availability from "./Pages/Mentor/Availability/Availability";
import BookingRequest from "./Pages/Mentor/BookingRequest/BookingRequest";
import RejectBookings from "./Pages/Mentor/RejectBooking/RejectBookings";
import MentorProfiles from "./Pages/Mentor/Profile/MentorProfile";
import CancelBookings from "./Pages/Mentor/CancelBooking/CancelBookings";
import CompletedBookings from "./Pages/Mentor/CompletedBookings/CompletedBooking";
import EditMentorProfile from "./Pages/Mentor/Profile/EditMentorProfile";
import RescheduleSession from "./Pages/Mentor/RescheduleSession/RescheduleSession";
import MentorStudents from "./Pages/Mentor/MentorStudents/MentorStudents";
import MentorStudentProfile from "./Pages/Mentor/MentorStudents/MentorStudentProfile";
import MentorReviews from "./Pages/Mentor/MentorStudents/MentorReviews";



// Admin related pages
import AdminLayout from "./Pages/Admin/Layout/AdminLayout";
import AdminDashboard from "./Pages/Admin/Dashboard/Dashboard";
import UserManagement from "./Pages/Admin/Users/UserManagement";
import MentorsManagement from "./Pages/Admin/Mentors/MentorsManagement";
// import AddMentor from "./Pages/Admin/Mentors/AddMentor";
import MentorDetails from "./Pages/Admin/Mentors/MentorDetails";
import ReviewsManagement from "./Pages/Admin/Reviews/Reviews";
import Analytics from "./Pages/Admin/Analytics/Analytics";
import MentorRequest from "./Pages/Admin/Mentors/MentorRequest";
import BookingManagement from "./Pages/Admin/Bookings/BookingManagement";
import AuditLogs from "./Pages/Admin/Audits/AuditManagement";
import AdminProfile from "./Pages/Admin/Profile";
import AdminContactRequests from "./Pages/Admin/ContactRequests/ContactRequest";
import AdminContactDetails from "./Pages/Admin/ContactRequests/ContactRequestDetails";
import AdminBlogManagement from "./Pages/Admin/Blogs/AdminBlogManagement";
import AdminBlogForm from "./Pages/Admin/Blogs/AdminBlogForm";
import BlogDetails from "./Pages/Admin/Blogs/BlogDetails";
import EditBlog from "./Pages/Admin/Blogs/EditBlog";
import FAQManagement from "./Pages/Admin/FAQ/FAQManagement";
import EventManagement from "./Pages/Admin/Events/EventManagement";
import CreateEvent from "./Pages/Admin/Events/CreateEvent";
import EditEvent from "./Pages/Admin/Events/EditEvent";
import AdminEventDetails from "./Pages/Admin/Events/AdminEventDetails";
import ResourceManagement from "./Pages/Admin/Resources/ResourceManagement";
import CreateResource from "./Pages/Admin/Resources/CreateResouce";
import EditResource from "./Pages/Admin/Resources/EditResource";
import AdminResourceDetails from "./Pages/Admin/Resources/ResourceDetails";
import StudentDetails from "./Pages/Admin/Users/UserDetails";
import EditStudent from "./Pages/Admin/Users/EditUser";
import EditMentor from "./Pages/Admin/Mentors/EditMentor";
import BookingDetails from "./Pages/Admin/Bookings/BookingDetails";



// protected Route
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { Edit } from "lucide-react";

function App() {
  useAutoLogout();

  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/meeting/:roomId" element={<MeetingPage />} />
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />

        {/* Mentor Public Pages */}

        {/* ================= STUDENT ROUTES ================= */}

        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<Mycourses />} />
          <Route path="/my-bookings" element={<MyBookinsg />} />
          <Route path="/mentor/register" element={<MentorRegistration />} />
          <Route path="/mentor/profile/:id" element={<MentorProfile />} />
          <Route path="/mentor/booking/:mentorId" element={<BookSession />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/support-inbox" element={<SupportInbox />} />
          <Route path="/support/:id" element={<SupportDetails />} />
          <Route
            path="/landingPage"
            element={<MentorRegistraionLandingPage />}
          />
          <Route path="/review/:bookingId" element={<ReviewPage />} />
          <Route path="/blogs/:id" element={<StudentBlogDetails />} />
          <Route path="/FAQPage" element={<FAQPage />} />
          <Route path="/upComingEvents" element={<UpcomingEvents />} />
          <Route path="/upComingEvents/:id" element={<EventDetails />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route
            path="/my-registrations/:id"
            element={<RegistrationDetails />}
          />
          <Route path="/career-resources" element={<CareerResources />} />
          <Route path="/learning-resources/:id" element={<ResourceDetails />} />
          <Route path="/rescheduleRequest" element={<RescheduleRequests />} />
          <Route path="/analytics" element={<StudentAnalytics />} />
        </Route>
      </Route>

      {/* ================= MENTOR ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRole="mentor" />}>
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          <Route path="/mentor/today-sessions" element={<TodaySession />} />
          <Route
            path="/mentor/upcoming-sessions"
            element={<UpcomingSession />}
          />
          <Route path="/mentor/bookings" element={<Bookings />} />
          <Route path="/mentor/availability" element={<Availability />} />
          <Route path="/mentor/BookingRequest" element={<BookingRequest />} />
          <Route path="/mentor/RejectBookings" element={<RejectBookings />} />
          <Route path="/mentor/profile" element={<MentorProfiles />} />
          <Route path="/mentor/Editprofile" element={<EditMentorProfile />} />
          <Route path="/mentor/CancelBookings" element={<CancelBookings />} />
          <Route path="/mentor/availability" element={<Availability />} />
          <Route
            path="/mentor/CompletedBookings"
            element={<CompletedBookings />}
          />
          <Route
            path="/mentor/RescheduleBookings"
            element={<RescheduleSession />}
          />
          <Route path="/mentor/students" element={<MentorStudents />} />
          <Route
            path="/mentor/students/:studentId"
            element={<MentorStudentProfile />}
          />
          <Route path="/mentor/reviews" element={<MentorReviews />} />
        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="mentors" element={<MentorsManagement />} />
          <Route path="reviews" element={<ReviewsManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="mentor-requests" element={<MentorRequest />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="auditslogs" element={<AuditLogs />} />
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="contact-requests" element={<AdminContactRequests />} />
          <Route
            path="contact-requests-details/:id"
            element={<AdminContactDetails />}
          />
          <Route path="/admin/blogs" element={<AdminBlogManagement />} />
          <Route path="/admin/blogs/create" element={<AdminBlogForm />} />
          <Route path="/admin/blogs/:id" element={<BlogDetails />} />
          <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />{" "}
          <Route path="/admin/mentors/:mentorId" element={<MentorDetails />} />
          <Route path="/admin/FAQ" element={<FAQManagement />} />
          <Route path="/admin/Events" element={<EventManagement />} />
          <Route path="/admin/Events/create" element={<CreateEvent />} />
          <Route path="/admin/Events/edit/:id" element={<EditEvent />} />
          <Route
            path="/admin/Events/details/:id"
            element={<AdminEventDetails />}
          />
          <Route
            path="/admin/careerResources"
            element={<ResourceManagement />}
          />
          <Route
            path="/admin/careerResources/create"
            element={<CreateResource />}
          />
          <Route
            path="/admin/careerResources/edit/:id"
            element={<EditResource />}
          />
          <Route
            path="/admin/careerResources/details/:id"
            element={<AdminResourceDetails />}
          />
          <Route path="/admin/students/:id" element={<StudentDetails />} />
          <Route path="/admin/students/:id/edit" element={<EditStudent />} />
          <Route path="/admin/mentors/:id/edit" element={<EditMentor />} />
          <Route path="/admin/bookings/:id" element={<BookingDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
