import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quote } from '../../domain/model/Quote';
import { QuoteRepository } from '../../domain/repository/QuoteRepository';
import { Logger } from '../../utils/Logger';

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
      return (
          <View style={styles.container}>
              <Text style={styles.title}>Quote List</Text>
              {this.state.loading ? (
              <Text>Loading...</Text>
              ) : (
              this.state.quotes.map((quote, index) => (
                  <View key={index} style={styles.quoteItem}>
                  <Text style={styles.quoteTitle}>{quote.personaje}</Text>
                  <Text style={styles.quoteDetails}>
                      Quote: {quote.cita}
                  </Text>
                  <Text style={styles.quoteDetails}>
                      Image: {quote.imagen}
                  </Text>
                  </View>
              ))
              )}
          </View>
      );
    }

    // Método para cargar las citas desde el datasource
    // protected abstract loadQuote(): Promise<Quote>; // Este método se implementa en la clase concreta
    async loadQuote() {
        try {
            const quotes: Quote[]  = await this.quoteRepository.getQuotes(); // .getQuotesTest();
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
    backgroundColor: '#fff',
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
});
