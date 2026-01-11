interface OnlineToggleProps {
	isOnline: boolean
	onToggle: () => void
}

export function OnlineToggle({ isOnline, onToggle }: OnlineToggleProps) {
	return (
		<div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
			<span
				className={`text-sm font-medium ${
					isOnline ? "text-green-600" : "text-orange-600"
				}`}
			>
				{isOnline ? "🟢 Online" : "🟠 Offline"}
			</span>
			<button
				type="button"
				onClick={onToggle}
				className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
					isOnline ? "bg-green-600" : "bg-gray-400"
				}`}
			>
				<span
					className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
						isOnline ? "translate-x-6" : "translate-x-1"
					}`}
				/>
			</button>
		</div>
	)
}
