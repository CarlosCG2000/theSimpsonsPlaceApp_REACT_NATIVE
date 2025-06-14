/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MenuScreen from './src/presentation/MenuScreen';
import { EpisodeTabs } from './src/presentation/episode/EpisodeTabs';
import { QuoteTabs } from './src/presentation/quote/QuoteTabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export const Stack = createNativeStackNavigator(); // Creamos el stack de navegación
export const Tab = createBottomTabNavigator(); // Creamos el stack de navegación para las pestañas (Tab)

function RootStack(): React.JSX.Element {
    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      {/* <Stack.Screen name="EpisodeTabs" component={EpisodeTabs} /> */}
      <Stack.Screen name="EpisodeTabs">
              {({ navigation }) => <EpisodeTabs navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="QuoteTabs">
              {({ navigation }) => <QuoteTabs navigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
    );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
    );
}

export default App;
