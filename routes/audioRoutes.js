import express from "express"
import { generateAudio } from "../controllers/audioController.js"

const router = express.Router()

// Define the POST endpoint for audio generation
// Path will be: /api/audio/generate
router.post("/generate", generateAudio)

export default router
