import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVideo } from "../context/VideoContext"
import { useOnline } from "../context/OnlineContext"
import axios from "axios"

interface AudioSection {
	id: string
	text: string
	voice: string
	tone: string
	audioUrl: string | null
	isGenerating: boolean
}

const AVAILABLE_VOICES = [
	"Callirrhoe",
	"Matthew",
	"Joanna",
	"Amy",
	"Brian",
	"Emma",
	"Olivia",
	"Aria",
	"Davis",
	"Tony",
]

const TONE_PRESETS = [
	{
		value: "over hyped and excited with a latin accent",
		label: "🔥 Hyped & Excited (Latin)",
	},
	{ value: "calm and professional", label: "😌 Calm & Professional" },
	{ value: "energetic and motivating", label: "⚡ Energetic & Motivating" },
	{
		value: "friendly and conversational",
		label: "😊 Friendly & Conversational",
	},
	{
		value: "authoritative and confident",
		label: "💪 Authoritative & Confident",
	},
	{ value: "warm and encouraging", label: "🤗 Warm & Encouraging" },
	{ value: "fast-paced and dynamic", label: "🚀 Fast-paced & Dynamic" },
]

function AudioGeneration() {
	const navigate = useNavigate()
	const { videoData } = useVideo()
	const { onLine } = useOnline()
	const [error, setError] = useState<string | null>(null)

	// Audio sections for each part of the video
	const [audioSections, setAudioSections] = useState<AudioSection[]>([])

	// Global settings (can apply to all)
	const [globalVoice, setGlobalVoice] = useState("Callirrhoe")
	const [globalTone, setGlobalTone] = useState(
		"over hyped and excited with a latin accent"
	)

	useEffect(() => {
		if (!videoData) {
			navigate("/")
			return
		}

		// Initialize audio sections
		const sections: AudioSection[] = [
			{
				id: "hook",
				text: videoData.hook.text,
				voice: globalVoice,
				tone: globalTone,
				audioUrl: null,
				isGenerating: false,
			},
			...videoData.main_sections.map((section, index) => ({
				id: `section_${index}`,
				text: section.content,
				voice: globalVoice,
				tone: globalTone,
				audioUrl: null,
				isGenerating: false,
			})),
			{
				id: "outro",
				text: `${videoData.summary} ${videoData.cta}`,
				voice: globalVoice,
				tone: globalTone,
				audioUrl: null,
				isGenerating: false,
			},
		]

		setAudioSections(sections)
	}, [videoData, navigate])

	const updateSection = (id: string, updates: Partial<AudioSection>) => {
		setAudioSections((prev) =>
			prev.map((section) =>
				section.id === id ? { ...section, ...updates } : section
			)
		)
	}

	const generateAudio = async (sectionId: string) => {
		const section = audioSections.find((s) => s.id === sectionId)
		if (!section) return

		updateSection(sectionId, { isGenerating: true })
		setError(null)

		try {
			if (!onLine) {
				// Offline mode - simulate
				console.log("Offline mode - simulating audio generation")
				await new Promise((resolve) => setTimeout(resolve, 2000))

				// Mock audio URL
				updateSection(sectionId, {
					audioUrl:
						"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
					isGenerating: false,
				})
			} else {
				// Online mode - call API
				const response = await axios.post(
					"http://localhost:3000/api/audio/generate",
					{
						text: section.text,
						voice: section.voice,
						tone: section.tone,
					}
				)

				if (!response.data.success) {
					throw new Error(response.data.message || "Failed to generate audio")
				}

				updateSection(sectionId, {
					audioUrl: response.data.audioUrl,
					isGenerating: false,
				})
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message =
					err.response?.data?.message ||
					err.message ||
					"Failed to generate audio"
				setError(message)
			} else {
				setError(err instanceof Error ? err.message : "An error occurred")
			}
			console.error("Error generating audio:", err)
			updateSection(sectionId, { isGenerating: false })
		}
	}

	const generateAllAudio = async () => {
		for (const section of audioSections) {
			if (!section.audioUrl) {
				await generateAudio(section.id)
			}
		}
	}

	const applyGlobalSettings = () => {
		setAudioSections((prev) =>
			prev.map((section) => ({
				...section,
				voice: globalVoice,
				tone: globalTone,
			}))
		)
	}

	const canProceed = () => {
		return audioSections.every((section) => section.audioUrl !== null)
	}

	const handleContinue = () => {
		if (!canProceed()) {
			setError("Please generate audio for all sections")
			return
		}

		console.log("Audio sections:", audioSections)
		alert("Video assembly not implemented yet. Check console for audio data.")
	}

	if (!videoData) return null

	const progress = {
		total: audioSections.length,
		completed: audioSections.filter((s) => s.audioUrl).length,
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<button
						onClick={() => navigate("/images")}
						className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
					>
						← Back to Images
					</button>

					<div className="flex items-center gap-3">
						<span
							className={`text-sm font-medium ${
								onLine ? "text-green-600" : "text-orange-600"
							}`}
						>
							{onLine ? "🟢 Online" : "🟠 Offline (Mock)"}
						</span>
					</div>
				</div>

				{/* Main Content */}
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						🎙️ Generate Audio for Each Scene
					</h1>
					<p className="text-gray-600 mb-8">
						Customize voice and tone for each section, then generate audio
					</p>

					{/* Progress Indicator */}
					<div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-semibold text-gray-700">
								Progress: {progress.completed} of {progress.total} sections
							</span>
							<span className="text-sm font-semibold text-blue-600">
								{Math.round((progress.completed / progress.total) * 100)}%
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
								style={{
									width: `${(progress.completed / progress.total) * 100}%`,
								}}
							/>
						</div>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					)}

					{/* Global Settings */}
					<div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							⚙️ Global Settings (Apply to All)
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Voice
								</label>
								<select
									value={globalVoice}
									onChange={(e) => setGlobalVoice(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{AVAILABLE_VOICES.map((voice) => (
										<option key={voice} value={voice}>
											{voice}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Tone
								</label>
								<select
									value={globalTone}
									onChange={(e) => setGlobalTone(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{TONE_PRESETS.map((preset) => (
										<option key={preset.value} value={preset.value}>
											{preset.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex gap-3">
							<button
								onClick={applyGlobalSettings}
								className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
							>
								Apply to All Sections
							</button>
							<button
								onClick={generateAllAudio}
								disabled={audioSections.some((s) => s.isGenerating)}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
							>
								Generate All Audio
							</button>
						</div>
					</div>

					{/* Audio Sections */}
					<div className="space-y-6">
						{audioSections.map((section, index) => (
							<AudioSectionCard
								key={section.id}
								section={section}
								index={index}
								onUpdate={(updates) => updateSection(section.id, updates)}
								onGenerate={() => generateAudio(section.id)}
								availableVoices={AVAILABLE_VOICES}
								tonePresets={TONE_PRESETS}
							/>
						))}
					</div>

					{/* Continue Button */}
					<div className="mt-8 pt-8 border-t border-gray-200">
						<button
							onClick={handleContinue}
							disabled={!canProceed()}
							className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
								canProceed()
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
						>
							{canProceed()
								? "Continue to Video Assembly →"
								: `Generate ${
										progress.total - progress.completed
								  } more audio file(s)`}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

// Audio Section Card Component
interface AudioSectionCardProps {
	section: AudioSection
	index: number
	onUpdate: (updates: Partial<AudioSection>) => void
	onGenerate: () => void
	availableVoices: string[]
	tonePresets: Array<{ value: string; label: string }>
}

function AudioSectionCard({
	section,
	index,
	onUpdate,
	onGenerate,
	availableVoices,
	tonePresets,
}: AudioSectionCardProps) {
	const [showFullText, setShowFullText] = useState(false)

	const getSectionTitle = () => {
		if (section.id === "hook") return "🎣 Hook"
		if (section.id === "outro") return "🎬 Outro"
		return `📝 Section ${index}`
	}

	const isTextLong = section.text.length > 150

	return (
		<div
			className={`p-6 rounded-lg border-2 transition-all ${
				section.audioUrl
					? "bg-green-50 border-green-300"
					: "bg-white border-gray-200"
			}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">
					{getSectionTitle()}
				</h3>
				{section.audioUrl && (
					<span className="flex items-center gap-2 text-green-700 text-sm font-medium">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						Generated
					</span>
				)}
			</div>

			{/* Text */}
			<div className="mb-4">
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Script Text
				</label>
				<div className="relative">
					<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
						{showFullText || !isTextLong
							? section.text
							: `${section.text.substring(0, 150)}...`}
					</p>
					{isTextLong && (
						<button
							onClick={() => setShowFullText(!showFullText)}
							className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
						>
							{showFullText ? "Show less" : "Show more"}
						</button>
					)}
				</div>
			</div>

			{/* Settings */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Voice
					</label>
					<select
						value={section.voice}
						onChange={(e) => onUpdate({ voice: e.target.value })}
						disabled={section.isGenerating}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
					>
						{availableVoices.map((voice) => (
							<option key={voice} value={voice}>
								{voice}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Tone
					</label>
					<select
						value={section.tone}
						onChange={(e) => onUpdate({ tone: e.target.value })}
						disabled={section.isGenerating}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
					>
						{tonePresets.map((preset) => (
							<option key={preset.value} value={preset.value}>
								{preset.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Audio Player or Generate Button */}
			{section.audioUrl ? (
				<div className="space-y-3">
					<audio controls src={section.audioUrl} className="w-full" />
					<button
						onClick={onGenerate}
						disabled={section.isGenerating}
						className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
					>
						Regenerate Audio
					</button>
				</div>
			) : (
				<button
					onClick={onGenerate}
					disabled={section.isGenerating}
					className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{section.isGenerating ? (
						<>
							<svg
								className="animate-spin h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Generating...
						</>
					) : (
						<>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
								/>
							</svg>
							Generate Audio
						</>
					)}
				</button>
			)}
		</div>
	)
}

export default AudioGeneration
