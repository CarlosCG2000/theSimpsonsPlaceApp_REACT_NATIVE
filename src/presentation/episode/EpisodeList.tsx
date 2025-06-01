import React from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Episode } from '../../domain/model/Episode'; // Import the Episode type
import { EpisodeRepository } from '../../domain/repository/EpisodeRepository';
import { Logger } from '../../utils/Logger';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EpisodeItem from './EpisodeItem';

// Propiedades del componente EpisodeList, de momento no necesitamos pasarle nada
interface EpisodeListProps {
  // readonly navigation: any
  // readonly searchFilter?: string; // Campos del filtro de búsqueda, filtro de búsqueda opcional
}

// Estado del componente EpisodeList, que contiene un array de episodios y un estado de carga
interface EpisodeListState {
  readonly episodes: Episode[]; // Array de episodios
  readonly loading: boolean; // Loading de la lista de episodios
}

const logger = new Logger('EpisodeList');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); // Función para simular una espera


export default /* abstract */ class EpisodeList extends React.Component<EpisodeListProps, EpisodeListState> {

    /* protected */ private episodeRepository: EpisodeRepository; // Instancia del datasource para obtener los episodios

    // 1. Constructor para inicializar el estado y el datasource
    constructor(props: EpisodeListProps) { // Le pasamos las propiedades del componente, de momento no necesitamos ninguna
        super(props); // Llamada al constructor de la clase base

        // Inicializamos el estado del componente
        this.state = { episodes: [], loading: true };

        this.episodeRepository = new EpisodeRepository(); // Creamos una instancia del datasource para obtener los episodios

        // props.navigation.setOptions({
        //     title: 'Navegación Vista Lista Películas', // Título de la pantalla
        // });
    }

    // 2. Método para cargar los episodios al montar el componente (solo se ejecuta una vez)
    async componentDidMount() {
        await this.loadEpisodes();
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
                    data={ episodes } // Usamos el estado para obtener la lista de episodios
                    keyExtractor={( item: Episode ) => item.id } // Usamos el id de la película como clave
                    renderItem={ this.renderItem } // Renderizamos cada item con el método renderItem
                    // ItemSeparatorComponent={ this.renderSeparator } // Separador entre los items
                    // ListHeaderComponent={ this.renderHeader } // Encabezado para la lista
                    // ListFooterComponent={ this.renderFooter } // Pie de página para la lista
                    // onEndReachedThreshold={0.5} // Umbral para cargar más episodios (cuando se llega al 50% del final de la lista)
                    showsVerticalScrollIndicator={ false } // Oculto el indicador de scroll vertical
                    refreshing={ loading } // Indicador de carga
                    contentContainerStyle={styles.contentContainer} // Espacio al final de la lista para evitar que el último item quede pegado al borde
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay episodios para mostrar</Text>} // Mensaje cuando no hay películas
                    onRefresh={this.onRefresh} // Permite refrescar la lista al hacer pull-to-refresh
                />
            );
        }
    }

    // Método para cargar los episodios desde el datasource (de momento se realiza aqui, luego en subclases para cargar desde diferentes logicas)
    // protected abstract loadEpisodes(searchFilter: String): Promise<Episode>;
    async loadEpisodes() {
        try {
            await sleep(300); // Simulamos una espera de 1 segundo para simular la carga de datos
            const episodes: Episode[] = await this.episodeRepository.getEpisodes();
            logger.info('Episodios cargados:' + episodes.length);

            this.setState({ episodes: episodes, loading: false }); // Actualizamos el estado con los episodios cargados y cambiamos el loading a false
        } catch (error) {
            logger.error('Error al cargar los episodios:' + error);
        }
    }

    // Método para reiniciar la lista de episodios y filtrado de búsqueda
    private onRefresh = async () => {
        logger.info('Reiniciando la lista de episodios y filtrado de búsqueda');
        this.setState({ loading: true, episodes: [] }); // Reiniciamos el estado a loading y sin episodios
        await this.loadEpisodes(); // Volvemos a cargar los episodios
    };

    // ___________ Componentes de renderizado ___________
    private renderItem = ({ item, index }: { item: Episode, index: number }) => {
        return (
            <EpisodeItem
                episode={item}
                index={index} // Pasamos el índice del item para animaciones
                onPress={() =>
                    // this.props.navigation.navigate('MovieDetails', { movie: item })
                    logger.info(`Episodio seleccionado: ${item.titulo} - Temporada: ${item.temporada} - Episodio: ${item.episodio}`)
                }
            />
        );
    };

    private renderSeparator = () => {
        return <View style={styles.separator} />; // Renderizamos un separador entre los items
    };

    private renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>Películas Populares</Text>
            </View>
        ); // Renderizamos un encabezado para la lista
    };

    private renderFooter = () => {
        //const insets = useSafeAreaInsets(); // Obtenemos los insets de la zona segura para evitar que el pie de página quede pegado al borde

        return (
            //<View style={{ height: insets.bottom }}>
                <Text style={styles.footerText}>Fin de la lista</Text>
            //</View>
        ); // Renderizamos un pie de página para la lista
    };
}

const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,                  // Ocupa toda la pantalla
        justifyContent: 'center', // Centrado vertical
        alignItems: 'center',     // Centrado horizontal
    },
    header: {
        padding: 20,
        backgroundColor: '#f8f8f8', // Color de fondo del encabezado
        borderBottomWidth: 1, // Ancho del borde inferior
        borderBottomColor: '#ccc', // Color del borde inferior
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold', // Estilo para el texto del encabezado
        color: '#333', // Color del texto del encabezado
    },
    footer: {
        padding: 20,
        backgroundColor: '#f8f8f8', // Color de fondo del pie de página
        borderTopWidth: 1, // Ancho del borde superior
        borderTopColor: '#ccc', // Color del borde superior
        alignItems: 'center', // Centrar el texto en el pie de página
    },
    footerText: {
        fontSize: 16,
        color: '#666', // Color del texto del pie de página
        fontStyle: 'italic', // Estilo para el texto del pie de página
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc', // Color del separador entre los items
    },
    contentContainer: {
        paddingBottom: 20, // Espacio al final de la lista para evitar que el último item quede pegado al borde
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
    },
});
