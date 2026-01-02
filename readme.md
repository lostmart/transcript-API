# Transcript API

This is a transcript API, enter a youtbe video url and it will give you the transcript

## Technologies

- **Node.js (v22+)** - Core runtime using modern ES Modules.
- **Express.js (v5)** - High-performance web framework for the API layer.
- **@google/genai** - Unified SDK supporting **Gemini 3 Flash** (Reasoning) and **Gemini 2.5 Flash TTS** (Audio).
- **youtube-caption-extractor** - Robust subtitle extraction for YouTube content.
- **fluent-ffmpeg** & **ffmpeg-static** - Industrial-grade audio encoding to MP3.
- **dotenv** - Secure environment variable management.
- **nodemon** - Development utility for automatic server restarts.
- **EJS** - Embedded JavaScript templates for dynamic HTML generation.

## 🚀 Getting Started

1. Installation

```bash
npm install
```

2. Environment Setup
   Create a .env file in the root directory:

```
PORT=3000
GEMINI_API_KEY=your_google_ai_studio_key
```

3. Start the server

```
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

`POST /api/videos/process`

Extracts a transcript and generates a refactored script.

**_Request Body:_**

```json
{
	"videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**_Success Response (200 OK):_**

```json
{
	"success": true,
	"data": {
		"title": "Optimized Title",
		"hook": "Engaging introduction...",
		"main_sections": [{ "heading": "Section 1", "content": "..." }],
		"summary": "Final takeaway."
	}
}
```

## 📝 Important Notes

- This API is a work in progress and may not be perfect.
- **_VPN Requirement:_** Accessing the Google AI Studio API or YouTube scraping from certain regions (like France/EEA) may require a VPN set to the US/UK.
- **_Auto-Generated Captions:_** This API supports both manually uploaded and auto-generated YouTube subtitles.

## Audio files

- Since Gemini is a reasoning model, you can get very creative with the tone field in your JSON

```
|       Tone Value      |  Effect on Audio                 |
|-----------------------|:--------------------------------:|
| professional and calm |  professional and calm                                     |
| whispering            |  The model will lower its volume and add breathiness       |
| sad and somber        |  Lowers the pitch and adds pauses for emotional effect     |
| news anchor           |  Adds a very specific cadence and authoritative clarity    |
| hyped and energetic   |  Increases the pitch and pace (Perfect for social media hooks)|
| casual and friendly   |  etc ...                                                   |
```

## Official Documentation

- [Google AI Studio](https://ai.google.com/studio/)
- [YouTube API](https://developers.google.com/youtube/v3/getting-started)
- [JS-GenAI](https://github.com/googleapis/js-genai)
