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
export const saveSummaryAsJSON = (summaryData, videoId) => {
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
 * Save summary as Markdown file
 * @param {Object} summaryData - The generated summary data
 * @param {string} videoId - YouTube video ID
 * @returns {Object} File paths
 */
export const saveSummaryAsMarkdown = (summaryData, videoId) => {
	const summariesDir = path.join(__dirname, "..", "assets", "summaries")
	ensureDirectoryExists(summariesDir)

	const timestamp = Date.now()
	const filename = `summary-${videoId}-${timestamp}.md`
	const filePath = path.join(summariesDir, filename)

	// Generate markdown content
	const markdown = generateMarkdown(summaryData, videoId)

	fs.writeFileSync(filePath, markdown, "utf-8")

	return {
		filename,
		path: filePath,
		relativePath: `./assets/summaries/${filename}`,
	}
}

/**
 * Generate markdown content from summary data
 */
const generateMarkdown = (summaryData, videoId) => {
	const {
		title,
		hook,
		main_sections,
		summary,
		cta,
		outro_stock_photo_queries,
	} = summaryData

	let markdown = `# ${title}\n\n`
	markdown += `**Video ID:** ${videoId}\n`
	markdown += `**Generated:** ${new Date().toISOString()}\n\n`
	markdown += `---\n\n`

	// Hook
	markdown += `## 🎣 Hook\n\n`
	markdown += `${hook.text}\n\n`
	markdown += `**Stock Photo Queries:**\n`
	hook.stock_photo_queries.forEach((query) => {
		markdown += `- ${query}\n`
	})
	markdown += `\n`

	// Main Sections
	markdown += `## 📝 Main Content\n\n`
	main_sections.forEach((section, index) => {
		markdown += `### ${index + 1}. ${section.heading}\n\n`
		markdown += `${section.content}\n\n`
		markdown += `**Stock Photo Queries:**\n`
		section.stock_photo_queries.forEach((query) => {
			markdown += `- ${query}\n`
		})
		markdown += `\n`
	})

	// Summary
	markdown += `## 📌 Summary\n\n`
	markdown += `${summary}\n\n`

	// CTA
	markdown += `## 💬 Call to Action\n\n`
	markdown += `${cta}\n\n`

	// Outro
	markdown += `## 🎬 Outro\n\n`
	markdown += `**Stock Photo Queries:**\n`
	outro_stock_photo_queries.forEach((query) => {
		markdown += `- ${query}\n`
	})

	return markdown
}

/**
 * Save both JSON and Markdown versions
 * @param {Object} summaryData - The generated summary data
 * @param {string} videoId - YouTube video ID
 * @returns {Object} Both file paths
 */
export const saveSummaryBothFormats = (summaryData, videoId) => {
	const jsonFile = saveSummaryAsJSON(summaryData, videoId)
	// const markdownFile = saveSummaryAsMarkdown(summaryData, videoId)

	return {
		json: jsonFile,
		// markdown: markdownFile,
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

	return files.map((filename) => {
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

	const ext = path.extname(filename)

	if (ext === ".json") {
		const content = fs.readFileSync(filePath, "utf-8")
		return JSON.parse(content)
	} else if (ext === ".md") {
		return fs.readFileSync(filePath, "utf-8")
	}

	return null
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
