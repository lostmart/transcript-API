import { Outlet, Link, useLocation } from "react-router-dom"

function Layout() {
	const location = useLocation()

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="text-xl font-bold text-blue-600">
							Transcript Creator
						</Link>
						<div className="flex gap-4">
							<Link
								to="/"
								className={`px-4 py-2 rounded-lg transition-colors ${
									location.pathname === "/"
										? "bg-blue-100 text-blue-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								Home
							</Link>
							<Link
								to="/process"
								className={`px-4 py-2 rounded-lg transition-colors ${
									location.pathname === "/process"
										? "bg-blue-100 text-blue-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								Process Video
							</Link>
							<Link
								to="/images"
								className={`px-4 py-2 rounded-lg transition-colors ${
									location.pathname === "/images"
										? "bg-blue-100 text-blue-700"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								Images
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<main className="py-8 min-h-[calc(100vh-156px)]">
				<Outlet />
			</main>

			<footer className="bg-white border-t mt-auto py-6">
				<div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
					<p>© 2025 Transcript Creator. Built with React + Vite</p>
				</div>
			</footer>
		</div>
	)
}

export default Layout
