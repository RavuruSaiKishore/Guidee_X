import { Briefcase, Building2, Award, Mail } from "lucide-react";

const ProfessionalInformation = ({ formData, updateForm }) => {
  const handleChange = (e) => {
    updateForm({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Professional Information
      </h2>

      <p className="text-gray-500 mt-2 mb-8">
        Help students know about your career.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Profession */}
        <div>
          <label className="font-medium mb-2 block">Current Profession</label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <Briefcase className="text-gray-400 mr-3" />

            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Software Engineer"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="font-medium mb-2 block">Company</label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <Building2 className="text-gray-400 mr-3" />

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Google"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="font-medium mb-2 block">Years of Experience</label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <Award className="text-gray-400 mr-3" />

            <input
              type="number"
              name="experience"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              placeholder="5"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="font-medium mb-2 block">Industry</label>

          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select Industry</option>
            <option>Software Development</option>
            <option>Artificial Intelligence</option>
            <option>Machine Learning</option>
            <option>Cyber Security</option>
            <option>Cloud Computing</option>
            <option>DevOps</option>
            <option>Data Science</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
          </select>
        </div>

        {/* Email (NEW FIELD) */}
        <div className="md:col-span-2">
          <label className="font-medium mb-2 block">Email Address</label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <Mail className="text-gray-400 mr-3" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="md:col-span-2">
          <label className="font-medium mb-2 block">LinkedIn Profile</label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInformation;
