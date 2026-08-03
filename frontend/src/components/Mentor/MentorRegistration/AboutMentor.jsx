const AboutMentor = ({ formData, updateForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    updateForm({
      [name]: value.startsWith(" ") ? value.trimStart() : value,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">About Yourself</h2>

      <p className="text-gray-500 mt-2 mb-8">
        Tell students why they should learn from you.
      </p>

      <div className="space-y-6">
        {/* Professional Headline */}
        <div>
          <label className="block mb-2 font-medium">
            Professional Headline
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            type="text"
            name="headline"
            value={formData.headline || ""}
            onChange={handleChange}
            maxLength={120}
            placeholder="e.g. Senior Software Engineer | MERN Stack Mentor"
            className="w-full border rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {formData.headline.length}/120
          </p>
        </div>

        {/* About Yourself */}
        <div>
          <label className="block mb-2 font-medium">
            About Yourself
            <span className="ml-1 text-red-500">*</span>
          </label>

          <textarea
            rows={6}
            name="about"
            value={formData.about || ""}
            onChange={handleChange}
            maxLength={1500}
            placeholder="Tell students about your professional journey, expertise, achievements, mentoring experience, and what they can expect from your sessions."
            className="w-full border rounded-xl px-4 py-3 resize-none outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {formData.about.length}/1500
          </p>
        </div>

        {/* Teaching Style */}
        <div>
          <label className="block mb-2 font-medium">Teaching Style</label>

          <textarea
            rows={4}
            name="teachingStyle"
            value={formData.teachingStyle || ""}
            onChange={handleChange}
            maxLength={800}
            placeholder="e.g. Hands-on learning, real-world projects, interview preparation, personalized guidance."
            className="w-full border rounded-xl px-4 py-3 resize-none outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {formData.teachingStyle.length}/800
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMentor;
