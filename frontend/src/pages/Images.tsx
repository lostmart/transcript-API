import { useState } from "react"
import imageData from "./imageData.json"

const Images = () => {
	const [selectedImage, setSelectedImage] = useState<{
		id: number | string
		source: string
		url: string
		thumbnail: string
		photographer: string
		photographer_url: string
		query: string
		width: number
		height: number
	} | null>(null)

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<h1 className="text-4xl font-bold text-white mb-2">
					Stock Photo Gallery
				</h1>
				<p className="text-gray-400">
					{imageData.photos.length} photos from Pexels & Unsplash
				</p>
			</div>

			{/* Image Grid */}
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{imageData.photos.map((photo, i) => (
						<div
							key={i}
							className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800 cursor-pointer transition-transform hover:scale-105"
							onClick={() => setSelectedImage(photo)}
						>
							{/* Image */}
							<img
								src={photo.thumbnail}
								alt={photo.query}
								className="w-full h-full object-cover"
								loading="lazy"
							/>

							{/* Overlay on hover */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div className="absolute bottom-0 left-0 right-0 p-4">
									<p className="text-white text-sm font-medium mb-1">
										{photo.query}
									</p>
									<p className="text-gray-300 text-xs">
										by {photo.photographer}
									</p>
									<span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
										{photo.source}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal for selected image */}
			{selectedImage && (
				<div
					className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={() => setSelectedImage(null)}
				>
					<div
						className="relative max-w-4xl w-full"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<button
							onClick={() => setSelectedImage(null)}
							className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
						>
							<svg
								className="w-8 h-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						{/* Image */}
						<div className="bg-gray-900 rounded-lg overflow-hidden">
							<img
								src={selectedImage.url}
								alt={selectedImage.query}
								className="w-full h-auto max-h-[80vh] object-contain"
							/>

							{/* Image info */}
							<div className="p-6 border-t border-gray-800">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h3 className="text-white text-lg font-semibold mb-1">
											{selectedImage.query}
										</h3>
										<p className="text-gray-400 text-sm">
											<a
												href={selectedImage.photographer_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-400 hover:text-blue-300 transition-colors"
											>
												{selectedImage.photographer}
											</a>
										</p>
									</div>
									<span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
										{selectedImage.source}
									</span>
								</div>

								<div className="flex gap-4 text-sm text-gray-500">
									<span>
										{selectedImage.width} × {selectedImage.height}
									</span>
									<span>•</span>
									<span>
										{(selectedImage.height / selectedImage.width).toFixed(2)}:1
										ratio
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default Images
