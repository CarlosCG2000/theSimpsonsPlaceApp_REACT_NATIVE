import { Episode } from '../../domain/model/Episode';
import { Logger } from '../../utils/Logger';
import EpisodeList, { EpisodeListProps } from './EpisodeList';

const logger = new Logger('EpisodeListAll');

// Extensión de EpisodeList para mostrar una lista de EpisodeListAll
export default class EpisodeListAll extends EpisodeList {

    public constructor(props: EpisodeListProps) { // Constructor que recibe las propiedades del componente, las mismas que se pasan a la clase base EpisodeList
        super(props);
    }

    // Método que se llama después de que el componente se monta (primer renderizado)
    protected async getEpisodes(search?: string): Promise<Episode[]> {
        logger.info(`Cargando todos los episodios, búsqueda siempre ${search}`); // Log para indicar que se están cargando todos los episodios
        return this.episodeRepository.getAllEpisodes();                          // Llamada a la API para obtener las episodios
    }
}
