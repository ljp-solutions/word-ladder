import { motion } from 'framer-motion';

interface AnimatedInputRowProps {
  userInput: string[];
  rowIndex: number;
  isActive: boolean;
  isValid: boolean;
  shouldAnimate: boolean;
}

export const AnimatedInputRow: React.FC<AnimatedInputRowProps> = ({ 
  userInput, 
  rowIndex, 
  isActive,
  isValid,
  shouldAnimate
}) => {
  // Wave animation variants
  const waveVariants = {
    initial: { y: 0, scale: 1 },
    animate: (index: number) => ({
      y: [0, -8, 0],
      scale: [1, 1.08, 1],
      transition: {
        duration: 0.3,
        delay: index * 0.05, // Staggered delay for wave effect
        ease: [0.22, 1, 0.36, 1], // Custom easing for snappy feel
        times: [0, 0.5, 1] // Control timing of keyframes
      }
    })
  };

  return (
    <motion.div className="flex justify-center gap-3 px-2 py-1">
      {userInput.map((letter, index) => (
        <motion.div
          key={index}
          className={`font-light text-white p-3 rounded-lg text-center 
            w-14 h-14 md:w-16 md:h-16 uppercase text-3xl md:text-4xl 
            flex items-center justify-center transition-all duration-200
            ${isActive 
              ? index === userInput.findIndex(letter => letter === '')
                ? 'bg-gray-600' 
                : letter 
                  ? 'bg-gray-700'
                  : 'bg-gray-700/50'
              : 'bg-gray-800/50' 
            }`}
          variants={waveVariants}
          custom={index}
          initial="initial"
          animate={isValid ? "animate" : "initial"}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: isValid ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
          }}
        >
          {letter || ""}
        </motion.div>
      ))}
    </motion.div>
  );
};
