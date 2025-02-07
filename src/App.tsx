import './App.css'
import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import { ConfettiProvider } from './contexts/ConfettiContext'
import { useConfetti } from './contexts/ConfettiContext'
import Confetti from 'react-confetti'

function AppContent() {
  const { showConfetti } = useConfetti();
  
  return (
    <div className="min-h-screen bg-gray-900 w-full p-0">
      <div className="max-w-2xl mx-auto flex flex-col w-full">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
        <Header />
        <GameBoard />
      </div>
    </div>
  )
}

function App() {
  return (
    <ConfettiProvider>
      <AppContent />
    </ConfettiProvider>
  )
}

export default App
