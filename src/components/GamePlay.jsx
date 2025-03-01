import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { RiShareForwardFill, RiScissorsFill, RiFontSize, RiRefreshLine } from 'react-icons/ri';

const GamePlay = ({ playerName }) => {
  const [destination, setDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [wrongAttemptsLeft, setWrongAttemptsLeft] = useState(2); // Max 5 wrong guesses
  const [toast, setToast] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true, revealLetter: true }); // Persistent across game
  const [hint, setHint] = useState(null); // For Reveal a Letter lifeline

  const fetchDestination = async () => {
    try {
      const res = await axios.get('https://globe-trotter-backend-erld.onrender.com/api/destination');
      setDestination(res.data);
      setFeedback(null);
      setHint(null);

      const allDestinations = await axios.get('https://globe-trotter-backend-erld.onrender.com/api/destinations');
      const wrongOptions = allDestinations.data
        .filter(d => d.id !== res.data.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(d => d.name);
      setOptions([res.data.name, ...wrongOptions].sort(() => 0.5 - Math.random()));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDestination();
  }, []);

  const handleGuess = (guess) => {
    const isCorrect = guess === destination.name;
    setFeedback({
      isCorrect,
      selected: guess,
      ...(isCorrect && { funFact: destination.funFacts[0] }), // Fun fact only on correct
    });
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));
    if (isCorrect) {
      confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    } else {
      setWrongAttemptsLeft(prev => prev - 1);
    }
  };

  const handleShare = async () => {
    const shareLink = `${window.location.origin}?invitedBy=${playerName}&score=${score.correct}`;
    const gameArea = document.querySelector('.game-area');
    const canvas = await html2canvas(gameArea);
    const image = canvas.toDataURL('image/png');

    navigator.clipboard.writeText(`${shareLink}\nCheck out my game: ${image}`);
    setToast('Link and image copied! Share via WhatsApp.');
    setShowShareModal(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartOver = () => {
    setScore({ correct: 0, incorrect: 0 });
    setWrongAttemptsLeft(5);
    setLifelines({ fiftyFifty: true, revealLetter: true });
    setFeedback(null);
    setHint(null);
    fetchDestination();
  };

  const handleFiftyFifty = () => {
    if (lifelines.fiftyFifty && !feedback) {
      const wrongOptions = options.filter(opt => opt !== destination.name);
      const newOptions = [destination.name, wrongOptions[0]].sort(() => 0.5 - Math.random());
      setOptions(newOptions);
      setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    }
  };

  const handleRevealLetter = () => {
    if (lifelines.revealLetter && !feedback) {
      setHint(`The answer starts with "${destination.name[0]}"`);
      setLifelines(prev => ({ ...prev, revealLetter: false }));
    }
  };

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="loader h-12 w-12 rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
        <h2 className="text-xl font-medium text-gray-600">Loading your next destination...</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto game-area">
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
            <p className="text-gray-600 mb-4">Share your score and invite someone!</p>
            <button
              onClick={handleShare}
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

      <div className="mb-6 text-center">
        <p className="text-xl font-semibold text-blue-600">Playing as: {playerName}</p>
      </div>

      {wrongAttemptsLeft === 0 ? (
        <div className="border-2 border-red-500 rounded-lg shadow-lg animate-fade-in mb-6 bg-red-50">
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-red-700 mb-4">Game Over, {playerName || 'Guest'}!</div>
            <div className="text-lg text-gray-700 mb-6">
              You've used all 5 wrong attempts.<br />
              Final Score: <span className="font-bold text-green-600">{score.correct}</span> correct,{' '}
              <span className="font-bold text-red-600">{score.incorrect}</span> incorrect
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowShareModal(true)}
                className="py-3 px-6 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <RiShareForwardFill className="h-5 w-5" /> Challenge a Friend
              </button>
              <button
                onClick={handleStartOver}
                className="py-3 px-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <RiRefreshLine className="h-5 w-5" /> Start New Game
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                  <i className="ri-alert-fill h-5 w-5 text-yellow-500"></i> Wrong Attempts Left
                </div>
              </div>
              <div className="p-4 pt-2">
                <div className="text-3xl font-bold text-yellow-500">{wrongAttemptsLeft}</div>
              </div>
            </div>
          </div>

          <div className="mb-6 border-2 border-blue-200 rounded-lg shadow-md bg-white">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
              <div className="font-semibold text-lg flex items-center gap-2">
                <i className="ri-map-pin-fill h-5 w-5 text-blue-500"></i> Where in the world?
              </div>
              <div className="text-gray-600 text-sm">Guess the destination!</div>
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
              {hint && (
                <div className="p-4 bg-purple-100 rounded-lg border border-purple-200">
                  <p className="text-lg text-purple-600">{hint}</p>
                </div>
              )}
            </div>
          </div>

          {!feedback && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="tooltip">
                <button
                  onClick={handleFiftyFifty}
                  disabled={!lifelines.fiftyFifty}
                  className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-lg shadow-md transition-colors ${lifelines.fiftyFifty ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                >
                  <RiScissorsFill className="h-5 w-5" />
                  <span>50:50</span>
                </button>
                <span className="tooltip-text">Remove two incorrect options</span>
              </div>
              <div className="tooltip">
                <button
                  onClick={handleRevealLetter}
                  disabled={!lifelines.revealLetter}
                  className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-lg shadow-md transition-colors ${lifelines.revealLetter ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                >
                  <RiFontSize className="h-5 w-5" />
                  <span>Reveal a Letter</span>
                </button>
                <span className="tooltip-text">See the first letter of the answer</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleGuess(option)}
                disabled={feedback}
                className={`py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 ${
                  feedback && feedback.selected === option
                    ? feedback.isCorrect
                      ? 'bg-blue-500 text-white'
                      : 'bg-red-500 text-white animate-shake'
                    : 'bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="border-2 rounded-lg shadow-lg animate-fade-in">
              <div
                className={`p-4 border-b ${feedback.isCorrect ? 'bg-green-100 border-green-200' : feedback.hint ? 'bg-purple-100 border-purple-200' : 'bg-red-100 border-red-200'}`}
              >
                <div className={`text-lg font-semibold flex items-center gap-2 ${feedback.isCorrect ? 'text-green-600' : feedback.hint ? 'text-purple-600' : 'text-red-600'}`}>
                  {feedback.isCorrect ? (
                    <>
                      <i className="ri-check-fill h-5 w-5"></i> 🎉 Well Done!
                    </>
                  ) : feedback.hint ? (
                    <>
                      <i className="ri-lightbulb-fill h-5 w-5"></i> Hint
                    </>
                  ) : (
                    <>
                      <i className="ri-close-fill h-5 w-5"></i> 😢 Oops, Wrong!
                    </>
                  )}
                </div>
                {feedback.hint && (
                  <div className="text-sm text-gray-600 mt-1">{feedback.hint}</div>
                )}
              </div>
              {feedback.isCorrect && (
                <div className="p-6">
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <i className="ri-earth-fill h-4 w-4 text-blue-500"></i> Did You Know?
                    </h3>
                    <p className="text-gray-600">{feedback.funFact}</p>
                  </div>
                </div>
              )}
              <div className="p-4 pt-2 border-t flex gap-4">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full py-3 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RiShareForwardFill className="h-5 w-5" /> Challenge a Friend
                </button>
                <button
                  onClick={fetchDestination}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  Next <i className="ri-arrow-right-line h-4 w-4"></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GamePlay;