import React, { useState } from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onDelete, onEnter, disabled = false }) => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    if (disabled) return;
    setActiveKey(key);
    onKeyPress(key);

    setTimeout(() => {
      setActiveKey(null);
    }, 150); // Highlight key for 150ms
  };

  const letterKeyClasses = `
    w-[60px] h-[55px] bg-gray-700 rounded-lg text-white font-bold text-lg
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 active:bg-gray-500 cursor-pointer'}
    transition-all flex items-center justify-center
  `;
  const specialKeyClasses = `
    w-[75px] h-[54px] rounded-lg text-white font-medium text-lg
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 active:bg-gray-500 cursor-pointer'}
    transition-all flex items-center justify-center
  `;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[650px] mx-auto px-1">
      {/* First Row */}
      <div className="flex justify-center gap-1.5">
        {rows[0].map((key) => (
          <button
            key={key}
            className={letterKeyClasses}
            onMouseDown={(e) => {
              e.preventDefault();
              handleKeyPress(key);
            }}
            disabled={disabled}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Second Row - With Offset */}
      <div className="flex justify-center gap-1.5">
        <div className="w-[30px]"></div> {/* Offset Spacer */}
        {rows[1].map((key) => (
          <button
            key={key}
            className={letterKeyClasses}
            onMouseDown={(e) => {
              e.preventDefault();
              handleKeyPress(key);
            }}
            disabled={disabled}
          >
            {key}
          </button>
        ))}
        <div className="w-[30px]"></div> {/* Offset Spacer */}
      </div>

      {/* Third Row - With Wider Enter & Delete */}
      <div className="flex justify-center gap-1.5">
        <button
          className={`${specialKeyClasses} bg-red-500 hover:bg-red-400 active:bg-red-600`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (disabled) return;
            setActiveKey("⌫");
            onDelete();
            setTimeout(() => setActiveKey(null), 150);
          }}
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
        </button>

        {rows[2].map((key) => (
          <button
            key={key}
            className={letterKeyClasses}
            onMouseDown={(e) => {
              e.preventDefault();
              handleKeyPress(key);
            }}
            disabled={disabled}
          >
            {key}
          </button>
        ))}

        <button
          className={`${specialKeyClasses} bg-green-500 hover:bg-green-400 active:bg-green-600`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (disabled) return;
            setActiveKey("↵");
            onEnter();
            setTimeout(() => setActiveKey(null), 150);
          }}
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
