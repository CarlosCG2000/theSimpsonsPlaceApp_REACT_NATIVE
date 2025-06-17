import React from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Quote } from '../../domain/model/Quote';
import { QuoteRepository } from '../../domain/repository/QuoteRepository';
import { Logger } from '../../utils/Logger';
import QuoteItem from './QuoteItem';
import i18n from '../../i18n/i18n';

interface QuoteListProps { }

interface QuoteListState {
  readonly quotes: Quote[];
  readonly loading: boolean;
}

const logger = new Logger('QuoteList');

export default class QuoteList extends React.Component<QuoteListProps, QuoteListState> {
  private quoteRepository: QuoteRepository;

    constructor(props: QuoteListProps) {
        super(props);

        this.state = { quotes: [],
            loading: true,
        };

        this.quoteRepository = new QuoteRepository();
    }

    async componentDidMount() {
      await this.loadQuote();
    }

    render() {
      const { loading } = this.state;

      if (loading) {
          return (
              <View style={styles.containerLoading}>
                  <ActivityIndicator size="large" color="orange" />
              </View>
          );
      }

      return (
          <View style={styles.container}>

              <TouchableOpacity
                  style={styles.buttonQuotes}
                  onPress={this.onSubmit}
              >
                  <Text style={styles.buttonText}> {i18n('btQuotes')}</Text>
              </TouchableOpacity>

              {this.state.loading ? (
              <Text>{i18n('loading')}</Text>
              ) : (
                <Animated.FlatList
                      data={ this.state.quotes }
                      keyExtractor={( quote: Quote ) => quote.cita }
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
                index={index}
            />
        );
    };

    async loadQuote() {
        try {
            const quotes: Quote[]  = await this.quoteRepository.getQuotesTest();
            logger.info('Citas cargadas: ' + quotes.length);
            this.setState({ quotes: quotes, loading: false });
        } catch (error) {
            logger.error('Error al cargar las citas:' + error);
        }
    }

    private onSubmit = async () => {
        logger.info('Generando nuevo conjunto de citas');
        this.setState({ loading: true, quotes: [] });
        await this.loadQuote();
    };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#09184D',
  },
  quoteItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
