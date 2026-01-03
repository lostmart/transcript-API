import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

interface OnlineContextType {
	onLine: boolean
	setOnLine: (online: boolean) => void
	toggleOnLine: () => void
}

const OnlineContext = createContext<OnlineContextType | undefined>(undefined)

export const OnlineProvider = ({ children }: { children: ReactNode }) => {
	// Initialize from localStorage or default to false
	const [onLine, setOnLineState] = useState<boolean>(() => {
		const saved = localStorage.getItem("appOnlineMode")
		return saved !== null ? JSON.parse(saved) : false
	})

	// Persist to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("appOnlineMode", JSON.stringify(onLine))
	}, [onLine])

	const setOnLine = (online: boolean) => {
		setOnLineState(online)
	}

	const toggleOnLine = () => {
		setOnLineState((prev) => !prev)
	}

	return (
		<OnlineContext.Provider value={{ onLine, setOnLine, toggleOnLine }}>
			{children}
		</OnlineContext.Provider>
	)
}

export const useOnline = () => {
	const context = useContext(OnlineContext)
	if (context === undefined) {
		throw new Error("useOnline must be used within an OnlineProvider")
	}
	return context
}
