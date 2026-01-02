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
You are an expert Content Architect specializing in short-form viral content.
Your goal is to extract the MOST valuable insights from a video transcript and create punchy, engaging social media scripts.

CONSTRAINTS:
- This is for 60-90 second social media videos (YouTube Shorts, TikTok, Reels)
- Each section must be 50-75 words maximum
- Include ONLY the 3-5 most impactful points from the transcript
- Remove ALL filler, background info, and tangents

TASK:
1. Identify the ONE core problem the video solves
2. Create a hook following this exact structure:
   - Sentence 1: Open with relatable problem as a question (10-12 words)
   - Sentence 2: Include ONE specific, surprising stat or fact (12-15 words)
   - Sentence 3: Make a clear promise of what they'll learn (12-15 words)
   Total hook: 35-42 words maximum
   
3. Extract 3-5 key insights as separate sections
4. Each section = ONE main idea with ONE supporting detail
5. Write in short, punchy sentences (under 15 words each)

6. Create a summary following this structure:
   - Restate the core actionable steps in order (15-20 words)
   - Make it specific and memorable, NOT generic motivation
   - Example: "Start with X, add Y, then Z—that's your roadmap"
   
7. Add a Call-to-Action:
   - One engagement question or directive (10-15 words)
   - Examples: "Which are you learning first? Drop it in comments!"
   - Or: "Click the link for my complete beginner roadmap"

OUTPUT FORMAT (strict JSON):
{
  "title": "Click-worthy title (max 60 characters)",
  "hook": "Problem question + surprising stat + clear promise (35-42 words)",
  "main_sections": [
    { 
      "heading": "Clear, benefit-driven heading (5-7 words)", 
      "content": "Bold claim + supporting evidence + why it matters (50-75 words)"
    }
  ],
  "summary": "Specific actionable steps, NOT generic motivation (15-20 words)",
  "cta": "Engagement question or clear next action (10-15 words)"
}

IMPORTANT: 
- Limit to 3-5 sections maximum
- Each section is ONE idea, not multiple points
- If the transcript is long, be ruthlessly selective - quality over quantity
- Hook MUST follow the 3-sentence structure exactly
- Summary MUST be actionable steps, NOT "you can do it!" fluff
- CTA should drive engagement (comment/share/click)

TRANSCRIPT TO ANALYZE:
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
