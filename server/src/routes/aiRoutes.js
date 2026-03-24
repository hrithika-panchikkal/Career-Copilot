import express from 'express';
import { analyze, getHistory, parseResume } from "../controllers/ai.controller.js";
import { analyzeRoleFit } from '../services/ai.services.js';
import upload from "../middlewares/upload.js";

const router = express.Router();

// POST /api/ai/fit
router.post('/fit', async (req, res) => {
    const  { firstName, lastName, email, jobDescription } = req.body;

    if (!firstName || !lastName || !email || !jobDescription) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const analysis = await analyzeRoleFit(firstName, lastName, email, jobDescription);
        res.json({ analysis });
    } catch (err) {
        console.error('Error in analyzeRoleFit:', err);
        res.status(500).json({ error: 'Failed to analyze role fit' });
    }
});

// Route to handle resume parsing
router.post(
  "/parse-resume",
  upload.single("resume"),
  parseResume
);

// Route to fetch analysis history
router.get("/history", getHistory);

// Route to handle resume upload and analysis
router.post("/analyze", upload.single("resume"), analyze);

export default router;
