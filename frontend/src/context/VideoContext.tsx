import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

interface Section {
	heading: string
	content: string
	stock_photo_queries: string[]
}

interface Hook {
	text: string
	stock_photo_queries: string[]
}

interface VideoData {
	title: string
	hook: Hook
	main_sections: Section[]
	summary: string
	cta: string
	outro_stock_photo_queries: string[]
}

interface VideoContextType {
	videoUrl: string
	setVideoUrl: (url: string) => void
	videoData: VideoData | null
	setVideoData: (data: VideoData) => void
	isLoading: boolean
	setIsLoading: (loading: boolean) => void
	error: string | null
	setError: (error: string | null) => void
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export const VideoProvider = ({ children }: { children: ReactNode }) => {
	const [videoUrl, setVideoUrl] = useState("")
	const [videoData, setVideoData] = useState<VideoData | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	return (
		<VideoContext.Provider
			value={{
				videoUrl,
				setVideoUrl,
				videoData,
				setVideoData,
				isLoading,
				setIsLoading,
				error,
				setError,
			}}
		>
			{children}
		</VideoContext.Provider>
	)
}

export const useVideo = () => {
	const context = useContext(VideoContext)
	if (context === undefined) {
		throw new Error("useVideo must be used within a VideoProvider")
	}
	return context
}
