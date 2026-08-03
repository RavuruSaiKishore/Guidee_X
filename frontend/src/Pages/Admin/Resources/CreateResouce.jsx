import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Clock3,
  UserRound,
  GraduationCap,
  Sparkles,
  Plus,
  X,
  Eye,
  Globe2,
  Tag,
  Target,
  Lightbulb,
  ListChecks,
  Award,
  Search,
  Star,
  Trash2,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// CONSTANTS
// =====================================================

const categories = [
  "Interview Preparation",
  "Coding Roadmaps",
  "Resume Templates",
  "Career Guidance",
  "Skill Development",
];

const resourceTypes = ["PDF", "File", "External Link"];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const audienceOptions = [
  "College Students",
  "Freshers",
  "Job Seekers",
  "Working Professionals",
  "Career Switchers",
  "Developers",
  "Students",
];

const getToken = () => {
  return (
    localStorage.getItem("AdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  title: "",
  subtitle: "",
  description: "",

  category: "Interview Preparation",

  resourceType: "PDF",

  difficulty: "Beginner",

  estimatedDuration: "",

  targetAudience: [],

  authorName: "GuideX Career Team",

  authorRole: "Career & Learning Team",

  externalUrl: "",

  videoUrl: "",

  status: "Draft",

  isFeatured: false,

  seoTitle: "",

  seoDescription: "",

  whatYouWillLearn: [""],

  prerequisites: [""],

  keyTakeaways: [""],

  skills: [],

  tags: [],

  file: null,

  thumbnail: null,
};

// =====================================================
// COMPONENT
// =====================================================

export default function CreateResource() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [activePreview, setActivePreview] = useState(false);

  const [skillInput, setSkillInput] = useState("");

  const [tagInput, setTagInput] = useState("");

  // =====================================================
  // HANDLE NORMAL INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    // FILE INPUT
    if (name === "file") {
      setForm((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));

      return;
    }

    // THUMBNAIL INPUT
    if (name === "thumbnail") {
      const file = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      if (file) {
        setThumbnailPreview(URL.createObjectURL(file));
      } else {
        setThumbnailPreview("");
      }

      return;
    }

    // CHECKBOX
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    // NORMAL INPUT
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // DYNAMIC ARRAY INPUT
  // =====================================================

  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];

      updated[index] = value;

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  // =====================================================
  // ADD ARRAY ITEM
  // =====================================================

  const addArrayItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // =====================================================
  // REMOVE ARRAY ITEM
  // =====================================================

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // TARGET AUDIENCE
  // =====================================================

  const toggleAudience = (audience) => {
    setForm((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter((item) => item !== audience)
        : [...prev.targetAudience, audience],
    }));
  };

  // =====================================================
  // ADD SKILL
  // =====================================================

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (form.skills.includes(value)) {
      setSkillInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, value],
    }));

    setSkillInput("");
  };

  // =====================================================
  // REMOVE SKILL
  // =====================================================

  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skill),
    }));
  };

  // =====================================================
  // ADD TAG
  // =====================================================

  const addTag = () => {
    const value = tagInput.trim().toLowerCase();

    if (!value) return;

    if (form.tags.includes(value)) {
      setTagInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, value],
    }));

    setTagInput("");
  };

  // =====================================================
  // REMOVE TAG
  // =====================================================

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      throw new Error("Please enter a resource title");
    }

    if (!form.subtitle.trim()) {
      throw new Error("Please enter a resource subtitle");
    }

    if (!form.description.trim()) {
      throw new Error("Please enter a resource description");
    }

    if (!form.category) {
      throw new Error("Please select a category");
    }

    if (!form.resourceType) {
      throw new Error("Please select a resource type");
    }

    if (!form.estimatedDuration.trim()) {
      throw new Error("Please enter the estimated learning duration");
    }

    if (form.targetAudience.length === 0) {
      throw new Error("Please select at least one target audience");
    }

    if (!form.authorName.trim()) {
      throw new Error("Please enter the author name");
    }

    const learningItems = form.whatYouWillLearn.filter(
      (item) => item.trim() !== ""
    );

    if (learningItems.length === 0) {
      throw new Error("Please add at least one learning outcome");
    }

    if (form.resourceType === "External Link" && !form.externalUrl.trim()) {
      throw new Error("Please enter the external resource URL");
    }

    if (form.resourceType !== "External Link" && !form.file) {
      throw new Error("Please upload a resource file");
    }
  };

  // =====================================================
  // CREATE RESOURCE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      // VALIDATE
      validateForm();

      // =================================================
      // FORM DATA
      // =================================================

      const formData = new FormData();

      // BASIC
      formData.append("title", form.title.trim());

      formData.append("subtitle", form.subtitle.trim());

      formData.append("description", form.description.trim());

      // CLASSIFICATION
      formData.append("category", form.category);

      formData.append("resourceType", form.resourceType);

      formData.append("difficulty", form.difficulty);

      formData.append("estimatedDuration", form.estimatedDuration.trim());

      // AUDIENCE
      form.targetAudience.forEach((item) => {
        formData.append("targetAudience", item);
      });

      // AUTHOR
      formData.append("authorName", form.authorName.trim());

      formData.append("authorRole", form.authorRole.trim());

      // CONTENT
      formData.append(
        "whatYouWillLearn",
        JSON.stringify(
          form.whatYouWillLearn.filter((item) => item.trim() !== "")
        )
      );

      formData.append(
        "prerequisites",
        JSON.stringify(form.prerequisites.filter((item) => item.trim() !== ""))
      );

      formData.append(
        "keyTakeaways",
        JSON.stringify(form.keyTakeaways.filter((item) => item.trim() !== ""))
      );

      // SKILLS
      formData.append("skills", JSON.stringify(form.skills));

      // TAGS
      formData.append("tags", JSON.stringify(form.tags));

      // LINKS
      formData.append("externalUrl", form.externalUrl.trim());

      formData.append("videoUrl", form.videoUrl.trim());

      // STATUS
      formData.append("status", form.status);

      formData.append("isFeatured", String(form.isFeatured));

      // SEO
      formData.append("seoTitle", form.seoTitle.trim());

      formData.append("seoDescription", form.seoDescription.trim());

      // FILE
      if (form.file) {
        formData.append("file", form.file);
      }

      // THUMBNAIL
      if (form.thumbnail) {
        formData.append("thumbnail", form.thumbnail);
      }

      // =================================================
      // API REQUEST
      // =================================================

      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/api/resources/create`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create resource");
      }

      setSuccess("Resource created successfully");

      setTimeout(() => {
        navigate("/admin/careerResources");
      }, 1200);
    } catch (error) {
      console.error("Create resource error:", error);

      setError(error.message || "Failed to create resource");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const previewImage =
    thumbnailPreview ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/careerResources")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <BookOpen size={17} />
                </div>

                <h1 className="text-lg font-bold text-slate-900">
                  Create Resource
                </h1>
              </div>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                Build and publish a valuable learning resource for GuideX
                students.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePreview(true)}
              className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex"
            >
              <Eye size={16} />
              Preview
            </button>

            <button
              type="submit"
              form="resource-form"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  {form.status === "Published"
                    ? "Publish Resource"
                    : "Save Resource"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* PAGE INTRO */}

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <Sparkles size={14} />
            Resource Publishing Studio
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Create something students will love
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add useful career and learning content with clear outcomes,
            structured information, and a professional presentation.
          </p>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-bold">Unable to create resource</p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          id="resource-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
        >
          {/* ================================================= */}
          {/* LEFT COLUMN */}
          {/* ================================================= */}

          <div className="space-y-6">
            {/* ================================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <FileText size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Basic Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Introduce your resource to students.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Resource Title
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Complete DSA Interview Preparation Guide"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* SUBTITLE */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Short Subtitle
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Master data structures and algorithms with an interview-focused roadmap."
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700">
                      Resource Description
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <span className="text-xs text-slate-400">
                      {form.description.length} characters
                    </span>
                  </div>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Describe what this resource covers, who it is for, and why students should use it..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* LEARNING OUTCOMES */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <GraduationCap size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Learning Outcomes
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Tell students exactly what they will gain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 p-6 sm:p-8">
                {/* WHAT YOU WILL LEARN */}

                <DynamicList
                  title="What You'll Learn"
                  description="Add the main skills or concepts students will learn."
                  icon={<ListChecks size={17} />}
                  field="whatYouWillLearn"
                  items={form.whatYouWillLearn}
                  placeholder="Example: Solve common DSA interview problems"
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />

                {/* PREREQUISITES */}

                <DynamicList
                  title="Prerequisites"
                  description="What should students know before starting?"
                  icon={<Target size={17} />}
                  field="prerequisites"
                  items={form.prerequisites}
                  placeholder="Example: Basic knowledge of programming"
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />

                {/* TAKEAWAYS */}

                <DynamicList
                  title="Key Takeaways"
                  description="Highlight the most valuable outcomes."
                  icon={<Lightbulb size={17} />}
                  field="keyTakeaways"
                  items={form.keyTakeaways}
                  placeholder="Example: Build confidence for technical interviews"
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* RESOURCE CONTENT */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Upload size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Resource Content
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Upload the actual learning material.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* RESOURCE TYPE */}

                <div>
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    Resource Type
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {resourceTypes.map((type) => {
                      const selected = form.resourceType === type;

                      return (
                        <label
                          key={type}
                          className={`cursor-pointer rounded-2xl border p-4 transition ${
                            selected
                              ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="resourceType"
                            value={type}
                            checked={selected}
                            onChange={handleChange}
                            className="sr-only"
                          />

                          <div className="flex items-center gap-3">
                            {type === "PDF" && (
                              <FileText
                                size={20}
                                className={
                                  selected
                                    ? "text-indigo-600"
                                    : "text-slate-400"
                                }
                              />
                            )}

                            {type === "File" && (
                              <Upload
                                size={20}
                                className={
                                  selected
                                    ? "text-indigo-600"
                                    : "text-slate-400"
                                }
                              />
                            )}

                            {type === "External Link" && (
                              <LinkIcon
                                size={20}
                                className={
                                  selected
                                    ? "text-indigo-600"
                                    : "text-slate-400"
                                }
                              />
                            )}

                            <span className="text-sm font-bold text-slate-800">
                              {type}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* FILE */}

                {form.resourceType !== "External Link" && (
                  <div>
                    <label className="mb-3 block text-sm font-bold text-slate-700">
                      Upload Resource File
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100 transition group-hover:scale-105">
                        <Upload size={25} />
                      </div>

                      <p className="text-sm font-bold text-slate-800">
                        {form.file
                          ? form.file.name
                          : "Click to upload your resource"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        PDF, DOC, DOCX, PPT, PPTX, ZIP
                      </p>

                      {form.file && (
                        <div className="mt-4 flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700">
                          <FileText size={13} />
                          {(form.file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      )}

                      <input
                        type="file"
                        name="file"
                        onChange={handleChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                      />
                    </label>
                  </div>
                )}

                {/* EXTERNAL LINK */}

                {form.resourceType === "External Link" && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      External Resource URL
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <LinkIcon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="url"
                        name="externalUrl"
                        value={form.externalUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/learning-resource"
                        className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                )}

                {/* VIDEO URL */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Optional Video URL
                  </label>

                  <div className="relative">
                    <Video
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* SKILLS & TAGS */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Award size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Skills & Discovery
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Help students discover your resource.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 p-6 sm:p-8">
                {/* SKILLS */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Skills Covered
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Example: Data Structures"
                      className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={addSkill}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700"
                    >
                      <Plus size={19} />
                    </button>
                  </div>

                  {form.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {form.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-500"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* TAGS */}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Search Tags
                  </label>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Example: dsa"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addTag}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800"
                    >
                      <Plus size={19} />
                    </button>
                  </div>

                  {form.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* SEO */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                    <Search size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Search Optimization
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Improve how your resource appears in search.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    SEO Title
                  </label>

                  <input
                    type="text"
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    placeholder="Complete DSA Interview Preparation Guide"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    SEO Description
                  </label>

                  <textarea
                    name="seoDescription"
                    value={form.seoDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Learn DSA and prepare for coding interviews with this comprehensive career resource."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside className="space-y-6">
            {/* ================================================= */}
            {/* COVER IMAGE */}
            {/* ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900">Cover Image</h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Add an attractive image for your resource.
                  </p>
                </div>

                <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 flex-col items-center justify-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                        <ImageIcon size={21} />
                      </div>

                      <p className="text-sm font-bold text-slate-600">
                        Upload Cover Image
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PNG, JPG or WEBP
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800">
                      Change Image
                    </span>
                  </div>

                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleChange}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            {/* ================================================= */}
            {/* RESOURCE DETAILS */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <h3 className="font-bold text-slate-900">Resource Details</h3>
              </div>

              <div className="space-y-5 p-5">
                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DIFFICULTY */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Difficulty
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {difficulties.map((level) => {
                      const selected = form.difficulty === level;

                      return (
                        <button
                          type="button"
                          key={level}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              difficulty: level,
                            }))
                          }
                          className={`rounded-xl border px-2 py-3 text-xs font-bold transition ${
                            selected
                              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DURATION */}

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Estimated Duration
                  </label>

                  <div className="relative">
                    <Clock3
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="estimatedDuration"
                      value={form.estimatedDuration}
                      onChange={handleChange}
                      placeholder="8 hours"
                      className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* TARGET AUDIENCE */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-2">
                  <Target size={17} className="text-indigo-600" />

                  <h3 className="font-bold text-slate-900">Target Audience</h3>
                </div>
              </div>

              <div className="space-y-2 p-5">
                {audienceOptions.map((audience) => {
                  const selected = form.targetAudience.includes(audience);

                  return (
                    <button
                      type="button"
                      key={audience}
                      onClick={() => toggleAudience(audience)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-xs font-semibold transition ${
                        selected
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {audience}

                      {selected && <CheckCircle2 size={16} />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ================================================= */}
            {/* AUTHOR */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-2">
                  <UserRound size={17} className="text-violet-600" />

                  <h3 className="font-bold text-slate-900">
                    Author Information
                  </h3>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <input
                  type="text"
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <input
                  type="text"
                  name="authorRole"
                  value={form.authorRole}
                  onChange={handleChange}
                  placeholder="Author role"
                  className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* PUBLISHING */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-2">
                  <Globe2 size={17} className="text-emerald-600" />

                  <h3 className="font-bold text-slate-900">Publishing</h3>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {/* STATUS */}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        status: "Draft",
                      }))
                    }
                    className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
                      form.status === "Draft"
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        status: "Published",
                      }))
                    }
                    className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
                      form.status === "Published"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Publish
                  </button>
                </div>

                {/* FEATURED */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    form.isFeatured
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        form.isFeatured
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Star size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Featured Resource
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Highlight this resource.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-5 w-5 accent-indigo-600"
                  />
                </label>
              </div>
            </section>

            {/* ================================================= */}
            {/* MOBILE PREVIEW */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => setActivePreview(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 xl:hidden"
            >
              <Eye size={17} />
              Preview Resource
            </button>
          </aside>
        </form>
      </main>

      {/* ================================================= */}
      {/* PREVIEW MODAL */}
      {/* ================================================= */}

      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* PREVIEW HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Student Preview
                </p>

                <h3 className="mt-1 font-bold text-slate-900">
                  How students will see this resource
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActivePreview(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* PREVIEW CONTENT */}

            <div>
              <img
                src={previewImage}
                alt="Resource preview"
                className="h-64 w-full object-cover"
              />

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                    {form.category}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                    {form.difficulty}
                  </span>

                  {form.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
                  {form.title || "Your Resource Title"}
                </h2>

                <p className="mt-3 text-base font-medium leading-7 text-slate-500">
                  {form.subtitle || "Your resource subtitle will appear here."}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={15} />
                    {form.estimatedDuration || "Duration not specified"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <UserRound size={15} />
                    {form.authorName || "GuideX Career Team"}
                  </span>
                </div>

                <div className="my-7 h-px bg-slate-100" />

                <h3 className="text-lg font-bold text-slate-900">
                  About this resource
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {form.description ||
                    "Your resource description will appear here."}
                </p>

                {form.whatYouWillLearn.filter((item) => item.trim()).length >
                  0 && (
                  <div className="mt-8 rounded-2xl bg-emerald-50 p-5">
                    <h3 className="flex items-center gap-2 font-bold text-emerald-900">
                      <CheckCircle2 size={18} />
                      What You'll Learn
                    </h3>

                    <ul className="mt-4 space-y-3">
                      {form.whatYouWillLearn
                        .filter((item) => item.trim())
                        .map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-sm text-emerald-800"
                          >
                            <CheckCircle2
                              size={16}
                              className="mt-0.5 shrink-0"
                            />

                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {form.skills.length > 0 && (
                  <div className="mt-7">
                    <h3 className="text-sm font-bold text-slate-900">
                      Skills Covered
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs text-slate-500">Published by</p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {form.authorName || "GuideX Career Team"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {form.authorRole || "Career & Learning Team"}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <BookOpen size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW FOOTER */}

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-5">
              <button
                type="button"
                onClick={() => setActivePreview(false)}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// DYNAMIC LIST COMPONENT
// =====================================================

function DynamicList({
  title,
  description,
  icon,
  field,
  items,
  placeholder,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
}) {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-indigo-600">{icon}</div>

            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          </div>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
              {index + 1}
            </div>

            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={placeholder}
              className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
