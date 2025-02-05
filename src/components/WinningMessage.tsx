import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface WinningMessageProps {
  turnsTaken: number;
  onClose: () => void;
}

const WinningMessage: React.FC<WinningMessageProps> = ({ turnsTaken, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-center relative">
          
          {/* Trophy Icon & Sparkles */}
          <div className="flex justify-center mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
            >
              <TrophyIcon className="w-14 h-14 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Header */}
          <motion.h3 
            className="text-2xl font-bold text-white drop-shadow-lg"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          >
            🎉 Congratulations! 🎉
          </motion.h3>

          {/* Success Message */}
          <p className="text-gray-300 text-lg mt-2">
            You solved today’s puzzle in <strong className="text-green-400">{turnsTaken} turns!</strong>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Come back tomorrow for a new challenge and keep your streak alive! 🔥
          </p>

          {/* Sparkles Effect */}
          <motion.div 
            className="absolute -top-2 -right-2 text-yellow-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1.3, rotate: -10 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
          >
            <SparklesIcon className="w-8 h-8" />
          </motion.div>

          {/* Close Button */}
          <motion.button 
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition-all duration-200"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
          >
            Awesome! 🚀
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default WinningMessage;
