interface NavigationButtonsProps {
	onPrevious: () => void
	onNext: () => void
	canGoBack: boolean
	isLastSection: boolean
	canProceed: boolean
}

export function NavigationButtons({
	onPrevious,
	onNext,
	canGoBack,
	isLastSection,
	canProceed,
}: NavigationButtonsProps) {
	return (
		<div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
			<button
				onClick={onPrevious}
				disabled={!canGoBack}
				className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
					!canGoBack
						? "bg-gray-200 text-gray-400 cursor-not-allowed"
						: "bg-gray-600 text-white hover:bg-gray-700"
				}`}
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
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Previous
			</button>

			{isLastSection ? (
				<button
					onClick={onNext}
					disabled={!canProceed}
					className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
						canProceed
							? "bg-blue-600 text-white hover:bg-blue-700"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
				>
					Continue to Audio
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
				</button>
			) : (
				<button
					onClick={onNext}
					className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
				>
					Next
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
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			)}
		</div>
	)
}
