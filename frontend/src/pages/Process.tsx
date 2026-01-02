function Process() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				Processing Transcript
			</h1>
			<div className="bg-white rounded-lg shadow-lg p-8 text-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<p className="text-gray-600">
					AI is analyzing your video transcript...
				</p>
			</div>
		</div>
	)
}

export default Process
