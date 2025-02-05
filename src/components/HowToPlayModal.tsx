import { motion } from "framer-motion";
import { XMarkIcon, ArrowsRightLeftIcon, PencilSquareIcon, UsersIcon, ClockIcon, ChartBarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

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
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-5 text-center"> {/* Ensures all text is left-aligned */}
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4">
          <h3 className="text-lg font-semibold text-white">How to Play</h3> {/* Left-aligned now */}
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Move Types Section */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-md font-semibold">Make Your Move</h4>
          
          {/* Change One Letter */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md">
            <PencilSquareIcon className="w-6 h-6 text-blue-400" />
            <p className="text-gray-300 text-sm text-left">
              Change <strong>one letter</strong> in the word to move closer to the target.
            </p>
          </div>

          {/* Swap Two Letters */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md">
            <ArrowsRightLeftIcon className="w-6 h-6 text-green-400" />
            <p className="text-gray-300 text-sm text-left">
              Swap <strong>any two letters</strong> instead of changing one.
            </p>
          </div>

          {/* Move Must Be a Valid Word */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md">
            <CheckBadgeIcon className="w-6 h-6 text-green-400" />
            <p className="text-gray-300 text-sm text-left">
              Moves must result in a <strong>valid word</strong>.
            </p>
          </div>
        </div>

        {/* Game Rules Section */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-md font-semibold">Game Rules</h4>

          {/* Same Word for Everyone */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md">
            <UsersIcon className="w-6 h-6 text-yellow-400" />
            <p className="text-gray-300 text-sm text-left">
              All players start with the <strong>same word</strong> and must reach the <strong>same target word</strong>.
            </p>
          </div>

          {/* Play Once Per Day */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md">
            <ClockIcon className="w-6 h-6 text-red-400" />
            <p className="text-gray-300 text-sm text-left">
              You can only play <strong>once per day</strong>, so think carefully!
            </p>
          </div>

          {/* Track Progress */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md">
            <ChartBarIcon className="w-6 h-6 text-purple-400" />
            <p className="text-gray-300 text-sm text-left">
              Track your <strong>streak</strong> and challenge your friends!
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button 
          className="mt-6 w-full bg-green-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-all duration-200 text-center"
          onClick={onClose}
        >
          Play
        </button>
      </div>
    </motion.div>
  );
};

export default HowToPlayModal;
