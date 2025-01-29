import React from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-5xl font-bold mb-6 text-white text-center drop-shadow-glow">
        Right Today
      </h1>
      <p className="text-gray-300 mb-12 text-center text-lg">
        A simple choice... or is it?
      </p>
      <Game />
    </div>
  );
}

export default App;
