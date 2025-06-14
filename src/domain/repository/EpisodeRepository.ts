import { EpisodeDatasource } from '../../data/datasource/remote/EpisodeDatasource';
import { EpisodeDTO } from '../../data/model/EpisodeJsonResponse';
import { Logger } from '../../utils/Logger';
import { toEpisode } from '../mapper/toEpisode';
import { Episode } from '../model/Episode';

const logger = new Logger('EpisodeRepository');

export class EpisodeRepository {

    // V1: el JSON no cambia y no necesito leerlo dinámicamente, se puede importarlo directamente:
    async getAllEpisodes(): Promise<Episode[]> {
        const episodeDatasource = new EpisodeDatasource();

        var episodesDTO: EpisodeDTO[] = await episodeDatasource.getEpisodes();

        // Mapeamos los DTO a la entidad Episode, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const episodes = (episodesDTO).map(toEpisode);

        logger.info(`Episodios obtenidos: ${episodes.length}`);

        return episodes;
    }

    // V2: Método para obtener el JSON de episodios de forma dinámica
    async getAllEpisodesV2(): Promise<Episode[]> {
        const episodeDatasource = new EpisodeDatasource();

        var episodesDTO: EpisodeDTO[] = await episodeDatasource.getEpisodesV2();

        // Mapeamos los DTO a la entidad Episode, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const episodes = (episodesDTO).map(toEpisode);

        logger.info(`Episodios obtenidos: ${episodes.length}`);

        return episodes;
    }

    // Método para filtrar los episodios por nombre
    async getEpisodesByName(name: string): Promise<Episode[]> {
        const episodeDatasource = new EpisodeDatasource();

        var episodesDTO: EpisodeDTO[] =  await episodeDatasource.getEpisodesByName(name);

        // Mapeamos los DTO a la entidad Episode, lo iba a meter en el domain pero por simplicidad lo hacemos aquí
        const episodes = (episodesDTO).map(toEpisode);

        logger.info(`Episodios filtrados por nombre "${name}": ${episodes.length}`);

        return episodes;
    }

}
