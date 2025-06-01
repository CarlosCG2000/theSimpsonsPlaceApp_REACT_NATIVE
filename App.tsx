/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import EpisodeList from './src/presentation/episode/EpisodeList';
// import QuoteList from './src/presentation/QuoteList';

function App(): React.JSX.Element {

  return (
    <SafeAreaView style = {styles.container}>
      <EpisodeList />
      {/* <QuoteList /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09184D',
  },
});

export default App;
