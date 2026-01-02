import { Link } from "react-router-dom"

function NotFound() {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8 text-center">
			<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<p className="text-xl text-gray-600 mb-8">Page not found</p>
			<Link
				to="/"
				className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
			>
				Go Home
			</Link>
		</div>
	)
}

export default NotFound
