
import { Episode } from '../../domain/model/Episode';
import { Logger } from '../../utils/Logger';
import EpisodeList, { EpisodeListProps } from './EpisodeList';

const logger = new Logger('EpisodeListView');

// Extensión de EpisodeList para mostrar una lista de EpisodeListView
export default class EpisodeListView extends EpisodeList {
    private focusListener?: () => void; // 🔹 Aquí defines la propiedad

    public constructor(props: EpisodeListProps) {
        super(props);
    }

    async componentDidMount() {
        await super.componentDidMount();

        // 🔄 Escuchar el evento 'focus' de navegación
        this.focusListener = this.props.navigation.addListener('focus', () => {
            logger.debug('🔄 Reentrando a EpisodeListView. Refrescando lista de episodios vistos...');
            this.loadEpisodes();
        });
    }

    componentWillUnmount() {
        // ❌ Limpieza del listener cuando se destruye el componente
        if (this.focusListener) {
            this.focusListener(); // Esto ejecuta la función devuelta por addListener para desuscribirse
        }
    }

    protected async getEpisodes(): Promise<Episode[]> {
        try {
            const viewedEpisodes = await this.episodeRepository.getAllViewedEpisodes();
            logger.info(`👁️ Lista de Vistos: Cargados ${viewedEpisodes.length} episodios visualizados.`);
            return viewedEpisodes;
        } catch (error) {
            logger.error('Error al cargar episodios visualizados: ' + error);
            return [];
        }
    }
}
