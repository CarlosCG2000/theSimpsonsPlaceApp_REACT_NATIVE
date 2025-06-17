import React from 'react';
import { View, Text, StyleSheet, Animated, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Quote } from '../../domain/model/Quote';
import { QuoteRepository } from '../../domain/repository/QuoteRepository';
import { Logger } from '../../utils/Logger';
import QuoteItem from './QuoteItem';
import Icon from '@react-native-vector-icons/ionicons';
import i18n from '../../i18n/i18n';

interface QuoteListProps { }

interface QuoteListState {
    readonly quotes: Quote[];
    readonly loading: boolean;
    readonly search: string,
    selectedCount: number
}

const logger = new Logger('QuoteList');

export default class QuoteListSearch extends React.Component<QuoteListProps, QuoteListState> {
    private quoteRepository: QuoteRepository;
    private searchTimeout: NodeJS.Timeout | null = null;

    constructor(props: QuoteListProps) {
        super(props);

        this.state = { quotes: [], loading: true, search: '', selectedCount: 3 };

        this.quoteRepository = new QuoteRepository();
    }

    async componentDidMount() { await this.loadQuote(this.state.selectedCount, this.state.search); }

    componentWillUnmount() {
        if (this.searchTimeout) { clearTimeout(this.searchTimeout); }
    }

    handleFilterChange = (value: any) => {
        this.setState({ search: value });

        if (this.searchTimeout) { clearTimeout(this.searchTimeout); }
        this.searchTimeout = setTimeout(() => this.loadQuote(this.state.selectedCount, value), 300);
    };

    handleClearSearch = () => this.handleFilterChange('');

    handleCountChange = (count: number) => {
        this.setState({ selectedCount: count });
        this.loadQuote(count, this.state.search);
    };

    render() {
        const { loading, search } = this.state;

        if (loading) {
            return (
                <View style={styles.containerLoading}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            );
        }

        return (
        <View style={ styles.flatList }>

                <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={ i18n('playholderSearchQuote') }
                            value={search}
                            onChangeText={(text) => this.handleFilterChange(text)}
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        />
                        {(search ?? '').length > 0 && (
                            <TouchableOpacity
                                onPress={this.handleClearSearch}
                                style={styles.clearButton}
                            >
                                <Icon name="close" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                </View>

                <View style={styles.segmentedControl}>
                    {[1, 3, 5].map((count) => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.segmentButton,
                                this.state.selectedCount === count && styles.segmentButtonActive,
                            ]}
                            onPress={() => this.handleCountChange(count)}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    this.state.selectedCount === count && styles.segmentTextActive,
                                ]}
                            >
                                { i18n('element') } {count}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Animated.FlatList
                        data={ this.state.quotes } // Usamos el estado para obtener la lista de episodios
                        keyExtractor={( quote: Quote ) => quote.cita } // Usamos el id de la película como clave
                        renderItem={ this.renderItem }
                    />

            </View>
        );
    }

    private renderItem = ({ item, index }: { item: Quote, index: number }) => {
        return (
            <QuoteItem
                quote={item}
                index={index}
            />
        );
    };

    async loadQuote(numElementos: number = 10, textPersonaje: string = '') {
        try {
            const quotes: Quote[]  = await this.quoteRepository.getQuotes(numElementos, textPersonaje); //.getQuotesTest()
            logger.info('Citas cargadas: ' + quotes.length);
            this.setState({ quotes: quotes, loading: false });
        } catch (error) {
            logger.error('Error al cargar las citas:' + error);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#09184D',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    quoteItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    quoteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quoteDetails: {
        fontSize: 14,
        color: '#666',
    },
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
        marginTop: 20,
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
    segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#2A2E5B', // el azul oscuro de fondo
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    justifyContent: 'center', // Centra los botones horizontalmente
    marginHorizontal: 20, // Espacio horizontal para que no toque los bordes
    },
    segmentButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    segmentButtonActive: {
        backgroundColor: 'white',
    },
    segmentText: {
        color: '#aaa',
        fontWeight: 'normal',
    },
    segmentTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
});
