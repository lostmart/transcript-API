import express from "express"
import { processVideo } from "../controllers/videoController.js"

const router = express.Router()

// POST route because we are sending a URL in the body
router.post("/process", processVideo)

export default router
