import { CheckCircle } from "lucide-react";

const SuccessCard = () => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg text-center">
        <CheckCircle size={70} className="mx-auto text-green-500" />

        <h2 className="text-3xl font-bold mt-5">Application Submitted</h2>

        <p className="text-gray-600 mt-4">
          Thank you for applying as a mentor.
        </p>

        <p className="text-gray-600">
          Our team will review your profile and contact you within
          <span className="font-semibold"> 2-5 business days.</span>
        </p>

        <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessCard;
