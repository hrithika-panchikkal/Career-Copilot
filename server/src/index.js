import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get("/", (req, res) => {
  res.send("CareerCopilot API Running 🚀");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
