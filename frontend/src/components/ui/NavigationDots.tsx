interface NavigationDotsProps {
	total: number
	current: number
	selectedIndices: boolean[]
	onDotClick: (index: number) => void
}

export function NavigationDots({
	total,
	current,
	selectedIndices,
	onDotClick,
}: NavigationDotsProps) {
	return (
		<div className="flex items-center justify-center gap-2 mb-6">
			{Array.from({ length: total }).map((_, index) => {
				const isSelected = selectedIndices[index]

				return (
					<button
						key={index}
						onClick={() => onDotClick(index)}
						className={`transition-all ${
							current === index
								? "w-8 h-3 rounded-full"
								: "w-3 h-3 rounded-full"
						} ${
							isSelected
								? "bg-green-500"
								: current === index
								? "bg-blue-600"
								: "bg-gray-300 hover:bg-gray-400"
						}`}
						title={`Go to section ${index + 1}`}
					/>
				)
			})}
		</div>
	)
}
