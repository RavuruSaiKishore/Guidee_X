// config/validateEnv.js
export const validateEnv = () => {
  const requiredEnvFiles = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "BREVO_API_KEY",
    "FRONTEND_URL",
  ];

  const missingEnv = requiredEnvFiles.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    console.error(
      `❌ FATAL ERROR: Missing required environment variables: ${missingEnv.join(
        ", "
      )}`
    );
    process.exit(1);
  }

  console.log("All required environment variables verified successfully.");
};
