import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  BookOpen,
  Upload,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    previewVideoUrl: "",
    category: "Development",
    subCategory: "",
    level: "Beginner",
    language: "English",
    price: 0,
    compareAtPrice: 0,
    isPublished: true,
  });

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [modules, setModules] = useState([
    {
      title: "Module 1: Introduction",
      notesFile: null,
      notesFileName: "",
      notes: [],
      lessons: [
        {
          title: "",
          description: "",
          videoUrl: "",
          duration: 15,
          isPreviewFree: false,
          type: "video",
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("AdminToken");
        const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setForm({
            title: data.course.title || "",
            subtitle: data.course.subtitle || "",
            description: data.course.description || "",
            previewVideoUrl: data.course.previewVideoUrl || "",
            category: data.course.category || "Development",
            subCategory: data.course.subCategory || "",
            level: data.course.level || "Beginner",
            language: data.course.language || "English",
            price: data.course.price || 0,
            compareAtPrice: data.course.compareAtPrice || 0,
            isPublished: data.course.isPublished ?? true,
          });
          setThumbnailUrl(data.course.thumbnail || "");
          setThumbnailPreview(
            data.course.thumbnail?.startsWith("http")
              ? data.course.thumbnail
              : `${API_BASE_URL}${data.course.thumbnail}`
          );
          if (data.course.modules && data.course.modules.length > 0) {
            const formattedModules = data.course.modules.map((mod) => ({
              ...mod,
              notesFile: null,
              notesFileName:
                mod.notes && mod.notes.length > 0
                  ? mod.notes[0].title || "Existing PDF Notes"
                  : "",
            }));
            setModules(formattedModules);
          }
        } else {
          toast.error(data.message || "Failed to load course details");
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        toast.error("Network error while loading course.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, API_BASE_URL]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (modIndex, e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const updated = [...modules];
      updated[modIndex].notesFile = file;
      updated[modIndex].notesFileName = file.name;
      setModules(updated);
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        notesFile: null,
        notesFileName: "",
        notes: [],
        lessons: [
          {
            title: "",
            description: "",
            videoUrl: "",
            duration: 10,
            isPreviewFree: false,
            type: "video",
          },
        ],
      },
    ]);
  };

  const removeModule = (modIndex) => {
    setModules(modules.filter((_, i) => i !== modIndex));
  };

  const addLesson = (modIndex) => {
    const updated = [...modules];
    updated[modIndex].lessons.push({
      title: "",
      description: "",
      videoUrl: "",
      duration: 10,
      isPreviewFree: false,
      type: "video",
    });
    setModules(updated);
  };

  const removeLesson = (modIndex, lesIndex) => {
    const updated = [...modules];
    updated[modIndex].lessons = updated[modIndex].lessons.filter(
      (_, i) => i !== lesIndex
    );
    setModules(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading(
      "Updating course details & PDF notes..."
    );

    try {
      const formData = new FormData();
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else {
        formData.append("thumbnail", thumbnailUrl);
      }

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      modules.forEach((mod, idx) => {
        if (mod.notesFile) {
          formData.append(`module_pdf_${idx}`, mod.notesFile);
        }
      });

      const cleanModules = modules.map((mod) => ({
        title: mod.title,
        notes: mod.notesFile
          ? [
              {
                title: `${mod.title} Notes`,
                fileUrl: `/uploads/${mod.notesFileName}`,
              },
            ]
          : mod.notes || [],
        lessons: mod.lessons,
      }));

      formData.append("modules", JSON.stringify(cleanModules));

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        toast.success("Course updated successfully!");
        navigate("/admin/courses");
      } else {
        toast.error(data.message || "Failed to update course");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Course update error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 font-semibold text-lg animate-pulse">
        Loading edit portal...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-1 font-semibold transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <BookOpen className="text-blue-600" /> Edit Professional Course
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Modify and update your educational course curriculum & module PDF
            notes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., Full-Stack React Bootcamp"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Subtitle / Catchy Tagline
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., Master web development from scratch"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Course Thumbnail / Banner Image *
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-blue-500 bg-gray-50 transition">
                <Upload className="text-gray-400 mb-2" size={24} />
                <span className="text-sm font-semibold text-gray-600">
                  Click to replace banner image
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {thumbnailPreview && (
                <div className="w-32 h-20 rounded-xl overflow-hidden border shadow-sm flex-shrink-0">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Development"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sub-Category
              </label>
              <input
                type="text"
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Web Dev"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="English"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Selling Price ($)
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={(e) =>
                  setForm({ ...form, compareAtPrice: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="199"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Promo Trailer URL
              </label>
              <input
                type="url"
                value={form.previewVideoUrl}
                onChange={(e) =>
                  setForm({ ...form, previewVideoUrl: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Course Description *
            </label>
            <textarea
              required
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Comprehensive course overview..."
            />
          </div>

          {/* Modules Builder */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Curriculum Modules & Lessons
              </h3>
              <button
                type="button"
                onClick={addModule}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100"
              >
                <Plus size={16} /> Add Module
              </button>
            </div>

            {modules.map((mod, modIdx) => (
              <div
                key={modIdx}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Module Title (e.g., Module 1: Introduction)"
                    value={mod.title}
                    onChange={(e) => {
                      const updated = [...modules];
                      updated[modIdx].title = e.target.value;
                      setModules(updated);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold bg-white"
                  />
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(modIdx)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Module PDF Notes Uploader */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-dashed border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium truncate">
                    <FileText
                      size={18}
                      className="text-blue-600 flex-shrink-0"
                    />
                    <span className="truncate">
                      {mod.notesFileName ||
                        (mod.notes && mod.notes.length > 0
                          ? mod.notes[0].title
                          : "Attach Module PDF Notes (Optional)")}
                    </span>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs cursor-pointer hover:bg-blue-100 transition flex-shrink-0">
                    Browse PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handlePdfChange(modIdx, e)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  {mod.lessons.map((lesson, lesIdx) => (
                    <div
                      key={lesIdx}
                      className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Lesson Title"
                          value={lesson.title}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].lessons[lesIdx].title =
                              e.target.value;
                            setModules(updated);
                          }}
                          className="px-3 py-2 rounded-lg border text-sm"
                        />
                        <input
                          type="url"
                          required
                          placeholder="Video Embed URL"
                          value={lesson.videoUrl}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].lessons[lesIdx].videoUrl =
                              e.target.value;
                            setModules(updated);
                          }}
                          className="px-3 py-2 rounded-lg border text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <input
                          type="number"
                          placeholder="Duration (mins)"
                          value={lesson.duration}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].lessons[lesIdx].duration = Number(
                              e.target.value
                            );
                            setModules(updated);
                          }}
                          className="px-3 py-2 rounded-lg border text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Lesson Summary / Description"
                          value={lesson.description}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[modIdx].lessons[lesIdx].description =
                              e.target.value;
                            setModules(updated);
                          }}
                          className="md:col-span-2 px-3 py-2 rounded-lg border text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lesson.isPreviewFree}
                            onChange={(e) => {
                              const updated = [...modules];
                              updated[modIdx].lessons[lesIdx].isPreviewFree =
                                e.target.checked;
                              setModules(updated);
                            }}
                            className="rounded text-blue-600"
                          />
                          Free Preview
                        </label>
                        {mod.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLesson(modIdx, lesIdx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLesson(modIdx)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition"
          >
            Update Course Curriculum
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
