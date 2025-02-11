import { motion } from 'framer-motion';

interface AnimatedInputRowProps {
  userInput: string[];
  rowIndex: number;
  isActive: boolean;
  isValid?: boolean;
}

export const AnimatedInputRow: React.FC<AnimatedInputRowProps> = ({ 
  userInput, 
  rowIndex, 
  isActive,
  isValid 
}) => {
  // Find the index of the first empty cell in active row
  const activeIndex = isActive ? userInput.findIndex(letter => letter === '') : -1;

  return (
    <div className="flex justify-center gap-3 px-2 py-1">
      {userInput.map((letter, index) => (
        <motion.div
          key={index}
          className={`font-light text-white p-3 rounded-lg text-center 
            w-14 h-14 md:w-16 md:h-16 uppercase text-3xl md:text-4xl 
            flex items-center justify-center transition-all duration-200
            ${isActive 
              ? index === activeIndex
                ? 'bg-gray-600' // Active cell
                : letter 
                  ? 'bg-gray-700' // Filled cell in active row
                  : 'bg-gray-700/50' // Empty cell in active row
              : 'bg-gray-800/50' // Inactive row
            }`}
          animate={isValid ? {
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1],
            transition: { 
              duration: 0.6, // Faster rotation
              delay: index * 0.1, // Quicker cascade
              ease: "easeInOut" // Smoother rotation
            }
          } : {}}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          {letter || ""}
        </motion.div>
      ))}
    </div>
  );
};
