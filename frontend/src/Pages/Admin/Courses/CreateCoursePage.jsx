import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  BookOpen,
  Upload,
  Sparkles,
  ArrowLeft,
  FileText,
  FileCheck,
  Code,
} from "lucide-react";
import { toast } from "react-toastify";

const CreateCoursePage = () => {
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

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [modules, setModules] = useState([
    {
      title: "Module 1: Introduction",
      notesFile: null,
      notesFileName: "",
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
      assignment: {
        title: "Module Assessment",
        description: "10 MCQ Assessment",
        questions: [],
      },
      codingProblem: {
        title: "",
        problemSlug: "",
        difficulty: "Medium",
        description: "",
      },
    },
  ]);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Helper function to check if the course or module is coding/technical related
  const isCodingRelated = () => {
    const cat = form.category.toLowerCase();
    const sub = form.subCategory.toLowerCase();
    const title = form.title.toLowerCase();
    const desc = form.description.toLowerCase();

    const codingKeywords = [
      "dsa",
      "coding",
      "programming",
      "web",
      "full-stack",
      "frontend",
      "backend",
      "react",
      "node",
      "javascript",
      "python",
      "java",
      "c++",
      "algorithm",
      "data structures",
      "software",
      "development",
      "cybersecurity",
      "ethical hacking",
    ];

    return codingKeywords.some(
      (keyword) =>
        cat.includes(keyword) ||
        sub.includes(keyword) ||
        title.includes(keyword) ||
        desc.includes(keyword)
    );
  };

  // Helper to load sample test data instantly
 const loadSampleData = () => {
   setForm({
     title: "Data Structures & Algorithms Masterclass (DSA)",
     subtitle:
       "Master arrays, strings, linked lists, trees, graphs, and dynamic programming.",
     description:
       "Comprehensive technical curriculum for computer science students.",
     previewVideoUrl: "https://www.youtube.com/embed/8hly31xKli0",
     category: "Coding Roadmaps",
     subCategory: "Data Structures & Algorithms",
     level: "Intermediate",
     language: "English",
     price: 49,
     compareAtPrice: 199,
     isPublished: true,
   });

   // Helper to generate distinct, realistic looking questions
   const generateMCQs = (topic) => {
     const questions = [
       {
         q: `Which of the following is true about ${topic} time complexity?`,
         opts: [
           "O(N) is always best",
           "O(1) is constant time",
           "O(N^2) is faster than O(N)",
           "None of the above",
         ],
         ans: 1,
       },
       {
         q: `In the context of ${topic}, what is the main advantage of using a pointer?`,
         opts: [
           "Memory reduction",
           "Faster access",
           "Direct memory manipulation",
           "All of the above",
         ],
         ans: 3,
       },
       {
         q: `What data structure best supports ${topic} operations?`,
         opts: ["Stack", "Queue", "Hash Table", "All of the above"],
         ans: 2,
       },
       {
         q: `When is ${topic} typically utilized in industry?`,
         opts: [
           "Data indexing",
           "UI Rendering",
           "Database queries",
           "All of the above",
         ],
         ans: 3,
       },
       {
         q: `What is the space complexity of ${topic} recursive approach?`,
         opts: ["O(N)", "O(1)", "O(log N)", "O(N^2)"],
         ans: 0,
       },
       {
         q: `How does ${topic} improve performance?`,
         opts: [
           "Cache locality",
           "Reducing redundant calculations",
           "Decreasing memory usage",
           "All of the above",
         ],
         ans: 3,
       },
       {
         q: `Which algorithm is best suited for ${topic}?`,
         opts: ["Dijkstra", "QuickSort", "Kadane's", "Depends on use case"],
         ans: 3,
       },
       {
         q: `What is the worst-case scenario for ${topic}?`,
         opts: [
           "Sorted input",
           "Empty input",
           "Reverse sorted input",
           "All of the above",
         ],
         ans: 2,
       },
       {
         q: `Does ${topic} require extra space?`,
         opts: ["Always", "Never", "Sometimes", "Only on heap"],
         ans: 2,
       },
       {
         q: `Is ${topic} stable?`,
         opts: ["Yes", "No", "Depends on implementation", "Only in Java"],
         ans: 2,
       },
     ];

     return questions.map((item) => ({
       questionText: item.q,
       options: item.opts,
       correctOptionIndex: item.ans,
       explanation: `The correct answer is index ${item.ans} based on standard algorithm analysis.`,
     }));
   };

   setModules([
     {
       title: "Module 1: Array & String Manipulation",
       notesFile: null,
       notesFileName: "dsa-arrays.pdf",
       lessons: [
         {
           title: "Time Complexity Analysis",
           description: "Big O basics.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 30,
           isPreviewFree: true,
           type: "video",
         },
         {
           title: "Sliding Window Pattern",
           description: "Optimizing subarray problems.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 40,
           isPreviewFree: false,
           type: "video",
         },
       ],
       assignment: {
         title: "Arrays Assessment",
         description: "10 MCQs on Array logic",
         questions: generateMCQs("Arrays"),
       },
       codingProblem: {
         title: "Two Sum",
         problemSlug: "two-sum",
         difficulty: "Easy",
         description: "Find two numbers that add to target.",
       },
     },
     {
       title: "Module 2: Linked Lists & Recursion",
       notesFile: null,
       notesFileName: "linked-lists.pdf",
       lessons: [
         {
           title: "Singly Linked List",
           description: "Node traversal.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 35,
           isPreviewFree: false,
           type: "video",
         },
         {
           title: "Recursive Backtracking",
           description: "Solving maze.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 45,
           isPreviewFree: false,
           type: "video",
         },
       ],
       assignment: {
         title: "Linked List Assessment",
         description: "10 MCQs on Pointers",
         questions: generateMCQs("Linked Lists"),
       },
       codingProblem: {
         title: "Reverse Linked List",
         problemSlug: "reverse-ll",
         difficulty: "Medium",
         description: "Reverse list in-place.",
       },
     },
     {
       title: "Module 3: Trees & Graphs",
       notesFile: null,
       notesFileName: "trees-graphs.pdf",
       lessons: [
         {
           title: "BST Properties",
           description: "Binary Search Tree.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 40,
           isPreviewFree: false,
           type: "video",
         },
         {
           title: "BFS Traversal",
           description: "Level-order traversal.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 50,
           isPreviewFree: false,
           type: "video",
         },
       ],
       assignment: {
         title: "Trees Assessment",
         description: "10 MCQs on Nodes",
         questions: generateMCQs("Trees"),
       },
       codingProblem: {
         title: "Invert Binary Tree",
         problemSlug: "invert-tree",
         difficulty: "Medium",
         description: "Swap left and right children.",
       },
     },
     {
       title: "Module 4: Dynamic Programming",
       notesFile: null,
       notesFileName: "dp-guide.pdf",
       lessons: [
         {
           title: "Memoization",
           description: "Top-down approach.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 45,
           isPreviewFree: false,
           type: "video",
         },
         {
           title: "Knapsack Problem",
           description: "Weight optimization.",
           videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
           duration: 55,
           isPreviewFree: false,
           type: "video",
         },
       ],
       assignment: {
         title: "DP Assessment",
         description: "10 MCQs on DP",
         questions: generateMCQs("DP"),
       },
       codingProblem: {
         title: "Climbing Stairs",
         problemSlug: "climbing-stairs",
         difficulty: "Easy",
         description: "Count distinct ways to top.",
       },
     },
   ]);
 };

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
        assignment: {
          title: "Module Assessment",
          description: "10 MCQ Assessment",
          questions: [],
        },
        codingProblem: {
          title: "",
          problemSlug: "",
          difficulty: "Medium",
          description: "",
        },
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

  const addMCQ = (modIdx) => {
    const updated = [...modules];
    if (updated[modIdx].assignment.questions.length < 10) {
      updated[modIdx].assignment.questions.push({
        questionText: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        explanation: "",
      });
      setModules(updated);
    } else {
      toast.warning("Max 10 questions reached");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnailFile) {
      toast.error("Please upload a course thumbnail image.");
      return;
    }

    const loadingToast = toast.loading(
      "Publishing your course, assignments, and notes..."
    );

    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

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
        notes: mod.notesFileName
          ? [
              {
                title: `${mod.title} Notes`,
                fileUrl: `/uploads/${mod.notesFileName}`,
              },
            ]
          : [],
        lessons: mod.lessons,
        assignment: mod.assignment,
        // Only include coding problem if the course topic is coding-related
        codingProblem: isCodingRelated() ? mod.codingProblem : undefined,
      }));

      formData.append("modules", JSON.stringify(cleanModules));

      const token = localStorage.getItem("AdminToken");

      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        toast.success("Course published successfully!");
        navigate("/admin/courses");
      } else {
        toast.error(data.message || "Failed to create course");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Course creation error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-1 font-semibold transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <BookOpen className="text-blue-600" /> Create Professional Course
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Build and publish your educational course curriculum with dynamic
            topic-based coding integration.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSampleData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 text-sm font-bold hover:bg-purple-100 transition shadow-sm"
        >
          <Sparkles size={16} /> Load Sample DSA Bootcamp Data
        </button>
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
                placeholder="e.g., Data Structures & Algorithms"
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
                placeholder="e.g., Master problem solving from scratch"
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
                  Click to upload banner image
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
                placeholder="Coding Roadmaps"
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
                placeholder="DSA"
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
                Curriculum Modules, Lessons & Assessments
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
                        "Attach Module PDF Notes (Optional)"}
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

                {/* Lessons Section */}
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Lessons
                  </h4>
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

                {/* Module MCQ Assessment Builder (Up to 10 Questions) */}
                <div className="mt-4 p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold flex items-center gap-2 text-indigo-900">
                      <FileCheck size={16} className="text-indigo-600" /> Module
                      Assessment (Max 10 MCQs)
                    </h4>
                    <span className="text-xs font-bold text-gray-400">
                      {mod.assignment.questions.length} / 10 Questions
                    </span>
                  </div>

                  {mod.assignment.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-3 border rounded-xl bg-slate-50 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-600">
                          Question #{qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const up = [...modules];
                            up[modIdx].assignment.questions = up[
                              modIdx
                            ].assignment.questions.filter((_, i) => i !== qIdx);
                            setModules(up);
                          }}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter question statement..."
                        value={q.questionText}
                        className="w-full p-2 border rounded bg-white font-semibold"
                        onChange={(e) => {
                          const up = [...modules];
                          up[modIdx].assignment.questions[qIdx].questionText =
                            e.target.value;
                          setModules(up);
                        }}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-mod-${modIdx}-q-${qIdx}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => {
                                const up = [...modules];
                                up[modIdx].assignment.questions[
                                  qIdx
                                ].correctOptionIndex = optIdx;
                                setModules(up);
                              }}
                              title="Mark as correct answer"
                            />
                            <input
                              type="text"
                              placeholder={`Option ${optIdx + 1}`}
                              value={opt}
                              className="w-full p-1.5 border rounded bg-white"
                              onChange={(e) => {
                                const up = [...modules];
                                up[modIdx].assignment.questions[qIdx].options[
                                  optIdx
                                ] = e.target.value;
                                setModules(up);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addMCQ(modIdx)}
                    className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    + Add MCQ Question ({mod.assignment.questions.length}/10)
                  </button>
                </div>

                {/* 🔑 CONDITIONAL CODING PRACTICE INTEGRATION: Only shown if course is related to coding/programming */}
                {isCodingRelated() ? (
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-900">
                        <Code size={16} className="text-emerald-600" />{" "}
                        Topic-Based Coding Problem (DSA / Programming)
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        Active for Coding Topic
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Problem Title (e.g. Two Sum)"
                        value={mod.codingProblem.title}
                        className="p-2 border rounded text-xs font-semibold"
                        onChange={(e) => {
                          const up = [...modules];
                          up[modIdx].codingProblem.title = e.target.value;
                          setModules(up);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Problem Slug (e.g. two-sum)"
                        value={mod.codingProblem.problemSlug}
                        className="p-2 border rounded text-xs font-semibold"
                        onChange={(e) => {
                          const up = [...modules];
                          up[modIdx].codingProblem.problemSlug = e.target.value;
                          setModules(up);
                        }}
                      />
                      <select
                        value={mod.codingProblem.difficulty}
                        className="p-2 border rounded text-xs font-semibold bg-white"
                        onChange={(e) => {
                          const up = [...modules];
                          up[modIdx].codingProblem.difficulty = e.target.value;
                          setModules(up);
                        }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <textarea
                      rows="2"
                      placeholder="Short description of the coding challenge relevant to this module..."
                      value={mod.codingProblem.description}
                      className="w-full p-2 border rounded text-xs"
                      onChange={(e) => {
                        const up = [...modules];
                        up[modIdx].codingProblem.description = e.target.value;
                        setModules(up);
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 italic flex items-center gap-2">
                    <span>
                      💡 Note: Coding practice inputs are hidden because the
                      course topic/category is non-coding (e.g., theory,
                      management, or design). Update the course category/title
                      to a coding topic to enable code challenges.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition"
          >
            Publish Professional Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
