import { motion } from "framer-motion";
import { XMarkIcon, QuestionMarkCircleIcon, UsersIcon, EyeIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface HowToPlayModalProps {
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <h3 className="text-lg font-semibold text-white text-center w-full">How to Play</h3>
          <button 
            className="text-gray-400 hover:text-white absolute right-4"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Game Instructions - Left-Aligned with Icons */}
        <div className="text-gray-300 text-sm leading-relaxed space-y-4 text-left px-2">
          <div className="flex items-center gap-2">
            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
            <p>You have <strong>one chance</strong> to guess: <strong>Left</strong> or <strong>Right</strong>.</p>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-gray-400" />
            <p>All players get the <strong>same answer</strong> each day.</p>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-gray-400" />
            <p>There might be a <strong>hidden pattern</strong>...</p>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <p>You can only place <strong>once per day</strong>.</p>
          </div>
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
            <p>Track your streak & try to beat your friends!</p>
          </div>
        </div>

        {/* Close Button */}
        <button 
          className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-all duration-200"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </motion.div>
  );
};

export default HowToPlayModal;
