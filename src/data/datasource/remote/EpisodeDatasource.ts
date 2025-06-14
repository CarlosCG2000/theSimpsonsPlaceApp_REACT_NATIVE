import { Platform } from 'react-native';
import { readFileAssets } from 'react-native-fs'; // requiere instalación: ver nota abajo
import { Logger } from '../../../utils/Logger'; // asumiendo que tienes un logger propio
import episodesData from '../../../utils/assets/episodios_data.json'; // Importa el JSON directamente si es estático
import episodesDataTest from '../../../utils/assets/episodios_test.json'; // Para pruebas, si es necesario
import { JSON_EPISODES } from '../../../utils/Constant';
import { EpisodeDTO, EpisodeJsonResponse } from '../../model/EpisodeJsonResponse';
import { EpisodeFilter } from '../../../domain/model/EpisodeFilter';

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
    async getEpisodes(): Promise<EpisodeDTO[]> {
        if (!episodesData || !episodesDataTest) {
            logger.error('No se ha encontrado el archivo episodios_data.json o episodios_test.json');
            throw new Error('No se ha encontrado el archivo episodios_data.json o episodios_test.json');
        }

        try {
            let parsed: EpisodeJsonResponse;

            // if(__DEV__) { parsed = episodesDataTest; }
            // else { parsed = episodesData; }

            parsed = episodesData;

            if (!parsed.episodes || !Array.isArray(parsed.episodes)) {
                logger.warn('El archivo no contiene el campo "episodes"');
                return [];
            }

            return parsed.episodes; // Retornamos el array de DTOs
        } catch (e) {
            logger.error(`Error al cargar el archivo ${JSON_EPISODES}: ` + e);
            throw new Error(`No se ha podido cargar el archivo ${JSON_EPISODES}`);
        }
    }

    // V2: Método para obtener el JSON de episodios de forma dinámica
    async getEpisodesV2(): Promise<EpisodeDTO[]> {
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

            return parsed.episodes;
        } catch (e) {
            logger.warn(`Falló al cargar el JSON: ${JSON_EPISODES}`);
            throw new Error(`No se ha encontrado el archivo ${JSON_EPISODES}`);
        }
    }

    // Método para obtener episodios con filtros
    async getFilteredEpisodes(filters: EpisodeFilter): Promise<EpisodeDTO[]> {
            logger.info(`[EpisodeRepository] Obteniendo episodios con filtros: ${JSON.stringify(filters)}`);

            // Obtenemos todos los episodios desde el datasource
            let episodesDTO: EpisodeDTO[];

            try {
                episodesDTO = await this.getEpisodes(); // O getEpisodesV2() si esa es tu versión preferida
            } catch (error) {
                logger.error(`Error al obtener DTOs de episodios desde el datasource: ${error}`);
                throw error; // Re-lanza el error para que la vista lo maneje
            }

            // Realizamos el filtrado en la capa de repositorio (o datasource si la BD lo permite)
            const filteredDTOs = episodesDTO.filter(dto => {
                const matchesTitle = filters.search
                    ? dto.title?.toLowerCase().includes(filters.search.toLowerCase())
                    : true;

                const matchesSeason = filters.season !== undefined && filters.season !== null && filters.season !== 0
                    ? dto.season === filters.season
                    : true;

                // Asegúrate de que dto.lanzamiento es un string de fecha válido (ej. "YYYY-MM-DD")
                const episodeDate = dto.release_date ? new Date(dto.release_date) : null;

                const matchesDateStart = filters.dateStart && episodeDate
                    ? episodeDate >= filters.dateStart
                    : true;

                const matchesDateEnd = filters.dateEnd && episodeDate
                    ? episodeDate <= filters.dateEnd
                    : true;

                return matchesTitle && matchesSeason && matchesDateStart && matchesDateEnd;
            });

            return filteredDTOs;
        }
    }
