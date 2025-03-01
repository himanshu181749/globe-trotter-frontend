import React from 'react';

const PlayerList = ({ players, currentPlayer }) => {
  return (
    <div className="bg-white bg-opacity-50 backdrop-blur-md p-6 rounded-lg shadow-md w-full max-w-md">
      <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
        <i className="ri-group-fill h-5 w-5"></i> Players
      </h3>
      <ul className="space-y-2">
        {players.map(player => (
          <li
            key={player.id}
            className={`flex justify-between text-gray-600 ${player.id === currentPlayer.id ? 'font-bold text-blue-600' : ''}`}
          >
            <span>{player.name}</span>
            <span>{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;