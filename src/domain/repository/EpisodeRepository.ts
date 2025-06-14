import { WebsqlDatabase } from 'react-native-sqlite-2';
import { EpisodeSQLiteDatasource } from '../../data/datasource/local/EpisodeSQLiteDatasource';
import { EpisodeDatasource } from '../../data/datasource/remote/EpisodeDatasource';
import { EpisodeDTO } from '../../data/model/EpisodeJsonResponse';
import { Logger } from '../../utils/Logger';
import { toEpisode } from '../mapper/toEpisode';
import { Episode } from '../model/Episode';
import { EpisodeFilter } from '../model/EpisodeFilter';

const logger = new Logger('EpisodeRepository');

export class EpisodeRepository {

    private episodeDatasource: EpisodeDatasource;
    private sqliteEpisodeDatasource: EpisodeSQLiteDatasource | null = null;

    constructor(dbInstance?: WebsqlDatabase) { // Aceptar la instancia de la BD en el constructor (opcional)
        this.episodeDatasource = new EpisodeDatasource();
        if (dbInstance) {
            this.sqliteEpisodeDatasource = new EpisodeSQLiteDatasource(dbInstance);
        }
    }

    // Método para inicializar el datasource de SQLite si la DB se pasa después
    setDatabaseInstance(dbInstance: WebsqlDatabase) {
        if (!this.sqliteEpisodeDatasource) {
            this.sqliteEpisodeDatasource = new EpisodeSQLiteDatasource(dbInstance);
        }
    }

    // V1: el JSON no cambia y no necesito leerlo dinámicamente, se puede importarlo directamente:
    async getAllEpisodes(): Promise<Episode[]> {

        var episodesDTO: EpisodeDTO[] = await this.episodeDatasource.getEpisodes();

        // Mapeamos los DTO a la entidad Episode, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const episodes = (episodesDTO).map(toEpisode);

        logger.info(`Episodios obtenidos: ${episodes.length}`);

        return episodes;
    }

    // V2: Método para obtener el JSON de episodios de forma dinámica
    async getAllEpisodesV2(): Promise<Episode[]> {

        var episodesDTO: EpisodeDTO[] = await this.episodeDatasource.getEpisodesV2();

        // Mapeamos los DTO a la entidad Episode, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const episodes = (episodesDTO).map(toEpisode);

        logger.info(`Episodios obtenidos: ${episodes.length}`);

        return episodes;
    }

    // Método para obtener episodios con filtros
    async getFilteredEpisodes(filters: EpisodeFilter): Promise<Episode[]> {
        var filterEpisodesDTO: EpisodeDTO[] = await this.episodeDatasource.getFilteredEpisodes(filters);

        // Mapeamos los DTOs filtrados a entidades de dominio
        const filterEpisodes = filterEpisodesDTO.map(toEpisode);

        logger.info(`[Repositorio] Episodios filtrados devueltos: ${filterEpisodes.length}`);
        return filterEpisodes;
    }

     // --- Métodos para episodios visualizados (SQLite) ---

    // Añadir/Actualizar episodio visualizado
    async addViewedEpisode(episode: Episode): Promise<void> {
        if (!this.sqliteEpisodeDatasource) {
            logger.error('SQLite Datasource no inicializado en el repositorio.');
            throw new Error('SQLite Datasource no disponible.');
        }

        return this.sqliteEpisodeDatasource.addViewedEpisode(episode);
    }

    // Eliminar episodio visualizado
    async removeViewedEpisode(episodeId: string): Promise<void> {
        if (!this.sqliteEpisodeDatasource) {
            logger.error('SQLite Datasource no inicializado en el repositorio.');
            throw new Error('SQLite Datasource no disponible.');
        }
        return this.sqliteEpisodeDatasource.removeViewedEpisode(episodeId);
    }

    // Obtener todos los episodios visualizados
    async getAllViewedEpisodes(): Promise<Episode[]> {
        if (!this.sqliteEpisodeDatasource) {
            logger.error('SQLite Datasource no inicializado en el repositorio.');
            throw new Error('SQLite Datasource no disponible.');
        }
        const viewedDTOs = await this.sqliteEpisodeDatasource.getAllViewedEpisodes();
        return viewedDTOs;
    }

    // Comprobar si un episodio ha sido visualizado
    async isEpisodeViewed(episodeId: string): Promise<boolean> {
        if (!this.sqliteEpisodeDatasource) {
            logger.error('SQLite Datasource no inicializado en el repositorio.');
            throw new Error('SQLite Datasource no disponible.');
        }
        return this.sqliteEpisodeDatasource.isEpisodeViewed(episodeId);
    }

}
