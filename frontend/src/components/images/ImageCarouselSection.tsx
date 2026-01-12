import { ImageCard } from "./ImageCard"

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

interface ImageCarouselSectionProps {
	section: {
		id: string
		title: string
		text?: string // NEW: Add text content
		queries: string[]
		photos: Photo[]
		selectedPhoto: Photo | null
		onSelect: (photo: Photo) => void
	}
	isSelected: boolean
}

export function ImageCarouselSection({
	section,
	isSelected,
}: ImageCarouselSectionProps) {
	return (
		<div>
			{/* Section Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold text-gray-900">
					{section.title}
				</h2>
				{isSelected && (
					<span className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="font-medium">Selected</span>
					</span>
				)}
			</div>

			{/* NEW: Script Text Content */}
			{section.text && (
				<div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 mt-1">
							<svg
								className="w-5 h-5 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<h3 className="text-sm font-semibold text-gray-700 mb-2">
								Script Content
							</h3>
							<p className="text-sm text-gray-700 leading-relaxed">
								{section.text}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Search Queries */}
			<div className="mb-6">
				<p className="text-sm font-semibold text-gray-700 mb-2">
					📸 Image search queries:
				</p>
				<div className="flex flex-wrap gap-2">
					{section.queries.map((query, i) => (
						<span
							key={i}
							className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
						>
							{query}
						</span>
					))}
				</div>
			</div>

			{/* Image Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{section.photos.map((photo, i) => (
					<ImageCard
						key={i}
						photo={photo}
						isSelected={section.selectedPhoto?.id === photo.id}
						onSelect={() => section.onSelect(photo)}
					/>
				))}
			</div>

			{section.photos.length === 0 && (
				<p className="text-gray-500 text-center py-12">
					No images found for this section
				</p>
			)}
		</div>
	)
}
