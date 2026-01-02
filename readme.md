# Transcript Creator

A full-stack application for extracting, processing, and generating video scripts from URLs using AI-powered transcript analysis.

## Project Structure

```
transcript-creator/
├── backend/          # Express API server
└── frontend/         # React + TypeScript + Vite client
```

## Backend

The backend is built using Node.js and Express.js, and it includes the following modules:

### Technology Stack

- Node.js with Express
- Google Generative AI (Gemini)
- FFmpeg for video processing
- YouTube caption extraction

### Features

- Extract transcripts from video URLs
- Process and refactor transcripts using AI
- Generate polished video scripts
- RESTful API architecture

## Quick Start

```bash
cd backend
npm install
npm run dev
```

See `backend/README.md` for detailed documentation

## Frontend

The frontend is built using React + TypeScript + Vite, and it includes the following modules:

### Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Features

- Modern, responsive UI
- Real-time transcript processing
- Video script generation interface

## Quick Start

```
cd frontend
npm install
npm run dev
```

See `frontend/README.md` for detailed documentation.

## License

MIT © Martin P
