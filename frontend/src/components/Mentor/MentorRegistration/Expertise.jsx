const Expertise = ({ formData, updateForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "primarySkill") {
      updateForm({
        primarySkill: value.split(",").map((skill) => skill.trim()),
      });
      return;
    }

    updateForm({
      [name]: value.startsWith(" ") ? value.trimStart() : value,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Expertise</h2>

      <p className="text-gray-500 mt-2 mb-8">
        Tell students what you can teach.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Primary Skill */}
        <div>
          <label className="block mb-2 font-medium">Primary Skill</label>

          <input
            type="text"
            name="primarySkill"
            value={formData.primarySkill.join(", ")}
            onChange={handleChange}
            placeholder="React.js, Node.js, MongoDB"
            className="w-full border rounded-xl px-4 py-3 outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium">Category</label>

          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select Category</option>
            <option>Programming</option>
            <option>AI / ML</option>
            <option>Cyber Security</option>
            <option>Cloud Computing</option>
            <option>Data Science</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-2 font-medium">Experience</label>

          <input
            type="number"
            name="skillExperience"
            min="0"
            value={formData.skillExperience || ""}
            onChange={handleChange}
            placeholder="5 Years"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block mb-2 font-medium">Skill Level</label>

          <select
            name="skillLevel"
            value={formData.skillLevel || ""}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>

        {/* Languages */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Languages You Teach In
          </label>

          <input
            type="text"
            name="languages"
            value={formData.languages || ""}
            onChange={handleChange}
            placeholder="English, Telugu, Hindi"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Expertise;
