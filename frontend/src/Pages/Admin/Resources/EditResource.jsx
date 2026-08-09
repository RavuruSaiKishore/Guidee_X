import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Image as ImageIcon,
  Video,
  Clock3,
  UserRound,
  GraduationCap,
  Sparkles,
  Plus,
  X,
  Eye,
  Tag,
  Target,
  Lightbulb,
  ListChecks,
  Award,
  Search,
  Star,
  Trash2,
  Layers,
  Lock,
  FileCode,
  FolderArchive,
  AlignLeft,
  Save,
} from "lucide-react";

import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =====================================================
// CONSTANTS & TAXONOMY
// =====================================================

const categories = [
  "Interview Preparation",
  "Coding Roadmaps",
  "Resume Templates",
  "Career Guidance",
  "Skill Development",
  "System Design",
];

const resourceTypes = [
  "PDF",
  "File",
  "External Link",
  "Interactive Guide",
  "Video Course",
  "Template Pack",
];

const difficulties = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const audienceOptions = [
  "College Students",
  "Freshers",
  "Job Seekers",
  "Working Professionals",
  "Career Switchers",
  "Developers",
  "Students",
];

const videoProviders = ["youtube", "vimeo", "cloudinary", "custom"];

const getToken = () => {
  return (
    localStorage.getItem("AdminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};

// Helper for image URLs
const getImageUrl = (imageObj) => {
  if (!imageObj) return "";
  const path = typeof imageObj === "string" ? imageObj : imageObj.url;
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// =====================================================
// INITIAL FORM STATE
// =====================================================

const initialForm = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  bodyContent: "",

  category: "Interview Preparation",
  subcategory: "",
  resourceType: "PDF",
  difficulty: "Beginner",
  estimatedDuration: "",

  targetAudience: [],

  // Author
  authorName: "GuideX Career Team",
  authorRole: "Career & Learning Team",
  authorBio: "",

  // External Links & Primary Video
  externalUrl: "",
  videoProvider: "youtube",
  videoUrl: "",
  videoDurationInSeconds: 0,

  // Publishing & Access
  status: "Draft",
  isFeatured: false,
  isPremium: false,

  // SEO
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],

  // Dynamic Array Fields
  whatYouWillLearn: [""],
  prerequisites: [""],
  keyTakeaways: [""],
  skills: [],
  tags: [],

  // Sub-document items
  attachments: [], // Existing + new local uploads
  modules: [], // Step-by-step roadmap/chapters

  // Cover / Banner Images
  thumbnail: null,
  bannerImage: null,
};

export default function EditResource() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialForm);
  const [existingResource, setExistingResource] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Previews
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [activePreview, setActivePreview] = useState(false);

  // Chip Inputs
  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // =====================================================
  // FETCH EXISTING RESOURCE DATA
  // =====================================================

  useEffect(() => {
    if (!id) {
      setError("Resource ID is missing");
      setLoading(false);
      return;
    }

    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) throw new Error("Admin authentication token not found");

      const response = await fetch(
        `${API_BASE_URL}/api/resources/details/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch resource");
      }

      const resData = data.resource || data.data;
      if (!resData) throw new Error("Resource details not found");

      setExistingResource(resData);

      // Populate Form State with existing database values
      setForm({
        title: resData.title || "",
        slug: resData.slug || "",
        subtitle: resData.subtitle || "",
        description: resData.description || "",
        bodyContent: resData.bodyContent || "",

        category: resData.category || "Interview Preparation",
        subcategory: resData.subcategory || "",
        resourceType: resData.resourceType || "PDF",
        difficulty: resData.difficulty || "Beginner",
        estimatedDuration: resData.estimatedDuration || "",

        targetAudience: Array.isArray(resData.targetAudience)
          ? resData.targetAudience
          : [],

        // Author
        authorName:
          resData.author?.name || resData.authorName || "GuideX Career Team",
        authorRole:
          resData.author?.role ||
          resData.authorRole ||
          "Career & Learning Team",
        authorBio: resData.author?.bio || "",

        // External Links & Primary Video
        externalUrl: resData.externalUrl || "",
        videoProvider: resData.primaryVideo?.provider || "youtube",
        videoUrl: resData.primaryVideo?.url || resData.videoUrl || "",
        videoDurationInSeconds: resData.primaryVideo?.durationInSeconds || 0,

        // Publishing & Access
        status: resData.status || "Draft",
        isFeatured: Boolean(resData.isFeatured),
        isPremium: Boolean(resData.isPremium),

        // SEO
        seoTitle: resData.seo?.title || resData.seoTitle || "",
        seoDescription:
          resData.seo?.description || resData.seoDescription || "",
        seoKeywords: Array.isArray(resData.seo?.keywords)
          ? resData.seo.keywords
          : [],

        // Dynamic Arrays
        whatYouWillLearn:
          Array.isArray(resData.whatYouWillLearn) &&
          resData.whatYouWillLearn.length
            ? resData.whatYouWillLearn
            : [""],
        prerequisites:
          Array.isArray(resData.prerequisites) && resData.prerequisites.length
            ? resData.prerequisites
            : [""],
        keyTakeaways:
          Array.isArray(resData.keyTakeaways) && resData.keyTakeaways.length
            ? resData.keyTakeaways
            : [""],
        skills: Array.isArray(resData.skills) ? resData.skills : [],
        tags: Array.isArray(resData.tags) ? resData.tags : [],

        // Existing attachments mapped into working array
        attachments: Array.isArray(resData.attachments)
          ? resData.attachments
          : [],
        modules: Array.isArray(resData.modules) ? resData.modules : [],

        thumbnail: null,
        bannerImage: null,
      });

      if (resData.thumbnail) {
        setThumbnailPreview(getImageUrl(resData.thumbnail));
      }
      if (resData.bannerImage) {
        setBannerPreview(getImageUrl(resData.bannerImage));
      }
    } catch (err) {
      console.error("Fetch resource error:", err);
      setError(err.message || "Failed to load resource details");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE FORM INPUT CHANGES
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    // FILE INPUT: THUMBNAIL
    if (name === "thumbnail") {
      const file = files?.[0] || null;
      setForm((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(
        file
          ? URL.createObjectURL(file)
          : getImageUrl(existingResource?.thumbnail)
      );
      return;
    }

    // FILE INPUT: BANNER
    if (name === "bannerImage") {
      const file = files?.[0] || null;
      setForm((prev) => ({ ...prev, bannerImage: file }));
      setBannerPreview(
        file
          ? URL.createObjectURL(file)
          : getImageUrl(existingResource?.bannerImage)
      );
      return;
    }

    // CHECKBOX
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // NORMAL INPUT / SLUG
    if (name === "title") {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-");

      setForm((prev) => ({
        ...prev,
        title: value,
        slug: prev.slug ? prev.slug : autoSlug,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =====================================================
  // MULTI-ATTACHMENT HANDLERS
  // =====================================================

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const newAttachments = selectedFiles.map((file) => {
      let fileType = "other";
      if (file.type.includes("pdf")) fileType = "pdf";
      else if (
        file.name.endsWith(".zip") ||
        file.name.endsWith(".rar") ||
        file.name.endsWith(".7z")
      )
        fileType = "zip";
      else if (
        file.type.includes("word") ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      )
        fileType = "doc";
      else if (file.type.includes("image")) fileType = "image";

      return {
        title: file.name.split(".")[0],
        file,
        fileType,
        fileSize: file.size,
        isNew: true, // Flag new uploads vs existing database attachments
      };
    });

    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
  };

  const removeAttachment = (index) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // MODULES / ROADMAP BUILDER HANDLERS
  // =====================================================

  const addModule = () => {
    setForm((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: "",
          description: "",
          content: "",
          videoUrl: "",
          durationInMinutes: 0,
          isFreePreview: true,
        },
      ],
    }));
  };

  const updateModule = (index, key, value) => {
    setForm((prev) => {
      const updated = [...prev.modules];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, modules: updated };
    });
  };

  const removeModule = (index) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  // =====================================================
  // DYNAMIC ARRAY HELPERS
  // =====================================================

  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleAudience = (audience) => {
    setForm((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter((item) => item !== audience)
        : [...prev.targetAudience, audience],
    }));
  };

  const addChipItem = (field, inputValue, setInputValue) => {
    const val = inputValue.trim();
    if (!val) return;
    if (!form[field].includes(val)) {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], val] }));
    }
    setInputValue("");
  };

  const removeChipItem = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== val),
    }));
  };

  // =====================================================
  // SUBMIT UPDATE
  // =====================================================

  const validateForm = () => {
    if (!form.title.trim()) throw new Error("Please enter a resource title");
    if (!form.subtitle.trim())
      throw new Error("Please enter a resource subtitle");
    if (!form.description.trim())
      throw new Error("Please enter a resource description");
    if (!form.category) throw new Error("Please select a category");
    if (!form.resourceType) throw new Error("Please select a resource type");
    if (!form.estimatedDuration.trim())
      throw new Error("Please enter the estimated duration");
    if (form.targetAudience.length === 0)
      throw new Error("Please select at least one target audience");

    const learningItems = form.whatYouWillLearn.filter((i) => i.trim() !== "");
    if (learningItems.length === 0)
      throw new Error("Please add at least one learning outcome");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      validateForm();

      const formData = new FormData();

      // Basic Identification
      formData.append("title", form.title.trim());
      formData.append("slug", form.slug.trim());
      formData.append("subtitle", form.subtitle.trim());
      formData.append("description", form.description.trim());
      formData.append("bodyContent", form.bodyContent);

      // Taxonomy
      formData.append("category", form.category);
      formData.append("subcategory", form.subcategory.trim());
      formData.append("resourceType", form.resourceType);
      formData.append("difficulty", form.difficulty);
      formData.append("estimatedDuration", form.estimatedDuration.trim());

      // Target Audience
      form.targetAudience.forEach((item) => {
        formData.append("targetAudience", item);
      });

      // Author Payload
      formData.append(
        "author",
        JSON.stringify({
          name: form.authorName.trim(),
          role: form.authorRole.trim(),
          bio: form.authorBio.trim(),
        })
      );

      // Media & Links
      formData.append("externalUrl", form.externalUrl.trim());
      formData.append(
        "primaryVideo",
        JSON.stringify({
          provider: form.videoProvider,
          url: form.videoUrl.trim(),
          durationInSeconds: Number(form.videoDurationInSeconds) || 0,
        })
      );

      // Educational Arrays
      formData.append(
        "whatYouWillLearn",
        JSON.stringify(form.whatYouWillLearn.filter((i) => i.trim() !== ""))
      );
      formData.append(
        "prerequisites",
        JSON.stringify(form.prerequisites.filter((i) => i.trim() !== ""))
      );
      formData.append(
        "keyTakeaways",
        JSON.stringify(form.keyTakeaways.filter((i) => i.trim() !== ""))
      );
      formData.append("skills", JSON.stringify(form.skills));
      formData.append("tags", JSON.stringify(form.tags));

      // Modules
      formData.append("modules", JSON.stringify(form.modules));

      // Publishing & Access
      formData.append("status", form.status);
      formData.append("isFeatured", String(form.isFeatured));
      formData.append("isPremium", String(form.isPremium));

      // SEO
      formData.append(
        "seo",
        JSON.stringify({
          title: form.seoTitle.trim() || form.title.trim(),
          description: form.seoDescription.trim() || form.subtitle.trim(),
          keywords: form.seoKeywords,
        })
      );

      // Binary Covers
      if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
      if (form.bannerImage) formData.append("bannerImage", form.bannerImage);

      // Attachments Manifest (Distinguishes existing vs newly uploaded binary files)
      const attachmentManifest = [];
      let binaryIndex = 0;

      form.attachments.forEach((attachment) => {
        if (attachment.file) {
          const fieldKey = `attachment_file_${binaryIndex}`;
          formData.append(fieldKey, attachment.file);
          attachmentManifest.push({
            title: attachment.title,
            fileType: attachment.fileType,
            fileSize: attachment.fileSize,
            fieldKey,
          });
          binaryIndex++;
        } else if (attachment.fileUrl) {
          // Retain existing saved attachments
          attachmentManifest.push({
            title: attachment.title,
            fileUrl: attachment.fileUrl,
            publicId: attachment.publicId || "",
            fileType: attachment.fileType || "pdf",
            fileSize: attachment.fileSize || 0,
          });
        }
      });

      formData.append("attachmentManifest", JSON.stringify(attachmentManifest));

      // API CALL
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/resources/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update resource");
      }

      setSuccess("Resource updated successfully!");
      toast.success("Resource updated successfully");

      setTimeout(() => {
        navigate("/admin/careerResources");
      }, 1200);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update resource");
      toast.error(err.message || "Failed to update resource");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">
            Loading resource details...
          </p>
        </div>
      </div>
    );
  }

  if (!existingResource && error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate("/admin/careerResources")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to Resources
          </button>
          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle size={36} className="mx-auto text-red-500" />
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              Unable to load resource
            </h3>
            <p className="mt-1 text-xs text-slate-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const previewCover =
    thumbnailPreview ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* TOP HEADER */}
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
                  Edit Resource
                </h1>
              </div>
              <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                Modify learning material, curriculum, media, and publishing
                settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePreview(true)}
              className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex"
            >
              <Eye size={16} /> Preview
            </button>

            <button
              type="submit"
              form="resource-edit-form"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Update Resource
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <Sparkles size={14} /> Resource Management Studio
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Update Career Resource
          </h2>
        </div>

        {/* NOTIFICATIONS */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={19} /> {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Error updating resource</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* FORM GRID */}
        <form
          id="resource-edit-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* 1. CORE IDENTIFICATION */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <FileText size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Core Details & Routing
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Title, slug, and overview.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Resource Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Resource title..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    URL Slug
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-100/70 px-4">
                    <span className="text-xs text-slate-400">/resources/</span>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="custom-slug"
                      className="h-11 w-full bg-transparent text-xs font-semibold text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Subtitle / Tagline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Short punchy tagline..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Resource Overview <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Resource summary..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <AlignLeft size={16} className="text-indigo-600" />
                    Rich Text Article / Inline Content (Markdown/HTML)
                  </label>
                  <textarea
                    name="bodyContent"
                    value={form.bodyContent}
                    onChange={handleChange}
                    rows={8}
                    placeholder="# Complete Guide..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* 2. MULTI-FILE ATTACHMENTS & MEDIA */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <FolderArchive size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Downloadable Attachments & Media
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Manage attached files, external URLs, and video embeds.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100">
                    <Upload size={22} />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Add File Assets
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PDF, ZIP, DOCX, Code files
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />
                </label>

                {form.attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Attached Files ({form.attachments.length})
                    </h4>
                    {form.attachments.map((asset, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                            {asset.fileType === "pdf" && <FileText size={18} />}
                            {asset.fileType === "zip" && (
                              <FolderArchive size={18} />
                            )}
                            {asset.fileType === "code" && (
                              <FileCode size={18} />
                            )}
                            {asset.fileType !== "pdf" &&
                              asset.fileType !== "zip" &&
                              asset.fileType !== "code" && <Upload size={18} />}
                          </div>
                          <div>
                            <input
                              type="text"
                              value={asset.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm((prev) => {
                                  const updated = [...prev.attachments];
                                  updated[idx].title = val;
                                  return { ...prev, attachments: updated };
                                });
                              }}
                              className="bg-transparent text-sm font-bold text-slate-800 outline-none hover:bg-white focus:bg-white"
                            />
                            <p className="text-xs text-slate-400">
                              {asset.isNew ? "New Upload" : "Existing File"} •{" "}
                              {asset.fileType.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      External Resource URL
                    </label>
                    <div className="relative">
                      <LinkIcon
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="url"
                        name="externalUrl"
                        value={form.externalUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Video size={16} className="text-indigo-600" /> Primary
                      Video Settings
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                          Provider
                        </label>
                        <select
                          name="videoProvider"
                          value={form.videoProvider}
                          onChange={handleChange}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold outline-none focus:border-indigo-500"
                        >
                          {videoProviders.map((vp) => (
                            <option key={vp} value={vp}>
                              {vp.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                          Video URL
                        </label>
                        <input
                          type="url"
                          name="videoUrl"
                          value={form.videoUrl}
                          onChange={handleChange}
                          placeholder="https://youtube.com/..."
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                          Duration (Seconds)
                        </label>
                        <input
                          type="number"
                          name="videoDurationInSeconds"
                          value={form.videoDurationInSeconds}
                          onChange={handleChange}
                          placeholder="3600"
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. ROADMAP / CURRICULUM MODULES */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Layers size={19} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Curriculum / Roadmap Sections
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Manage step-by-step learning modules.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                  >
                    <Plus size={15} /> Add Section
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-6 sm:p-8">
                {form.modules.length === 0 ? (
                  <p className="text-center text-xs text-slate-400">
                    No modules added yet.
                  </p>
                ) : (
                  form.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                          Section {idx + 1}
                        </span>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                            <input
                              type="checkbox"
                              checked={mod.isFreePreview}
                              onChange={(e) =>
                                updateModule(
                                  idx,
                                  "isFreePreview",
                                  e.target.checked
                                )
                              }
                              className="accent-indigo-600"
                            />
                            Free Preview
                          </label>

                          <button
                            type="button"
                            onClick={() => removeModule(idx)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                          Module Title
                        </label>
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) =>
                            updateModule(idx, "title", e.target.value)
                          }
                          placeholder="Module Title..."
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                          Short Description
                        </label>
                        <input
                          type="text"
                          value={mod.description}
                          onChange={(e) =>
                            updateModule(idx, "description", e.target.value)
                          }
                          placeholder="Module brief..."
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                          Rich Content / Instructions
                        </label>
                        <textarea
                          value={mod.content}
                          onChange={(e) =>
                            updateModule(idx, "content", e.target.value)
                          }
                          rows={3}
                          placeholder="Lesson content..."
                          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                            Video URL
                          </label>
                          <input
                            type="url"
                            value={mod.videoUrl}
                            onChange={(e) =>
                              updateModule(idx, "videoUrl", e.target.value)
                            }
                            placeholder="https://..."
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                            Duration (Minutes)
                          </label>
                          <input
                            type="number"
                            value={mod.durationInMinutes}
                            onChange={(e) =>
                              updateModule(
                                idx,
                                "durationInMinutes",
                                e.target.value
                              )
                            }
                            placeholder="45"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 4. LEARNING OUTCOMES */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <GraduationCap size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Outcomes & Prerequisites
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Define expected learning gains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 p-6 sm:p-8">
                <DynamicList
                  title="What You'll Learn"
                  description="Key skill gains"
                  icon={<ListChecks size={17} />}
                  field="whatYouWillLearn"
                  items={form.whatYouWillLearn}
                  placeholder="e.g. Design resilient microservices"
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />

                <DynamicList
                  title="Prerequisites"
                  description="Required prior knowledge"
                  icon={<Target size={17} />}
                  field="prerequisites"
                  items={form.prerequisites}
                  placeholder="e.g. Basic understanding of Databases"
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />

                <DynamicList
                  title="Key Takeaways"
                  description="Actionable summaries"
                  icon={<Lightbulb size={17} />}
                  field="keyTakeaways"
                  items={form.keyTakeaways}
                  placeholder="e.g. System Design Cheat Sheet"
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                />
              </div>
            </section>

            {/* 5. TAXONOMY & SEO */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                    <Search size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Skills, Tags & Search Engine Indexing
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Optimize search index settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* Skills */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Skills Covered
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addChipItem("skills", skillInput, setSkillInput))
                      }
                      placeholder="Add a skill..."
                      className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addChipItem("skills", skillInput, setSkillInput)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
                      >
                        {s}
                        <X
                          size={12}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => removeChipItem("skills", s)}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Platform Search Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addChipItem("tags", tagInput, setTagInput))
                      }
                      placeholder="Add a tag..."
                      className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => addChipItem("tags", tagInput, setTagInput)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                      >
                        #{t}
                        <X
                          size={12}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => removeChipItem("tags", t)}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* SEO */}
                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-600">
                      SEO Title Tag
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={form.seoTitle}
                      onChange={handleChange}
                      placeholder="SEO Title"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-600">
                      SEO Description
                    </label>
                    <input
                      type="text"
                      name="seoDescription"
                      value={form.seoDescription}
                      onChange={handleChange}
                      placeholder="SEO Description"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {/* THUMBNAIL & BANNER MEDIA */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900">Cover Media</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Thumbnail & Hero Banner
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Thumbnail Image
                </label>
                <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 flex-col items-center justify-center">
                      <ImageIcon size={20} className="text-slate-400" />
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        Upload Thumbnail
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Banner Image
                </label>
                <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Banner"
                      className="h-28 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-28 flex-col items-center justify-center">
                      <ImageIcon size={20} className="text-slate-400" />
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        Upload Hero Banner
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="bannerImage"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            {/* CLASSIFICATION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Classification</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    name="subcategory"
                    value={form.subcategory}
                    onChange={handleChange}
                    placeholder="Subcategory..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                    Resource Type
                  </label>
                  <select
                    name="resourceType"
                    value={form.resourceType}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-indigo-500"
                  >
                    {resourceTypes.map((rt) => (
                      <option key={rt} value={rt}>
                        {rt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {difficulties.map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, difficulty: lvl }))
                        }
                        className={`rounded-xl border py-2 text-xs font-bold transition ${
                          form.difficulty === lvl
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                    Estimated Duration
                  </label>
                  <div className="relative">
                    <Clock3
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      name="estimatedDuration"
                      value={form.estimatedDuration}
                      onChange={handleChange}
                      placeholder="e.g. 4 hours"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* TARGET AUDIENCE */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-bold text-slate-900">Target Audience</h3>
              <div className="space-y-1.5">
                {audienceOptions.map((aud) => {
                  const sel = form.targetAudience.includes(aud);
                  return (
                    <button
                      type="button"
                      key={aud}
                      onClick={() => toggleAudience(aud)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                        sel
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {aud}
                      {sel && <CheckCircle2 size={15} />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* AUTHOR DETAILS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-bold text-slate-900">
                Author Attribution
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  placeholder="Author Name"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  name="authorRole"
                  value={form.authorRole}
                  onChange={handleChange}
                  placeholder="Author Role"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-indigo-500"
                />
                <textarea
                  name="authorBio"
                  value={form.authorBio}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Author Bio..."
                  className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </section>

            {/* PUBLISHING CONTROLS */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">
                Publishing Controls
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, status: "Draft" }))
                    }
                    className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                      form.status === "Draft"
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, status: "Published" }))
                    }
                    className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                      form.status === "Published"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Publish
                  </button>
                </div>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                    form.isFeatured
                      ? "border-amber-200 bg-amber-50/60"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star
                      size={16}
                      className={
                        form.isFeatured ? "text-amber-600" : "text-slate-400"
                      }
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Featured
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="accent-indigo-600"
                  />
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                    form.isPremium
                      ? "border-indigo-200 bg-indigo-50/60"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lock
                      size={16}
                      className={
                        form.isPremium ? "text-indigo-600" : "text-slate-400"
                      }
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Gated / Premium
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Require registration
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={form.isPremium}
                    onChange={handleChange}
                    className="accent-indigo-600"
                  />
                </label>
              </div>
            </section>
          </aside>
        </form>
      </main>

      {/* PREVIEW MODAL */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Student Portal Preview
              </p>
              <button
                type="button"
                onClick={() => setActivePreview(false)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <img
                src={previewCover}
                alt="Preview"
                className="h-64 w-full rounded-2xl object-cover"
              />

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  {form.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {form.difficulty}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-900">
                {form.title || "Title"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{form.subtitle}</p>

              <div className="my-6 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-slate-900">Overview</h3>
                <p className="mt-2 whitespace-pre-line text-xs text-slate-600">
                  {form.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Dynamic List component
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
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="text-indigo-600">{icon}</div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{title}</h4>
            <p className="text-[10px] text-slate-400">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={placeholder}
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
