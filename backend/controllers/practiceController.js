import PracticeProblem from "../models/PracticeProblem.js";

// SUBMIT & EVALUATE CODE
export const submitCodeSolution = async (req, res) => {
  try {
    const { problemId, language, sourceCode } = req.body;
    const problem = await PracticeProblem.findById(problemId);

    if (!problem)
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });

    // In production, send sourceCode and testCases to Judge0 API or a secure sandbox compiler
    // Simulated evaluation response:
    const passedAllTests = true;

    res.status(200).json({
      success: true,
      passed: passedAllTests,
      message: passedAllTests
        ? "All test cases passed successfully!"
        : "Some test cases failed.",
      runtime: "42 ms",
      memory: "14.2 MB",
    });
  } catch (error) {
    console.error("Code evaluation error:", error);
    res.status(500).json({ success: false, message: "Code execution failed." });
  }
};
