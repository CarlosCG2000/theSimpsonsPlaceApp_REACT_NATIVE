import React from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Animated, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from '../..//i18n/i18n';

import EpisodeItem from './EpisodeItem';
import { Episode } from '../../domain/model/Episode';
import { EpisodeRepository } from '../../domain/repository/EpisodeRepository';
import { Logger } from '../../utils/Logger';
import EmptyStateView from '../components/EmptyStateView';
import { EpisodeFilter } from '../../domain/model/EpisodeFilter';
import Icon from '@react-native-vector-icons/ionicons';

interface EpisodeListSearchProps {
    readonly navigation: any;
    readonly searchFilter?: string;
}

interface EpisodeListSearchState {
    readonly episodes: ReadonlyArray<Episode>;
    readonly loading: boolean;
    readonly episodeFilter: EpisodeFilter
    showSeasonPicker: boolean; // <-- Para controlar la visibilidad del Picker
}

const logger = new Logger('EpisodeListSearch');

export default class EpisodeListSearch extends React.Component<EpisodeListSearchProps, EpisodeListSearchState> {
    private episodeRepository: EpisodeRepository;

    private searchTimeout: NodeJS.Timeout | null = null; // "debounce" la búsqueda

    constructor(props: EpisodeListSearchProps) {
        super(props);

        this.state = {
            episodes: [],
            loading: true,
            episodeFilter: new EpisodeFilter('', null, new Date(1989, 11, 16), new Date()), // Inicializamos el filtro de episodios
            showSeasonPicker: false, // Inicialmente oculto
        };

        this.episodeRepository = new EpisodeRepository();
    }

    async componentDidMount() { // después de que el componente ha sido montado, se ejecuta este método
        await this.loadFilteredEpisodes();
    }

    async loadFilteredEpisodes() {
        this.setState({ loading: true });

        try {
            const episodes = await this.episodeRepository.getFilteredEpisodes(this.state.episodeFilter);
            logger.info(`Vista: Episodios cargados y filtrados: ${episodes.length}`);
            this.setState({ episodes, loading: false });
        } catch (error) {
            logger.error('Error al cargar episodios con filtros:' + error);
            this.setState({ episodes: [],loading: false });
        }
    }

    // Método para manejar cambios en los filtros y disparar la recarga
    handleFilterChange = (filterName: keyof EpisodeFilter, value: any) => {
        // Nueva copia del objeto episodeFilter
        const updatedEpisodeFilter = {
            ...this.state.episodeFilter, // Copiamos todas las propiedades existentes
            [filterName]: value,         // Actualizamos la propiedad específica
        };

        this.setState({ episodeFilter: updatedEpisodeFilter }, () => // Reemplazamos el episodeFilter con la nueva copia
        {
            if (filterName === 'search') { // Si el cambio es en la búsqueda de texto, usamos debounce
                if (this.searchTimeout) { clearTimeout(this.searchTimeout); } // Limpiamos el timeout anterior si existe
                this.searchTimeout = setTimeout(() => this.loadFilteredEpisodes(), 300); // Espera 300ms antes de buscar
            } else { // Para los demás filtros, carga inmediatamente
                this.loadFilteredEpisodes();
            }
        });
    };

    // Limpiar el campo de búsqueda (icono de X en el 'input text' para limpiar)
    handleClearSearch = () => this.handleFilterChange('search', ''); // Establece el filtro de búsqueda a una cadena vacía

    render() {
        const { loading, showSeasonPicker } = this.state;
        const { search, season, dateStart, dateEnd } = this.state.episodeFilter; // Desestructuramos los filtros

        if (loading) {
            return (
                <View style={styles.containerLoading}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            );
        }

        const filteredEpisodes = this.state.episodes; // Los episodios filtrados por el repositorio

        return (
            <View style={ styles.flatList }>
                <View style={styles.filters}>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={ i18n('playholderSearch') }
                            value={search}
                            onChangeText={(text) => this.handleFilterChange('search', text)}
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        />
                        {(search ?? '').length > 0 && (
                            <TouchableOpacity
                                onPress={this.handleClearSearch}
                                style={styles.clearButton}
                            >
                                <Icon name="close" size={20} color="#999" /> {/* Icono de círculo con X */}
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.pickerToggle}
                        onPress={() => this.setState(prevState => ({ showSeasonPicker: !prevState.showSeasonPicker }))}
                    >
                        <Text style={styles.pickerToggleText}>
                            {season ? `Temporada ${season}` : 'Todas las temporadas'}
                        </Text>
                    </TouchableOpacity>

                    {showSeasonPicker && ( // Muestra el Picker solo si showSeasonPicker es true
                        <Picker
                            selectedValue={season}
                            style={styles.picker} // Puedes ajustar el estilo para que sea más compacto
                            onValueChange={(value) => {
                                this.handleFilterChange('season', value === 0 ? null : value); // Llama al manejador
                                this.setState({ showSeasonPicker: false }); // Oculta después de seleccionar
                            }}
                        >
                            <Picker.Item label="Todas las temporadas" value={0} />

                            {[...Array(25)].map((_, i) => (
                                <Picker.Item key={i + 1} label={`Temporada ${i + 1}`} value={i + 1} />
                            ))}

                        </Picker>
                    )}

                    <View style={styles.dateRow}>
                        <DateTimePicker
                            value={dateStart || new Date(1989, 11, 16)}
                            style={styles.datePicker}
                            mode="date"
                            display="default"
                            onChange={(_, selectedDate) => (
                                this.handleFilterChange('dateStart', selectedDate || dateStart) // Llama al manejador
                            )}
                        />

                        <DateTimePicker
                            value={dateEnd || new Date()}
                            style={styles.datePicker}
                            mode="date"
                            display="default"
                            onChange={(_, selectedDate) => (
                                this.handleFilterChange('dateEnd', selectedDate || dateEnd) // Llama al manejador
                            )}
                        />
                    </View>
                </View>

                <Animated.FlatList
                    style={styles.flatList}
                    data={filteredEpisodes}
                    keyExtractor={(item) => item.id}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderEmptyComponent}
                    onRefresh={this.onRefresh}
                    refreshing={loading}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                />
            </View>
        );
    }

    private onRefresh = async () => {
        this.setState({ loading: true, episodes: [] }); // Reiniciamos el estado a loading y sin episodios
        await this.loadFilteredEpisodes(); // Volvemos a cargar los episodios
        logger.info('Reiniciando la lista de episodios y filtrado de búsqueda');
        this.searchTimeout = null; // Limpiamos el temporizador de búsqueda
    };

    private renderEmptyComponent = () => (
        <View style={styles.emptyView}>
            <EmptyStateView
                title="Ningún episodio disponible"
                description="Aún no hay episodios para mostrar. Cambia los filtros de búsqueda."
            />
        </View>
    );

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
        paddingTop: 180,
    },
    contentContainer: {
        paddingTop: 10,
    },
    filters: {
        padding: 10,
        backgroundColor: '#09184D',
    },
    searchInputContainer: {
        flexDirection: 'row', // Para que el input y el botón estén en la misma fila
        alignItems: 'baseline', // Alinea verticalmente el input y el icono
       // backgroundColor: '#4E5D9C',
        borderRadius: 5,
        marginBottom: 10,
        paddingRight: 10, // Espacio para el icono
    },
    clearButton: {
        padding: 5, // Aumenta el área de toque del icono
    },
    input: {
        backgroundColor: '#4E5D9C',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        color: 'black',
        fontSize: 18,
        marginLeft: 30, // Espacio para el icono de limpiar
        width: '87%', // Asegura que el input ocupe todo el ancho disponible
    },
    picker: {
        backgroundColor: '#4E5D9C',
        marginBottom: 10,
        borderRadius: 5,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 30,
    },
    pickerToggle: { // NUEVO ESTILO para el "botón" del Picker de temporada
        backgroundColor: '#4E5D9C',
        paddingHorizontal: 10,
        paddingVertical: 12, // Un poco más de padding para que parezca un botón
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center', // Alinea el texto a la izquierda
    },
    pickerToggleText: {
        color: 'black', // Color del texto
        fontSize: 18,
    },
    datePicker: {
        backgroundColor: '#4E5D9C',
        borderRadius: 5,
        alignContent: 'center',
        paddingEnd: 4,
    },
});
