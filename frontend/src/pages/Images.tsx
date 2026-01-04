import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVideo } from "../context/VideoContext"
import { useOnline } from "../context/OnlineContext"
import axios from "axios"

// Import mock image data for offline mode
import mockImageData from "../data/imageData.json"

interface Photo {
	id: number | string
	source: string
	url: string
	thumbnail: string
	photographer: string
	photographer_url: string
	query: string
	width: number
	height: number
}

interface SelectedImages {
	hook: Photo | null
	sections: (Photo | null)[]
	outro: Photo | null
}

function SelectImages() {
	const navigate = useNavigate()
	const { videoData } = useVideo()
	const { onLine, setOnLine } = useOnline()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Store all fetched photos organized by scene
	const [photos, setPhotos] = useState<{
		hook: Photo[]
		sections: Photo[][]
		outro: Photo[]
	} | null>(null)

	// Track selected images
	const [selectedImages, setSelectedImages] = useState<SelectedImages>({
		hook: null,
		sections: [],
		outro: null,
	})

	useEffect(() => {
		if (!videoData) {
			navigate("/")
			return
		}

		// Initialize selected sections array
		setSelectedImages((prev) => ({
			...prev,
			sections: new Array(videoData.main_sections.length).fill(null),
		}))

		// Fetch photos on mount
		fetchPhotos()
	}, [videoData, navigate])

	const fetchPhotos = async () => {
		if (!videoData) return

		setIsLoading(true)
		setError(null)

		try {
			if (!onLine) {
				// Offline mode - use mock data
				console.log("Using mock image data (offline mode)")
				await new Promise((resolve) => setTimeout(resolve, 500))

				// Distribute mock photos across sections
				const photosPerSection = Math.floor(
					mockImageData.photos.length / (videoData.main_sections.length + 2)
				)

				setPhotos({
					hook: mockImageData.photos.slice(0, photosPerSection),
					sections: videoData.main_sections.map((_, i) =>
						mockImageData.photos.slice(
							photosPerSection * (i + 1),
							photosPerSection * (i + 2)
						)
					),
					outro: mockImageData.photos.slice(-photosPerSection),
				})
			} else {
				// Online mode - fetch from API
				const response = await axios.post(
					"http://localhost:3000/api/images/video-sections",
					{
						summaryData: videoData,
					}
				)

				if (!response.data.success) {
					throw new Error(response.data.message || "Failed to fetch images")
				}

				setPhotos(response.data.photo_options)
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message =
					err.response?.data?.message || err.message || "Failed to fetch images"
				setError(message)
			} else {
				setError(err instanceof Error ? err.message : "An error occurred")
			}
			console.error("Error fetching photos:", err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSelectImage = (
		scene: "hook" | "outro" | number,
		photo: Photo
	) => {
		if (typeof scene === "number") {
			// Section selection
			const newSections = [...selectedImages.sections]
			newSections[scene] = photo
			setSelectedImages({ ...selectedImages, sections: newSections })
		} else {
			// Hook or outro selection
			setSelectedImages({ ...selectedImages, [scene]: photo })
		}
	}

	const canProceed = () => {
		return (
			selectedImages.hook !== null &&
			selectedImages.sections.every((img) => img !== null) &&
			selectedImages.outro !== null
		)
	}

	const getProgress = () => {
		const total = videoData ? videoData.main_sections.length + 2 : 0
		const selected =
			(selectedImages.hook ? 1 : 0) +
			selectedImages.sections.filter(Boolean).length +
			(selectedImages.outro ? 1 : 0)
		return { selected, total, remaining: total - selected }
	}

	const handleContinue = () => {
		if (!canProceed()) {
			setError("Please select an image for each scene")
			return
		}

		// Save selected images to context or proceed to next step
		console.log("Selected images:", selectedImages)
		navigate("/audio") // Next step
	}

	if (!videoData) return null

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<svg
						className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
					<p className="text-gray-600 font-medium">
						{onLine
							? "Fetching images from Pexels & Unsplash..."
							: "Loading mock images..."}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<button
						onClick={() => navigate("/edit")}
						className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
					>
						← Back to Edit
					</button>

					{/* Online/Offline Toggle */}
					<div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
						<span
							className={`text-sm font-medium ${
								onLine ? "text-green-600" : "text-orange-600"
							}`}
						>
							{onLine ? "🟢 Online" : "🟠 Offline"}
						</span>
						<button
							type="button"
							onClick={() => {
								setOnLine(!onLine)
								fetchPhotos() // Refetch with new mode
							}}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								onLine ? "bg-green-600" : "bg-gray-400"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									onLine ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>

				{/* Floating Progress Panel */}
				<FloatingProgressPanel
					progress={getProgress()}
					selectedImages={selectedImages}
					onContinue={handleContinue}
					canProceed={canProceed()}
				/>

				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Select Images for Each Scene
					</h1>
					<p className="text-gray-600 mb-8">
						Choose one image for each section of your video
					</p>

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					)}

					{photos && (
						<>
							{/* Hook Scene */}
							<ImageSection
								title="🎣 Hook Scene"
								queries={videoData.hook.stock_photo_queries}
								photos={photos.hook}
								selectedPhoto={selectedImages.hook}
								onSelect={(photo) => handleSelectImage("hook", photo)}
							/>

							{/* Main Sections */}
							{videoData.main_sections.map((section, index) => (
								<ImageSection
									key={index}
									title={`📝 Section ${index + 1}: ${section.heading}`}
									queries={section.stock_photo_queries}
									photos={photos.sections[index] || []}
									selectedPhoto={selectedImages.sections[index]}
									onSelect={(photo) => handleSelectImage(index, photo)}
								/>
							))}

							{/* Outro Scene */}
							<ImageSection
								title="🎬 Outro Scene"
								queries={videoData.outro_stock_photo_queries}
								photos={photos.outro}
								selectedPhoto={selectedImages.outro}
								onSelect={(photo) => handleSelectImage("outro", photo)}
							/>
						</>
					)}

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
								? "Continue to Audio Generation →"
								: `Select ${
										videoData.main_sections.length +
										2 -
										(selectedImages.sections.filter(Boolean).length +
											(selectedImages.hook ? 1 : 0) +
											(selectedImages.outro ? 1 : 0))
								  } more image(s)`}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

// Floating Progress Panel Component
interface FloatingProgressPanelProps {
	progress: { selected: number; total: number; remaining: number }
	selectedImages: SelectedImages
	onContinue: () => void
	canProceed: boolean
}

function FloatingProgressPanel({
	progress,
	selectedImages,
	onContinue,
	canProceed,
}: FloatingProgressPanelProps) {
	const [isExpanded, setIsExpanded] = useState(true)
	const percentage = (progress.selected / progress.total) * 100

	if (!isExpanded) {
		return (
			<div className="fixed bottom-8 right-8 z-50">
				<button
					onClick={() => setIsExpanded(true)}
					className="bg-white rounded-full shadow-2xl p-4 border border-gray-200 hover:scale-110 transition-transform"
				>
					<div className="relative">
						<svg
							className="w-6 h-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
							{progress.selected}
						</span>
					</div>
				</button>
			</div>
		)
	}

	return (
		<div className="fixed bottom-8 right-8 z-50">
			<div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80">
				{/* Progress Header */}
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900">
						Selection Progress
					</h3>
					<div className="flex items-center gap-2">
						<span className="text-2xl">{canProceed ? "✅" : "📸"}</span>
						<button
							onClick={() => setIsExpanded(false)}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
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
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mb-4">
					<div className="flex justify-between text-sm text-gray-600 mb-2">
						<span>
							{progress.selected} of {progress.total} selected
						</span>
						<span className="font-semibold">{Math.round(percentage)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
						<div
							className={`h-full rounded-full transition-all duration-500 ${
								canProceed
									? "bg-gradient-to-r from-green-500 to-green-600"
									: "bg-gradient-to-r from-blue-500 to-blue-600"
							}`}
							style={{ width: `${percentage}%` }}
						/>
					</div>
				</div>

				{/* Status Message */}
				<div className="mb-4">
					{canProceed ? (
						<div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="text-sm font-medium">All images selected!</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-orange-700 bg-orange-50 px-3 py-2 rounded-lg">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="text-sm font-medium">
								{progress.remaining}{" "}
								{progress.remaining === 1 ? "image" : "images"} remaining
							</span>
						</div>
					)}
				</div>

				{/* Breakdown */}
				<div className="space-y-2 mb-4 text-sm">
					<div className="flex items-center justify-between text-gray-600">
						<span>🎣 Hook</span>
						<span
							className={
								selectedImages.hook
									? "text-green-600 font-semibold"
									: "text-gray-400"
							}
						>
							{selectedImages.hook ? "✓" : "○"}
						</span>
					</div>
					<div className="border-t border-gray-100 pt-2">
						<div className="text-gray-600 mb-1">📝 Sections</div>
						<div className="pl-4 space-y-1">
							{selectedImages.sections.map((section, i) => (
								<div
									key={i}
									className="flex items-center justify-between text-xs"
								>
									<span>Section {i + 1}</span>
									<span
										className={
											section ? "text-green-600 font-semibold" : "text-gray-400"
										}
									>
										{section ? "✓" : "○"}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-2">
						<span>🎬 Outro</span>
						<span
							className={
								selectedImages.outro
									? "text-green-600 font-semibold"
									: "text-gray-400"
							}
						>
							{selectedImages.outro ? "✓" : "○"}
						</span>
					</div>
				</div>

				{/* Action Button */}
				<button
					onClick={onContinue}
					disabled={!canProceed}
					className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
						canProceed
							? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105"
							: "bg-gray-200 text-gray-400 cursor-not-allowed"
					}`}
				>
					{canProceed ? (
						<span className="flex items-center justify-center gap-2">
							Continue
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
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</span>
					) : (
						"Select all images"
					)}
				</button>
			</div>
		</div>
	)
}

// Image Section Component
interface ImageSectionProps {
	title: string
	queries: string[]
	photos: Photo[]
	selectedPhoto: Photo | null
	onSelect: (photo: Photo) => void
}

function ImageSection({
	title,
	queries,
	photos,
	selectedPhoto,
	onSelect,
}: ImageSectionProps) {
	return (
		<div className="mb-10 pb-8 border-b border-gray-200 last:border-b-0">
			<h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>

			{/* Show queries */}
			<div className="mb-4">
				<p className="text-sm text-gray-600 mb-2">Search queries used:</p>
				<div className="flex flex-wrap gap-2">
					{queries.map((query, i) => (
						<span
							key={i}
							className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
						>
							{query}
						</span>
					))}
				</div>
			</div>

			{/* Image Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{photos.map((photo, i) => (
					<div
						key={i}
						onClick={() => onSelect(photo)}
						className={`group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer transition-all ${
							selectedPhoto?.id === photo.id
								? "ring-4 ring-blue-500 scale-105"
								: "hover:scale-105"
						}`}
					>
						{/* Image */}
						<img
							src={photo.thumbnail}
							alt={photo.query}
							className="w-full h-full object-cover"
							loading="lazy"
						/>

						{/* Selected checkmark */}
						{selectedPhoto?.id === photo.id && (
							<div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						)}

						{/* Hover overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="absolute bottom-0 left-0 right-0 p-3">
								<p className="text-white text-xs font-medium truncate mb-1">
									{photo.query}
								</p>
								<p className="text-gray-300 text-xs truncate">
									by {photo.photographer}
								</p>
								<span className="inline-block mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
									{photo.source}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{photos.length === 0 && (
				<p className="text-gray-500 text-center py-8">
					No images found for this section
				</p>
			)}
		</div>
	)
}

export default SelectImages
