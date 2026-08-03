const Education = ({ formData, updateForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "certifications") {
      updateForm({
        certifications: value,
      });
      return;
    }

    updateForm({
      [name]: value.startsWith(" ") ? value.trimStart() : value,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Education</h2>

      <p className="text-gray-500 mt-2 mb-8">
        Add your educational qualifications.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Degree */}
        <div>
          <label className="block mb-2 font-medium">Degree</label>

          <input
            type="text"
            name="degree"
            value={formData.degree || ""}
            onChange={handleChange}
            placeholder="B.Tech Computer Science"
            className="w-full border rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* College */}
        <div>
          <label className="block mb-2 font-medium">College / University</label>

          <input
            type="text"
            name="college"
            value={formData.college || ""}
            onChange={handleChange}
            placeholder="Rajiv Gandhi University of Knowledge Technologies"
            className="w-full border rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block mb-2 font-medium">Graduation Year</label>

          <input
            type="number"
            name="graduationYear"
            min="1950"
            max={new Date().getFullYear() + 10}
            inputMode="numeric"
            onWheel={(e) => e.target.blur()}
            value={formData.graduationYear || ""}
            onChange={handleChange}
            placeholder="2026"
            className="w-full border rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* CGPA */}
        <div>
          <label className="block mb-2 font-medium">CGPA / Percentage</label>

          <input
            type="text"
            name="cgpa"
            value={formData.cgpa || ""}
            onChange={handleChange}
            placeholder="8.9"
            className="w-full border rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Certifications */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Certifications</label>

          <textarea
            rows={4}
            name="certifications"
            value={formData.certifications || ""}
            onChange={handleChange}
            placeholder="AWS Certified Cloud Practitioner, Google Data Analytics..."
            className="w-full border rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Education;
