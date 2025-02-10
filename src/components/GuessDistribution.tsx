import { motion } from 'framer-motion';

interface GuessDistributionProps {
  distribution: Record<string, number>;
}

export const GuessDistribution: React.FC<GuessDistributionProps> = ({ distribution }) => {
  const maxValue = Math.max(...Object.values(distribution));
  
  return (
    <div className="w-full max-w-md mx-auto px-4">
      {Object.entries(distribution).map(([turns, count]) => {
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
        
        return (
          <div key={turns} className="flex items-center gap-2 mb-1">
            <div className="w-6 text-white/60 text-sm font-medium">{turns}</div>
            <div className="flex-1 h-6">
              <motion.div 
                className="h-full bg-green-600/80 rounded flex items-center justify-end px-2"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(percentage, 8)}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-white/90 text-sm font-medium">
                  {count}
                </span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
