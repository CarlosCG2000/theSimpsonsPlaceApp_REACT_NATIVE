import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quote } from '../domain/model/Quote';
import { QuoteDatasource } from '../data/datasource/remote/QuoteDatasource';

interface QuoteListProps { }

interface QuoteListState {
  quotes: Quote[]; // Array of quotes to be displayed
  loading: boolean; // Loading state
}

export default class QuoteList extends React.Component<QuoteListProps, QuoteListState> {
  private quoteDatasource: QuoteDatasource;

    constructor(props: QuoteListProps) {
        super(props);

        this.state = {
            quotes: [],
            loading: true,
        };

        this.quoteDatasource = new QuoteDatasource();
    }

    componentDidMount() {
        this.loadQuote();
    }

    async loadQuote() {
        try {
            const quotes = await this.quoteDatasource.getQuotes(); // .getQuotesTest();
            console.log('Quotes loaded:', quotes);
            this.setState({
                quotes: quotes,
                loading: false,
            });
            // Here you would typically update the state with the loaded quotes
        } catch (error) {
            console.error('Error loading quotes:', error);
        }
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
