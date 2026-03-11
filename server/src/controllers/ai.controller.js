import { analyzeRoleFit } from "../services/ai.services.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const analyze = async (req, res) => {
  try {
    const { profile, jobDescription } = req.body;

    if (!profile || !jobDescription) {
      return res.status(400).json({ error: "Missing input fields" });
    }

    const result = await analyzeRoleFit(profile, jobDescription);

    await prisma.analysis.create({
      data: {
        profile,
        jobDescription,
        result
      }
    });

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed" });
  }
};

// Controller to fetch previous AI analyses
export const getHistory = async (req, res) => {

  try {

    // Fetch all analysis records sorted by newest first
    const history = await prisma.analysis.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    // Return results to frontend
    res.json(history);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch history"
    });

  }

};