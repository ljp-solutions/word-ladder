import React, { createContext, useContext, useState } from 'react';

type ConfettiContextType = {
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
};

const ConfettiContext = createContext<ConfettiContextType | undefined>(undefined);

export const ConfettiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <ConfettiContext.Provider value={{ showConfetti, setShowConfetti }}>
      {children}
    </ConfettiContext.Provider>
  );
};

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (context === undefined) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};
