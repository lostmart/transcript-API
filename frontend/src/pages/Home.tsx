import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVideo } from "../context/VideoContext"
import { useOnline } from "../context/OnlineContext"
import axios from "axios"

// Import your local mock data
import mockVideoData from "../data/videoData.json"

function Home() {
	const navigate = useNavigate()
	const {
		setVideoUrl,
		setVideoData,
		setIsLoading,
		setError,
		isLoading,
		error,
	} = useVideo()
	const [url, setUrl] = useState("")
	const { onLine, setOnLine } = useOnline()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!url.trim()) {
			setError("Please enter a valid YouTube URL")
			return
		}

		setVideoUrl(url)
		setIsLoading(true)
		setError(null)

		// Retry logic for 503 errors
		const maxRetries = 2
		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				if (!onLine) {
					// Offline mode - use local mock data
					console.log("Using local mock data (offline mode)")
					await new Promise((resolve) => setTimeout(resolve, 1000))
					setVideoData(mockVideoData.data)
					navigate("/edit")
					return
				} else {
					// Online mode - make API call
					const response = await axios.post(
						"http://localhost:3000/api/videos/process",
						{
							url,
						}
					)

					if (!response.data.success) {
						throw new Error(response.data.message || "Failed to process video")
					}

					// Save data to context
					setVideoData(response.data.data)

					// Navigate to edit page
					navigate("/edit")
					return // Success, exit retry loop
				}
			} catch (err) {
				const isLastAttempt = attempt === maxRetries - 1

				if (axios.isAxiosError(err)) {
					const isOverloaded =
						err.response?.status === 503 || err.response?.data?.retryable

					if (isOverloaded && !isLastAttempt) {
						// Wait before retry
						const delay = 3000 * (attempt + 1)
						console.log(`Service overloaded. Retrying in ${delay}ms...`)
						setError(
							`AI service is busy. Retrying in ${delay / 1000} seconds...`
						)
						await new Promise((resolve) => setTimeout(resolve, delay))
						continue // Retry
					}

					// Handle axios-specific errors
					const message =
						err.response?.data?.message ||
						err.message ||
						"Failed to process video"
					setError(message)
				} else {
					setError(err instanceof Error ? err.message : "An error occurred")
				}
				console.error("Error processing video:", err)
				break // Exit on non-retryable error
			} finally {
				if (attempt === maxRetries - 1) {
					setIsLoading(false)
				}
			}
		}
		setIsLoading(false)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-4xl mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">
						Video Script Creator
					</h1>
					<p className="text-xl text-gray-600">
						Transform YouTube videos into engaging social media scripts with AI
					</p>
				</div>

				<div className="bg-white rounded-2xl shadow-xl p-8">
					{/* Online/Offline Toggle */}
					<div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-3">
							<span className="text-sm font-semibold text-gray-700">Mode:</span>
							<span
								className={`text-sm font-medium ${
									onLine ? "text-green-600" : "text-orange-600"
								}`}
							>
								{onLine ? "🟢 Online (API)" : "🟠 Offline (Mock Data)"}
							</span>
						</div>
						<button
							type="button"
							onClick={() => setOnLine(!onLine)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
								onLine ? "bg-green-600" : "bg-gray-400"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									onLine ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<label className="block text-sm font-semibold text-gray-700 mb-3">
							YouTube Video URL
							{!onLine && (
								<span className="ml-2 text-xs text-orange-600 font-normal">
									(URL will be ignored - using mock data)
								</span>
							)}
						</label>
						<input
							type="text"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://youtube.com/watch?v=..."
							disabled={isLoading}
							className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>

						{error && (
							<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-700 text-sm">{error}</p>
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-sm hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-400 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
						>
							{isLoading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
									{onLine ? "Processing Video..." : "Loading Mock Data..."}
								</>
							) : (
								"Generate Script"
							)}
						</button>
					</form>

					<div className="mt-8 pt-8 border-t border-gray-200">
						<h3 className="text-sm font-semibold text-gray-700 mb-3">
							How it works:
						</h3>
						<ol className="space-y-2 text-sm text-gray-600">
							<li className="flex items-start">
								<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-semibold text-xs">
									1
								</span>
								<span>Paste a YouTube video URL</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-semibold text-xs">
									2
								</span>
								<span>AI extracts and analyzes the transcript</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-semibold text-xs">
									3
								</span>
								<span>Review and edit your generated script</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-semibold text-xs">
									4
								</span>
								<span>Select images for each scene</span>
							</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
