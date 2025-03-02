# Globetrotter Challenge Submission

**Candidate**: Himanshu Gupta  
**Date**: March 01, 2025  
**Email**: [himanshuhimanshu282@gmail.com](mailto:himanshuhimanshu282@gmail.com)  
**Phone**: +91 79924 23198  
**Frontend Repository**: [https://github.com/himanshu181749/globe-trotter-frontend](https://github.com/himanshu181749/globe-trotter-frontend)  
**Backend Repository**: [https://github.com/himanshu181749/globe-trotter-backend](https://github.com/himanshu181749/globe-trotter-backend)  
**Live Frontend URL**: [https://globe-trotter-frontend-1.onrender.com/](https://globe-trotter-frontend-1.onrender.com/) (Pending deployment)  

## Project Overview

The *Globetrotter Challenge* is a single-player geography guessing game implemented as a full-stack web application. Players identify destinations from 1-2 cryptic clues, with a game-wide limit of 5 wrong attempts and two persistent lifelines. The project comprises a React frontend and a Node.js/Express backend, delivering a seamless and engaging experience via REST API integration. Key features include immediate feedback, a "Challenge a Friend" sharing mechanism, and a polished UI, all built to meet and extend the original problem statement requirements.

## Key Features

- **Dataset**: 
  - Over 100 destinations stored in `backend/destinations.json`, with clues and fun facts, served via REST API.
- **Gameplay Mechanics**:
  - Presents 1-2 random clues per destination with 4 multiple-choice options.
  - Limits players to 5 wrong attempts across the entire game, tracked as "Wrong Attempts Left."
  - Ends with a "Game Over" screen after 5 wrong attempts, offering a reset option.
- **Feedback System**:
  - Correct guesses trigger a `canvas-confetti` animation and display a fun fact.
  - Incorrect guesses show a CSS shake animation, concealing the correct answer.
- **Lifelines** (Single-use, persistent across game):
  - "50:50": Reduces options to 2 (correct + 1 incorrect).
  - "Reveal a Letter": Displays the first letter of the destination name as a hint.
- **Challenge a Friend**:
  - Generates a shareable URL with the player’s name and score.
  - Captures a game screenshot using `html2canvas` for sharing.
- **User Interface**:
  - Styled with Tailwind CSS (via CDN) for a modern, responsive design with glassmorphism effects.
  - Custom CSS animations (fade-in, shake) enhance interactivity.

## Technology Stack

### Frontend
- **React**: Version 18.2.0  
  - Component-based framework for building a dynamic, single-page application (SPA).
  - Manages state and renders UI components efficiently via hooks (`useState`, `useEffect`).
- **Vite**: Version 5.2.11  
  - Fast build tool and development server, leveraging ES modules for instant hot module replacement (HMR) and optimized production builds.
  - Outputs static assets to `dist/` for deployment.
- **Tailwind CSS**: Loaded via CDN  
  - Utility-first CSS framework for rapid, responsive styling without custom CSS overhead.
  - Applied via class names for layout, typography, and glassmorphism effects (e.g., `bg-opacity-50`, `backdrop-blur-md`).
- **axios**: Version 1.7.2  
  - Promise-based HTTP client for making REST API requests to the backend (`GET /api/destination`, `GET /api/destinations`).
- **canvas-confetti**: Version 1.9.2  
  - Lightweight library for rendering confetti animations on correct guesses, enhancing visual feedback.
- **html2canvas**: Version 1.4.1  
  - Captures the game area as a PNG image for the "Challenge a Friend" feature, enabling screenshot sharing.
- **react-icons**: Version 5.0.1  
  - Provides scalable SVG icons from Remix Icon set (e.g., `RiScissorsFill`, `RiFontSize`) for lifelines and actions.

### Backend
- **Node.js**: Version 18.x  
  - Runtime environment for executing JavaScript server-side, supporting asynchronous I/O operations.
- **Express**: Version 4.18.2  
  - Minimalist web framework for Node.js, used to define and manage REST API routes.
- **CORS**: Version 2.8.5  
  - Middleware enabling cross-origin requests from the frontend, configured for `http://localhost:5173` (Vite dev port).

## Project Structure

### Frontend
- `src/components/GamePlay.jsx`: Core game logic, state management, and UI rendering.
- `src/components/GameStart.jsx`: Player name input and game initialization.
- `src/App.jsx`: Root component with conditional rendering for start and play states.
- `src/main.jsx`: Application entry point, mounts React to the DOM.
- `src/index.css`: Custom CSS for animations (fadeIn, shake).
- `public/index.html`: Base HTML template with Tailwind CSS CDN.

### Backend
- `server.js`: Express server setup and API endpoint definitions.
- `destinations.js`: Utility functions to fetch random and all destinations from `destinations.json`.
- `destinations.json`: Static JSON file with 100+ destinations (name, clues, fun facts).

## API Endpoints

| Method | Endpoint            | Description                                          |
|--------|---------------------|-----------------------------------------------------|
| GET    | `/api/destination`  | Retrieves a random destination object.              |
| GET    | `/api/destinations` | Retrieves the full list of destinations for options.|

## Deployment Status
- **Frontend**: Deployment pending on Render as a static site. Currently configured to use local backend or sample data for demo purposes.
- **Backend**: Running locally at `https://globe-trotter-backend-erld.onrender.com`.

## Evaluation Instructions

### Live Demo (Post-Deployment)
- **URL**: [https://globe-trotter-frontend-1.onrender.com/](https://globe-trotter-frontend-1.onrender.com/)
- **Steps**:
  1. Visit the live URL.
  2. Enter a player name to start.
  3. Guess destinations, utilizing lifelines (each usable once per game).
  4. Test "Challenge a Friend" by generating and inspecting the shared link.
  5. Exhaust 5 wrong attempts to trigger "Game Over" and reset with "Start New Game".

### Local Testing
- **Repositories**: Clone both frontend and backend repositories.
- **Setup**: Follow detailed instructions in each repository’s `README.md`.
- **Run**: Start backend (`npm start`), then frontend (`npm run dev`) to test full integration.
- **extras**: Need to change the api baseurl in GamePlay.jsx and also the cors origin in the server.js in the backend

## Submission Notes
- Fully satisfies the problem statement:
  - Backend-driven dataset with 100+ destinations.
  - Immediate feedback (confetti for correct, shake for incorrect).
  - "Challenge a Friend" with dynamic link and screenshot.
- Extensible design supports future additions (timers, multiplayer).
- Sample data option ensures frontend demo without backend dependency.

For detailed setup, deployment, and architecture, refer to `README.md` in each repository and `architecture.md` for system design.