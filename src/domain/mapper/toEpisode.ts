import { EpisodeDTO } from '../../data/model/EpisodeJsonResponse';
import { Episode } from '../model/Episode';

export function toEpisode(episode: EpisodeDTO): Episode {
    return {
        id: episode.disneyplus_id || 'Sin ID',
        titulo: episode.title || 'Sin título',
        temporada: episode.season || 0,
        episodio: episode.episode || 0,
        lanzamiento: episode.release_date || 'Sin fecha de lanzamiento',
        directores: episode.directors || [],
        escritores: episode.writers || [],
        descripcion: episode.description || 'Sin descripción',
        valoracion: episode.good || false,
        invitados: episode.guest_stars || [],
    };
}
