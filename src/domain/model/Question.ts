
// Entidad que representa una pregunta de trivia de los Simpsons
export interface Question {
    cita: string
    personajeCorrecto: string
    imagen: string
    personajeIncorrectos: string[]
}
