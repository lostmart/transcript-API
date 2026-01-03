// AI summary generation logic

import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

/**
 * Generate video summary from transcript
 * @param {string} transcript - Full video transcript
 * @returns {Promise<Object>} Structured summary
 */
export const generateSummary = async (transcript) => {
	const scriptArchitectPrompt = `
    [Your full prompt here - the one with stock_photo_queries]
    
    TRANSCRIPT TO ANALYZE:
    ${transcript}
  `

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: scriptArchitectPrompt,
			config: {
				responseMimeType: "application/json",
			},
		})

		return JSON.parse(response.text)
	} catch (error) {
		throw new Error(`Summary generation failed: ${error.message}`)
	}
}
