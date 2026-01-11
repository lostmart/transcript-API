import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVideo } from "../context/VideoContext"
import { useOnline } from "../context/OnlineContext"
import axios from "axios"

// Import components
import { ProgressBar } from "../components/ui/ProgressBar"
import { NavigationDots } from "../components/ui/NavigationDots"
import { OnlineToggle } from "../components/ui/OnlineToggle"
import { LoadingSpinner } from "../components/ui/LoadingSpinner"
import { NavigationButtons } from "../components/ui/NavigationButtons"
import { ErrorAlert } from "../components/ui/ErrorAlert"
import { ImageCarouselSection } from "../components/images/ImageCarouselSection"

// Import mock data
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
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

	const [photos, setPhotos] = useState<{
		hook: Photo[]
		sections: Photo[][]
		outro: Photo[]
	} | null>(null)

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

		setSelectedImages((prev) => ({
			...prev,
			sections: new Array(videoData.main_sections.length).fill(null),
		}))

		fetchPhotos()
	}, [videoData, navigate])

	const fetchPhotos = async () => {
		if (!videoData) return

		setIsLoading(true)
		setError(null)

		try {
			if (!onLine) {
				console.log("Using mock image data (offline mode)")
				await new Promise((resolve) => setTimeout(resolve, 500))

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
				const response = await axios.post(
					"http://localhost:3000/api/images/video-sections",
					{ summaryData: videoData }
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
			const newSections = [...selectedImages.sections]
			newSections[scene] = photo
			setSelectedImages({ ...selectedImages, sections: newSections })
		} else {
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

	const getCurrentSection = () => {
		if (!videoData || !photos) return null

		const totalSections = videoData.main_sections.length + 2

		if (currentSectionIndex === 0) {
			// Hook
			return {
				id: "hook",
				title: "🎣 Hook Scene",
				text: videoData.hook.text, // NEW: Add hook text
				queries: videoData.hook.stock_photo_queries,
				photos: photos.hook,
				selectedPhoto: selectedImages.hook,
				onSelect: (photo: Photo) => handleSelectImage("hook", photo),
			}
		} else if (currentSectionIndex === totalSections - 1) {
			// Outro
			return {
				id: "outro",
				title: "🎬 Outro Scene",
				text: `${videoData.summary} ${videoData.cta}`, // NEW: Add summary + CTA
				queries: videoData.outro_stock_photo_queries,
				photos: photos.outro,
				selectedPhoto: selectedImages.outro,
				onSelect: (photo: Photo) => handleSelectImage("outro", photo),
			}
		} else {
			// Main sections
			const sectionIndex = currentSectionIndex - 1
			const section = videoData.main_sections[sectionIndex]
			return {
				id: `section_${sectionIndex}`,
				title: `📝 Section ${sectionIndex + 1}: ${section.heading}`,
				text: section.content, // NEW: Add section content
				queries: section.stock_photo_queries,
				photos: photos.sections[sectionIndex] || [],
				selectedPhoto: selectedImages.sections[sectionIndex],
				onSelect: (photo: Photo) => handleSelectImage(sectionIndex, photo),
			}
		}
	}

	const getSelectedIndices = () => {
		const totalSections = videoData ? videoData.main_sections.length + 2 : 0
		return Array.from({ length: totalSections }).map((_, index) => {
			if (index === 0) return selectedImages.hook !== null
			if (index === totalSections - 1) return selectedImages.outro !== null
			return selectedImages.sections[index - 1] !== null
		})
	}

	const goToNext = () => {
		const totalSections = videoData ? videoData.main_sections.length + 2 : 0
		if (currentSectionIndex < totalSections - 1) {
			setCurrentSectionIndex((prev) => prev + 1)
		} else {
			handleContinue()
		}
	}

	const goToPrevious = () => {
		if (currentSectionIndex > 0) {
			setCurrentSectionIndex((prev) => prev - 1)
		}
	}

	const goToSection = (index: number) => {
		setCurrentSectionIndex(index)
	}

	const handleContinue = () => {
		if (!canProceed()) {
			setError("Please select an image for each scene")
			return
		}

		console.log("Selected images:", selectedImages)
		navigate("/audio")
	}

	const isCurrentSectionSelected = () => {
		if (currentSectionIndex === 0) return selectedImages.hook !== null
		const totalSections = videoData ? videoData.main_sections.length + 2 : 0
		if (currentSectionIndex === totalSections - 1)
			return selectedImages.outro !== null
		return selectedImages.sections[currentSectionIndex - 1] !== null
	}

	if (!videoData) return null

	if (isLoading) {
		return (
			<LoadingSpinner
				message={
					onLine
						? "Fetching images from Pexels & Unsplash..."
						: "Loading mock images..."
				}
			/>
		)
	}

	const currentSection = getCurrentSection()
	const totalSections = videoData.main_sections.length + 2
	const progress = getProgress()

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

					<OnlineToggle
						isOnline={onLine}
						onToggle={() => {
							setOnLine(!onLine)
							fetchPhotos()
						}}
					/>
				</div>

				{/* Main Content */}
				<div className="bg-white rounded-lg shadow-lg p-8">
					<ProgressBar
						current={progress.selected}
						total={progress.total}
						label="Select Images for Each Scene"
					/>

					<NavigationDots
						total={totalSections}
						current={currentSectionIndex}
						selectedIndices={getSelectedIndices()}
						onDotClick={goToSection}
					/>

					{error && (
						<ErrorAlert message={error} onDismiss={() => setError(null)} />
					)}

					{currentSection && (
						<div className="min-h-[600px]">
							<ImageCarouselSection
								section={currentSection}
								isSelected={isCurrentSectionSelected()}
							/>
						</div>
					)}

					<NavigationButtons
						onPrevious={goToPrevious}
						onNext={goToNext}
						canGoBack={currentSectionIndex > 0}
						isLastSection={currentSectionIndex === totalSections - 1}
						canProceed={canProceed()}
					/>
				</div>
			</div>
		</div>
	)
}

export default SelectImages
