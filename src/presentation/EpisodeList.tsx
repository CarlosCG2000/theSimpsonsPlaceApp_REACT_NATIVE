import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Episode } from '../domain/model/Episode'; // Import the Episode type
import { EpisodeDatasource } from '../data/datasource/remote/EpisodeDatasource'; // Import the datasource

interface EpisodeListProps { }

interface EpisodeListState {
  episodes: Episode[]; // Array of episodes to be displayed
  loading: boolean; // Loading state
}

export default class EpisodeList extends React.Component<EpisodeListProps, EpisodeListState> {
  private episodeDatasource: EpisodeDatasource;

    constructor(props: EpisodeListProps) {
        super(props);

        this.state = {
            episodes: [],
            loading: true,
        };

        this.episodeDatasource = new EpisodeDatasource();
    }

    componentDidMount() {
        this.loadEpisodes();
    }

    async loadEpisodes() {
        try {
            const episodes = await this.episodeDatasource.getEpisodes();
            console.log('Episodes loaded:', episodes);
            this.setState({
                episodes: episodes,
                loading: false,
            });
            // Here you would typically update the state with the loaded episodes
        } catch (error) {
            console.error('Error loading episodes:', error);
        }
    }


  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Episode List</Text>
            {this.state.loading ? (
            <Text>Loading...</Text>
            ) : (
            this.state.episodes.map((episode, index) => (
                <View key={index} style={styles.episodeItem}>
                <Text style={styles.episodeTitle}>{episode.titulo}</Text>
                <Text style={styles.episodeDetails}>
                    Season: {episode.temporada}, Episode: {episode.episodio}
                </Text>
                <Text style={styles.episodeDetails}>
                    Release Date: {episode.lanzamiento}
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
  episodeItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  episodeDetails: {
    fontSize: 14,
    color: '#666',
  },
});
