function Home() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">
				Video Transcript Creator
			</h1>
			<p className="text-gray-600 mb-8">
				Extract and process video transcripts with AI-powered script generation.
			</p>

			<div className="bg-white rounded-lg shadow-lg p-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Video URL
				</label>
				<input
					type="text"
					placeholder="https://youtube.com/watch?v=..."
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
					Process Transcript
				</button>
			</div>
		</div>
	)
}

export default Home
