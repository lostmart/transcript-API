// Business logic for fetching and processing stock photos

import { pexelsAPI, unsplashAPI } from "../config/apiClients.js"

/**
 * Search for stock photos across multiple providers
 * @param {string[]} queries - Array of search queries
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of photo objects
 */
export const searchStockPhotos = async (queries, options = {}) => {
	const { perPage = 5, orientation = "portrait" } = options

	const results = await Promise.all(
		queries.map(async (query) => {
			try {
				// Search both APIs in parallel
				const [pexelsRes, unsplashRes] = await Promise.all([
					searchPexels(query, { perPage, orientation }),
					searchUnsplash(query, { perPage, orientation }),
				])

				return [...pexelsRes, ...unsplashRes]
			} catch (error) {
				console.error(`Error searching for "${query}":`, error.message)
				return []
			}
		})
	)

	return results.flat()
}

/**
 * Search Pexels API
 * @private
 */
const searchPexels = async (query, { perPage, orientation }) => {
	try {
		const response = await pexelsAPI.get("/search", {
			params: { query, per_page: perPage, orientation },
		})

		return response.data.photos.map((photo) => ({
			id: photo.id,
			source: "pexels",
			url: photo.src.large2x,
			thumbnail: photo.src.medium,
			photographer: photo.photographer,
			photographer_url: photo.photographer_url,
			query: query,
			width: photo.width,
			height: photo.height,
		}))
	} catch (error) {
		console.error("Pexels search failed:", error.message)
		return []
	}
}

/**
 * Search Unsplash API
 * @private
 */
const searchUnsplash = async (query, { perPage, orientation }) => {
	try {
		const response = await unsplashAPI.get("/search/photos", {
			params: { query, per_page: perPage, orientation },
		})

		return response.data.results.map((photo) => ({
			id: photo.id,
			source: "unsplash",
			url: photo.urls.regular,
			thumbnail: photo.urls.small,
			photographer: photo.user.name,
			photographer_url: photo.user.links.html,
			query: query,
			width: photo.width,
			height: photo.height,
		}))
	} catch (error) {
		console.error("Unsplash search failed:", error.message)
		return []
	}
}

/**
 * Fetch photos for all video sections
 * @param {Object} summaryData - AI-generated summary with stock_photo_queries
 * @returns {Promise<Object>} Organized photo options
 */
export const fetchPhotosForVideo = async (summaryData) => {
	const photoOptions = {
		hook: await searchStockPhotos(summaryData.hook.stock_photo_queries),
		sections: await Promise.all(
			summaryData.main_sections.map((section) =>
				searchStockPhotos(section.stock_photo_queries)
			)
		),
		outro: await searchStockPhotos(summaryData.outro_stock_photo_queries),
	}

	return photoOptions
}