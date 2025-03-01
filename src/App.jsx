import React, { useState, useEffect } from 'react';
import GameStart from './components/GameStart';
import GamePlay from './components/GamePlay';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [invitedBy, setInvitedBy] = useState(null);
  const [invitedScore, setInvitedScore] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitedByParam = params.get('invitedBy');
    const scoreParam = params.get('score');
    if (invitedByParam && scoreParam) {
      setInvitedBy(invitedByParam);
      setInvitedScore(parseInt(scoreParam, 10));
    }
  }, []);

  const handleStart = (name) => {
    setPlayerName(name);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <i className="ri-earth-fill h-8 w-8 text-blue-500"></i>
          <h1 className="text-4xl font-bold text-blue-600">The Globetrotter Challenge</h1>
        </div>
        <p className="text-gray-600">Guess famous destinations from cryptic clues!</p>
      </header>
      {!gameStarted ? (
        <GameStart onStart={handleStart} invitedBy={invitedBy} invitedScore={invitedScore} />
      ) : (
        <GamePlay playerName={playerName} />
      )}
    </div>
  );
};

export default App;