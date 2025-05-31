/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
// import EpisodeList from './src/presentation/EpisodeList';
import QuoteList from './src/presentation/QuoteList';

function App(): React.JSX.Element {

  return (
    <SafeAreaView style = {styles.container}>
    <Text style={styles.text}>Hola me llamo Carlos</Text>

    <ScrollView>
      {/* <EpisodeList /> */}
      <QuoteList />
    </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
