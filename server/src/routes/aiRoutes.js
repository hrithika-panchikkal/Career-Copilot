import express from 'express';
import { analyze, getHistory } from "../controllers/ai.controller.js";
import { analyzeRoleFit } from '../services/ai.services.js';

const router = express.Router();

// POST /api/ai/fit
router.post('/fit', async (req, res) => {
    const { profile, jobDescription } = req.body;

    if (!profile || !jobDescription) {
        return res.status(400).json({ error: 'profile and jobDescription are required' });
    }

    try {
        const analysis = await analyzeRoleFit(profile, jobDescription);
        res.json({ analysis });
    } catch (err) {
        console.error('Error in analyzeRoleFit:', err);
        res.status(500).json({ error: 'Failed to analyze role fit' });
    }
});

// Route to analyze role fit
router.post("/analyze", analyze);

// Route to fetch analysis history
router.get("/history", getHistory);

export default router;
