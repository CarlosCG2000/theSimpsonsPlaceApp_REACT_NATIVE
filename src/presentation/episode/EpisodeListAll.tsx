import { Episode } from '../../domain/model/Episode';
import { Logger } from '../../utils/Logger';
import EpisodeList, { EpisodeListProps } from './EpisodeList';

const logger = new Logger('EpisodeListAll');

// Extensión de EpisodeList para mostrar una lista de EpisodeListAll
export default class EpisodeListAll extends EpisodeList {

    public constructor(props: EpisodeListProps) {
        super(props);
    }

    // Método que se llama después de que el componente se monta (primer renderizado)
    protected async getEpisodes(): Promise<Episode[]> {
        logger.info('Cargando todos los episodios'); // Log para indicar que se están cargando todos los episodios

        try {
            const allEpisodes = await  this.episodeRepository.getAllEpisodes();
            logger.info(`👁️ Lista de Vistos: Cargados ${allEpisodes.length} episodios visualizados.`);
            return allEpisodes;
        } catch (error) {
            logger.error('Error al cargar todos los episodios: ' + error);
            return [];
        }
    }
}
