import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Ensure directory exists
 */
const ensureDirectoryExists = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}

/**
 * Save summary as JSON file
 * @param {Object} summaryData - The generated summary data
 * @param {string} videoId - YouTube video ID
 * @returns {Object} File paths
 */
export const saveSummary = (summaryData, videoId) => {
	const summariesDir = path.join(__dirname, "..", "assets", "summaries")
	ensureDirectoryExists(summariesDir)

	const timestamp = Date.now()
	const filename = `summary-${videoId}-${timestamp}.json`
	const filePath = path.join(summariesDir, filename)

	const dataToSave = {
		videoId,
		timestamp,
		generatedAt: new Date().toISOString(),
		data: summaryData,
	}

	fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), "utf-8")

	return {
		filename,
		path: filePath,
		relativePath: `./assets/summaries/${filename}`,
	}
}

/**
 * List all saved summaries
 * @returns {Array} List of saved summary files
 */
export const listSavedSummaries = () => {
	const summariesDir = path.join(__dirname, "..", "assets", "summaries")

	if (!fs.existsSync(summariesDir)) {
		return []
	}

	const files = fs.readdirSync(summariesDir)

	return files
		.filter((filename) => filename.endsWith(".json")) // Only JSON files
		.map((filename) => {
			const filePath = path.join(summariesDir, filename)
			const stats = fs.statSync(filePath)

			return {
				filename,
				path: filePath,
				size: stats.size,
				createdAt: stats.birthtime,
				modifiedAt: stats.mtime,
			}
		})
}

/**
 * Get a specific summary by filename
 * @param {string} filename - The filename to retrieve
 * @returns {Object|null} Summary data or null if not found
 */
export const getSummary = (filename) => {
	const summariesDir = path.join(__dirname, "..", "assets", "summaries")
	const filePath = path.join(summariesDir, filename)

	if (!fs.existsSync(filePath)) {
		return null
	}

	const content = fs.readFileSync(filePath, "utf-8")
	return JSON.parse(content)
}

/**
 * Delete a summary file
 * @param {string} filename - The filename to delete
 * @returns {boolean} Success status
 */
export const deleteSummary = (filename) => {
	const summariesDir = path.join(__dirname, "..", "assets", "summaries")
	const filePath = path.join(summariesDir, filename)

	if (!fs.existsSync(filePath)) {
		return false
	}

	fs.unlinkSync(filePath)
	return true
}
