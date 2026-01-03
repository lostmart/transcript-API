import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

// Initialize the AI client outside the function to reuse it
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

/**
 * The prompt template for generating video summaries
 */
const scriptArchitectPrompt = (fullTranscript) => `
You are an expert Content Architect specializing in short-form viral content.
Your goal is to extract the MOST valuable insights from a video transcript and create punchy, engaging social media scripts WITH visual direction using stock photography.

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

8. Generate Stock Photo Search Queries for EACH scene (hook + each section + outro):
- Create 3-4 alternative search queries per scene for Pexels/Unsplash APIs
- Queries should find professional, high-quality stock photos that:
	* Visually represent the concept being discussed
	* Have dark/neutral areas suitable for text overlay
	* Are distinct from other sections
	* Avoid cliché tech stock photos (people pointing at screens, etc.)
- Use concrete, searchable terms (not abstract concepts)
- Prioritize: technology, coding, abstract tech, workspace, data visualization themes
- Each query should be 2-4 words for best search results

OUTPUT FORMAT (strict JSON):
{
"title": "Click-worthy title (max 60 characters)",
"hook": {
	"text": "Problem question + surprising stat + clear promise (35-42 words)",
	"stock_photo_queries": ["query1", "query2", "query3", "query4"]
},
"main_sections": [
	{ 
	"heading": "Clear, benefit-driven heading (5-7 words)", 
	"content": "Bold claim + supporting evidence + why it matters (50-75 words)",
	"stock_photo_queries": ["query1", "query2", "query3", "query4"]
	}
],
"summary": "Specific actionable steps, NOT generic motivation (15-20 words)",
"cta": "Engagement question or clear next action (10-15 words)",
"outro_stock_photo_queries": ["query1", "query2", "query3", "query4"]
}

STOCK PHOTO QUERY GUIDELINES:
- Keep queries SHORT: 2-4 words maximum for best API results
- Use CONCRETE nouns: "laptop code screen", "data visualization", "programming workspace"
- Avoid abstract terms: NOT "innovation" or "creativity" - too vague
- Think visually: What would this concept look like in a photo?
- Prioritize technical/professional imagery over lifestyle shots
- Include variations: some close-ups, some wide shots, some abstract
- Consider dark/moody aesthetics for better text overlay compatibility

EXAMPLES OF GOOD VS BAD QUERIES:

GOOD QUERIES (specific, searchable, visual):
- "code editor screen" (not "coding")
- "circuit board closeup" (not "technology")  
- "developer laptop night" (not "programming")
- "data charts dashboard" (not "analytics")
- "abstract network nodes" (not "connectivity")
- "minimalist workspace dark" (not "office")

BAD QUERIES (too vague, abstract, or generic):
- "innovation" (too abstract)
- "teamwork" (too generic)
- "business success" (cliché)
- "happy programmer" (lifestyle shot, text overlay difficult)
- "future technology" (too vague)

QUERY STRATEGY FOR EACH SECTION:
For a section about "React Components":
- Query 1: Broad/safe - "react code screen"
- Query 2: Technical - "component architecture diagram"  
- Query 3: Abstract - "modular building blocks"
- Query 4: Alternative angle - "code syntax highlighting"

This gives variety while staying on-topic.

IMPORTANT: 
- Limit to 3-5 sections maximum
- Each section is ONE idea, not multiple points
- If the transcript is long, be ruthlessly selective - quality over quantity
- Hook MUST follow the 3-sentence structure exactly
- Summary MUST be actionable steps, NOT "you can do it!" fluff
- CTA should drive engagement (comment/share/click)
- EVERY scene needs 3-4 distinct search query alternatives
- Queries must be SHORT (2-4 words) for optimal API search results
- Prioritize queries that will return dark/neutral images suitable for text overlay

TRANSCRIPT TO ANALYZE:
${fullTranscript}
`

/**
 * Generate video summary from transcript using Gemini AI
 * @param {string} fullTranscript - The complete video transcript
 * @returns {Promise<Object>} Structured summary with stock photo queries
 */
export const generateSummary = async (fullTranscript) => {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: scriptArchitectPrompt(fullTranscript),
		config: {
			responseMimeType: "application/json",
		},
	})

	const aiData = JSON.parse(response.text)
	return aiData
}
