import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Save,
  Send,
  X,
  Eye,
  Clock3,
  FileText,
  Search,
  Tag,
  User,
  CheckCircle2,
  CalendarDays,
  Star,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// CONSTANTS
// =====================================================

const categories = [
  "Career",
  "Technology",
  "Education",
  "Interview",
  "Programming",
  "Personal Growth",
  "Mentorship",
  "Industry Trends",
];

const contentTypes = [
  "Article",
  "Tutorial",
  "Guide",
  "Interview Tips",
  "Career Advice",
  "News",
  "Case Study",
  "Success Story",
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
];

// =====================================================
// COMPONENT
// =====================================================

const AdminBlogForm = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    contentType: "Article",
    difficulty: "Beginner",

    authorName: "GuideX Team",
    authorBio: "",

    featured: false,
    commentsEnabled: false,

    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],

    scheduledAt: "",
  });

  // =====================================================
  // STATES
  // =====================================================

  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // =====================================================
  // SLUG GENERATOR
  // =====================================================

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // =====================================================
  // LOAD SAMPLE BLOG DATA (TEST HELPER)
  // =====================================================

 const loadSampleBlogData = () => {
   const sampleTitle =
     "Understanding React Server Components: The Future of Web Architecture";

   setFormData({
     title: sampleTitle,
     slug: generateSlug(sampleTitle),
     excerpt:
       "Dive deep into React Server Components (RSC), zero-bundle-size components, server-side data fetching, and how they change modern frontend development.",
     content: `
        <h2>The Paradigm Shift of React Server Components</h2>
        <p>React Server Components (RSC) allow developers to build applications that span the server and client, combining the rich interactivity of client-side apps with the improved performance of traditional server rendering.</p>
        
        <h3>Zero Bundle Size on the Client</h3>
        <p>Server components execute entirely on the server. Their code is never sent to the client browser, reducing JavaScript bundle size and accelerating initial page loads significantly.</p>
        
        <blockquote>"Server components represent a fundamental shift in how we think about component composition and data loading."</blockquote>
        
        <h3>When to Use Client vs. Server Components</h3>
        <p>Use server components for heavy data fetching, direct database access, and rendering static content. Reserve client components strictly for interactivity, browser APIs, and stateful hooks.</p>
      `,
     category: "Technology",
     tags: ["react", "server-components", "frontend", "web-dev", "performance"],
     contentType: "Article",
     difficulty: "Advanced",
     authorName: "GuideX Core Architecture Team",
     authorBio:
       "Specializing in modern React architecture, SSR, and high-performance web apps.",
     featured: true,
     commentsEnabled: true,
     seoTitle: "React Server Components Guide & Architecture",
     seoDescription:
       "Discover how React Server Components improve app performance with zero-bundle-size rendering and direct data fetching.",
     seoKeywords: [
       "react server components",
       "rsc tutorial",
       "react performance optimization",
       "modern frontend architecture",
     ],
     scheduledAt: "",
   });

   // Mocking sample preview values and meta
   setCoverImageAlt(
     "Abstract visual representation of server-client communication and data flow networks"
   );
   setImagePreview("https://images.unsplash.com/photo-1555066931-4365d14bab8c");

   // Create a dummy file object for submission check bypass
   const dummyFile = new File(["dummy content"], "sample-cover.jpg", {
     type: "image/jpeg",
   });
   setCoverImage(dummyFile);

   toast.success("Sample blog data loaded successfully!");
 };

  // =====================================================
  // READING TIME
  // =====================================================

  const readingTime = useMemo(() => {
    if (!formData.content) return 1;

    const cleanContent = formData.content
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!cleanContent) return 1;

    const wordCount = cleanContent.split(/\s+/).length;

    return Math.max(1, Math.ceil(wordCount / 200));
  }, [formData.content]);

  // =====================================================
  // WORD COUNT
  // =====================================================

  const wordCount = useMemo(() => {
    if (!formData.content) return 0;

    const cleanContent = formData.content
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!cleanContent) return 0;

    return cleanContent.split(/\s+/).length;
  }, [formData.content]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    setCoverImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview("");
    setCoverImageAlt("");
  };

  // =====================================================
  // TAGS
  // =====================================================

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // =====================================================
  // SEO KEYWORDS
  // =====================================================

  const addSeoKeyword = () => {
    const keyword = seoKeywordInput.trim().toLowerCase();

    if (!keyword) return;

    if (formData.seoKeywords.includes(keyword)) {
      setSeoKeywordInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords, keyword],
    }));

    setSeoKeywordInput("");
  };

  const handleSeoKeywordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSeoKeyword();
    }
  };

  const removeSeoKeyword = (keywordToRemove) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(
        (keyword) => keyword !== keywordToRemove
      ),
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (status) => {
    if (!formData.title.trim()) {
      toast.error("Please enter blog title.");
      return;
    }

    if (formData.title.trim().length < 10) {
      toast.error("Blog title should contain at least 10 characters.");
      return;
    }

    if (!formData.excerpt.trim()) {
      toast.error("Please enter blog excerpt.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (!formData.content.trim() || formData.content === "<p><br></p>") {
      toast.error("Please enter blog content.");
      return;
    }

    if (!coverImage) {
      toast.error("Please upload a cover image.");
      return;
    }

    if (!coverImageAlt.trim()) {
      toast.error("Please enter cover image alt text.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("slug", formData.slug.trim());
      data.append("excerpt", formData.excerpt.trim());
      data.append("content", formData.content);

      data.append("category", formData.category);
      data.append("contentType", formData.contentType);
      data.append("difficulty", formData.difficulty);

      data.append("authorName", formData.authorName.trim());
      data.append("authorBio", formData.authorBio.trim());

      data.append("status", status);
      data.append("featured", formData.featured);
      data.append("commentsEnabled", formData.commentsEnabled);

      data.append("readingTime", readingTime);

      data.append("seoTitle", formData.seoTitle.trim());
      data.append("seoDescription", formData.seoDescription.trim());

      formData.seoKeywords.forEach((keyword) => {
        data.append("seoKeywords", keyword);
      });

      formData.tags.forEach((tag) => {
        data.append("tags", tag);
      });

      if (formData.scheduledAt) {
        data.append("scheduledAt", formData.scheduledAt);
      }

      data.append("coverImageAlt", coverImageAlt.trim());
      data.append("coverImage", coverImage);

      const response = await fetch(`${API_BASE_URL}/api/admin/createblogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create blog");
      }

      toast.success(
        status === "Published"
          ? "Blog published successfully!"
          : "Blog saved as draft!"
      );

      setTimeout(() => {
        navigate("/admin/blogs");
      }, 1000);
    } catch (error) {
      console.error("Create blog error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  if (showPreview) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <ToastContainer position="top-right" />

        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                Blog Preview
              </p>

              <h1 className="text-xl font-bold text-gray-900 mt-1">
                {formData.title || "Untitled Blog"}
              </h1>
            </div>

            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              Back to Editor
            </button>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-6 py-10">
          <article className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            {imagePreview && (
              <img
                src={imagePreview}
                alt={coverImageAlt}
                className="w-full h-[420px] object-cover"
              />
            )}

            <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
              <div className="flex flex-wrap gap-3 items-center">
                {formData.category && (
                  <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold">
                    {formData.category}
                  </span>
                )}

                <span className="text-sm text-gray-400">
                  {formData.contentType}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-950 leading-tight mt-6">
                {formData.title || "Your Blog Title"}
              </h1>

              <p className="text-xl text-gray-500 leading-8 mt-6">
                {formData.excerpt || "Your blog excerpt will appear here."}
              </p>

              <div className="flex flex-wrap items-center gap-5 mt-7 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {formData.authorName}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {readingTime} min read
                </span>

                <span>{formData.difficulty}</span>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-7">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="h-px bg-gray-200 my-10" />

              <div
                className="blog-preview-content text-gray-800 text-lg leading-8"
                dangerouslySetInnerHTML={{
                  __html:
                    formData.content ||
                    "<p>Your blog content will appear here.</p>",
                }}
              />
            </div>
          </article>
        </main>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <ToastContainer position="top-right" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => navigate("/admin/blogs")}
                className="w-11 h-11 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-indigo-600" />

                  <span className="text-sm font-semibold text-indigo-600">
                    Blog Manager
                  </span>
                </div>

                <h1 className="text-xl font-bold text-gray-900 truncate">
                  Create New Blog
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadSampleBlogData}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 text-sm font-bold hover:bg-purple-100 transition shadow-sm"
              >
                <Sparkles size={16} />
                Load Sample Blog Data
              </button>

              <div className="hidden md:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50"
                >
                  <Eye size={17} />
                  Preview
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("Draft")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
                >
                  <Save size={17} />
                  Save Draft
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("Published")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  {loading ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-[1500px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6">
            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Basic Information
                    </h2>

                    <p className="text-sm text-gray-400 mt-0.5">
                      Define the title and introduction of your blog.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={loadSampleBlogData}
                  className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition shadow-sm"
                >
                  <Sparkles size={14} />
                  Load Sample
                </button>
              </div>

              <div className="p-6 space-y-7">
                {/* =================================================
                    IMPROVED BLOG TITLE
                ================================================= */}

                <div className="relative">
                  {/* Label */}
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-black">
                        01
                      </span>
                      Blog Title
                      <span className="text-red-500">*</span>
                    </label>

                    <span
                      className={`text-xs font-semibold ${
                        formData.title.length > 180
                          ? "text-orange-500"
                          : "text-gray-400"
                      }`}
                    >
                      {formData.title.length}/200
                    </span>
                  </div>

                  {/* Main Title Input */}
                  <div
                    className={`relative rounded-2xl border transition-all duration-200 ${
                      formData.title
                        ? "border-indigo-200 bg-white shadow-sm shadow-indigo-100/50"
                        : "border-gray-200 bg-gray-50/50"
                    } focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50`}
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={200}
                      placeholder="Write a clear and engaging blog title..."
                      className="w-full px-5 py-5 pr-16 bg-transparent text-xl md:text-2xl font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium outline-none rounded-2xl"
                    />

                    {/* Success Indicator */}
                    {formData.title.trim() && (
                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                          <CheckCircle2 size={18} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Helper Text */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                    <p className="text-xs text-gray-400">
                      Create a title that clearly tells readers what they will
                      learn.
                    </p>

                    {formData.title.length >= 10 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <CheckCircle2 size={14} />
                        Good title length
                      </span>
                    )}
                  </div>

                  {/* Slug Preview */}
                  {formData.title.trim() && (
                    <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        URL
                      </span>

                      <span className="text-xs text-gray-500 truncate">
                        /blog/{formData.slug || "your-blog-title"}
                      </span>
                    </div>
                  )}
                </div>

                {/* =================================================
                    URL SLUG
                ================================================= */}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    URL Slug
                  </label>

                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <span className="px-4 text-sm text-gray-400 border-r border-gray-200">
                      /blog/
                    </span>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3.5 bg-transparent outline-none text-gray-700"
                    />
                  </div>
                </div>

                {/* =================================================
                    EXCERPT
                ================================================= */}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">
                      Excerpt *
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.excerpt.length}/300
                    </span>
                  </div>

                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    maxLength={300}
                    rows={4}
                    placeholder="Write a short and compelling summary of your blog..."
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                CATEGORY
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">Content Details</h2>

                  <p className="text-sm text-gray-400 mt-0.5">
                    Organize your blog for students.
                  </p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Content Type
                  </label>

                  <select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500"
                  >
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-6 pb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Tag size={16} />
                    Tags
                  </span>
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={addTag}
                    className="px-5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
                  >
                    Add Tag
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-semibold"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                COVER IMAGE
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">Cover Image</h2>

                  <p className="text-sm text-gray-400 mt-0.5">
                    Add an attractive image for your blog.
                  </p>
                </div>
              </div>

              <div className="p-6">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt={coverImageAlt}
                      className="w-full h-[360px] object-cover rounded-2xl"
                    />

                    <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex items-center gap-2 px-5 py-3 bg-white text-red-600 rounded-xl font-bold shadow-lg"
                      >
                        <X size={18} />
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="h-[360px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                      <ImageIcon size={28} />
                    </div>

                    <h3 className="font-bold text-gray-800">
                      Upload Cover Image
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      PNG, JPG or WEBP · Maximum 5MB
                    </p>

                    <span className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">
                      Choose Image
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {imagePreview && (
                  <div className="mt-5">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Image Alt Text *
                    </label>

                    <input
                      type="text"
                      value={coverImageAlt}
                      onChange={(e) => setCoverImageAlt(e.target.value)}
                      placeholder="Describe the image for accessibility and SEO"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                BLOG CONTENT
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">Write Your Blog</h2>

                    <p className="text-sm text-gray-400 mt-0.5">
                      Create valuable content for GuideX students.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
                  <span>{wordCount} words</span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={15} />
                    {readingTime} min read
                  </span>
                </div>
              </div>

              <div className="blog-editor">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: value,
                    }))
                  }
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your blog..."
                />
              </div>
            </section>

            {/* =================================================
                AUTHOR
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Author Information
                  </h2>

                  <p className="text-sm text-gray-400 mt-0.5">
                    Tell readers who created this content.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Author Name
                  </label>

                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Author Bio
                  </label>

                  <textarea
                    name="authorBio"
                    value={formData.authorBio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write a short author biography..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none resize-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                SEO
            ================================================= */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <Search size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">SEO Settings</h2>

                  <p className="text-sm text-gray-400 mt-0.5">
                    Optimize your blog for search engines.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">
                      SEO Title
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.seoTitle.length}/60
                    </span>
                  </div>

                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    maxLength={60}
                    placeholder="SEO optimized title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700">
                      SEO Description
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.seoDescription.length}/160
                    </span>
                  </div>

                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    maxLength={160}
                    rows={4}
                    placeholder="Write a search-friendly description..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none resize-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    SEO Keywords
                  </label>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={seoKeywordInput}
                      onChange={(e) => setSeoKeywordInput(e.target.value)}
                      onKeyDown={handleSeoKeywordKeyDown}
                      placeholder="Type keyword and press Enter"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                    />

                    <button
                      type="button"
                      onClick={addSeoKeyword}
                      className="px-5 rounded-xl bg-gray-900 text-white font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  {formData.seoKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.seoKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600"
                        >
                          {keyword}

                          <button
                            type="button"
                            onClick={() => removeSeoKeyword(keyword)}
                            className="hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* GOOGLE PREVIEW */}

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    <ExternalLink size={14} />
                    Search Preview
                  </div>

                  <p className="text-blue-700 text-lg font-medium truncate">
                    {formData.seoTitle || formData.title || "Your Blog Title"}
                  </p>

                  <p className="text-green-700 text-sm mt-1">
                    guidex.com/blog/
                    {formData.slug || "your-blog"}
                  </p>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    {formData.seoDescription ||
                      formData.excerpt ||
                      "Your blog description will appear here."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="xl:sticky xl:top-28 space-y-6">
            {/* PUBLISH */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Send size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">Publish</h2>

                    <p className="text-xs text-gray-400">
                      Manage blog visibility
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-800">Status</p>

                      <p className="text-xs text-gray-400">Ready to publish</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-green-600">
                    Draft
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit("Published")}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  Publish Blog
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit("Draft")}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  Save as Draft
                </button>
              </div>
            </section>

            {/* BLOG OVERVIEW */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Blog Overview</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Category</span>

                  <span className="text-sm font-semibold text-gray-800">
                    {formData.category || "Not selected"}
                  </span>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Reading time</span>

                  <span className="text-sm font-semibold text-gray-800">
                    {readingTime} min
                  </span>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Word count</span>

                  <span className="text-sm font-semibold text-gray-800">
                    {wordCount}
                  </span>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Tags</span>

                  <span className="text-sm font-semibold text-gray-800">
                    {formData.tags.length}
                  </span>
                </div>
              </div>
            </section>

            {/* BLOG SETTINGS */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-5">Blog Settings</h3>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 mt-0.5 accent-indigo-600"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <Star size={15} className="text-yellow-500" />

                    <p className="font-semibold text-gray-800">Featured Blog</p>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 leading-5">
                    Highlight this blog on the GuideX platform.
                  </p>
                </div>
              </label>

              <div className="h-px bg-gray-100 my-5" />

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.commentsEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      commentsEnabled: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 mt-0.5 accent-indigo-600"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={15} className="text-indigo-500" />

                    <p className="font-semibold text-gray-800">
                      Enable Comments
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 leading-5">
                    Allow students to interact with this blog.
                  </p>
                </div>
              </label>
            </section>

            {/* SCHEDULE */}

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">Schedule</h3>

                  <p className="text-xs text-gray-400">
                    Publish at a specific time
                  </p>
                </div>
              </div>

              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
              />

              <p className="text-xs text-gray-400 mt-2 leading-5">
                Leave empty to publish immediately.
              </p>
            </section>

            {/* MOBILE PREVIEW */}

            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="xl:hidden w-full py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              Preview Blog
            </button>
          </aside>
        </div>
      </main>

      {/* =====================================================
          MOBILE ACTION BAR
      ===================================================== */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit("Draft")}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold flex items-center justify-center gap-2"
          >
            <Save size={17} />
            Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("Published")}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2"
          >
            <Send size={17} />
            Publish
          </button>
        </div>
      </div>

      {/* =====================================================
          CUSTOM STYLES
      ===================================================== */}

      <style>{`
        .blog-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #f1f1f1;
          padding: 16px 20px;
          background: #fafafa;
        }

        .blog-editor .ql-container {
          border: none;
          min-height: 480px;
          font-size: 17px;
        }

        .blog-editor .ql-editor {
          min-height: 480px;
          padding: 28px;
          line-height: 1.8;
        }

        .blog-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 28px;
        }

        .blog-preview-content h1,
        .blog-preview-content h2,
        .blog-preview-content h3,
        .blog-preview-content h4 {
          color: #111827;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .blog-preview-content h1 {
          font-size: 2rem;
        }

        .blog-preview-content h2 {
          font-size: 1.6rem;
        }

        .blog-preview-content h3 {
          font-size: 1.3rem;
        }

        .blog-preview-content p {
          margin-bottom: 1.25rem;
        }

        .blog-preview-content ul,
        .blog-preview-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .blog-preview-content blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }

        .blog-preview-content pre {
          background: #111827;
          color: white;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .blog-preview-content a {
          color: #4f46e5;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AdminBlogForm;
