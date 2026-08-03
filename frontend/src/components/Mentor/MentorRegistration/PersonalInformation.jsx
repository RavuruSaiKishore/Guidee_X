import { User, Phone, MapPin, Calendar } from "lucide-react";

const PersonalInformation = ({ formData, updateForm }) => {
  const handleChange = (e) => {
    updateForm({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Personal Information</h2>

      <p className="text-gray-500 mt-2 mb-8">Tell us about yourself.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* First Name */}

        <div>
          <label className="mb-2 block font-medium">
            First Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <User className="text-gray-400 mr-3" size={20} />

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Last Name */}

        <div>
          <label className="font-medium mb-2 block">
            Last Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <User className="text-gray-400 mr-3" size={20} />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Phone */}

        <div>
          <label className="font-medium mb-2 block">
            Phone Number
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <Phone className="text-gray-400 mr-3" size={20} />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* DOB */}

        <div>
          <label className="font-medium mb-2 block">
            Date of Birth
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <Calendar className="text-gray-400 mr-3" size={20} />

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Gender */}

        <div>
          <label className="font-medium mb-2 block">
            Gender
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select Gender</option>

            <option>Male</option>

            <option>Female</option>

            <option>Other</option>
          </select>
        </div>

        {/* City */}

        <div>
          <label className="font-medium mb-2 block">
            City
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="flex items-center border rounded-xl px-4 py-3">
            <MapPin className="text-gray-400 mr-3" size={20} />

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Hyderabad"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* State */}

        <div>
          <label className="font-medium mb-2 block">
            State
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Telangana"
            className="w-full border rounded-xl px-4 py-3 outline-none"
          />
        </div>

        {/* Country */}

        <div>
          <label className="font-medium mb-2 block">Country</label>

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="India"
            className="w-full border rounded-xl px-4 py-3 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
