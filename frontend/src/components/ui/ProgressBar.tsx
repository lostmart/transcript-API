interface ProgressBarProps {
	current: number
	total: number
	label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
	const percentage = (current / total) * 100

	return (
		<div className="mb-8">
			{label && (
				<div className="flex items-center justify-between mb-3">
					<h1 className="text-3xl font-bold text-gray-900">{label}</h1>
					<span className="text-sm font-semibold text-gray-600">
						{current} of {total} selected
					</span>
				</div>
			)}
			<div className="w-full bg-gray-200 rounded-full h-2">
				<div
					className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	)
}
