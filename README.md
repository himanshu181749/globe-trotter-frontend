# 🗺️ Globetrotter Challenge - Frontend

Welcome to the frontend repository of **Globetrotter Challenge**, an engaging geography guessing game designed to test your knowledge with cryptic destination clues. Built with modern tools and a sleek UI, this React-based game delivers an immersive experience.

## 📌 Project Overview

**Globetrotter Challenge** challenges players to identify destinations based on clues, making strategic use of limited wrong attempts and lifelines. The frontend integrates with a **Node.js/Express backend** (or sample data for standalone demo) via REST API, ensuring seamless gameplay.

## ✨ Key Features

### 🎮 Interactive Gameplay

- Players receive **1-2 random clues** per round.
- Four multiple-choice options; **5 wrong attempts max**.

### 🎉 Engaging Feedback System

- ✅ **Correct guesses** trigger **confetti animation** & a **fun fact**.
- ❌ **Wrong answers** trigger a subtle **shake effect**.
- ⛔ **Game Over** after 5 incorrect guesses, with an option to restart.

### 🛠️ Strategic Lifelines _(Single-use per session)_

- **50:50**: Eliminates two incorrect choices.
- **Reveal a Letter**: Displays the first letter of the correct answer.

### 🌎 Social Sharing & Competitive Play

- **Challenge a Friend**: Generates a shareable link with player score.
- **Game Screenshot**: Captures game state via **html2canvas**.

### 🎨 Sleek & Responsive UI

- **Tailwind CSS** for modern styling.
- **Glassmorphism effects** & smooth animations for a premium feel.

## 🏗 Technology Stack

| **Technology**      | **Version** | **Purpose**         |
| ------------------- | ----------- | ------------------- |
| **React**           | 18.2.0      | Frontend framework  |
| **Vite**            | 5.2.11      | Fast build tool     |
| **Tailwind CSS**    | CDN         | Responsive styling  |
| **Axios**           | 1.7.2       | API requests        |
| **Canvas-Confetti** | 1.9.2       | Confetti animations |
| **html2canvas**     | 1.4.1       | Screenshot capture  |
| **React Icons**     | 5.0.1       | UI icons            |

## 🚀 Getting Started

### 🔧 Installation & Setup

1. Clone the Repository

```sh
git clone https://github.com/yourusername/globetrotter-challenge-frontend.git
cd globetrotter-challenge-frontend
```

2. Install Dependencies

```sh
npm install
```

3. Start Development Server

```sh
npm run dev
```

Your project will be running at `http://localhost:5173/`.

## 🔗 API Integration

### 📥 Fetching Destination Data

- **Endpoint**: `GET /api/destination`
- **Response**:

```json
{
  "id": 1,
  "name": "Paris",
  "clues": ["Famous for the Eiffel Tower", "Known as the City of Love"],
  "funFacts": ["Paris has the second busiest metro system in Europe."]
}
```

### 🏆 Tracking Scores

- Scores are **tracked locally** using React state.

## 📌 Game Mechanics

✅ **Randomized Clues** - Selected dynamically for variation.  
✅ **Shuffled Answer Choices** - One correct, three incorrect.  
✅ **Game Over Handling** - Ends after **5 incorrect attempts**.  
✅ **Lifelines** - Dynamically applied to assist decision-making.

## 🎯 Future Enhancements

- 🌍 **Multiplayer Mode** - Compete with friends in real-time.
- 📊 **Leaderboard** - Track top scores globally.
- 📱 **Mobile App** - Extend as a React Native app.
