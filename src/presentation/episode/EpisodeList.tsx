import React from 'react';
import { View, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Episode } from '../../domain/model/Episode'; // Import the Episode type
import { EpisodeRepository } from '../../domain/repository/EpisodeRepository';
import { Logger } from '../../utils/Logger';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EpisodeItem from './EpisodeItem';
import EmptyStateView from '../components/EmptyStateView';
import { AppDatabase } from '../../../App';

// Propiedades del componente EpisodeList, de momento no necesitamos pasarle nada
export interface EpisodeListProps {
    readonly navigation: any
}

// Estado del componente EpisodeList, que contiene un array de episodios y un estado de carga
export interface EpisodeListState {
  readonly episodes: ReadonlyArray<Episode>; // Array de episodios
  readonly loading: boolean;                 // Loading de la lista de episodios
}

const logger = new Logger('EpisodeList');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Función para simular una espera

export default abstract class EpisodeList extends React.Component<EpisodeListProps, EpisodeListState> {

    protected episodeRepository: any; // Instancia del repository para obtener los episodios
    static contextType = AppDatabase; // Declara que este componente consumirá el contexto AppDatabase

    // 1. Constructor para inicializar el estado y el repositorio de episodios
    constructor(props: EpisodeListProps) {                  // Recibe las propiedades definidas en EpisodeListProps
        super(props);                                       // Llama al constructor de la clase base (React.Component)

        this.state = {  episodes: [],                       // Inicializa 'episodes' como un array vacío en el estado
                        loading: true };                     // Inicializa 'loading' como true, para mostrar un indicador de carga

        this.episodeRepository = new EpisodeRepository();
    }

    // 2. Método para cargar los episodios al montar el componente (solo se ejecuta una vez)
    async componentDidMount() {
        const db = this.context;

        if (!db) {
            logger.error('Base de datos no disponible en EpisodeList. No se puede inicializar el repositorio.');
            this.setState({ loading: false }); // Aseguramos que el estado de carga se desactive
            return;
        }

        this.episodeRepository.setDatabaseInstance(db);

        await this.loadEpisodes();
    }

    // 3. Método abstracto: debe ser implementado por las subclases
    protected abstract getEpisodes(): Promise<Episode[]>;

    // 4. Método para cargar los episodios (implementación concreta en la clase abstracta)
    async loadEpisodes() {
        try {
            await sleep(300);
            const episodes: Episode[] = await this.getEpisodes();
            logger.info('Episodios cargados: ' + episodes.length);

            this.setState({ episodes: episodes, loading: false });
        } catch (error) {
            logger.error('Error al cargar los episodios: ' + error);
            this.setState({ loading: false, episodes: [] }); // En caso de error, oculta la carga y vacía la lista
        }
    }

    // 5. Método para renderizar el componente
    render() {
        const { loading, episodes } = this.state;

        if (loading && episodes.length === 0) {
            return (
                <View style={styles.containerLoading}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            );
        } else {
            return (
                <Animated.FlatList
                    style={styles.flatList}                                 // Ocupa todo el espacio disponible
                    data={ episodes }                                       // Usamos el estado para obtener la lista de episodios
                    keyExtractor={ ( item: Episode ) => item.id }           // Usamos el id de la película como clave
                    renderItem={ this.renderItem }                          // Renderizamos cada item con el método renderItem
                    ListEmptyComponent={ this.renderEmptyComponent }        // Mensaje cuando no hay películas
                    onRefresh={this.onRefresh}                              // Permite refrescar la lista al hacer pull-to-refresh
                    showsVerticalScrollIndicator={ false }                  // Oculto el indicador de scroll vertical
                    refreshing={ loading }                                  // Indicador de carga
                    contentContainerStyle={styles.contentContainer}         // Espacio alrededor de la lista
                    onEndReachedThreshold={0.5}
                    // ItemSeparatorComponent={ this.renderSeparator }      // Separador entre los items
                    // ListHeaderComponent={ this.renderHeader }            // Encabezado para la lista
                    // ListFooterComponent={ this.renderFooter }            // Pie de página para la lista
                    // onEndReachedThreshold={0.5}                          // Umbral para cargar más episodios (cuando se llega al 50% del final de la lista)
                />
            );
        }
    }

    // Método para reiniciar la lista de episodios y filtrado de búsqueda
    private onRefresh = async () => {
        logger.info('Reiniciando la lista de episodios y filtrado de búsqueda');
        this.setState({ loading: true, episodes: [] });
        await this.loadEpisodes();
    };

    private renderItem = ({ item, index }: { item: Episode, index: number }) => {
        return (
            <EpisodeItem
                episode={item}
                index={index}
                onPress={() => {
                        this.props.navigation.navigate('EpisodeDetails', { episode: item });
                        logger.info(`Episodio seleccionado: ${item.titulo} - Temporada: ${item.temporada} - Episodio: ${item.episodio}`);
                    }
                }
            />
        );
    };

    private renderEmptyComponent = () => {
        return (
            <View style={ styles.emptyView }>
                <EmptyStateView
                    title="Ningún episodio disponible"
                    description="Aún no hay episodios para mostrar. Agrega episodios a tu lista para verlos aquí."
                />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
        backgroundColor: '#09184D',
    },
    containerLoading: {
        flex: 1,                    // Ocupa toda la pantalla
        justifyContent: 'center',   // Centrado vertical
        alignItems: 'center',       // Centrado horizontal
        backgroundColor: '#09184D',
    },
    emptyView: {
        paddingTop: 280,
    },
    contentContainer: {
        paddingTop: 10,          // Espacio al final de la lista para evitar que el último item quede pegado al borde
    },
});
