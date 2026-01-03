import { getSubtitles } from "youtube-caption-extractor"

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string} Video ID
 */
export const extractVideoId = (url) => {
	// Using your existing extraction logic
	const videoID = url.split("v=")[1]?.split("&")[0] || url.split("/").pop()
	return videoID
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
