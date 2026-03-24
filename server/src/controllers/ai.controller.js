import { extractText, getDocumentProxy } from "unpdf";
import { analyzeRoleFit } from "../services/ai.services.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const analyze = async (req, res) => {
  try {

    const { firstName, lastName, email, jobDescription } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !jobDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let profileText = "";

    // Parse uploaded PDF
    if (req.file) {

      const pdf = await getDocumentProxy(
        new Uint8Array(req.file.buffer)
      );

      const { text } = await extractText(pdf, { mergePages: true });

      profileText = text
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (!profileText) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Run AI analysis
    const result = await analyzeRoleFit(profileText, jobDescription);

    // Create or update user
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, firstName, lastName }
    });

    // Save analysis
    await prisma.analysis.create({
      data: {
        userEmail: email,
        jobDescription,
        result: JSON.stringify(result)
      }
    });

    res.json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Analysis failed" });

  }
};

// This function extracts text from the uploaded resume and basic contact info
export const parseResume = async (req, res) => {

  try {

    const pdf = await getDocumentProxy(
      new Uint8Array(req.file.buffer)
    );

    const { text } = await extractText(pdf, { mergePages: true });

    const resumeText = text.replace(/\n/g, " ");

    // Basic email extraction
    const emailMatch = resumeText.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    const email = emailMatch ? emailMatch[0] : "";

    // Basic name extraction (first line usually name)
    const nameMatch = resumeText.split("\n")[0];

    let firstName = "";
    let lastName = "";

    if (nameMatch) {

      const parts = nameMatch.trim().split(" ");

      firstName = parts[0] || "";
      lastName = parts[1] || "";

    }

    res.json({
      firstName,
      lastName,
      email
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to parse resume"
    });

  }

};


export const getHistory = async (req, res) => {

  try {

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const history = await prisma.analysis.findMany({
      where: { userEmail: email },
      orderBy: { createdAt: "desc" }
    });

    res.json(history);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });

  }
};