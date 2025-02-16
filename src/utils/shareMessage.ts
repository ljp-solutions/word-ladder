export const generateWordBoxes = (guess: string, target: string): string => {
  const boxes: string[] = [];
  const targetChars = target.toUpperCase().split('');
  const guessChars = guess.toUpperCase().split('');

  guessChars.forEach((char, i) => {
    if (char === targetChars[i]) {
      boxes.push('🟩'); // Green box for correct letter in correct position
    } else {
      boxes.push('⬜'); // Grey box for incorrect letter
    }
  });

  return boxes.join('');
};

export const formatShareMessage = (
  gameNumber: number,
  attempts: string[],
  target: string,
  won: boolean,
  turns: number
): string => {
  const validAttempts = attempts.filter(attempt => attempt.length === 4);
  const gameResult = won ? `${turns} Moves` : 'X/8';
  const header = `#${gameNumber} ${gameResult}\n`;
  
  // Add separator line before boxes
  let message = '\n';
  
  // Add boxes for each guess
  validAttempts.forEach(word => {
    message += `${generateWordBoxes(word, target)}\n`;
  });

  // Add final green row if won (without trailing newline)
  if (won) {
    message += '🟩🟩🟩🟩';
  }

  return header + message;
};
