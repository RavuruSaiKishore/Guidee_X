import {
  User,
  Briefcase,
  BookOpen,
  GraduationCap,
  FileText,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    title: "Personal",
    icon: User,
  },
  {
    title: "Professional",
    icon: Briefcase,
  },
  {
    title: "Expertise",
    icon: BookOpen,
  },
  {
    title: "Education",
    icon: GraduationCap,
  },
  {
    title: "About",
    icon: FileText,
  },
  {
    title: "Availability",
    icon: Calendar,
  },
  {
    title: "Pricing",
    icon: IndianRupee,
  },
  {
    title: "Verification",
    icon: ShieldCheck,
  },
  {
    title: "Review",
    icon: CheckCircle,
  },
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="hidden lg:flex flex-col gap-5 w-64">
      {steps.map((step, index) => {
        const Icon = step.icon;

        const active = currentStep === index + 1;
        const completed = currentStep > index + 1;

        return (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition
              ${
                completed
                  ? "bg-green-500 text-white"
                  : active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Icon size={18} />
            </div>

            <span
              className={`font-medium ${
                active
                  ? "text-blue-600"
                  : completed
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
