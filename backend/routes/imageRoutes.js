import express from "express"
import {
	searchImages,
	fetchPhotosForVideoSections,
} from "../controllers/imageControllers.js"

const router = express.Router()

// Search photos by queries
router.post("/search", searchImages)

// Fetch photos for video sections
router.post("/video-sections", fetchPhotosForVideoSections)

export default router
