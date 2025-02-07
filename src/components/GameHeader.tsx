import React from 'react';
import SwitchIcon from "../components/appIcon";
import { StatsButton } from './StatsButton';
import HowToPlayButton from './HowToPlayButton';

interface GameHeaderProps {
  onShowHowToPlay: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onShowHowToPlay }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 md:space-y-6 pt-8 pb-4 font-sans">
      <div className="fixed top-4 right-4 z-10 flex items-center justify-end space-x-2">
        <HowToPlayButton onClick={onShowHowToPlay} />
        <StatsButton />
      </div>
      <div className="inline-flex flex-col items-center gap-2">
        <SwitchIcon />
        <h1 className="text-3xl md:text-4xl text-white drop-shadow-lg">
          <span className="font-thin tracking-[0.08em]">RIGHT</span>
          <span className="font-light text-gray-300 tracking-[0.02em]"> today</span>
        </h1>
      </div>
      <p className="font-thin text-base md:text-lg text-gray-100 opacity-90  mt-2">
        A simple choice... left or right?
      </p>
    </div>
  );
};

export default GameHeader;
