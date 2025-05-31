import { QuoteDTO } from '../../data/model/QuoteApiResponse';
import { Quote } from '../model/Quote';

export function toQuote(quote: QuoteDTO): Quote {
    return {
        cita: quote.quote || 'Sin cita disponible',
        personaje: quote.character || 'Desconocido',
        imagen: quote.image || 'https://via.placeholder.com/150',
    };
}
