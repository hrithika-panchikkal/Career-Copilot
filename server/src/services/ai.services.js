import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeRoleFit = async (profile, jobDescription) => {

  const prompt = `
    You are a senior technical recruiter and career advisor.

    Your job is to deeply analyze how well a candidate’s resume matches a job description.

    Perform a thorough evaluation using the following factors:

    1. Technical skills match
    2. Years of experience alignment
    3. Relevant technologies and tools
    4. Architecture or system design experience
    5. Industry/domain alignment
    6. Seniority level alignment
    7. Missing or weak skill areas

    Use the scoring rubric below to calculate a Fit Score from 0-100:

    90-100 → Excellent match (candidate strongly fits the role)  
    70-89 → Strong match (minor skill gaps)  
    50-69 → Moderate match (multiple missing skills but relevant background)  
    30-49 → Weak match (limited alignment)  
    0-29 → Poor match (major mismatch)

    Important instructions:

    - Identify ALL relevant skills from the resume that match the job description
    - Identify ALL important skills that are missing
    - Provide multiple risk factors if applicable
    - Provide detailed and actionable career advice
    - Generate realistic interview questions related to the role

    Return ONLY valid JSON.
    Do NOT include markdown or code blocks.

    Return the response in this exact format:

    {
      "fitScore": number,

      "matchingSkills": [
        "list of matching technical skills",
        "include tools, frameworks, and technologies"
      ],

      "missingSkills": [
        "important missing technical skills",
        "technologies required but not present"
      ],

      "riskFactors": [
        "experience gaps",
        "seniority mismatch",
        "technology stack gaps"
      ],

      "advice": "Provide a detailed paragraph explaining how the candidate can improve alignment with this role. Mention specific skills, technologies, or experiences they should gain.",

      "interviewQuestions": [
        "role-specific technical interview questions",
        "system design questions",
        "practical scenario questions"
      ],

      "skillBreakdown": {
        "backend": [],
        "cloud": [],
        "devops": [],
        "databases": [],
        "architecture": []
      },

      "experienceAssessment": "Explain how the candidate's experience compares with the role requirements.",

      "learningRecommendations": [
        "specific technologies to learn",
        "certifications or tools to explore",
        "practical projects to build"
      ]
    }

    Candidate Resume:
    ${profile}

    Job Description:
    ${jobDescription}
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }]
    });
    
    return response.choices[0].message.content;
};
