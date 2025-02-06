import { useState } from 'react'
import SwitchIcon from "../components/appIcon";
import HowToPlayButton from './HowToPlayButton'
import HowToPlayModal from './HowToPlayModal'
import { StatsButton } from './StatsButton'

export const Header = () => {
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  return (
    <>
      <header className="relative flex items-center justify-between w-full px-4 py-1">
        <div className="flex items-center gap-3">
          <SwitchIcon />
          <h1 className="text-3xl md:text-5xl font-thin drop-shadow-lg 
                        bg-gradient-to-r from-blue-400 via-green-300 to-yellow-400 
                        text-transparent bg-clip-text tracking-wide relative">
            Swapple
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatsButton />
          <HowToPlayButton onClick={() => setShowHowToPlay(true)} />
        </div>
        {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      </header>
      <div className="w-full border-t border-gray-800"></div>
    </>
  )
}