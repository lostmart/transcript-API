import dotenv from "dotenv"
import {
	extractVideoId,
	fetchTranscript,
} from "../services/transcriptService.js"
import { generateSummary } from "../services/summaryService.js"

dotenv.config()


export const processVideo = async (req, res) => {
	try {
		const { url } = req.body

		// Use transcript service
		const videoID = extractVideoId(url)
		const fullTranscript = await fetchTranscript(videoID)

		// 2. Generate AI summary
		const aiData = await generateSummary(fullTranscript)

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
