"use server";

import { GoogleGenAI } from "@google/genai";

export async function generateQuestions(topic: string) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA_eCV9qgJyrz6fDd3SeLrn4ftBVczv4HY";

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    Generate 5 diagnostic multiple-choice questions for the topic: "${topic}".
    The questions should assess the user's understanding of the core concepts.
    
    Return the response ONLY as a valid JSON array of objects. Do not include markdown formatting or backticks.
    Each object should have the following structure:
    {
      "question_text": "The question string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "The correct option string (must match one of the options exactly)",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Using a newer model as suggested
      contents: prompt,
    });

    const text = response.text || "";
    console.log("Gemini Raw Response:", text);

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

export async function analyzeResults(topic: string, answers: any[]) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA_eCV9qgJyrz6fDd3SeLrn4ftBVczv4HY";

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    Analyze the following quiz results for the topic "${topic}".
    
    User Answers:
    ${JSON.stringify(answers, null, 2)}
    
    Provide a detailed analysis of the user's strengths and weaknesses.
    Suggest a personalized learning path with 3-5 key steps to improve.
    
    Return the response ONLY as a valid JSON object. Do not include markdown formatting or backticks.
    Structure:
    {
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"],
      "learning_path": [
        { "step": "Step 1 Title", "description": "Details..." },
        { "step": "Step 2 Title", "description": "Details..." }
      ],
      "overall_score": 80 (integer 0-100)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text || "";

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing results:", error);
    return null;
  }
}

export async function generateModuleContent(topic: string, moduleName: string) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA_eCV9qgJyrz6fDd3SeLrn4ftBVczv4HY";

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    Generate educational content for a learning module.
    Topic: "${topic}"
    Module: "${moduleName}"

    Provide:
    1. A clear, engaging explanation of the concept (markdown supported).
    2. A code example demonstrating the concept.
    3. A practice question to test understanding.

    Return the response ONLY as a valid JSON object. Do not include markdown formatting or backticks.
    Structure:
    {
      "explanation": "Markdown string...",
      "code_snippet": "Code string...",
      "practice_question": {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "The correct option string (must match one of the options exactly)",
        "explanation": "Why this is correct"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text || "";

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating module content:", error);
    return null;
  }
}

export async function generateModuleTips(topic: string, moduleName: string) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA_eCV9qgJyrz6fDd3SeLrn4ftBVczv4HY";

  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    The user has just completed the learning module "${moduleName}" in the topic "${topic}".
    Generate a short, encouraging tip or "did you know" fact related to what they just learned, 
    and briefly mention what's coming next (if you can infer it, otherwise just be general).
    Keep it under 2 sentences.
    Return ONLY the text string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || "Great job! Keep going to master this topic.";
  } catch (error) {
    console.error("Error generating tip:", error);
    return "Great job! Keep going to master this topic.";
  }
}

export async function generateSubjects(degree: string) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyA_eCV9qgJyrz6fDd3SeLrn4ftBVczv4HY";

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    Generate a list of 6-8 relevant academic subjects or specializations for the degree/program: "${degree}".
    
    Examples:
    - If BCA: Programming, Data Structures, DBMS, Networking, OOP, AI Basics
    - If B.Tech CSE: DSA, OS, DBMS, CN, AI/ML, Compiler Design
    - If B.Com: Accounting, Business Maths, Economics, Financial Management
    
    Return the response ONLY as a valid JSON array of strings. Do not include markdown formatting or backticks.
    Example: ["Subject 1", "Subject 2", "Subject 3"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating subjects:", error);
    return [];
  }
}
