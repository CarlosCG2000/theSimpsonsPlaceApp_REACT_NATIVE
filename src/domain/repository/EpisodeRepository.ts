import { EpisodeDatasource } from '../../data/datasource/remote/EpisodeDatasource';
import { EpisodeDTO } from '../../data/model/EpisodeJsonResponse';
import { Logger } from '../../utils/Logger';
import { toEpisode } from '../mapper/toEpisode';
import { Episode } from '../model/Episode';
import { EpisodeFilter } from '../model/EpisodeFilter';

const logger = new Logger('EpisodeRepository');

export class EpisodeRepository {

    private episodeDatasource: EpisodeDatasource;

    constructor() {
        this.episodeDatasource = new EpisodeDatasource();
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

}
