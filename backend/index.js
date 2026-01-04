import express from "express"
const app = express()
import { fileURLToPath } from "url"
import path from "path"
const PORT = process.env.PORT || 3000

import cors from "cors"

import videoRoutes from "./routes/videoRoutes.js"
import audioRoutes from "./routes/audioRoutes.js"
import imageRoutes from "./routes/imageRoutes.js"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware to parse JSON bodies
app.use(express.json())

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).json({
		success: false,
		message: "Something went wrong!",
	})
})

// CORS Middleware
app.use(cors())
app.use("/", (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type")
	next()
})

app.get("/", (req, res) => {
	res.send("Transcript API is running...")
})

// mounts routes
app.use("/api/videos", videoRoutes)
app.use("/api/audio", audioRoutes)
app.use("/api/images", imageRoutes)

// Serve static files from assets/audio directory
app.use("/audio", express.static(path.join(__dirname, "assets", "audio")))

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	console.log(`Audio files available at: http://localhost:${PORT}/audio/`)
})
