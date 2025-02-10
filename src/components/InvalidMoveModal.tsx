import { motion } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface InvalidMoveModalProps {
  onClose: () => void;
  message: string;
}

const InvalidMoveModal: React.FC<InvalidMoveModalProps> = ({ onClose, message }) => {
  return (
    <motion.div
      className="fixed left-0 right-0 bottom-[225px] flex justify-center z-50 pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <motion.div 
        className="bg-gray-900 border-2 border-red-500/50 px-4 py-2 rounded-lg shadow-lg
                   shadow-black/20 mx-4 backdrop-blur-sm"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm font-medium text-red-400">{message}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvalidMoveModal;
