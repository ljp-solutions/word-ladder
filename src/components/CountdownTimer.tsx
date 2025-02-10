import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ hours, minutes, seconds }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      

      <div className="flex gap-4 items-center justify-center">
        <TimeUnit value={hours} label="hours" />
        <TimeUnit value={minutes} label="mins" />
        <TimeUnit value={seconds} label="secs" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const displayValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className="bg-gray-800 rounded-lg px-3 py-2 min-w-[3rem] text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
      >
        <motion.span 
          key={value}
          className="text-xl font-bold text-white/90"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {displayValue}
        </motion.span>
      </motion.div>
      <span className="text-xs text-white/40 mt-1">{label}</span>
    </div>
  );
};
