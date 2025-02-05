import { motion } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // Warning icon

interface InvalidMoveModalProps {
  onClose: () => void;
  message: string; // Allow dynamic error messages
}

const InvalidMoveModal: React.FC<InvalidMoveModalProps> = ({ onClose, message }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <h3 className="text-lg font-semibold text-white text-center w-full">Invalid Move</h3>
          <button
            className="text-gray-400 hover:text-white absolute right-4"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Warning Message */}
        <div className="flex items-center gap-3 text-yellow-400 text-sm px-2">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <p>{message}</p>
        </div>

        {/* Close Button */}
        <button
          className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-all duration-200"
          onClick={onClose}
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
};

export default InvalidMoveModal;
