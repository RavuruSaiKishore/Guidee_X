import { toast } from "react-toastify";

const Verification = ({ formData, updateForm }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file.size > MAX_SIZE) {
      toast.error("File size must be under 5MB.");
      return;
    }

    updateForm({
      [e.target.name]: file,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Verification</h2>

      <p className="text-gray-500 mt-2 mb-8">
        Upload your documents for mentor verification.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Photo */}

        <div>
          <label className="block mb-2 font-medium">Profile Photo</label>

          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFile}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Resume */}

        <div>
          <label className="block mb-2 font-medium">Resume</label>

          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFile}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Government ID */}

        <div>
          <label className="block mb-2 font-medium">
            Aadhaar / Passport / PAN
          </label>

          <input
            type="file"
            name="governmentId"
            accept="image/*,.pdf"
            onChange={handleFile}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* Degree Certificate */}

        <div>
          <label className="block mb-2 font-medium">Degree Certificate</label>

          <input
            type="file"
            name="degreeCertificate"
            accept=".pdf,image/*"
            onChange={handleFile}
            className="w-full border rounded-xl p-3"
          />
        </div>

        {/* LinkedIn */}

        {/* Agreement */}

        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.agreement || false}
              onChange={(e) =>
                updateForm({
                  agreement: e.target.checked,
                })
              }
            />

            <span>
              I certify that all the information provided is accurate.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Verification;
