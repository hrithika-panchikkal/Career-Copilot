import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeRoleFit = async (profile, jobDescription) => {
    const prompt = `
    You are a senior tech recruiter.
    Analyze this candidate profile and job description
    
    Return:
    - Fit score (0-100)
    - Matching skills
    - Missing Skills
    - Risk factors
    - Strategic advice
    - 5 Interview questions

    Profile:
    ${profile}

    Job Description:
    ${jobDescription}
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt}],
    });

    return response.choices[0].message.content;
};
