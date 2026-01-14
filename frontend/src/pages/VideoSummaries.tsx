import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

interface Summary {
	filename: string
	path: string
	size: number
	createdAt: string
	modifiedAt: string
}

function Summaries() {
	const navigate = useNavigate()
	const [summaries, setSummaries] = useState<Summary[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedSummary, setSelectedSummary] = useState<any>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		fetchSummaries()
	}, [])

	const fetchSummaries = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await axios.get(
				"http://localhost:3000/api/videos/summaries"
			)

			if (!response.data.success) {
				throw new Error(response.data.message || "Failed to fetch summaries")
			}

			// Sort by creation date (newest first)
			const sorted = response.data.summaries.sort(
				(a: Summary, b: Summary) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)

			setSummaries(sorted)
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(
					err.response?.data?.message ||
						err.message ||
						"Failed to load summaries"
				)
			} else {
				setError(err instanceof Error ? err.message : "An error occurred")
			}
			console.error("Error fetching summaries:", err)
		} finally {
			setIsLoading(false)
		}
	}

	const viewSummary = async (filename: string) => {
		try {
			const response = await axios.get(
				`http://localhost:3000/api/videos/summaries/${filename}`
			)

			if (!response.data.success) {
				throw new Error(response.data.message || "Failed to load summary")
			}

			setSelectedSummary(response.data.summary)
			setIsModalOpen(true)
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(
					err.response?.data?.message || err.message || "Failed to load summary"
				)
			} else {
				setError(err instanceof Error ? err.message : "An error occurred")
			}
			console.error("Error viewing summary:", err)
		}
	}

	const deleteSummary = async (filename: string) => {
		if (!confirm(`Are you sure you want to delete ${filename}?`)) {
			return
		}

		try {
			const response = await axios.delete(
				`http://localhost:3000/api/videos/summaries/${filename}`
			)

			if (!response.data.success) {
				throw new Error(response.data.message || "Failed to delete summary")
			}

			// Refresh the list
			fetchSummaries()
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(
					err.response?.data?.message ||
						err.message ||
						"Failed to delete summary"
				)
			} else {
				setError(err instanceof Error ? err.message : "An error occurred")
			}
			console.error("Error deleting summary:", err)
		}
	}

	const loadSummaryIntoEditor = (summaryData: any) => {
		// TODO: Load summary into VideoContext and navigate to edit
		console.log("Load into editor:", summaryData)
		alert("Feature coming soon: Load summary into editor")
		setIsModalOpen(false)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
	}

	const getVideoIdFromFilename = (filename: string) => {
		// Extract video ID from filename like: summary-dQw4w9WgXcQ-1767555123456.json
		const match = filename.match(/summary-([^-]+)-/)
		return match ? match[1] : "Unknown"
	}

	const getFileType = (filename: string) => {
		return filename.endsWith(".json") ? "JSON" : "MD"
	}

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
					<p className="text-gray-600 font-medium">Loading summaries...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 py-16">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-5xl font-bold text-gray-900 mb-2">
							Saved Summaries
						</h1>
						<p className="text-xl text-gray-600">
							{summaries.length}{" "}
							{summaries.length === 1 ? "summary" : "summaries"} saved
						</p>
					</div>
					<button
						onClick={() => navigate("/")}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
					>
						+ New Summary
					</button>
				</div>

				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
						<p className="text-red-700 text-sm">{error}</p>
						<button
							onClick={() => setError(null)}
							className="text-red-400 hover:text-red-600"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				)}

				{/* Summaries Grid */}
				{summaries.length === 0 ? (
					<div className="bg-white rounded-2xl shadow-xl p-16 text-center">
						<svg
							className="w-24 h-24 text-gray-300 mx-auto mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<h3 className="text-2xl font-bold text-gray-800 mb-2">
							No summaries yet
						</h3>
						<p className="text-gray-600 mb-6">
							Create your first video summary to get started
						</p>
						<button
							onClick={() => navigate("/")}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
						>
							Create Summary
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{summaries.map((summary) => (
							<SummaryCard
								key={summary.filename}
								summary={summary}
								onView={() => viewSummary(summary.filename)}
								onDelete={() => deleteSummary(summary.filename)}
								formatDate={formatDate}
								formatFileSize={formatFileSize}
								getVideoId={getVideoIdFromFilename}
								getFileType={getFileType}
							/>
						))}
					</div>
				)}
			</div>

			{/* Summary Detail Modal */}
			{isModalOpen && selectedSummary && (
				<SummaryModal
					summary={selectedSummary}
					onClose={() => setIsModalOpen(false)}
					onLoadIntoEditor={() => loadSummaryIntoEditor(selectedSummary)}
				/>
			)}
		</div>
	)
}

// Summary Card Component
interface SummaryCardProps {
	summary: Summary
	onView: () => void
	onDelete: () => void
	formatDate: (date: string) => string
	formatFileSize: (size: number) => string
	getVideoId: (filename: string) => string
	getFileType: (filename: string) => string
}

function SummaryCard({
	summary,
	onView,
	onDelete,
	formatDate,
	formatFileSize,
	getVideoId,
	getFileType,
}: SummaryCardProps) {
	const fileType = getFileType(summary.filename)
	const videoId = getVideoId(summary.filename)

	return (
		<div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<svg
							className="w-6 h-6 text-white"
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
					<span
						className={`px-2 py-1 text-xs font-semibold rounded ${
							fileType === "JSON"
								? "bg-green-100 text-green-700"
								: "bg-purple-100 text-purple-700"
						}`}
					>
						{fileType}
					</span>
				</div>
			</div>

			{/* Video ID */}
			<div className="mb-4">
				<p className="text-sm font-semibold text-gray-700 mb-1">Video ID</p>
				<p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
					{videoId}
				</p>
			</div>

			{/* Metadata */}
			<div className="space-y-2 mb-4">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span>{formatDate(summary.createdAt)}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
						/>
					</svg>
					<span>{formatFileSize(summary.size)}</span>
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<button
					onClick={onView}
					className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
				>
					View
				</button>
				<button
					onClick={onDelete}
					className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
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
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}

// Summary Modal Component
interface SummaryModalProps {
	summary: any
	onClose: () => void
	onLoadIntoEditor: () => void
}

function SummaryModal({
	summary,
	onClose,
	onLoadIntoEditor,
}: SummaryModalProps) {
	const summaryData = summary.data || summary

	return (
		<div
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-2xl font-bold text-gray-900">
						{summaryData.title || "Video Summary"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg
							className="w-6 h-6"
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
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
					{/* Hook */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							🎣 Hook
						</h3>
						<p className="text-gray-700">
							{summaryData.hook?.text || summaryData.hook}
						</p>
					</div>

					{/* Main Sections */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							📝 Main Content
						</h3>
						{summaryData.main_sections?.map((section: any, index: number) => (
							<div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
								<h4 className="font-semibold text-gray-900 mb-2">
									{index + 1}. {section.heading}
								</h4>
								<p className="text-gray-700 text-sm">{section.content}</p>
							</div>
						))}
					</div>

					{/* Summary */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							📌 Summary
						</h3>
						<p className="text-gray-700">{summaryData.summary}</p>
					</div>

					{/* CTA */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							💬 Call to Action
						</h3>
						<p className="text-gray-700">{summaryData.cta}</p>
					</div>
				</div>

				{/* Footer */}
				<div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
					<button
						onClick={onLoadIntoEditor}
						className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
					>
						Load into Editor
					</button>
					<button
						onClick={onClose}
						className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	)
}

export default Summaries
