import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./server.config";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

module.exports = ai;