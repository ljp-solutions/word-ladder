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
  // Dramatically enhanced wave animation
  const waveVariants = {
    initial: { y: 0, scale: 1, rotate: 0 },
    animate: (index: number) => ({
      y: [0, -30, 0],  // Much higher jump - doubled from previous
      scale: [1, 1.25, 1],  // More dramatic scale change
      rotate: [0, index % 2 === 0 ? 6 : -6, 0],  // Doubled rotation for more emphasis
      transition: {
        duration: 0.4,  // Slightly longer duration to make it more noticeable
        delay: index * 0.07,  // Increased delay between letters for more wave-like effect
        ease: [0.12, 0.8, 0.3, 1],  // More exaggerated "bounce" easing
        times: [0, 0.5, 1]  // Equal time up and down
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
            boxShadow: isValid ? "0 5px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)" : "none",
            transformOrigin: "bottom center" // Makes the jump feel more natural
          }}
        >
          {letter || ""}
        </motion.div>
      ))}
    </motion.div>
  );
};
