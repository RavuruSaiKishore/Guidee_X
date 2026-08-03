const ProgressBar = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          Step {currentStep} of {totalSteps}
        </span>

        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-blue-600 transition-all duration-500"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
