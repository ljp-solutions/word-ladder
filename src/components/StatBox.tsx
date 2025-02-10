interface StatBoxProps {
  label: string;
  value: number | string;
  highlight?: 'gold' | 'purple' | 'white';
  loading?: boolean;
  className?: string;
}

export const StatBox = ({ 
  label, 
  value, 
  highlight = 'white', 
  loading = false,
  className = '' 
}: StatBoxProps) => {
  const highlightClasses = {
    gold: 'text-yellow-400/90 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]',
    purple: 'text-purple-400',
    white: 'text-white/90'
  };

  return (
    <div className={`text-center transform opacity-0 animate-[fadeIn_0.4s_ease-out_forwards] ${className}`}>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 w-16 bg-white/10 rounded mx-auto mb-2"></div>
          <div className="h-4 w-20 bg-white/10 rounded mx-auto"></div>
        </div>
      ) : (
        <>
          <div className={`text-2xl font-bold ${highlightClasses[highlight]}`}>
            {value}
          </div>
          <div className="text-sm text-white/60 mt-1 font-medium">{label}</div>
        </>
      )}
    </div>
  );
};
