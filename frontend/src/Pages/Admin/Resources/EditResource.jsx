import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

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
  Save,
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

// =====================================================
// GET ADMIN TOKEN
// =====================================================

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
  description: "",
  category: "Interview Preparation",
  resourceType: "PDF",
  externalUrl: "",
  status: "Draft",
  file: null,
};

export default function EditResource() {
  const navigate = useNavigate();

  const { id } = useParams();

  // =====================================================
  // STATES
  // =====================================================

  const [form, setForm] = useState(initialForm);

  const [resource, setResource] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [removeExistingFile, setRemoveExistingFile] = useState(false);

  // =====================================================
  // FETCH RESOURCE
  // =====================================================

  useEffect(() => {
    if (!id) {
      setError("Resource ID is missing");
      setLoading(false);
      return;
    }

    fetchResource();
  }, [id]);

  // =====================================================
  // GET RESOURCE
  // =====================================================

  const fetchResource = async () => {
    try {
      setLoading(true);

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/resources/admin/${id}`,
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

      const resourceData = data.resource || data.data;

      if (!resourceData) {
        throw new Error("Resource data not found");
      }

      setResource(resourceData);

      setForm({
        title: resourceData.title || "",

        description: resourceData.description || "",

        category: resourceData.category || "Interview Preparation",

        resourceType: resourceData.resourceType || "PDF",

        externalUrl: resourceData.externalUrl || "",

        status: resourceData.status || "Draft",

        file: null,
      });
    } catch (error) {
      console.error("Fetch resource error:", error);

      setError(error.message || "Failed to load resource");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // =================================================
    // FILE
    // =================================================

    if (name === "file") {
      setForm((prev) => ({
        ...prev,

        file: files?.[0] || null,
      }));

      setRemoveExistingFile(false);

      return;
    }

    // =================================================
    // RESOURCE TYPE
    // =================================================

    if (name === "resourceType") {
      setForm((prev) => ({
        ...prev,

        resourceType: value,

        externalUrl: value === "External Link" ? prev.externalUrl : "",

        file: value === "External Link" ? null : prev.file,
      }));

      if (value === "External Link") {
        setRemoveExistingFile(true);
      } else {
        setRemoveExistingFile(false);
      }

      return;
    }

    // =================================================
    // NORMAL INPUT
    // =================================================

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // =====================================================
  // REMOVE EXISTING FILE
  // =====================================================

  const handleRemoveExistingFile = () => {
    setRemoveExistingFile(true);

    setResource((prev) => ({
      ...prev,

      fileUrl: "",
      fileName: "",
      fileSize: 0,
    }));
  };

  // =====================================================
  // UPDATE RESOURCE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      // =================================================
      // VALIDATION
      // =================================================

      if (!form.title.trim()) {
        throw new Error("Please enter a resource title");
      }

      if (!form.description.trim()) {
        throw new Error("Please enter a resource description");
      }

      if (!form.category) {
        throw new Error("Please select a resource category");
      }

      if (!form.resourceType) {
        throw new Error("Please select a resource type");
      }

      // =================================================
      // EXTERNAL LINK VALIDATION
      // =================================================

      if (form.resourceType === "External Link") {
        if (!form.externalUrl.trim()) {
          throw new Error("Please enter the external resource URL");
        }
      }

      // =================================================
      // FILE VALIDATION
      // =================================================

      if (
        form.resourceType !== "External Link" &&
        !form.file &&
        !resource?.fileUrl &&
        !removeExistingFile
      ) {
        throw new Error("Please upload a resource file");
      }

      // =================================================
      // CREATE FORM DATA
      // =================================================

      const formData = new FormData();

      formData.append("title", form.title.trim());

      formData.append("description", form.description.trim());

      formData.append("category", form.category);

      formData.append("resourceType", form.resourceType);

      formData.append("status", form.status);

      // =================================================
      // EXTERNAL URL
      // =================================================

      if (form.resourceType === "External Link") {
        formData.append("externalUrl", form.externalUrl.trim());
      } else {
        formData.append("externalUrl", "");
      }

      // =================================================
      // REMOVE EXISTING FILE
      // =================================================

      formData.append(
        "removeExistingFile",
        removeExistingFile ? "true" : "false"
      );

      // =================================================
      // NEW FILE
      // =================================================

      if (form.file) {
        formData.append("file", form.file);
      }

      // =================================================
      // TOKEN
      // =================================================

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication token not found");
      }

      // =================================================
      // API REQUEST
      // =================================================

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

      // =================================================
      // SUCCESS
      // =================================================

      toast.success("Resource updated successfully");

      // =================================================
      // NAVIGATE
      // =================================================

      setTimeout(() => {
        navigate("/admin/careerResources");
      }, 1200);
    } catch (error) {
      console.error("Update resource error:", error);

      setError(error.message || "Failed to update resource");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING UI
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />

          <p className="text-sm font-semibold text-slate-500">
            Loading resource...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR WITHOUT RESOURCE
  // =====================================================

  if (!resource) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate("/admin/careerResources")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Career Resources
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />

              <p className="font-semibold">{error || "Resource not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/careerResources")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Career Resources
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <BookOpen size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Edit Resource
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update the learning resource details for GuideX students.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />

            {success}
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle size={18} />

            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          {/* ================================================= */}
          {/* BASIC INFORMATION */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the main details about this resource.
              </p>
            </div>

            <div className="space-y-5">
              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Resource Title
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Example: Complete DSA Interview Preparation Guide"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe what students will learn from this resource..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* CLASSIFICATION */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Resource Classification
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose where and how this resource should appear.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* RESOURCE TYPE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Resource Type
                </label>

                <select
                  name="resourceType"
                  value={form.resourceType}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RESOURCE CONTENT */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Resource Content
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Replace the existing file or update the external learning link.
              </p>
            </div>

            {/* ================================================= */}
            {/* FILE */}
            {/* ================================================= */}

            {form.resourceType !== "External Link" && (
              <div className="space-y-5">
                {/* EXISTING FILE */}

                {resource.fileUrl && !removeExistingFile && !form.file && (
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                          <FileText size={21} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Existing Resource
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500 sm:max-w-md">
                            {resource.fileName || "Uploaded file"}
                          </p>

                          {resource.fileSize > 0 && (
                            <p className="mt-1 text-xs text-slate-400">
                              {(resource.fileSize / (1024 * 1024)).toFixed(2)}{" "}
                              MB
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
                        >
                          <ExternalLink size={15} />
                          View
                        </a>

                        <button
                          type="button"
                          onClick={handleRemoveExistingFile}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* FILE REMOVED */}

                {removeExistingFile && !form.file && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                    Existing file will be removed. Please upload a replacement
                    file.
                  </div>
                )}

                {/* NEW FILE SELECTED */}

                {form.file && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText
                          size={20}
                          className="shrink-0 text-emerald-600"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-emerald-800">
                            New file selected
                          </p>

                          <p className="truncate text-xs text-emerald-600">
                            {form.file.name}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            file: null,
                          }))
                        }
                        className="shrink-0 text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* UPLOAD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {resource.fileUrl && !removeExistingFile
                      ? "Replace Resource File"
                      : "Upload Resource File"}

                    <span className="text-red-500"> *</span>
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <Upload size={24} />
                    </div>

                    <p className="text-sm font-bold text-slate-800">
                      {form.file
                        ? form.file.name
                        : "Click to upload replacement file"}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Supported: PDF, DOC, DOCX, PPT, PPTX, ZIP
                    </p>

                    {form.file && (
                      <p className="mt-2 text-xs font-semibold text-indigo-600">
                        {(form.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
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
              </div>
            )}

            {/* ================================================= */}
            {/* EXTERNAL LINK */}
            {/* ================================================= */}

            {form.resourceType === "External Link" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  External Resource URL
                  <span className="text-red-500"> *</span>
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
                    className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <ExternalLink size={14} />
                  Students will be redirected to this website.
                </div>
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* PUBLICATION */}
          {/* ================================================= */}

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Publication Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose whether students can see this resource.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* DRAFT */}

              <label
                className={`cursor-pointer rounded-2xl border p-5 transition ${
                  form.status === "Draft"
                    ? "border-amber-300 bg-amber-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="Draft"
                    checked={form.status === "Draft"}
                    onChange={handleChange}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-slate-800">Save as Draft</p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      The resource will be available only in the admin panel.
                    </p>
                  </div>
                </div>
              </label>

              {/* PUBLISHED */}

              <label
                className={`cursor-pointer rounded-2xl border p-5 transition ${
                  form.status === "Published"
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="Published"
                    checked={form.status === "Published"}
                    onChange={handleChange}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-slate-800">Publish Resource</p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Students will be able to see and access this resource.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-6 sm:flex-row sm:justify-end sm:p-8">
            <button
              type="button"
              onClick={() => navigate("/admin/career-resources")}
              disabled={saving}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
