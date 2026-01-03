import { searchStockPhotos } from "../services/stockPhotoService.js"

/**
 * Search for stock photos based on queries
 * @route POST /api/images/search
 */
export const searchImages = async (req, res) => {
	try {
		const { queries } = req.body

		// Validate input
		if (!queries || !Array.isArray(queries) || queries.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Queries array is required",
			})
		}

		// Fetch photos
		const photos = await searchStockPhotos(queries)

		return res.status(200).json({
			success: true,
			photos,
		})
	} catch (error) {
		console.error("Image Search Error:", error)
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

/**
 * Fetch photos for all video sections
 * @route POST /api/images/video-sections
 */
export const fetchPhotosForVideoSections = async (req, res) => {
	try {
		const { summaryData } = req.body

		// Validate input
		if (!summaryData) {
			return res.status(400).json({
				success: false,
				message: "Summary data is required",
			})
		}

		// Fetch photos for each section
		const photoOptions = {
			hook: await searchStockPhotos(summaryData.hook.stock_photo_queries),
			sections: await Promise.all(
				summaryData.main_sections.map((section) =>
					searchStockPhotos(section.stock_photo_queries)
				)
			),
			outro: await searchStockPhotos(summaryData.outro_stock_photo_queries),
		}

		return res.status(200).json({
			success: true,
			photo_options: photoOptions,
		})
	} catch (error) {
		console.error("Video Section Photos Error:", error)
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}
