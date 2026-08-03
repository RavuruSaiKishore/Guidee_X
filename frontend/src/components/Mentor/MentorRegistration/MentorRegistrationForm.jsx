import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Stepper from "./Stepper";
import ProgressBar from "./ProgressBar";

// STEPS
import PersonalInformation from "../MentorRegistration/PersonalInformation";
import ProfessionalInformation from "../MentorRegistration/ProfessionalInformation";
import Education from "../MentorRegistration/Educations";
import Verification from "../MentorRegistration/Verification";
import ReviewApplication from "../MentorRegistration/ReviewApplication";
import Expertise from "../MentorRegistration/Expertise";
import AboutMentor from "../MentorRegistration/AboutMentor";
import Availability from "../MentorRegistration/Availability";
import Pricing from "../MentorRegistration/Pricing";

const TOTAL_STEPS = 9;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MentorRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    // PERSONAL
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    country: "",

    // PROFESSIONAL
    profession: "",
    company: "",
    experience: "",
    industry: "",
    email: "",
    linkedin: "",

    // EXPERTISE
    primarySkill: [],
    category: "",
    skillExperience: "",
    skillLevel: "",
    languages: "",

    // EDUCATION
    degree: "",
    college: "",
    graduationYear: "",
    cgpa: "",
    certifications: "",

    // ABOUT
    headline: "",
    about: "",
    teachingStyle: "",

    // AVAILABILITY
    availableDays: [],
    preferredTime: "",
    startTime: "",
    endTime: "",
    timezone: "Asia/Kolkata",
    sessionDuration: 60,

    // PRICING
    sessionTypes: [],
    sessionPrice: "",
    currency: "INR",
    freeTrial: false,
    pricingNote: "",

    // VERIFICATION
    profilePhoto: null,
    resume: null,
    governmentId: null,
    degreeCertificate: null,
    agreement: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  // Restore saved form on page refresh
  useEffect(() => {
    const savedForm = localStorage.getItem("mentorForm");
    const savedStep = localStorage.getItem("mentorCurrentStep");

    if (savedForm) {
      setFormData((prev) => ({
        ...prev,
        ...JSON.parse(savedForm),
      }));
    }

    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
  }, []);

  // Save form data (excluding files)
  useEffect(() => {
    const {
      profilePhoto,
      resume,
      governmentId,
      degreeCertificate,
      ...dataToSave
    } = formData;

    localStorage.setItem("mentorForm", JSON.stringify(dataToSave));
  }, [formData]);

  // Save current step
  useEffect(() => {
    localStorage.setItem("mentorCurrentStep", currentStep);
  }, [currentStep]);

  const updateForm = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const nextStep = () => {
    if (!validateStep()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((p) => p + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  // validation of the form
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.phone &&
          formData.gender
        );

      case 2:
        return formData.profession && formData.email;

      case 3:
        return formData.primarySkill && formData.category;

      case 4:
        return formData.degree && formData.college && formData.graduationYear;

      case 5:
        return formData.headline && formData.about;

      case 6:
        return (
          formData.availableDays.length > 0 &&
          formData.startTime &&
          formData.endTime &&
          formData.startTime < formData.endTime
        );

      case 7:
        return (
          formData.sessionTypes &&
          formData.sessionTypes.length > 0 &&
          formData.sessionPrice !== "" &&
          Number(formData.sessionPrice) > 0
        );

      case 8:
        return formData.agreement;

      default:
        return true;
    }
  };

  // ================= STEP RENDER =================
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformation formData={formData} updateForm={updateForm} />
        );

      case 2:
        return (
          <ProfessionalInformation
            formData={formData}
            updateForm={updateForm}
          />
        );

      case 3:
        return <Expertise formData={formData} updateForm={updateForm} />;

      case 4:
        return <Education formData={formData} updateForm={updateForm} />;

      case 5:
        return <AboutMentor formData={formData} updateForm={updateForm} />;

      case 6:
        return <Availability formData={formData} updateForm={updateForm} />;

      case 7:
        return <Pricing formData={formData} updateForm={updateForm} />;

      case 8:
        return <Verification formData={formData} updateForm={updateForm} />;
      case 9:
        return <ReviewApplication formData={formData} />;

      default:
        return null;
    }
  };

  // ================= SUBMIT =================
  const submitApplication = async () => {
    setLoading(true); // <-- ADD THIS

    try {
      const data = new FormData();

      // ================= PERSONAL =================
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("phone", formData.phone);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("country", formData.country);

      // ================= PROFESSIONAL =================
      data.append("profession", formData.profession);
      data.append("company", formData.company);
      data.append("experience", Number(formData.experience || 0));
      data.append("industry", formData.industry);
      data.append("email", formData.email);
      data.append("linkedin", formData.linkedin);

      // ================= EXPERTISE =================
      data.append(
        "primarySkill",
        JSON.stringify(
          formData.primarySkill.map((skill) => skill.trim()).filter(Boolean)
        )
      );
      data.append("category", formData.category);
      data.append("skillExperience", Number(formData.skillExperience || 0));
      data.append("skillLevel", formData.skillLevel);

      data.append(
        "languages",
        JSON.stringify(
          formData.languages
            ? formData.languages.split(",").map((l) => l.trim())
            : []
        )
      );

      // ================= EDUCATION =================
      data.append("degree", formData.degree);
      data.append("college", formData.college);
      data.append("graduationYear", Number(formData.graduationYear || 0));
      data.append("cgpa", formData.cgpa);
      data.append(
        "certifications",
        JSON.stringify(
          formData.certifications
            ? formData.certifications.split(",").map((c) => c.trim())
            : []
        )
      );

      // ================= ABOUT =================
      data.append("headline", formData.headline);
      data.append("about", formData.about);
      data.append("teachingStyle", formData.teachingStyle);

      // ================= AVAILABILITY =================
      data.append("availableDays", JSON.stringify(formData.availableDays));
      data.append("preferredTime", formData.preferredTime);
      data.append("startTime", formData.startTime);
      data.append("endTime", formData.endTime);
      data.append("timezone", formData.timezone);
      data.append("sessionDuration", Number(formData.sessionDuration || 0));

      // ================= PRICING =================
     data.append("sessionTypes", JSON.stringify(formData.sessionTypes));
      data.append("sessionPrice", Number(formData.sessionPrice || 0));
      data.append("currency", formData.currency);
      data.append("freeTrial", formData.freeTrial ? "true" : "false");
      data.append("pricingNote", formData.pricingNote);

      // ================= FILES =================
      if (formData.profilePhoto) {
        data.append("profileImage", formData.profilePhoto);
      }

      if (formData.resume) {
        data.append("resume", formData.resume);
      }

      if (formData.governmentId) {
        data.append("governmentId", formData.governmentId);
      }

      if (formData.degreeCertificate) {
        data.append("degreeCertificate", formData.degreeCertificate);
      }

      // ================= AGREEMENT =================
      data.append("agreement", formData.agreement ? "true" : "false");

      const token = localStorage.getItem("UserToken");

      const res = await fetch(`${API_BASE_URL}/api/mentor/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to submit application");
      }

      toast.success(result.message);
      setFormData(initialFormData);
      setCurrentStep(1);
      localStorage.removeItem("mentorForm");
      localStorage.removeItem("mentorCurrentStep");
    } catch (error) {
      console.error("Submit Error:", error);
      console.log(error.message);
      toast.error(error.message || "Error occurred");
    } finally {
      setLoading(false); // <-- ADD THIS
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 py-12 mt-15">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-4">
            {/* LEFT STEP */}
            <div className="bg-gray-50 p-8 border-r">
              <h2 className="text-2xl font-bold mb-8">Mentor Application</h2>

              <Stepper currentStep={currentStep} />
            </div>

            {/* RIGHT CONTENT */}
            <div className="lg:col-span-3 p-10">
              <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

              {renderStep()}

              {/* BUTTONS */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={previousStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl ${
                    currentStep === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Previous
                </button>

                {/* SHOW CONTINUE UNTIL LAST STEP */}
                {currentStep < 9 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={submitApplication}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl text-white ${
                      loading
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRegistrationForm;
