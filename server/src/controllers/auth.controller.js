import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        provider: "local"
      }
    });

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// ================= GOOGLE SUCCESS =================
export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user; // from passport

    if (!user) {
      return res.redirect("http://localhost:5173/login");
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.redirect(`http://localhost:5173/?token=${token}`);
  } catch (err) {
    console.error("Google auth error:", err);
    return res.redirect("http://localhost:5173/login");
  }
};