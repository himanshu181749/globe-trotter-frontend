import React, { useState } from 'react';

const GameLobby = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = () => {
    if (roomId && playerName) {
      console.log('Handle join triggered with:', { roomId, playerName });
      onJoin({ roomId, playerName });
    } else {
      console.log('Missing roomId or playerName');
    }
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('Generated room ID:', id);
    setRoomId(id);
  };

  return (
    <div className="bg-white bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Join or Create a Game</h2>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Your Name"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={generateRoomId}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mb-4 transition-colors"
      >
        Create New Room
      </button>
      <button
        onClick={handleJoin}
        disabled={!roomId || !playerName}
        className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:text-gray-600 transition-colors"
      >
        Join Game
      </button>
    </div>
  );
};

export default GameLobby;