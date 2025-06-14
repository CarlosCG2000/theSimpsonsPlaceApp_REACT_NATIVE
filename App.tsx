/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MenuScreen from './src/presentation/MenuScreen';
import { EpisodeTabs } from './src/presentation/episode/EpisodeTabs';
import { QuoteTabs } from './src/presentation/quote/QuoteTabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SQLite, { WebsqlDatabase } from 'react-native-sqlite-2';
import { Logger } from './src/utils/Logger';
import { ActivityIndicator, Text, View } from 'react-native';

export const Stack = createNativeStackNavigator(); // Creamos el stack de navegación
export const Tab = createBottomTabNavigator(); // Creamos el stack de navegación para las pestañas (Tab)
export const AppDatabase = React.createContext<WebsqlDatabase | null>(null); // Define un tipo global para la base de datos, si lo necesitas, o pásalo por contexto
const logger = new Logger('App');

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
  // Es una variable de estado que controla si la base de datos ha sido inicializada. La app solo se renderizará completamente una vez que dbReady sea true.
  const [dbReady, setDbReady] = useState<boolean>(false);
  //Es un useRef para almacenar la instancia de WebsqlDatabase. useRef es ideal para mantener referencias a objetos que no causan re-renderizados cuando cambian (a diferencia de useState), pero que necesitan persistir entre renders
  const dbRef = useRef<WebsqlDatabase | null>(null); // Usamos useRef para mantener la instancia de la DB

  // El hook useEffect se usa para ejecutar código con efectos secundarios (como la inicialización de la BD) después de que el componente se renderiza. El array vacío [] como segundo argumento asegura que este efecto se ejecute solo una vez, al igual que componentDidMount en un componente de clase.
  useEffect(() => {
    const initDatabase = async () => {
      logger.info('Iniciando la base de datos SQLite...');
      try {
        const db = SQLite.openDatabase('episodes.db', '1.0', 'Episodes Database', 2 * 1024 * 1024); // Abre (o crea si no existe) la base de datos episodes.db.

        // Almacenar la referencia en dbRef
        dbRef.current = db;

        // Ejecuta una transacción SQL. Es la forma segura de interactuar con la base de datos.
        db.transaction(tx => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS viewed_episodes (
              id TEXT PRIMARY KEY NOT NULL,
              titulo TEXT NOT NULL,
              temporada INTEGER NOT NULL,
              episodio INTEGER NOT NULL,
              lanzamiento TEXT,
              directores TEXT,
              escritores TEXT,
              descripcion TEXT,
              valoracion INTEGER,
              invitados TEXT
            );`,
            [],
            () => logger.info('Tabla "viewed_episodes" creada o ya existe.'),
            (_, error) => {
              logger.error('Error al crear la tabla "viewed_episodes": ' + error.message);
              return true; // Para que la transacción no haga rollback
            }
          );
        });

        setDbReady(true);
        logger.info('Base de datos SQLite inicializada y lista.');
      } catch (error) {
        logger.error('Error al inicializar la base de datos: ' + error);
      }
    };

    initDatabase();

    // Cleanup: Cierra la DB si el componente se desmonta (útil en casos complejos, pero en App.tsx rara vez se desmonta)
    return () => {
      if (dbRef.current) {
        // No hay un método db.close() explícito en react-native-sqlite-2
        // La conexión se gestiona internamente o se cierra con la app.
        // Podrías poner lógica de limpieza aquí si fuera necesario.
      }
    };
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  if (!dbReady) {  // Si !dbReady, la aplicación muestra una SplashOrLoadingScreen simple.
    return (
      <SplashOrLoadingScreen /> // Muestra una pantalla de carga mientras la BD se inicializa
    );
  }

  return (
    // Pasamos la instancia de la base de datos a través del contexto para que sea accesible en los repositorios.
    // AppDatabase.Provider (Context API): Una vez que la base de datos está lista, su instancia (dbRef.current) se pasa a través del Context API de React. Esto es crucial porque permite que cualquier componente hijo (como tus repositorios) acceda a la instancia de la base de datos sin tener que pasarla explícitamente como prop por cada nivel del árbol de componentes.
    <AppDatabase.Provider value={dbRef.current}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AppDatabase.Provider>
  );
}

// Puedes crear un componente simple de carga o usar un ActivityIndicator
import { StyleSheet } from 'react-native';

const SplashOrLoadingScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color="#FFC107" />
    <Text style={styles.splashText}>Cargando aplicación...</Text>
  </View>
);

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09184D',
  },
  splashText: {
    color: '#fff',
    marginTop: 10,
  },
});

export default App;
