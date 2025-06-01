import { EpisodeDTO } from '../../data/model/EpisodeJsonResponse';
import { Episode } from '../model/Episode';
// import { v4 as uuidv4 } from 'uuid';

export function toEpisode(episode: EpisodeDTO): Episode {
    const fallbackId = `${episode.title ?? 'unknown'}-${episode.season ?? 0}-${episode.episode ?? 0}`;

    return {
        id: episode.disneyplus_id || fallbackId, // uuidv4() -> Genera un UUID si no hay ID
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
