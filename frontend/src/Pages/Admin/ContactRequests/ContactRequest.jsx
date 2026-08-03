import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Search,
  RefreshCw,
  Mail,
  Clock3,
  CheckCircle2,
  Loader2,
  Eye,
  MessageSquareMore,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AdminContactRequests = () => {
  const token = localStorage.getItem("AdminToken");

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  // =========================
  // FETCH CONTACT REQUESTS
  // =========================

  useEffect(() => {
    fetchContacts();
  }, [page, search, status, category]);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (status) {
        params.append("status", status);
      }

      if (category) {
        params.append("category", category);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/contact-requests?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch contact requests.");
      }

      setContacts(data.contacts || []);
      setPages(data.pages || 1);
      setTotal(data.count || 0);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load contact requests.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const stats = useMemo(() => {
    return {
      total: contacts.length,

      pending: contacts.filter((item) => item.status === "Pending").length,

      progress: contacts.filter((item) => item.status === "In Progress").length,

      resolved: contacts.filter((item) => item.status === "Resolved").length,

      replied: contacts.filter((item) => item.replied).length,
    };
  }, [contacts]);

  // =========================
  // STATUS BADGE
  // =========================

  const getBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // RESET FILTERS
  // =========================

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setPage(1);
  };


   if (loading) {
     return (
       <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-white px-4">
         <div className="relative">
           <div className="h-16 w-16 rounded-full border-4 border-blue-100" />

           <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
         </div>

         <p className="mt-6 text-center text-lg font-semibold text-gray-700">
           Loading your Contact Request's...
         </p>

         <p className="mt-1 text-center text-sm text-gray-400">
           Please wait while we fetch the Contact Request data.
         </p>
       </div>
     );
   }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* HERO HEADER */}
      {/* ================================================= */}

      <section className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 mt-9">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-700 shadow-xl">
          <div className="px-4 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* LEFT CONTENT */}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    Contact Requests
                  </h1>

                  <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-6">
                    Manage student inquiries, review contact messages, and
                    respond to requests from learners through one centralized
                    communication hub.
                  </p>
                </div>
              </div>

              {/* REFRESH BUTTON */}

              <button
                onClick={fetchContacts}
                className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <RefreshCw size={18} />

                <span>Refresh Requests</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 -mt-3 sm:-mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-5">
          {/* TOTAL */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6">
            <Mail className="text-indigo-600 w-5 h-5 sm:w-6 sm:h-6" />

            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Total Requests
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 text-slate-800">
              {total}
            </h2>
          </div>

          {/* PENDING */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6">
            <AlertCircle className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />

            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Pending
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 text-slate-800">
              {stats.pending}
            </h2>
          </div>

          {/* IN PROGRESS */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6">
            <Clock3 className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />

            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              In Progress
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 text-slate-800">
              {stats.progress}
            </h2>
          </div>

          {/* RESOLVED */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6">
            <CheckCircle2 className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />

            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Resolved
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 text-slate-800">
              {stats.resolved}
            </h2>
          </div>

          {/* REPLIED */}

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6">
            <MessageSquareMore className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />

            <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
              Replied
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 sm:mt-2 text-slate-800">
              {stats.replied}
            </h2>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-6 sm:mt-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* SEARCH */}

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full h-12 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full h-12 border border-gray-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">All Categories</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Mentorship">Mentorship</option>
              <option value="Course Support">Course Support</option>
              <option value="Booking Issue">Booking Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Career Guidance">Career Guidance</option>
              <option value="Feedback / Suggestions">
                Feedback / Suggestions
              </option>
            </select>
          </div>

          {/* RESET FILTERS */}

          {(search || status || category) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleResetFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* CONTACT REQUESTS */}
      {/* ================================================= */}

      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* TABLE HEADER */}

          <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 bg-gradient-to-r from-slate-50 to-indigo-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Student Contact Requests
              </h2>

              <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
                Showing{" "}
                <span className="font-semibold text-indigo-600">
                  {contacts.length}
                </span>{" "}
                contact requests
              </p>
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Mail className="text-indigo-600" size={22} />
            </div>
          </div>

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-24">
              <Loader2 className="animate-spin text-indigo-600" size={36} />

              <p className="mt-4 text-sm sm:text-base text-slate-500">
                Loading contact requests...
              </p>
            </div>
          ) : contacts.length === 0 ? (
            /* ================================================= */
            /* EMPTY STATE */
            /* ================================================= */

            <div className="text-center py-20 sm:py-24 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center">
                <Mail className="text-slate-300" size={34} />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mt-5 sm:mt-6">
                No Contact Requests
              </h3>

              <p className="text-sm sm:text-base text-slate-500 mt-2">
                There are currently no student messages.
              </p>
            </div>
          ) : (
            /* ================================================= */
            /* TABLE */
            /* ================================================= */

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 sm:px-8 py-4 sm:py-5 text-left text-sm font-semibold text-slate-600">
                      Student
                    </th>

                    <th className="px-6 py-4 sm:py-5 text-left text-sm font-semibold text-slate-600">
                      Category
                    </th>

                    <th className="px-6 py-4 sm:py-5 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 sm:py-5 text-left text-sm font-semibold text-slate-600">
                      Reply
                    </th>

                    <th className="px-6 py-4 sm:py-5 text-left text-sm font-semibold text-slate-600">
                      Submitted
                    </th>

                    <th className="px-6 py-4 sm:py-5 text-center text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="border-b hover:bg-indigo-50/40 transition"
                    >
                      {/* STUDENT */}

                      <td className="px-6 sm:px-8 py-4 sm:py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl bg-indigo-100 flex items-center justify-center">
                            <User className="text-indigo-600" size={20} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-800 truncate max-w-[180px]">
                              {contact.name}
                            </h3>

                            <p className="text-sm text-slate-500 truncate max-w-[220px]">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4 sm:py-5">
                        <span className="text-slate-700 font-medium whitespace-nowrap">
                          {contact.category}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4 sm:py-5">
                        <span
                          className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getBadgeColor(
                            contact.status
                          )}`}
                        >
                          {contact.status}
                        </span>
                      </td>

                      {/* REPLY */}

                      <td className="px-6 py-4 sm:py-5">
                        {contact.replied ? (
                          <span className="inline-flex items-center gap-2 text-green-600 font-semibold whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-red-500 font-semibold whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Pending
                          </span>
                        )}
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4 sm:py-5">
                        <div className="flex items-center gap-2 text-slate-600 whitespace-nowrap">
                          <Calendar size={16} />

                          {new Date(contact.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4 sm:py-5">
                        <div className="flex justify-center">
                          <Link
                            to={`/admin/contact-requests-details/${contact._id}`}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition whitespace-nowrap"
                          >
                            <Eye size={18} />

                            <span>View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          {!loading && contacts.length > 0 && pages > 1 && (
            <div className="px-4 sm:px-6 md:px-8 py-5 border-t bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">{page}</span> of{" "}
                <span className="font-semibold text-slate-700">{pages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-4 py-2 rounded-lg border bg-white text-sm font-medium disabled:opacity-40 hover:bg-slate-100 transition"
                >
                  Previous
                </button>

                <button
                  disabled={page === pages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 rounded-lg border bg-white text-sm font-medium disabled:opacity-40 hover:bg-slate-100 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminContactRequests;
