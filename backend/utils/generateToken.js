// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (userId, role, tokenVersion) => {
  return jwt.sign({ id: userId, role, tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export default generateToken;
