import { Quote } from './Quote';

// Entidad que representa una pregunta de trivia de los Simpsons
export interface Question {
    cita: string
    personajeCorrecto: string
    imagen: string
    personajeIncorrectos: string[]
}

const answerPersonajes: string[] = [
    'Moe Szyslak', 'Principal Skinner', 'Abe Simpson', 'Lisa Simpson', 'Duffman',
    'Apu Nahasapeemapetilon', 'Bart Simpson', 'Ralph Wiggum', 'Milhouse Van Houten',
    'Mr. Burns', 'Comic Book Guy', 'Mayor Quimby', 'Chief Wiggum', 'Dr. Nick',
    'Troy McClure', 'Rainier Wolfcastle', 'Groundskeeper Willie', 'Homer Simpson',
    'Frank Grimes', 'Nelson Muntz', 'Waylon Smithers', 'Marge Simpson',
];

export function getRandomOptions(correctAnswer: string, from: string[]): string[] {
  return from
    .filter(name => name !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

export function quoteToQuestion(quote: Quote): Question {
    return {
        cita: quote.cita,
        personajeCorrecto: quote.personaje,
        imagen: quote.imagen,
        personajeIncorrectos: getRandomOptions(quote.personaje, answerPersonajes),
    };
}

export function quotesToQuestions(quotes: Quote[]): Question[] {
  return quotes.map(quoteToQuestion);
}
