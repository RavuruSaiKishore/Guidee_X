const ReviewApplication = ({ formData }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Review Your Application</h2>

      <div className="border rounded-xl p-6 bg-gray-50 space-y-8">
        {/* ================= PERSONAL ================= */}
        <div>
          <h4 className="font-semibold mb-2">Personal Information</h4>

          <p>
            Name: {formData.firstName} {formData.lastName}
          </p>

          <p>Email: {formData.email}</p>

          <p>Phone: {formData.phone}</p>

          <p>Gender: {formData.gender}</p>

          <p>
            Location: {formData.city}, {formData.state}, {formData.country}
          </p>
        </div>

        {/* ================= PROFESSIONAL ================= */}
        <div>
          <h4 className="font-semibold mb-2">Professional Information</h4>

          <p>Profession: {formData.profession}</p>

          <p>Company: {formData.company}</p>

          <p>Experience: {formData.experience} years</p>

          <p>Industry: {formData.industry}</p>

          <p>LinkedIn: {formData.linkedin}</p>
        </div>

        {/* ================= EXPERTISE ================= */}
        <div>
          <h4 className="font-semibold mb-2">Skills & Expertise</h4>

          <p>Primary Skill: {formData.primarySkill}</p>

          <p>Category: {formData.category}</p>

          <p>Languages: {formData.languages}</p>
        </div>

        {/* ================= EDUCATION ================= */}
        <div>
          <h4 className="font-semibold mb-2">Education</h4>

          <p>Degree: {formData.degree}</p>

          <p>College: {formData.college}</p>

          <p>Graduation Year: {formData.graduationYear}</p>

          <p>CGPA: {formData.cgpa}</p>

          <p>Certifications: {formData.certifications}</p>
        </div>

        {/* ================= ABOUT ================= */}
        <div>
          <h4 className="font-semibold mb-2">About You</h4>

          <p>Headline: {formData.headline}</p>

          <p>About: {formData.about}</p>

          <p>Teaching Style: {formData.teachingStyle}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Availability</h4>

        <p>Available Days: {formData.availableDays}</p>

        <p>Preferred Time: {formData.preferredTime}</p>

        <p>Start Time: {formData.startTime}</p>

        <p>End Time: {formData.endTime}</p>

        <p>Timezone: {formData.timezone}</p>

        <p>Session Duration: {formData.sessionDuration} minutes</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Pricing</h4>

        <p>Session Type: {formData.sessionType}</p>

        <p>
          Price: {formData.currency} {formData.sessionPrice}
        </p>

        <p>Free Trial: {formData.freeTrial ? "Yes" : "No"}</p>

        <p>Notes: {formData.pricingNote}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Uploaded Documents</h4>

        <p>
          Profile Photo:
          {formData.profileImage ? " Uploaded" : " Not Uploaded"}
        </p>

        <p>
          Resume:
          {formData.resume ? " Uploaded" : " Not Uploaded"}
        </p>

        <p>
          Government ID:
          {formData.governmentId ? " Uploaded" : " Not Uploaded"}
        </p>

        <p>
          Degree Certificate:
          {formData.degreeCertificate ? " Uploaded" : " Not Uploaded"}
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Declaration</h4>

        <p>
          Agreement:
          {formData.agreement ? " Accepted" : " Not Accepted"}
        </p>
      </div>

      {/* NOTE */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-700">
          Please verify all details carefully before submitting. Once submitted,
          your profile will be reviewed by our admin team.
        </p>
      </div>
    </div>
  );
};

export default ReviewApplication;
