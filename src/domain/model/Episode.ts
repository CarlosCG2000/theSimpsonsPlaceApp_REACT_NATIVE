
// Entidad que representa un episodio de los Simpsons
export type Episode = {
    id: string;
    titulo: string;
    temporada: number;
    episodio: number;
    lanzamiento: string; // Consider converting to Date in the extension: toEpisode
    directores: string[];
    escritores: string[];
    descripcion: string;
    valoracion: boolean;
    invitados: string[];
}
