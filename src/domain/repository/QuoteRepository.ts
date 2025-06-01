import { QuoteDatasource } from '../../data/datasource/remote/QuoteDatasource';
import { QuoteDTO } from '../../data/model/QuoteApiResponse';
import { Logger } from '../../utils/Logger';
import { toQuote } from '../mapper/toQuote';
import { Quote } from '../model/Quote';

const logger = new Logger('QuoteRepository');

export class QuoteRepository {
    async getQuotes(numElementos: number = 10, textPersonaje: string = ''): Promise<Quote[]> {
        const quoteDatasource = new QuoteDatasource();

        var quotesDTO: QuoteDTO[] = await quoteDatasource.getQuotes(numElementos, textPersonaje);

        // Mapeamos los DTO a la entidad Quote, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const quotes: Quote[] = quotesDTO.map(toQuote);

        logger.info(`Citas obtenidas: ${quotes.length}`);

        return quotes;
    }

    // Para tester con json local simulando la API en lugar de la API real
    async getQuotesTest(): Promise<Quote[]> {
        const quoteDatasource = new QuoteDatasource();

        var quotesDTO: QuoteDTO[] = await quoteDatasource.getQuotesTest();

        // Mapeamos los DTO a la entidad Quote, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const quotes: Quote[] = quotesDTO.map(toQuote);

        logger.info(`Citas obtenidas (test): ${quotes.length}`);

        return quotes;
    }
}
