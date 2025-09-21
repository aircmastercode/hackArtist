import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Validate required environment variable
if (!GEMINI_API_KEY) {
  console.error('❌ Missing required Gemini API key. Please check your .env file.');
  throw new Error('Gemini API key is missing. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
}

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });

export default {
  genAI,
  model,
  apiKey: GEMINI_API_KEY
};
