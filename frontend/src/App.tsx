import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"

// Pages
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Images from "./pages/Images"
import EditSummary from "./pages/EditSummary"

// Context
import { VideoProvider } from "./context/VideoContext"
import { OnlineProvider } from "./context/OnlineContext"

function App() {
	return (
		<OnlineProvider>
			<VideoProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<Home />} />
							<Route path="images" element={<Images />} />
							<Route path="edit" element={<EditSummary />} />
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</VideoProvider>
		</OnlineProvider>
	)
}

export default App
