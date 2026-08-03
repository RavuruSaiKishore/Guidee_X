import { useState } from "react";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  const plans = [
    {
      name: "Basic",
      price: "₹199",
      desc: "Perfect for beginners",
      features: ["Access basic courses", "Community support"],
    },
    {
      name: "Pro",
      price: "₹499",
      desc: "Most popular plan",
      features: ["All courses", "Mentor sessions", "Priority support"],
    },
    {
      name: "Premium",
      price: "₹999",
      desc: "For serious learners",
      features: ["1:1 mentorship", "Career guidance", "Live sessions"],
    },
    {
      name: "Premium",
      price: "₹999",
      desc: "For serious learners",
      features: ["1:1 mentorship", "Career guidance", "Live sessions"],
    },
    {
      name: "Premium",
      price: "₹899",
      desc: "For serious learners",
      features: ["1:1 mentorship", "Career guidance", "Live sessions"],
    },
    {
      name: "Premium",
      price: "₹699",
      desc: "For serious learners",
      features: ["1:1 mentorship", "Career guidance", "Live sessions"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-6 py-16">
        <h1 className="text-4xl font-bold">Choose Your Plan 💰</h1>
        <p className="mt-2 text-gray-200">Click a plan to select it</p>
      </div>

      {/* CARDS */}
      <div className="p-6 md:p-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.name;

          return (
            <div
              key={index}
              onClick={() => setSelectedPlan(plan.name)}
              className={`cursor-pointer rounded-2xl p-6 bg-white shadow-md transition transform hover:-translate-y-1 ${
                isSelected
                  ? "border-2 border-blue-600 ring-4 ring-blue-100"
                  : "border border-gray-200"
              }`}
            >
              {/* PLAN NAME */}
              <h2 className="text-xl font-bold">{plan.name}</h2>

              {/* PRICE */}
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {plan.price}
              </p>

              {/* DESC */}
              <p className="text-gray-500 mt-1">{plan.desc}</p>

              {/* FEATURES */}
              <ul className="mt-4 space-y-1 text-sm text-gray-600">
                {plan.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>

              {/* BUTTON */}
              <button
                className={`mt-6 w-full py-2 rounded-lg transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {isSelected ? "Selected" : "Select Plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
