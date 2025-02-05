import { supabase } from './supabase';

export function isOneLetterChange(word1: string, word2: string): boolean {
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    if (word1.length !== word2.length) return false;

    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) differences++;
        if (differences > 1) return false;
    }
    return differences === 1; // Must be exactly one letter difference
}

export function isTwoLetterSwap(word1: string, word2: string): boolean {
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    if (word1.length !== word2.length) return false;

    let diffIndexes: number[] = [];
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) diffIndexes.push(i);
    }

    if (diffIndexes.length === 2) {
        // Swap the two letters
        const wordArray = word1.split("");
        [wordArray[diffIndexes[0]], wordArray[diffIndexes[1]]] = 
            [wordArray[diffIndexes[1]], wordArray[diffIndexes[0]]];

        return wordArray.join("") === word2; // Must match after swap
    }
    
    return false;
}

// Check if the word exists in Supabase
export async function isValidWord(word: string): Promise<boolean> {
    word = word.trim().toUpperCase(); // Convert input to uppercase

    const { data, error } = await supabase
        .from("words")
        .select("word")
        .eq("word", word)
        .maybeSingle(); // Prevents "multiple or no rows" error

    console.log("Supabase Response:", { data, error });

    if (error) {
        console.error("Supabase Error:", error);
        return false;
    }

    return !!data; // Returns true if a word exists
}

// Validate the player's move
export async function isValidMove(currentWord: string, newWord: string): Promise<boolean> {
    // First, check if the word follows allowed transformations
    const isTransformationValid = isOneLetterChange(currentWord, newWord) || isTwoLetterSwap(currentWord, newWord);

    if (!isTransformationValid) {
        console.log(`Invalid transformation: ${currentWord} → ${newWord}`);
        return false; // Reject if the move is not allowed
    }

    // Now, check if the new word exists in the Supabase dictionary
    const wordExists = await isValidWord(newWord);
    if (!wordExists) {
        console.log(`Word does not exist in Supabase: ${newWord}`);
        return false;
    }

    return true; // Move is valid and word exists
}

