import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { RiScissorsFill, RiLightbulbFill, RiUserHeartFill } from 'react-icons/ri';

const GameRoom = ({ socket, roomId, playerName, destination, players, score, roundOver, attempts, onGuess, onNextRound }) => {
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true, hint: true, challengeFriend: true });
  const [toast, setToast] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (destination && !options.length) {
      fetch('http://localhost:5000/api/destinations')
        .then(res => res.json())
        .then(data => {
          const wrongOptions = data
            .filter(d => d.id !== destination.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(d => d.name);
          setOptions([destination.name, ...wrongOptions].sort(() => 0.5 - Math.random()));
          setFeedback(null);
          setLifelines({ fiftyFifty: true, hint: true, challengeFriend: true });
        })
        .catch(err => console.error('Fetch error:', err));
    }
  }, [destination, options.length]);

  const handleGuess = (guess) => {
    onGuess(guess);
    const isCorrect = guess === destination.name;
    if (isCorrect) {
      setFeedback({ isCorrect: true, funFact: destination.funFacts[0] });
      confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    } else {
      setFeedback({ isCorrect: false, attemptsLeft: attempts - 1 });
      if (attempts - 1 === 0) setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleFiftyFifty = () => {
    if (lifelines.fiftyFifty && !feedback) {
      const wrongOptions = options.filter(opt => opt !== destination.name).slice(0, 2);
      setOptions([destination.name, wrongOptions[0]].sort(() => 0.5 - Math.random()));
      setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    }
  };

  const handleHint = () => {
    if (lifelines.hint && !feedback) {
      setFeedback({ hint: `Hint: It’s in ${destination.name.split(' ')[1] || 'a major region'}.` });
      setLifelines(prev => ({ ...prev, hint: false }));
    }
  };

  const handleChallengeFriend = () => {
    if (lifelines.challengeFriend && !feedback) {
      setShowShareModal(true);
      setLifelines(prev => ({ ...prev, challengeFriend: false }));
    }
  };

  const shareChallenge = async () => {
    const shareLink = `${window.location.origin}?roomId=${roomId}&invitedBy=${playerName}&score=${score.correct}`;
    const gameArea = document.querySelector('.game-area');
    const canvas = await html2canvas(gameArea);
    const image = canvas.toDataURL('image/png');

    navigator.clipboard.writeText(`${shareLink}\nCheck out my game: ${image}`);
    setToast('Link and image copied! Share via WhatsApp.');
    setShowShareModal(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl game-area">
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-down">
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <i className="ri-alert-fill h-4 w-4"></i>
            <div>
              <div className="font-semibold">Success!</div>
              <div>{toast}</div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Challenge a Friend</h3>
            <p className="text-gray-600 mb-4">Invite someone to join your room!</p>
            <button
              onClick={shareChallenge}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Copy Link & Image
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-lg shadow-md border border-gray-200">
          <div className="p-4 pb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              <i className="ri-check-fill h-5 w-5 text-green-500"></i> Correct
            </div>
          </div>
          <div className="p-4 pt-2">
            <div className="text-3xl font-bold text-green-500">{score.correct}</div>
          </div>
        </div>
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-lg shadow-md border border-gray-200">
          <div className="p-4 pb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              <i className="ri-close-fill h-5 w-5 text-red-500"></i> Incorrect
            </div>
          </div>
          <div className="p-4 pt-2">
            <div className="text-3xl font-bold text-red-500">{score.incorrect}</div>
          </div>
        </div>
        <div className="bg-white bg-opacity-50 backdrop-blur-md rounded-lg shadow-md border border-gray-200">
          <div className="p-4 pb-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              <i className="ri-alert-fill h-5 w-5 text-yellow-500"></i> Attempts Left
            </div>
          </div>
          <div className="p-4 pt-2">
            <div className="text-3xl font-bold text-yellow-500">{attempts}</div>
            <div className="h-2 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full animate-progress-fill"
                style={{ '--progress-width': `${(attempts / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 border-2 border-blue-200 rounded-lg shadow-md bg-white">
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <div className="font-semibold text-lg flex items-center gap-2">
            <i className="ri-map-pin-fill h-5 w-5 text-blue-500"></i> Where in the world? (Room: {roomId})
          </div>
          <div className="text-gray-600 text-sm">Guess quickly to score points!</div>
        </div>
        <div className="p-6 space-y-4">
          {destination.clues.map((clue, idx) => (
            <div
              key={idx}
              className={`p-4 bg-gray-100 rounded-lg border border-gray-200 animate-fade-in ${idx === 1 ? 'delay-200' : 'delay-100'}`}
            >
              <p className="text-lg text-gray-700">{clue}</p>
            </div>
          ))}
        </div>
      </div>

      {!feedback?.isCorrect && attempts > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="tooltip">
            <button
              onClick={handleFiftyFifty}
              disabled={!lifelines.fiftyFifty || feedback}
              className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-lg shadow-md transition-colors ${lifelines.fiftyFifty && !feedback ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              <RiScissorsFill className="h-5 w-5" />
              <span>50:50</span>
            </button>
            <span className="tooltip-text">Remove two incorrect options</span>
          </div>
          <div className="tooltip">
            <button
              onClick={handleHint}
              disabled={!lifelines.hint || feedback}
              className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-lg shadow-md transition-colors ${lifelines.hint && !feedback ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              <RiLightbulbFill className="h-5 w-5" />
              <span>Hint</span>
            </button>
            <span className="tooltip-text">Get a helpful hint</span>
          </div>
          <div className="tooltip">
            <button
              onClick={handleChallengeFriend}
              disabled={!lifelines.challengeFriend || feedback}
              className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-lg shadow-md transition-colors ${lifelines.challengeFriend && !feedback ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              <RiUserHeartFill className="h-5 w-5" />
              <span>Challenge Friend</span>
            </button>
            <span className="tooltip-text">Invite a friend to join</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleGuess(option)}
            disabled={feedback?.isCorrect || attempts === 0}
            className={`py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 ${feedback ? option === destination.name ? 'bg-blue-500 text-white' : option === feedback?.selected ? 'bg-red-500 text-white animate-shake' : 'bg-gray-300 text-gray-600' : 'bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="border-2 rounded-lg shadow-lg animate-fade-in">
          <div
            className={`p-4 border-b ${feedback.isCorrect ? 'bg-green-100 border-green-200' : feedback.attemptsLeft ? 'bg-yellow-100 border-yellow-200' : 'bg-red-100 border-red-200'}`}
          >
            <div className={`text-lg font-semibold flex items-center gap-2 ${feedback.isCorrect ? 'text-green-600' : feedback.attemptsLeft ? 'text-yellow-600' : 'text-red-600'}`}>
              {feedback.isCorrect ? (
                <>
                  <i className="ri-check-fill h-5 w-5"></i> Well Done!
                </>
              ) : feedback.hint ? (
                <>
                  <i className="ri-lightbulb-fill h-5 w-5"></i> Hint
                </>
              ) : feedback.attemptsLeft ? (
                <>
                  <i className="ri-alert-fill h-5 w-5"></i> 😢 Try Again! ({feedback.attemptsLeft} left)
                </>
              ) : (
                <>
                  <i className="ri-close-fill h-5 w-5"></i> 😢 Out of Attempts!
                </>
              )}
            </div>
            {!feedback.isCorrect && !feedback.hint && feedback.attemptsLeft === 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Correct answer: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 border border-green-200">{destination.name}</span>
              </div>
            )}
          </div>
          {feedback.hint && (
            <div className="p-4 border-b border-yellow-200 bg-yellow-100 text-yellow-600">{feedback.hint}</div>
          )}
          {(feedback.isCorrect || attempts === 0) && (
            <div className="p-6">
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <i className="ri-earth-fill h-4 w-4 text-blue-500"></i> Did You Know?
                </h3>
                <p className="text-gray-600">{feedback.funFact}</p>
              </div>
            </div>
          )}
          {roundOver && (
            <div className="p-4 pt-2 border-t">
              <button
                onClick={onNextRound}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                Continue Exploring <i className="ri-arrow-right-line h-4 w-4"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameRoom;