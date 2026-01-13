import dotenv from "dotenv"
import {
	extractVideoId,
	fetchTranscript,
} from "../services/transcriptService.js"
import { generateSummary } from "../services/summaryService.js"
import { saveSummaryBothFormats } from "../services/storageService.js" // NEW

dotenv.config()

export const processVideo = async (req, res) => {
	try {
		const { url } = req.body

		if (!url) {
			return res.status(400).json({
				success: false,
				message: "YouTube URL is required",
			})
		}

		console.log(`📹 Processing video: ${url}`)

		// Use transcript service
		const videoID = extractVideoId(url)
		console.log(`🔑 Extracted video ID: ${videoID}`)

		const fullTranscript = await fetchTranscript(videoID)
		console.log(`📝 Transcript fetched: ${fullTranscript.length} characters`)

		// 2. Generate AI summary (with retry logic built-in)
		console.log(`🤖 Generating AI summary...`)
		const aiData = await generateSummary(fullTranscript)
		console.log(`✅ Summary generated successfully`)

		// 3. Save summary to files (NEW)
		console.log(`💾 Saving summary to files...`)
		const savedFiles = saveSummaryBothFormats(aiData, videoID)
		console.log(
			`✅ Saved: ${savedFiles.json.filename} & ${savedFiles.markdown.filename}`
		)

		return res.status(200).json({
			success: true,
			data: aiData,
			files: {
				json: savedFiles.json.filename,
				markdown: savedFiles.markdown.filename,
			},
		})
	} catch (error) {
		console.error("❌ Video Processing Error:", error)

		// Check if it's a Gemini overload error
		if (
			error.message?.includes("overloaded") ||
			error.code === 503 ||
			error.status === "UNAVAILABLE"
		) {
			return res.status(503).json({
				success: false,
				message:
					"AI service is currently overloaded. Please try again in a few moments.",
				retryable: true,
			})
		}

		// Check if it's a transcript error
		if (
			error.message?.includes("Transcript") ||
			error.message?.includes("subtitles") ||
			error.message?.includes("captions")
		) {
			return res.status(400).json({
				success: false,
				message:
					"Could not fetch video transcript. Make sure the video has captions enabled.",
			})
		}

		return res.status(500).json({
			success: false,
			message: error.message || "Failed to process video",
		})
	}
}
