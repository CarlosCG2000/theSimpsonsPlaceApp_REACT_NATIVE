
// Entidad que representa un episodio de los Simpsons
export type EpisodeDTO = {
    id: string | null;
    titulo: string | null;
    temporada: number | null;
    episodio: number | null;
    lanzamiento: string | null; // Consider converting to Date in the extension: toEpisode
    directores: string[] | null;
    escritores: string[] | null;
    descripcion: string | null;
    valoracion: boolean | null;
    invitados: string[] | null;
}
