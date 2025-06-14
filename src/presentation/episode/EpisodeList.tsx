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
    readonly navigation: any // Campos del filtro de búsqueda, filtro de búsqueda opcional
}

// Estado del componente EpisodeList, que contiene un array de episodios y un estado de carga
export interface EpisodeListState {
  readonly episodes: ReadonlyArray<Episode>; // Array de episodios
  readonly loading: boolean;                 // Loading de la lista de episodios
}

const logger = new Logger('EpisodeList');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Función para simular una espera


export default abstract class EpisodeList extends React.Component<EpisodeListProps, EpisodeListState> {

    protected episodeRepository: any; // Instancia del datasource para obtener los episodios
    static contextType = AppDatabase; // Declara que este componente consumirá el contexto AppDatabase


    // 1. Constructor para inicializar el estado y el repositorio de episodios
    constructor(props: EpisodeListProps) {                  // Recibe las propiedades definidas en EpisodeListProps
        super(props);                                       // Llama al constructor de la clase base (React.Component)

        this.state = {  episodes: [],                       // Inicializa 'episodes' como un array vacío en el estado
                        loading: true };                     // Inicializa 'loading' como true, para mostrar un indicador de carga

        // Crea una instancia del EpisodeRepository.
        // NOTA IMPORTANTE: En este punto, la instancia de la base de datos (db) no está disponible,
        // ya que el contexto solo se puede acceder *después* de que el componente se ha montado.
        // Necesitaremos manejar esto más abajo.
        this.episodeRepository = new EpisodeRepository();
    }

    // 2. Método para cargar los episodios al montar el componente (solo se ejecuta una vez)
    async componentDidMount() {
        // Accede a la instancia de la base de datos desde el contexto.
        // 'this.context' es proporcionado por React debido a 'static contextType = AppDatabase'.
        const db = this.context;

        // Si la instancia de la base de datos no está disponible (ej. si la DB aún no ha terminado de inicializarse en App.tsx),
        // registramos un error y salimos para evitar problemas.
        if (!db) {
            logger.error('Base de datos no disponible en EpisodeList. No se puede inicializar el repositorio.');
            this.setState({ loading: false }); // Aseguramos que el estado de carga se desactive
            return;
        }

        // Pasa la instancia de la base de datos al repositorio.
        // Esto es crucial para que el repositorio pueda crear y utilizar su EpisodeSQLiteDatasource.
        this.episodeRepository.setDatabaseInstance(db);

        // Llama al método para iniciar la carga de episodios.
        await this.loadEpisodes();
    }

    // 3. Método abstracto: debe ser implementado por las subclases
    // Este método es la "puerta" para que cada subclase defina cómo obtener sus propios episodios.
    // Podría ser desde una API, una base de datos local, un archivo JSON, etc.
    protected abstract getEpisodes(): Promise<Episode[]>;

    // 4. Método para cargar los episodios (implementación concreta en la clase abstracta)
    async loadEpisodes() {
        try {
            await sleep(300);           // Simula una espera para mostrar el indicador de carga (UX)
            // Llama al método abstracto 'getEpisodes()'.
            // La implementación específica de 'getEpisodes' en la subclase será la que se ejecute.
            const episodes: Episode[] = await this.getEpisodes();
            logger.info('Episodios cargados: ' + episodes.length);

            // Actualiza el estado con los episodios obtenidos y desactiva el indicador de carga.
            this.setState({ episodes: episodes, loading: false });
        } catch (error) {
            logger.error('Error al cargar los episodios: ' + error);
            this.setState({ loading: false, episodes: [] }); // En caso de error, oculta la carga y vacía la lista
        }
    }

    // 3. Método para renderizar el componente
    render() {
      const { loading, episodes } = this.state; // Desestructuramos el estado para obtener los episodios y el estado de carga

        if (loading && episodes.length === 0) {
            return (
                // Mostramos un indicador de carga mientras se obtienen las episodios
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
        this.setState({ loading: true, episodes: [] }); // Reiniciamos el estado a loading y sin episodios
        await this.loadEpisodes(); // Volvemos a cargar los episodios
    };

    private renderItem = ({ item, index }: { item: Episode, index: number }) => {
        return (
            <EpisodeItem
                episode={item}
                index={index} // Pasamos el índice del item para animaciones
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
    // header: {
    //     padding: 20,
    //     backgroundColor: '#f8f8f8', // Color de fondo del encabezado
    //     borderBottomWidth: 1,       // Ancho del borde inferior
    //     borderBottomColor: '#ccc',  // Color del borde inferior
    // },
    // headerText: {
    //     fontSize: 24,
    //     fontWeight: 'bold',         // Estilo para el texto del encabezado
    //     color: '#333',              // Color del texto del encabezado
    // },
    // footer: {
    //     padding: 20,
    //     backgroundColor: '#f8f8f8', // Color de fondo del pie de página
    //     borderTopWidth: 1,          // Ancho del borde superior
    //     borderTopColor: '#ccc',     // Color del borde superior
    //     alignItems: 'center',       // Centrar el texto en el pie de página
    // },
    // footerText: {
    //     fontSize: 16,
    //     color: '#666',              // Color del texto del pie de página
    //     fontStyle: 'italic',        // Estilo para el texto del pie de página
    // },
    // separator: {
    //     height: 1,
    //     backgroundColor: '#ccc',    // Color del separador entre los items
    // },
});
