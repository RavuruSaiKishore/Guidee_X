import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import useAutoLogout from "./hooks/useAutoLogout";
import { useAuth } from "./context/AuthContext";

// ================= PUBLIC PAGES (Eager Loaded) =================
import Home from "./Pages/Home";
import Login from "./Pages/Public/Login";
import Courses from "./Pages/Public/Courses";
import Mentors from "./Pages/Public/Mentors";
import Pricing from "./Pages/Public/Pricing";
import About from "./Pages/Public/About";
import Contact from "./Pages/Public/Contact";
import Blogs from "./Pages/Public/Blogs";

// Layouts & Protected Routes
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// ================= LAZY-LOADED PAGES =================
// Student related pages
const Profile = lazy(() => import("./Pages/User/Profile"));
const Dashboard = lazy(() => import("./Pages/User/Dashboard"));
const Mycourses = lazy(() => import("./Pages/User/My-courses"));
const MyBookinsg = lazy(() => import("./Pages/User/MyBookings"));
const MentorRegistration = lazy(() =>
  import("./Pages/Mentor/MentorRegistration")
);
const MentorProfile = lazy(() => import("./Pages/Public/Mentor/MentorProfile"));
const BookSession = lazy(() => import("./Pages/Public/Mentor/BookSession"));
const Badges = lazy(() => import("./Pages/User/Badges"));
const MeetingPage = lazy(() => import("./Pages/Meeting/MeetingPage"));
const SupportInbox = lazy(() => import("./Pages/User/SupportInbox"));
const SupportDetails = lazy(() => import("./Pages/User/SupportDetails"));
const MentorRegistraionLandingPage = lazy(() =>
  import("./components/Mentor/MentorRegistration/FormFirstPage")
);
const ReviewPage = lazy(() =>
  import("./Pages/User/UserReviewToMentor/ReviewPage")
);
const StudentBlogDetails = lazy(() =>
  import("./Pages/Public/StudentBlogDetails")
);
const FAQPage = lazy(() => import("./Pages/User/FAQPage"));
const UpcomingEvents = lazy(() =>
  import("./Pages/User/UpComing Events/UpcomingEvents")
);
const EventDetails = lazy(() =>
  import("./Pages/User/UpComing Events/EventDetails")
);
const MyRegistrations = lazy(() =>
  import("./Pages/User/Registrations/my-registrations")
);
const RegistrationDetails = lazy(() =>
  import("./Pages/User/Registrations/RegistrationDetails")
);
const CareerResources = lazy(() =>
  import("./Pages/User/CareerResource/CareerResources")
);
const ResourceDetails = lazy(() =>
  import("./Pages/User/CareerResource/ResourceDetails")
);
const RescheduleRequests = lazy(() =>
  import("./Pages/User/RescheduleSession/RescheduleSessin")
);
const StudentAnalytics = lazy(() =>
  import("./Pages/User/StudentAnalytics/StudentAnalytics")
);

const StudentDisputes = lazy(() =>
  import("./Pages/User/Disputes/StudentDisputes")
);

const DisputeChatPage = lazy(() =>
  import("./Pages/User/Disputes/DisputeChatPage")
);

// mentor routes
const MentorLayout = lazy(() => import("./Pages/Mentor/Layout/MentorLayout"));
const MentorDashboard = lazy(() =>
  import("./Pages/Mentor/Dashboard/MentorDashboard")
);
const TodaySession = lazy(() =>
  import("./Pages/Mentor/TodaySessions/TodaySession")
);
const UpcomingSession = lazy(() =>
  import("./Pages/Mentor/UpcomingSessions/UpcomingSession")
);
const Bookings = lazy(() => import("./Pages/Mentor/Bookings/Bookings"));
const Availability = lazy(() =>
  import("./Pages/Mentor/Availability/Availability")
);
const BookingRequest = lazy(() =>
  import("./Pages/Mentor/BookingRequest/BookingRequest")
);
const RejectBookings = lazy(() =>
  import("./Pages/Mentor/RejectBooking/RejectBookings")
);
const MentorProfiles = lazy(() =>
  import("./Pages/Mentor/Profile/MentorProfile")
);
const CancelBookings = lazy(() =>
  import("./Pages/Mentor/CancelBooking/CancelBookings")
);
const CompletedBookings = lazy(() =>
  import("./Pages/Mentor/CompletedBookings/CompletedBooking")
);
const EditMentorProfile = lazy(() =>
  import("./Pages/Mentor/Profile/EditMentorProfile")
);
const RescheduleSession = lazy(() =>
  import("./Pages/Mentor/RescheduleSession/RescheduleSession")
);
const MentorStudents = lazy(() =>
  import("./Pages/Mentor/MentorStudents/MentorStudents")
);
const MentorStudentProfile = lazy(() =>
  import("./Pages/Mentor/MentorStudents/MentorStudentProfile")
);
const MentorReviews = lazy(() =>
  import("./Pages/Mentor/MentorStudents/MentorReviews")
);
const MentorSupport = lazy(() =>
  import("./Pages/Mentor/MentorContactAdmin/MentorSupport")
);
const MentorSupportDetails = lazy(() =>
  import("./Pages/Mentor/MentorContactAdmin/MentorSupportDetails")
);
const CreateMentorRequest = lazy(() =>
  import("./Pages/Mentor/MentorContactAdmin/CreateMentorRequest")
);
const MentorDisputes = lazy(() =>
  import("./Pages/Mentor/Disputes/MentorDisputes")
);
const MentorDisputeChatPage = lazy(() =>
  import("./Pages/Mentor/Disputes/MentorDisputeChatPage")
);

// Admin related pages
const AdminLayout = lazy(() => import("./Pages/Admin/Layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./Pages/Admin/Dashboard/Dashboard"));
const UserManagement = lazy(() => import("./Pages/Admin/Users/UserManagement"));
const MentorsManagement = lazy(() =>
  import("./Pages/Admin/Mentors/MentorsManagement")
);
const MentorDetails = lazy(() => import("./Pages/Admin/Mentors/MentorDetails"));
const ReviewsManagement = lazy(() => import("./Pages/Admin/Reviews/Reviews"));
const Analytics = lazy(() => import("./Pages/Admin/Analytics/Analytics"));
const MentorRequest = lazy(() => import("./Pages/Admin/Mentors/MentorRequest"));
const BookingManagement = lazy(() =>
  import("./Pages/Admin/Bookings/BookingManagement")
);
const AuditLogs = lazy(() => import("./Pages/Admin/Audits/AuditManagement"));
const AdminProfile = lazy(() => import("./Pages/Admin/Profile"));
const AdminContactRequests = lazy(() =>
  import("./Pages/Admin/ContactRequests/ContactRequest")
);
const AdminContactDetails = lazy(() =>
  import("./Pages/Admin/ContactRequests/ContactRequestDetails")
);
const AdminBlogManagement = lazy(() =>
  import("./Pages/Admin/Blogs/AdminBlogManagement")
);
const AdminBlogForm = lazy(() => import("./Pages/Admin/Blogs/AdminBlogForm"));
const BlogDetails = lazy(() => import("./Pages/Admin/Blogs/BlogDetails"));
const EditBlog = lazy(() => import("./Pages/Admin/Blogs/EditBlog"));
const FAQManagement = lazy(() => import("./Pages/Admin/FAQ/FAQManagement"));
const EventManagement = lazy(() =>
  import("./Pages/Admin/Events/EventManagement")
);
const CreateEvent = lazy(() => import("./Pages/Admin/Events/CreateEvent"));
const EditEvent = lazy(() => import("./Pages/Admin/Events/EditEvent"));
const AdminEventDetails = lazy(() =>
  import("./Pages/Admin/Events/AdminEventDetails")
);
const ResourceManagement = lazy(() =>
  import("./Pages/Admin/Resources/ResourceManagement")
);
const CreateResource = lazy(() =>
  import("./Pages/Admin/Resources/CreateResouce")
);
const EditResource = lazy(() => import("./Pages/Admin/Resources/EditResource"));
const AdminResourceDetails = lazy(() =>
  import("./Pages/Admin/Resources/ResourceDetails")
);
const StudentDetails = lazy(() => import("./Pages/Admin/Users/UserDetails"));
const EditStudent = lazy(() => import("./Pages/Admin/Users/EditUser"));
const EditMentor = lazy(() => import("./Pages/Admin/Mentors/EditMentor"));
const BookingDetails = lazy(() =>
  import("./Pages/Admin/Bookings/BookingDetails")
);
const AdminMentorRequest = lazy(() =>
  import("./Pages/Admin/AdminContactWIthMentor/AdminMentorRequests")
);
const AdminMentorChatDetails = lazy(() =>
  import("./Pages/Admin/AdminContactWIthMentor/AdminMentorChatDetails")
);
const CreateMentorChat = lazy(() =>
  import("./Pages/Admin/AdminContactWIthMentor/CreateMentorChat")
);
const ResourceInteractions = lazy(() =>
  import("./Pages/Admin/Resources/ResourceInteractions")
);
const AdminRegistrationDetails = lazy(() =>
  import("./Pages/Admin/Events/EventStudentRegDetails")
);
const AdminDisputes = lazy(() =>
  import("./Pages/Admin/Disputes/AdminDisputes")
);
const AdminDisputeChatPage = lazy(() =>
  import("./Pages/Admin/Disputes/AdminDisputeChatPage")
);


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
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
        </div>
      }
    >
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
            <Route
              path="/learning-resources/:id"
              element={<ResourceDetails />}
            />
            <Route path="/rescheduleRequest" element={<RescheduleRequests />} />
            <Route path="/analytics" element={<StudentAnalytics />} />
            <Route path="/disputes" element={<StudentDisputes />} />
            <Route path="/disputes/:disputeId" element={<DisputeChatPage />} />
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
            <Route path="/mentor/admin-chat" element={<MentorSupport />} />
            <Route
              path="/mentor/admin-chat/:id"
              element={<MentorSupportDetails />}
            />
            <Route
              path="/mentor/create-request"
              element={<CreateMentorRequest />}
            />

            <Route path="/mentor/disputes" element={<MentorDisputes />} />
            <Route
              path="/mentor/disputes/:disputeId"
              element={<MentorDisputeChatPage />}
            />
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
            <Route
              path="/admin/mentors/:mentorId"
              element={<MentorDetails />}
            />
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
            <Route
              path="/admin/careerResources/:id/interactions"
              element={<ResourceInteractions />}
            />
            <Route path="/admin/students/:id" element={<StudentDetails />} />
            <Route path="/admin/students/:id/edit" element={<EditStudent />} />
            <Route path="/admin/mentors/:id/edit" element={<EditMentor />} />
            <Route path="/admin/bookings/:id" element={<BookingDetails />} />
            <Route
              path="/admin/mentor-chats"
              element={<AdminMentorRequest />}
            />
            <Route
              path="/admin/mentor-chats/:id"
              element={<AdminMentorChatDetails />}
            />
            <Route
              path="/admin/mentor-chat/create"
              element={<CreateMentorChat />}
            />
            <Route
              path="/admin/events/details/:eventId/registrations"
              element={<AdminRegistrationDetails />}
            />
            <Route path="/admin/disputes" element={<AdminDisputes />} />
            <Route
              path="/admin/disputes/:disputeId"
              element={<AdminDisputeChatPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
