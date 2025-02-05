import { motion } from "framer-motion";

interface WinningMessageProps {
  turnsTaken: number;
  onClose: () => void;
}

const WinningMessage: React.FC<WinningMessageProps> = ({ turnsTaken, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto text-center">
        
        {/* Header */}
        <h3 className="text-xl font-semibold text-white mb-4">🎉 Congratulations! 🎉</h3>

        {/* Success Message */}
        <p className="text-gray-300 text-lg">
          You solved today’s puzzle in <strong>{turnsTaken} turns!</strong>
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Come back tomorrow for a new challenge and keep your streak alive! 🔥
        </p>

        {/* Close Button */}
        <button 
          className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition-all duration-200"
          onClick={onClose}
        >
          Awesome! 🚀
        </button>
      </div>
    </motion.div>
  );
};

export default WinningMessage;
