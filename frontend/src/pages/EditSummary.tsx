import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVideo } from "../context/VideoContext"

function EditSummary() {
	const navigate = useNavigate()
	const { videoData, setVideoData } = useVideo()
	const [formData, setFormData] = useState(videoData)

	useEffect(() => {
		// Redirect to home if no video data
		if (!videoData) {
			navigate("/")
		}
	}, [videoData, navigate])

	if (!formData) return null

	const handleSectionChange = (index: number, field: string, value: string) => {
		const newSections = [...formData.main_sections]
		newSections[index] = { ...newSections[index], [field]: value }
		setFormData({ ...formData, main_sections: newSections })
	}

	const handleQueryChange = (
		section: "hook" | "outro" | number,
		queryIndex: number,
		value: string
	) => {
		if (section === "hook") {
			const newQueries = [...formData.hook.stock_photo_queries]
			newQueries[queryIndex] = value
			setFormData({
				...formData,
				hook: { ...formData.hook, stock_photo_queries: newQueries },
			})
		} else if (section === "outro") {
			const newQueries = [...formData.outro_stock_photo_queries]
			newQueries[queryIndex] = value
			setFormData({ ...formData, outro_stock_photo_queries: newQueries })
		} else {
			// It's a section index
			const newSections = [...formData.main_sections]
			const newQueries = [...newSections[section].stock_photo_queries]
			newQueries[queryIndex] = value
			newSections[section] = {
				...newSections[section],
				stock_photo_queries: newQueries,
			}
			setFormData({ ...formData, main_sections: newSections })
		}
	}

	const handleSave = () => {
		setVideoData(formData)
		navigate("/images")
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				<div className="mb-6">
					<button
						onClick={() => navigate("/")}
						className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
					>
						← Back to Home
					</button>
				</div>

				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-8">
						Edit Your Script
					</h1>

					{/* Title */}
					<div className="mb-6">
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Title
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Hook */}
					<div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							🎣 Hook
						</h2>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Text
						</label>
						<textarea
							value={formData.hook.text}
							onChange={(e) =>
								setFormData({
									...formData,
									hook: { ...formData.hook, text: e.target.value },
								})
							}
							rows={3}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
						/>

						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Stock Photo Search Queries
						</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{formData.hook.stock_photo_queries.map((query, qIndex) => (
								<input
									key={qIndex}
									type="text"
									value={query}
									onChange={(e) =>
										handleQueryChange("hook", qIndex, e.target.value)
									}
									placeholder={`Query ${qIndex + 1}`}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							))}
						</div>
					</div>

					{/* Sections */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							📝 Main Sections
						</h2>
						{formData.main_sections.map((section, index) => (
							<div
								key={index}
								className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
							>
								<div className="flex items-center gap-2 mb-4">
									<span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
										{index + 1}
									</span>
									<h3 className="text-lg font-semibold text-gray-800">
										Section {index + 1}
									</h3>
								</div>

								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Heading
								</label>
								<input
									type="text"
									value={section.heading}
									onChange={(e) =>
										handleSectionChange(index, "heading", e.target.value)
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
								/>

								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Content
								</label>
								<textarea
									value={section.content}
									onChange={(e) =>
										handleSectionChange(index, "content", e.target.value)
									}
									rows={4}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
								/>

								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Stock Photo Search Queries
								</label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{section.stock_photo_queries.map((query, qIndex) => (
										<input
											key={qIndex}
											type="text"
											value={query}
											onChange={(e) =>
												handleQueryChange(index, qIndex, e.target.value)
											}
											placeholder={`Query ${qIndex + 1}`}
											className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Summary */}
					<div className="mb-6">
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Summary
						</label>
						<input
							type="text"
							value={formData.summary}
							onChange={(e) =>
								setFormData({ ...formData, summary: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* CTA */}
					<div className="mb-8">
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Call to Action
						</label>
						<input
							type="text"
							value={formData.cta}
							onChange={(e) =>
								setFormData({ ...formData, cta: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Outro Queries */}
					<div className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							🎬 Outro Scene
						</h2>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Stock Photo Search Queries
						</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{formData.outro_stock_photo_queries.map((query, qIndex) => (
								<input
									key={qIndex}
									type="text"
									value={query}
									onChange={(e) =>
										handleQueryChange("outro", qIndex, e.target.value)
									}
									placeholder={`Query ${qIndex + 1}`}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
								/>
							))}
						</div>
					</div>

					<button
						onClick={handleSave}
						className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
					>
						Continue to Image Selection →
					</button>
				</div>
			</div>
		</div>
	)
}

export default EditSummary
