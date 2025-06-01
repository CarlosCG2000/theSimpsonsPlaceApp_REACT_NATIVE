import { API_QUOTES, API_QUOTES_PATH } from '../../../utils/Constant';
import { Logger } from '../../../utils/Logger';
import { QuoteApiResponse, QuoteDTO } from '../../model/QuoteApiResponse';
import quoteData from '../../../utils/assets/citas_test.json';

const logger = new Logger('QuoteDatasource');

export class QuoteDatasource {
    async getQuotes(numElementos: number = 10, textPersonaje: string = ''): Promise<QuoteDTO[]> {

        const url = `${API_QUOTES}${API_QUOTES_PATH}?count=${numElementos}&character=${encodeURIComponent(textPersonaje)}`;

        logger.info(`📡 Llamando a la URL: ${url}`);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const msg = `HTTP error! status: ${response.status}`;

                if (response.status >= 400 && response.status < 500) {
                    logger.error(`⚠️ Error del cliente: ${msg}`);
                } else if (response.status >= 500) {
                    logger.error(`🚨 Error del servidor: ${msg}`);
                } else {
                    logger.warn(`❓ Otro tipo de error: ${msg}`);
                }

                return [];
            }

            const data: QuoteApiResponse = await response.json();
            logger.info(`Citas cargadas con éxito (${data.length})`);

            return data;

        } catch (error: any) {
            logger.error(`💥 Error en la petición: ${error.message}`);
            return [];
        }
    }

    // Para tester con json local simulando la API en lugar de la API real
    async getQuotesTest(): Promise<QuoteDTO[]> {
        if (!quoteData) {
            logger.error('No se ha encontrado el archivo citas_test.json');
            throw new Error('No se ha encontrado el archivo citas_test.json');
        }

        const data: QuoteApiResponse = quoteData;
        logger.info(`Citas cargadas con éxito (${data.length})`);

        return data;
    }
}
