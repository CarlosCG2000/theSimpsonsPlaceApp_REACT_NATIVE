import React from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator, Animated,
    Text, // Añadir Text
    TouchableOpacity, // Añadir TouchableOpacity
 } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

import EpisodeItem from './EpisodeItem';
import { Episode } from '../../domain/model/Episode';
import { EpisodeRepository } from '../../domain/repository/EpisodeRepository';
import { Logger } from '../../utils/Logger';
import EmptyStateView from '../components/EmptyStateView';

interface EpisodeListSearchProps {
    readonly navigation: any;
    readonly searchFilter?: string;
}

interface EpisodeListSearchState {
    readonly episodes: ReadonlyArray<Episode>;
    readonly loading: boolean;
    readonly search: string;
    readonly season: number | null;
    readonly dateStart: Date | null;
    readonly dateEnd: Date | null;
    showSeasonPicker: boolean; // <-- NUEVO ESTADO para controlar la visibilidad del Picker
}

const logger = new Logger('EpisodeListSearch');

export default class EpisodeListSearch extends React.Component<EpisodeListSearchProps, EpisodeListSearchState> {
    private episodeRepository: EpisodeRepository;

    constructor(props: EpisodeListSearchProps) {
        super(props);

        this.state = {
            episodes: [],
            loading: true,
            search: '',  season: null,
            dateStart: new Date(1989, 11, 16), dateEnd: new Date(),
            showSeasonPicker: false, // Inicialmente oculto
        };

        this.episodeRepository = new EpisodeRepository();
    }

    async componentDidMount() {
        await this.loadEpisodes();
    }

    async loadEpisodes() {
        try {
            const episodes = await this.episodeRepository.getEpisodesByName(this.props.searchFilter ?? '');
            logger.info('Episodios cargados:' + episodes.length);
            this.setState({ episodes, loading: false });
        } catch (error) {
            logger.error('Error al cargar episodios:' + error);
        }
    }

    private filterEpisodes(): Episode[] {
        const { episodes, search, season, dateStart, dateEnd } = this.state;
        return episodes.filter((episode) => {
            const matchesTitle = episode.titulo.toLowerCase().includes(search.toLowerCase());
            const matchesSeason = season ? episode.temporada === season : true;
            const matchesDateStart = dateStart ? new Date(episode.lanzamiento) >= dateStart : true;
            const matchesDateEnd = dateEnd ? new Date(episode.lanzamiento) <= dateEnd : true;
            return matchesTitle && matchesSeason && matchesDateStart && matchesDateEnd;
        });
    }

    render() {
        const { loading, search, season, dateStart, dateEnd, showSeasonPicker  } = this.state;

        if (loading) {
            return (
                <View style={styles.containerLoading}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            );
        }

        const filteredEpisodes = this.filterEpisodes();

        return (
            <View style={ styles.flatList }>
                <View style={styles.filters}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar por título..."
                        value={search}
                        onChangeText={(text) => this.setState({ search: text })}
                        placeholderTextColor="rgba(0, 0, 0, 0.5)" // Cambia el color del placeholder
                    />

                     {/* Lógica para el Picker de Temporada */}
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
                                this.setState({ season: value === 0 ? null : value, showSeasonPicker: false }); // Ocultar después de seleccionar
                            }}
                        >
                            <Picker.Item label="Todas las temporadas" value={0} />

                            {[...Array(15)].map((_, i) => (
                                <Picker.Item key={i + 1} label={`Temporada ${i + 1}`} value={i + 1} />
                            ))}

                        </Picker>
                    )}


                    <View style={styles.dateRow}>
                        <DateTimePicker
                            value={dateStart || new Date()}
                            style={styles.datePicker}
                            display="default"
                            onChange={(_, selectedDate) => this.setState({
                                dateStart: selectedDate || dateStart,
                            })}
                        />

                        <DateTimePicker
                            value={dateEnd || new Date()}
                            style={styles.datePicker}
                            mode="date"
                            display="default"
                            onChange={(_, selectedDate) => this.setState({
                                dateEnd: selectedDate || dateEnd,
                            })}
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
        this.setState({ loading: true, episodes: [] });
        await this.loadEpisodes();
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#1E2A78',
    },
    input: {
        backgroundColor: '#4E5D9C',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        marginBottom: 10,
        color: 'black',
        fontSize: 18,
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
