import Select from "react-select";

const Pricing = ({ formData, updateForm }) => {
  const handleChange = (e) => {
    updateForm({
      [e.target.name]: e.target.value,
    });
  };


  const sessionOptions = [
    { value: "1 : 1 Mentorship", label: "1 : 1 Mentorship" },
    { value: "Group Session", label: "Group Session" },
    { value: "Career Guidance", label: "Career Guidance" },
    { value: "Mock Interview", label: "Mock Interview" },
    { value: "Project Mentoring", label: "Project Mentoring" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Pricing</h2>

      <p className="text-gray-500 mt-2 mb-8">
        Set your mentoring session charges.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Session Type */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Session Types</label>

          <Select
            isMulti
            options={sessionOptions}
            placeholder="Select session types..."
            value={sessionOptions.filter((option) =>
              (formData.sessionTypes || []).includes(option.value)
            )}
            onChange={(selected) =>
              updateForm({
                sessionTypes: selected
                  ? selected.map((item) => item.value)
                  : [],
              })
            }
          />
        </div>

        {/* Price */}

        <div>
          <label className="block mb-2 font-medium">Price (₹)</label>

          <input
            type="number"
            name="sessionPrice"
            min="0"
            step="1"
            value={formData.sessionPrice || ""}
            onChange={handleChange}
            placeholder="499"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        {/* Duration */}

        {/* <div>
          <label className="block mb-2 font-medium">Session Duration</label>

          <select
            name="sessionDuration"
            value={formData.sessionDuration || ""}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select</option>

            <option>30 Minutes</option>

            <option>45 Minutes</option>

            <option>60 Minutes</option>

            <option>90 Minutes</option>
          </select>
        </div> */}

        {/* Currency */}

        <div>
          <label className="block mb-2 font-medium">Currency</label>

          <select
            name="currency"
            value={formData.currency || "INR"}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>

        {/* Free Trial */}

        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="freeTrial"
              checked={formData.freeTrial || false}
              onChange={(e) =>
                updateForm({
                  freeTrial: e.target.checked,
                })
              }
            />

            <span className="font-medium">Offer Free Trial Session</span>
          </label>
        </div>

        {/* Notes */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Pricing Notes</label>

          <textarea
            rows={4}
            name="pricingNote"
            value={formData.pricingNote || ""}
            onChange={handleChange}
            placeholder="Mention any discounts or special offers..."
            className="w-full border rounded-xl px-4 py-3 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
