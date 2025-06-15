import React from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Quote } from '../../domain/model/Quote';
import { QuoteRepository } from '../../domain/repository/QuoteRepository';
import { Logger } from '../../utils/Logger';
import QuoteItem from './QuoteItem';

// Propiedades del componente QuoteList, de momento no necesitamos pasarle nada
interface QuoteListProps { }

// Estado del componente QuoteList, que contiene un array de citas y un estado de carga
interface QuoteListState {
  readonly quotes: Quote[]; // Array de citas
  readonly loading: boolean; // Loading de carga de citas
}

const logger = new Logger('QuoteList');

export default class QuoteList extends React.Component<QuoteListProps, QuoteListState> {
  private quoteRepository: QuoteRepository;

    // 1. Constructor para inicializar el estado y el datasource
    constructor(props: QuoteListProps) {
        super(props);

        // Inicializamos el estado del componente
        this.state = { quotes: [],
            loading: true,
        };

        this.quoteRepository = new QuoteRepository(); // Creamos una instancia del datasource para obtener las citas
    }

    // 2. Método para cargar las citas al montar el componente (solo se ejecuta una vez)
    async componentDidMount() {
      await this.loadQuote();
    }

    render() {
      const { loading } = this.state;

      // Si estamos cargando, mostramos un indicador de carga
      if (loading) {
          return (
              <View style={styles.containerLoading}>
                  <ActivityIndicator size="large" color="orange" />
              </View>
          );
      }

      return (  // boton para generar un nuevo conjunto de citas
          <View style={styles.container}>

              <TouchableOpacity
                  style={styles.buttonQuotes} // Aplicar estilos adicionales para diferenciar
                  onPress={this.onSubmit}
              >
                  <Text style={styles.buttonText}>Generar New Quotes</Text>
              </TouchableOpacity>

              {this.state.loading ? (
              <Text>Loading...</Text>
              ) : (
                <Animated.FlatList
                      data={ this.state.quotes } // Usamos el estado para obtener la lista de episodios
                      keyExtractor={( quote: Quote ) => quote.cita } // Usamos el id de la película como clave
                      renderItem={ this.renderItem }
                  />
              )}
          </View>
      );
    }

    private renderItem = ({ item, index }: { item: Quote, index: number }) => {
        return (
            <QuoteItem
                quote={item}
                index={index} // Pasamos el índice del item para animaciones
            />
        );
    };

    // Método para cargar las citas desde el datasource
    // protected abstract loadQuote(): Promise<Quote>; // Este método se implementa en la clase concreta
    async loadQuote() {
        try {
            const quotes: Quote[]  = await this.quoteRepository.getQuotesTest(); //.getQuotes()
            logger.info('Citas cargadas: ' + quotes.length);
            this.setState({ quotes: quotes, loading: false }); // Actualizamos el estado con las citas cargadas y cambiamos el loading a false
        } catch (error) {
            logger.error('Error al cargar las citas:' + error);
        }
    }

    // Método para generar un nuevo conjunto de citas
    private onSubmit = async () => {
        logger.info('Generando nuevo conjunto de citas');
        this.setState({ loading: true, quotes: [] }); // Reiniciamos el estado a loading y sin episodios
        await this.loadQuote(); // Volvemos a cargar nuevas citas aleatorias
    };

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
    containerLoading: {
      flex: 1,                    // Ocupa toda la pantalla
      justifyContent: 'center',   // Centrado vertical
      alignItems: 'center',       // Centrado horizontal
      backgroundColor: '#09184D',
  },
  buttonQuotes: {
        backgroundColor: '#FFC107',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: { color: '#0C134F', fontWeight: 'bold' },
});
