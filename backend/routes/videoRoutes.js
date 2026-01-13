import express from "express"
import { processVideo } from "../controllers/videoController.js"

const router = express.Router()

// POST route because we are sending a URL in the body
router.post("/process", processVideo)

// List all saved summaries
router.get("/summaries", (req, res) => {
	try {
		const summaries = listSavedSummaries()
		res.json({ success: true, summaries })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
})

// Get specific summary
router.get("/summaries/:filename", (req, res) => {
	try {
		const { filename } = req.params
		const summary = getSummary(filename)

		if (!summary) {
			return res
				.status(404)
				.json({ success: false, message: "Summary not found" })
		}

		res.json({ success: true, summary })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
})

// Delete summary
router.delete("/summaries/:filename", (req, res) => {
	try {
		const { filename } = req.params
		const deleted = deleteSummary(filename)

		if (!deleted) {
			return res
				.status(404)
				.json({ success: false, message: "Summary not found" })
		}

		res.json({ success: true, message: "Summary deleted" })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
})

export default router
