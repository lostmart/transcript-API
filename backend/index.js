import express from "express"
const app = express()
const PORT = process.env.PORT || 3000

import cors from "cors"

import videoRoutes from "./routes/videoRoutes.js"
import audioRoutes from "./routes/audioRoutes.js"
import imageRoutes from "./routes/imageRoutes.js"

// Middleware to parse JSON bodies
app.use(express.json())

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

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
