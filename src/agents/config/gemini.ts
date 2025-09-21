import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI configuration
const GEMINI_API_KEY = 'AIzaSyBOWg8ZzA8Cw1_YcmZW3BRfzGyKxHvevOE';

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export default {
  genAI,
  model,
  apiKey: GEMINI_API_KEY
};
