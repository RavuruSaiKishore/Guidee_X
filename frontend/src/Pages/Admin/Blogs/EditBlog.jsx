import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  ExternalLink,
  FileText,
  Loader2,
  MessageCircle,
  Save,
  Search,
  Send,
  Settings2,
  Sparkles,
  Star,
  Tag,
  User,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");

  const [showPreview, setShowPreview] = useState(false);

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

    status: "Draft",

    featured: false,

    commentsEnabled: false,

    authorName: "",
    authorBio: "",

    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
  });

  // =====================================================
  // FETCH BLOG
  // =====================================================

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blog");
      }

      const blog = data.blog;

      console.log("Blog:", blog);

      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",

        category: blog.category || "",
        tags: blog.tags || [],

        contentType: blog.contentType || "Article",
        difficulty: blog.difficulty || "Beginner",

        status: blog.status || "Draft",

        featured: blog.featured ?? false,

        commentsEnabled: blog.commentsEnabled ?? false,

        authorName: blog.authorName || "",
        authorBio: blog.authorBio || "",

        seoTitle: blog.seoTitle || "",
        seoDescription: blog.seoDescription || "",
        seoKeywords: blog.seoKeywords || [],
      });

      setImagePreview(
        blog.coverImage ? `${API_BASE_URL}${blog.coverImage}` : ""
      );

      setCoverImageAlt(blog.coverImageAlt || "");
    } catch (error) {
      console.error("Fetch blog error:", error);

      toast.error(error.message || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
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

  const removeSeoKeyword = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((item) => item !== keyword),
    }));
  };

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
  // READING TIME
  // =====================================================

  const readingTime = useMemo(() => {
    if (!wordCount) return 1;

    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // =====================================================
  // UPDATE BLOG
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter blog title.");
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

    try {
      setSaving(true);

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/admin/blogs/update/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,

            featured: Boolean(formData.featured),

            commentsEnabled: Boolean(formData.commentsEnabled),

            readingTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update blog");
      }

      toast.success("Blog updated successfully!");

      setTimeout(() => {
        navigate(`/admin/blogs/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Update blog error:", error);

      toast.error(error.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-indigo-200 blur-xl opacity-50" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-200">
              <Loader2 size={30} className="animate-spin text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-base font-bold text-gray-800">Loading blog...</p>

            <p className="text-sm text-gray-400 mt-1">Preparing your editor</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PREVIEW
  // =====================================================

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <ToastContainer position="top-right" />

        {/* PREVIEW HEADER */}

        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-indigo-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Eye size={16} className="text-white" />
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Blog Preview
                </p>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mt-2">
                {formData.title || "Untitled Blog"}
              </h1>
            </div>

            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-100 bg-white text-gray-700 font-semibold hover:bg-indigo-50 transition"
            >
              <ArrowLeft size={18} />
              Back to Editor
            </button>
          </div>
        </header>

        {/* PREVIEW CONTENT */}

        <main className="max-w-5xl mx-auto px-6 py-10">
          <article className="bg-white rounded-3xl overflow-hidden border border-indigo-100 shadow-[0_20px_60px_rgba(79,70,229,0.10)]">
            {/* COVER IMAGE */}

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt={coverImageAlt || formData.title}
                  className="w-full h-[420px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            )}

            <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
              {/* META */}

              <div className="flex flex-wrap gap-3 items-center">
                {formData.category && (
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
                    {formData.category}
                  </span>
                )}

                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-sm font-medium">
                  {formData.contentType}
                </span>

                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold">
                  {formData.difficulty}
                </span>
              </div>

              {/* TITLE */}

              <h1 className="text-4xl md:text-5xl font-black text-gray-950 leading-tight mt-7">
                {formData.title || "Untitled Blog"}
              </h1>

              {/* EXCERPT */}

              <p className="text-xl text-gray-500 leading-8 mt-6">
                {formData.excerpt}
              </p>

              {/* AUTHOR META */}

              <div className="flex flex-wrap items-center gap-5 mt-7 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <User size={15} className="text-white" />
                  </div>

                  <span className="font-semibold text-gray-700">
                    {formData.authorName || "GuideX Team"}
                  </span>
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {readingTime} min read
                </span>
              </div>

              {/* TAGS */}

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-7">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent my-10" />

              {/* BLOG CONTENT */}

              <div
                className="blog-preview-content text-gray-800 text-lg leading-8"
                dangerouslySetInnerHTML={{
                  __html: formData.content,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/50">
      <ToastContainer position="top-right" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-indigo-100 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-6">
            {/* LEFT */}

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-11 h-11 rounded-xl border border-indigo-100 bg-white flex items-center justify-center text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <FileText size={14} className="text-white" />
                  </div>

                  <span className="text-sm font-bold text-indigo-600">
                    Blog Manager
                  </span>
                </div>

                <h1 className="text-xl font-bold text-gray-900 mt-0.5">
                  Edit Blog
                </h1>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-100 bg-white text-gray-700 font-semibold hover:bg-indigo-50 transition"
              >
                <Eye size={17} />
                Preview
              </button>

              <button
                type="submit"
                form="edit-blog-form"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-[1500px] mx-auto px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <form id="edit-blog-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="space-y-6">
              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <section className="bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-[0_8px_30px_rgba(79,70,229,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Basic Information
                    </h2>

                    <p className="text-sm text-gray-400 mt-0.5">
                      Update the main information of your blog.
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* TITLE */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Blog Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={200}
                      placeholder="Enter your blog title..."
                      className="w-full px-4 py-3.5 text-lg border border-gray-200 rounded-xl bg-gradient-to-r from-white to-indigo-50/20 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/70 transition-all"
                    />
                  </div>

                  {/* SLUG */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      URL Slug
                    </label>

                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100/70 transition-all">
                      <span className="px-4 text-sm text-indigo-500 font-medium border-r border-gray-200 bg-indigo-50/50">
                        /blog/
                      </span>

                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* EXCERPT */}

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold text-gray-700">
                        Excerpt
                      </label>

                      <span className="text-xs font-semibold text-indigo-400">
                        {formData.excerpt.length}
                        /300
                      </span>
                    </div>

                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      maxLength={300}
                      rows={4}
                      placeholder="Write a short description of your blog..."
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-indigo-50/20 outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/70 transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  CONTENT DETAILS
              ================================================= */}

              <section className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-[0_8px_30px_rgba(124,58,237,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/40 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-200">
                    <BookOpen size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">Content Details</h2>

                    <p className="text-sm text-gray-400 mt-0.5">
                      Organize your blog content.
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* CATEGORY */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CONTENT TYPE */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Content Type
                    </label>

                    <select
                      name="contentType"
                      value={formData.contentType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    >
                      {contentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DIFFICULTY */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Difficulty
                    </label>

                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TAGS */}

                <div className="px-6 pb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Tag size={16} className="text-indigo-500" />
                      Tags
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type tag and press Enter"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    />

                    <button
                      type="button"
                      onClick={addTag}
                      className="px-5 rounded-xl bg-gradient-to-r from-gray-900 to-indigo-950 text-white font-semibold hover:from-indigo-900 hover:to-purple-950 transition shadow-lg shadow-gray-200"
                    >
                      Add
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-indigo-700 text-sm font-semibold shadow-sm"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 transition"
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
                  BLOG CONTENT
              ================================================= */}

              <section className="bg-white/90 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-[0_8px_30px_rgba(249,115,22,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50/70 via-white to-amber-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">Blog Content</h2>

                      <p className="text-sm text-gray-400 mt-0.5">
                        Edit your blog content.
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
                    <span className="font-semibold">{wordCount} words</span>

                    <span className="flex items-center gap-1.5 font-semibold">
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
                  />
                </div>
              </section>

              {/* =================================================
                  AUTHOR
              ================================================= */}

              <section className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-[0_8px_30px_rgba(37,99,235,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                    <User size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Author Information
                    </h2>

                    <p className="text-sm text-gray-400">
                      Manage the blog author details.
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-blue-50/20 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-blue-50/20 outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  SEO
              ================================================= */}

              <section className="bg-white/90 backdrop-blur-sm rounded-2xl border border-yellow-100 shadow-[0_8px_30px_rgba(234,179,8,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-yellow-100 bg-gradient-to-r from-yellow-50/70 via-white to-orange-50/30 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-yellow-200">
                    <Search size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">SEO Settings</h2>

                    <p className="text-sm text-gray-400">
                      Optimize your blog for search engines.
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* SEO TITLE */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      SEO Title
                    </label>

                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    />
                  </div>

                  {/* SEO DESCRIPTION */}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      SEO Description
                    </label>

                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleChange}
                      maxLength={160}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                    />
                  </div>

                  {/* SEO KEYWORDS */}

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
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60 transition"
                      />

                      <button
                        type="button"
                        onClick={addSeoKeyword}
                        className="px-5 rounded-xl bg-gradient-to-r from-gray-900 to-indigo-950 text-white font-semibold hover:from-indigo-900 hover:to-purple-950 transition"
                      >
                        Add
                      </button>
                    </div>

                    {formData.seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {formData.seoKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600"
                          >
                            {keyword}

                            <button
                              type="button"
                              onClick={() => removeSeoKeyword(keyword)}
                              className="hover:text-red-500 transition"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SEARCH PREVIEW */}

                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">
                      <ExternalLink size={14} />
                      Search Preview
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                      <p className="text-blue-700 text-lg font-medium truncate">
                        {formData.seoTitle ||
                          formData.title ||
                          "Your Blog Title"}
                      </p>

                      <p className="text-green-700 text-sm mt-1 truncate">
                        guidex.com/blog/
                        {formData.slug || "your-blog-slug"}
                      </p>

                      <p className="text-sm text-gray-600 mt-2 leading-6">
                        {formData.seoDescription ||
                          formData.excerpt ||
                          "Your blog description will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <aside className="xl:sticky xl:top-28 space-y-6">
              {/* =================================================
                  PUBLISH
              ================================================= */}

              <section className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/50 rounded-2xl border border-indigo-100 shadow-[0_10px_35px_rgba(79,70,229,0.08)] overflow-hidden">
                <div className="px-5 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
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
                  {/* STATUS */}

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-indigo-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={20}
                        className={
                          formData.status === "Published"
                            ? "text-emerald-500"
                            : "text-gray-400"
                        }
                      />

                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          Status
                        </p>

                        <p className="text-xs text-gray-400">
                          Current blog status
                        </p>
                      </div>
                    </div>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-indigo-100 bg-white text-sm font-semibold outline-none focus:border-indigo-500"
                    >
                      <option value="Draft">Draft</option>

                      <option value="Published">Published</option>

                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}

                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </section>

              {/* =================================================
                  BLOG SETTINGS
              ================================================= */}

              <section className="bg-gradient-to-br from-white to-indigo-50/40 rounded-2xl border border-indigo-100 shadow-[0_8px_30px_rgba(79,70,229,0.06)] p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Settings2 size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">Blog Settings</h3>

                    <p className="text-xs text-gray-400">Manage blog options</p>
                  </div>
                </div>

                {/* FEATURED */}

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-yellow-50/70 transition">
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

                      <p className="font-semibold text-gray-800">
                        Featured Blog
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 leading-5">
                      Highlight this blog on GuideX.
                    </p>
                  </div>
                </label>

                <div className="h-px bg-indigo-100 my-5" />

                {/* COMMENTS */}

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-indigo-50/70 transition">
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
                      <MessageCircle
                        size={15}
                        className={
                          formData.commentsEnabled
                            ? "text-indigo-500"
                            : "text-gray-400"
                        }
                      />

                      <p className="font-semibold text-gray-800">
                        Enable Comments
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 leading-5">
                      {formData.commentsEnabled
                        ? "Students can comment on this blog."
                        : "Comments are disabled for this blog."}
                    </p>
                  </div>
                </label>

                {/* COMMENT STATUS */}

                <div
                  className={`mt-5 p-4 rounded-xl border transition ${
                    formData.commentsEnabled
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        formData.commentsEnabled
                          ? "bg-emerald-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <MessageCircle
                        size={17}
                        className={
                          formData.commentsEnabled
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        Comment Status
                      </p>

                      <p
                        className={`text-sm font-semibold ${
                          formData.commentsEnabled
                            ? "text-emerald-600"
                            : "text-gray-500"
                        }`}
                      >
                        {formData.commentsEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  BLOG OVERVIEW
              ================================================= */}

              <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-2xl border border-indigo-900 shadow-xl shadow-indigo-200/30 p-5 text-white">
                <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                  <Sparkles size={17} className="text-purple-300" />
                  Blog Overview
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-200">Category</span>

                    <span className="text-sm font-semibold text-white">
                      {formData.category || "Not selected"}
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-200">
                      Reading time
                    </span>

                    <span className="text-sm font-semibold text-white">
                      {readingTime} min
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-200">Word count</span>

                    <span className="text-sm font-semibold text-white">
                      {wordCount}
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-200">Tags</span>

                    <span className="text-sm font-semibold text-white">
                      {formData.tags.length}
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-200">Comments</span>

                    <span
                      className={`text-sm font-bold ${
                        formData.commentsEnabled
                          ? "text-emerald-300"
                          : "text-gray-400"
                      }`}
                    >
                      {formData.commentsEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </main>

      {/* =====================================================
          MOBILE ACTION BAR
      ===================================================== */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-indigo-100 p-3 shadow-[0_-10px_30px_rgba(79,70,229,0.08)]">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex-1 py-3 rounded-xl border border-indigo-100 bg-white text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition"
          >
            <Eye size={17} />
            Preview
          </button>

          <button
            type="submit"
            form="edit-blog-form"
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </div>

      {/* =====================================================
          EDITOR + PREVIEW STYLES
      ===================================================== */}

      <style>{`
        /* =====================================================
           QUILL EDITOR
        ===================================================== */

        .blog-editor {
          background: linear-gradient(
            135deg,
            rgba(249, 250, 251, 0.8),
            rgba(238, 242, 255, 0.4)
          );
        }

        .blog-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 20px;
          background: linear-gradient(
            to right,
            #fafaff,
            #f5f3ff
          );
        }

        .blog-editor .ql-container {
          border: none;
          min-height: 480px;
          font-size: 17px;
          background: white;
        }

        .blog-editor .ql-editor {
          min-height: 480px;
          padding: 32px;
          line-height: 1.8;
        }

        .blog-editor .ql-editor:focus {
          background: linear-gradient(
            to bottom right,
            #ffffff,
            #fafaff
          );
        }

        .blog-editor .ql-toolbar button:hover,
        .blog-editor .ql-toolbar button.ql-active {
          color: #6366f1;
        }

        .blog-editor
          .ql-toolbar
          .ql-picker-label:hover {
          color: #6366f1;
        }

        /* =====================================================
           BLOG PREVIEW CONTENT
        ===================================================== */

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

        .blog-preview-content li {
          margin-bottom: 0.5rem;
        }

        .blog-preview-content blockquote {
          border-left: 4px solid #6366f1;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
          background: linear-gradient(
            to right,
            #eef2ff,
            #faf5ff
          );
          border-radius: 0 12px 12px 0;
        }

        .blog-preview-content pre {
          background: linear-gradient(
            135deg,
            #111827,
            #312e81
          );
          color: white;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .blog-preview-content code {
          background: #eef2ff;
          color: #4338ca;
          padding: 0.2rem 0.4rem;
          border-radius: 0.35rem;
          font-size: 0.9em;
        }

        .blog-preview-content pre code {
          background: transparent;
          color: white;
          padding: 0;
        }

        .blog-preview-content a {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: underline;
        }

        .blog-preview-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1.5rem 0;
        }

        /* =====================================================
           SCROLLBAR
        ===================================================== */

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f8fafc;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            #818cf8,
            #a78bfa
          );
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            #6366f1,
            #8b5cf6
          );
        }
      `}</style>
    </div>
  );
};

export default EditBlog;
