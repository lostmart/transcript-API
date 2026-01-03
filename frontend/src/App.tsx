import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"

// Pages
import Home from "./pages/Home"
import Process from "./pages/Process"
import NotFound from "./pages/NotFound"
import Images from "./pages/Images"
import EditSummary from "./pages/EditSummary"

// Context
import { VideoProvider } from "./context/VideoContext"

function App() {
	return (
		<VideoProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="process" element={<Process />} />
						<Route path="images" element={<Images />} />
						<Route path="edit" element={<EditSummary />} />
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</VideoProvider>
	)
}

export default App
