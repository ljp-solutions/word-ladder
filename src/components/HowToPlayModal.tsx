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
      <motion.div 
        className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto space-y-6 text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-semibold text-white">How to Play</h3>
        <p className="text-gray-400 text-sm">Reach the target word using valid moves!</p>

        {/* Moves Section - Swimlane Design */}
        <div className="space-y-2">
          <h4 className="text-left text-white font-thin text-m mb-2">Moves</h4>
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="grid grid-cols-[2.5rem_auto]">
              {/* Change One Letter */}
              <div className="bg-gray-700 flex items-center justify-center p-3">
                <PencilSquareIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="bg-gray-800 p-4 text-gray-300 text-sm text-left">
                <strong>Change one letter</strong> in the word to move closer to the target.
              </div>

              {/* Swap Two Letters */}
              <div className="bg-gray-700 flex items-center justify-center p-3">
                <ArrowsRightLeftIcon className="w-5 h-5 text-green-400" />
              </div>
              <div className="bg-gray-800 p-4 text-gray-300 text-sm text-left">
                <strong>Swap any two letters</strong> instead of changing one.
              </div>

              {/* Move Must Be a Valid Word */}
              <div className="bg-gray-700 flex items-center justify-center p-3">
                <CheckBadgeIcon className="w-5 h-5 text-green-400" />
              </div>
              <div className="bg-gray-800 p-4 text-gray-300 text-sm text-left">
                Moves must result in a <strong>valid word</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section - Swimlane Design */}
        <div className="space-y-2">
          <h4 className="text-left text-white font-thin text-m mb-2">Rules</h4>
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="grid grid-cols-[2.5rem_auto]">
              {/* Same Word for Everyone */}
              <div className="bg-gray-700 flex items-center justify-center p-3">
                <UsersIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="bg-gray-800 p-4 text-gray-300 text-sm text-left">
                All players start with the <strong>same word</strong> and must reach the <strong>same target word</strong>.
              </div>

              {/* Play Once Per Day */}
              <div className="bg-gray-700 flex items-center justify-center p-3">
                <ClockIcon className="w-5 h-5 text-red-400" />
              </div>
              <div className="bg-gray-800 p-4 text-gray-300 text-sm text-left">
                You can only play <strong>once per day</strong>, so think carefully!
              </div>

              {/* Track Progress */}
              <div className="bg-gray-700 flex items-center justify-center p-3">
                <ChartBarIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div className="bg-gray-800 p-4 text-gray-300 text-sm text-left">
                Track your <strong>streak</strong> and challenge your friends!
              </div>
            </div>
          </div>
        </div>

        {/* Play Button */}
        <motion.button 
          className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition-all duration-200 text-center"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Got it, Let’s Play!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HowToPlayModal;
