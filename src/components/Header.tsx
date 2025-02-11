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
        <div className="flex items-center gap-2">
          <SwitchIcon />
          <h1 className="text-3xl md:text-5xl font-black tracking-wider relative italic pt-1">
            {/* Gradient outline layer */}
            <span 
              className="relative text-transparent bg-clip-text"
              style={{
                WebkitTextStroke: '1.5px transparent',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(to right, #60a5fa, #4ade80, #facc15)',
                transform: 'translateY(2px)'
              }}
            >
              SWAPPLE
            </span>
            {/* Inner glow */}
            <span className="absolute inset-0 text-transparent mix-blend-overlay"
                  style={{
                    WebkitTextStroke: '0.5px rgba(255,255,255,0.3)',
                    transform: 'translateY(2px)'
                  }}>
              SWAPPLE
            </span>
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