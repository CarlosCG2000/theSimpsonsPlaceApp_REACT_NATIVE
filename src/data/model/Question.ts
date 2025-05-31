// Entidad que representa una pregunta de trivia de los Simpsons
export type Question = {
    quote: string; // The quote text, is the id
    correctCharacter: string; // The character who said the quote
    image: string; // URL or path to the image of the character
    incorrectCharacters: string[]; // Array of incorrect character names
}
