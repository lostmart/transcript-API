import { getSubtitles } from "youtube-caption-extractor"

/**
 * Extract video ID from YouTube URL (supports regular videos and Shorts)
 * @param {string} url - YouTube URL
 * @returns {string} Video ID
 */
export const extractVideoId = (url) => {
	// Handle different YouTube URL formats
	const patterns = [
		/(?:youtube\.com\/watch\?v=)([^&\s]+)/, // Regular: watch?v=VIDEO_ID
		/(?:youtube\.com\/shorts\/)([^&\s?]+)/, // Shorts: /shorts/VIDEO_ID
		/(?:youtu\.be\/)([^&\s?]+)/, // Short URL: youtu.be/VIDEO_ID
		/(?:youtube\.com\/embed\/)([^&\s?]+)/, // Embed: /embed/VIDEO_ID
		/(?:youtube\.com\/v\/)([^&\s?]+)/, // Old format: /v/VIDEO_ID
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match && match[1]) {
			return match[1]
		}
	}

	// Fallback to original logic if no pattern matches
	const fallback = url.split("v=")[1]?.split("&")[0] || url.split("/").pop()
	return fallback
}

/**
 * Fetch transcript for a YouTube video
 * @param {string} videoID - YouTube video ID
 * @param {string} lang - Language code (default: 'en')
 * @returns {Promise<string>} Full transcript text
 */
export const fetchTranscript = async (videoID, lang = "en") => {
	// 1. Extract Transcript
	const subtitles = await getSubtitles({ videoID, lang })
	const fullTranscript = subtitles.map((item) => item.text).join(" ")

	return fullTranscript
}
