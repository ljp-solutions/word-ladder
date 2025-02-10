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
  return (
    <div className="flex justify-center gap-3 px-2 py-1">
      {userInput.map((letter, index) => (
        <motion.div
          key={index}
          className={`bg-gray-800 font-light text-white p-3 rounded-lg text-center 
            w-14 h-14 md:w-16 md:h-16 uppercase text-3xl md:text-4xl 
            flex items-center justify-center border-2 
            ${isActive ? 'border-blue-500' : 'border-gray-600'}`}
          animate={isValid ? {
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1],
            transition: { 
              duration: 0.6,
              delay: index * 0.1,
              ease: "easeInOut"
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
