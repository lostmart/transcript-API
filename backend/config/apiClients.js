import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

// Pexels API client
export const pexelsAPI = axios.create({
	baseURL: "https://api.pexels.com/v1",
	headers: {
		Authorization: process.env.PEXELS_API_KEY,
	},
	timeout: 10000, // 10 second timeout
})

// Unsplash API client
export const unsplashAPI = axios.create({
	baseURL: "https://api.unsplash.com",
	params: {
		client_id: process.env.UNSPLASH_ACCESS_KEY,
	},
	timeout: 10000,
})

// Optional: Add response interceptors for logging/error handling
pexelsAPI.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("Pexels API Error:", error.message)
		return Promise.reject(error)
	}
)

unsplashAPI.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("Unsplash API Error:", error.message)
		return Promise.reject(error)
	}
)
