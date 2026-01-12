interface ErrorAlertProps {
	message: string
	onDismiss?: () => void
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
	return (
		<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
			<p className="text-red-700 text-sm">{message}</p>
			{onDismiss && (
				<button onClick={onDismiss} className="text-red-400 hover:text-red-600">
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
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			)}
		</div>
	)
}
