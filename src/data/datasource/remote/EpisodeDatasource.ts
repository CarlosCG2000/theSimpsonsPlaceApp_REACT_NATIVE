import { Platform } from 'react-native';
import { readFileAssets } from 'react-native-fs'; // requiere instalación: ver nota abajo
import { Logger } from '../../../utils/Logger'; // asumiendo que tienes un logger propio
import episodesData from '../../../utils/assets/episodios_data.json';
import { JSON_EPISODES } from '../../../utils/Constant';
import { Episode } from '../../../domain/model/Episode';
import { EpisodeDTO, EpisodeJsonResponse } from '../../model/EpisodeJsonResponse';
import { toEpisode } from '../../../domain/mapper/toEpisode';

const logger = new Logger('EpisodeDatasource');

export class EpisodeDatasource {
    // Ruta al fichero local
    private get path(): string {
        logger.info('📁 Obteniendo la ruta del archivo JSON');

        if (Platform.OS === 'android') {
            logger.info(`📱 Android - ruta: assets/${JSON_EPISODES}`);
            return `assets/${JSON_EPISODES}`;
        } else {
            logger.info(`🍏 iOS - ruta: ${JSON_EPISODES}`);
            return `${JSON_EPISODES}`;
        }
    }

    // V1: el JSON no cambia y no necesito leerlo dinámicamente, se puede importarlo directamente:
    async getEpisodes(): Promise<Episode[]> {
        if (!episodesData) {
            logger.error('No se ha encontrado el archivo episodes_data.json');
            throw new Error('No se ha encontrado el archivo episodes_data.json');
        }

        try {
            const parsed: EpisodeJsonResponse = episodesData;

            if (!parsed.episodes || !Array.isArray(parsed.episodes)) {
                logger.warn('El archivo no contiene el campo "episodes"');
                return [];
            }

            // Mapeamos los DTO a la entidad Episode, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
            const episodes = (parsed.episodes).map(toEpisode);

            return episodes;
        } catch (e) {
            logger.error(`Error al cargar el archivo ${JSON_EPISODES}: ` + e);
            throw new Error(`No se ha podido cargar el archivo ${JSON_EPISODES}`);
        }
    }

    // V2: Método para obtener el JSON de episodios de forma dinámica
    async getEpisodesV2(): Promise<Episode[]> {
        try {
            const filePath = this.path;
            logger.info(`Intentando cargar el archivo: ${filePath}`);

            const data = await readFileAssets(filePath); // Android
            logger.info(`Archivo encontrado: ${filePath}`);

            const parsed: EpisodeJsonResponse = JSON.parse(data);

            if (!parsed.episodes || !Array.isArray(parsed.episodes)) {
                logger.warn('El archivo no contiene el campo "episodes"');
                return [];
            }

            const episodes = (parsed.episodes as EpisodeDTO[]).map(toEpisode);
            return episodes;
        } catch (e) {
            logger.warn(`Falló al cargar el JSON: ${JSON_EPISODES}`);
            throw new Error(`No se ha encontrado el archivo ${JSON_EPISODES}`);
        }
    }
}
