import { getSubtitles } from "youtube-caption-extractor"
import { GoogleGenAI } from "@google/genai" // Import the new SDK
import dotenv from "dotenv"

dotenv.config()

// Initialize the AI client outside the function to reuse it
// It automatically looks for process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const processVideo = async (req, res) => {
	try {
		const { url } = req.body
		const videoID = url.split("v=")[1]?.split("&")[0] || url.split("/").pop()

		// 1. Extract Transcript
		const subtitles = await getSubtitles({ videoID, lang: "en" })
		const fullTranscript = subtitles.map((item) => item.text).join(" ")

		// 2. AI Processing
		// We define the complex prompt here for clarity
		const scriptArchitectPrompt = `
  You are an expert Content Architect and YouTube Scriptwriter. 
  Your goal is to refactor a raw, messy video transcript into a high-quality, engaging script.

  TASK:
  1. Analyze the provided transcript for key insights and the core message.
  2. Create a "Viral Hook" (first 15 seconds) that identifies a problem and promises a solution.
  3. Reorganize the main content into logical, punchy sections. 
  4. Write in a conversational, high-energy tone.
  5. Remove all "filler" words and repetitive phrases.

  OUTPUT FORMAT:
  You must return a JSON object with this exact structure:
  {
    "title": "A click-worthy, SEO-optimized title",
    "hook": "The first 15-30 seconds of the script",
    "main_sections": [
      { "heading": "Section Name", "content": "The rewritten script for this section" }
    ],
    "summary": "A 1-sentence wrap-up of the value provided"
  }

  TRANSCRIPT TO REFACTOR:
  ${fullTranscript}
`

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash", // Upgraded to the 2026 flagship model
			contents: scriptArchitectPrompt,
			config: {
				responseMimeType: "application/json",
			},
		})

		// The text property contains the AI's response directly
		const aiData = JSON.parse(response.text)

		return res.status(200).json({
			success: true,
			data: aiData,
		})
	} catch (error) {
		console.error("Video Processing Error:", error)
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}
