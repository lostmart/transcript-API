import { GoogleGenAI } from "@google/genai"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"
import { PassThrough } from "stream"

// Set the ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic)

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

export const generateAudio = async (req, res) => {
	try {
		const { text, voice, tone = "professional and calm" } = req.body

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash-preview-tts", // TTS-specific model
			contents: [{ parts: [{ text: `[Tone: ${tone}] Say this: ${text}` }] }],
			config: {
				// CRITICAL FIX: Tell the model to output audio
				responseModalities: ["AUDIO"],
				speechConfig: {
					voiceConfig: {
						prebuiltVoiceConfig: {
							voiceName: voice, // Options: 'Kore', 'Aoede', 'Callirrhoe', etc.
						},
					},
				},
			},
		})

		// 1. Get raw PCM data from Gemini
		const audioData = response.candidates[0].content.parts[0].inlineData.data
		const audioBuffer = Buffer.from(audioData, "base64")

		// 2. Create a stream from the buffer
		const bufferStream = new PassThrough()
		bufferStream.end(audioBuffer)

		// 3. Convert PCM to MP3 using FFmpeg

		const timestamp = Date.now()
		const fileName = `voiceover-${timestamp}.mp3`
		const filePath = `./assets/audio/${fileName}`

		const protocol = req.protocol // http or https
		const host = req.get("host") // localhost:3000
		const audioUrl = `${protocol}://${host}/audio/${fileName}`

		ffmpeg(bufferStream)
			.inputFormat("s16le") // Gemini returns 16-bit Little Endian PCM
			.inputOptions("-ar 24000") // Gemini TTS sample rate is 24kHz
			.inputOptions("-ac 1") // Mono channel
			.audioCodec("libmp3lame")
			.audioBitrate("128k")
			.save(filePath)
			.on("end", () => {
				return res.status(200).json({
					success: true,
					message: "MP3 generated successfully",
					file: filePath,
					audioUrl: audioUrl, // NEW: Full URL for frontend
					voice,
				})
			})
			.on("error", (err) => {
				throw new Error("FFmpeg conversion failed: " + err.message)
			})
	} catch (error) {
		console.error("Audio Error:", error)
		res.status(500).json({ success: false, error: error.message })
	}
}
