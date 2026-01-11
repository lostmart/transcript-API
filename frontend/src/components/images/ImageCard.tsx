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

interface ImageCardProps {
	photo: Photo
	isSelected: boolean
	onSelect: () => void
}

export function ImageCard({ photo, isSelected, onSelect }: ImageCardProps) {
	return (
		<div
			onClick={onSelect}
			className={`group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer transition-all ${
				isSelected ? "ring-4 ring-blue-500 scale-105" : "hover:scale-105"
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
			{isSelected && (
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
	)
}
