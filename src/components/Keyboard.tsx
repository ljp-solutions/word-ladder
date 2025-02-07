import React from "react";

const Keyboard: React.FC<{ onKeyPress: (key: string) => void, onDelete: () => void, onEnter: () => void }> = ({ onKeyPress, onDelete, onEnter }) => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  const keyClasses = "min-w-[36px] h-[48px] bg-gray-700 rounded-lg text-white font-medium text-lg flex items-center justify-center hover:bg-gray-600 active:bg-gray-500 transition-colors";
  const deleteClasses = "bg-red-500 hover:bg-red-400 active:bg-red-600";
  const enterClasses = "bg-green-500 hover:bg-green-400 active:bg-green-600";

  return (
    <div className="grid gap-2 w-full">
      {/* First Row */}
      <div className="grid grid-cols-10 gap-1">
        {rows[0].map((key) => (
          <button
            key={key}
            className={keyClasses}
            onMouseDown={(e) => {
              e.preventDefault();
              onKeyPress(key);
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-9 gap-1 px-[5%]">
        {rows[1].map((key) => (
          <button
            key={key}
            className={keyClasses}
            onMouseDown={(e) => {
              e.preventDefault();
              onKeyPress(key);
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-9 gap-1 px-[5%]">
        <button
          className={`${keyClasses} ${deleteClasses}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
        </button>

        {rows[2].map((key) => (
          <button
            key={key}
            className={keyClasses}
            onMouseDown={(e) => {
              e.preventDefault();
              onKeyPress(key);
            }}
          >
            {key}
          </button>
        ))}

        <button
          className={`${keyClasses} ${enterClasses}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onEnter();
          }}
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
