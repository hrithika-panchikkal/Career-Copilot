import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};