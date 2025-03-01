import React, { useState } from 'react';

const GameStart = ({ onStart, invitedBy, invitedScore }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = () => {
    if (playerName) onStart(playerName);
  };

  return (
    <div className="bg-white bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Start Your Journey</h2>
      {invitedBy && (
        <p className="text-gray-600 mb-4">
          Invited by <span className="font-bold">{invitedBy}</span> with a score of{' '}
          <span className="font-bold text-green-500">{invitedScore}</span>!
        </p>
      )}
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Your Name"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={!playerName}
        className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:text-gray-600 transition-colors"
      >
        Start Game
      </button>
    </div>
  );
};

export default GameStart;