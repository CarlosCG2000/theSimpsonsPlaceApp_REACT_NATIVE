
import React from 'react';

import { /*View,*/ Platform, /*TouchableOpacity*/
TouchableOpacity } from 'react-native';
import EpisodeList from './EpisodeList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicon from '@react-native-vector-icons/ionicons';
import EvilIcon from '@react-native-vector-icons/evil-icons';
import EpisodeDetails from './EpisodeDetails';

export const Stack = createNativeStackNavigator(); // Creamos el stack de navegación
export const Tab = createBottomTabNavigator(); // Creamos el stack de navegación para las pestañas (Tab)
export const Icon = Platform.OS === 'ios' ? EvilIcon : Ionicon;

function HeaderBack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <TouchableOpacity onPress={ () => rootNavigation.goBack()}>
            {/* <Text style={styles.inicioText}>Inicio</Text> */}
            <EvilIcon name="arrow-left" size={32} color="#FFC107" />
        </TouchableOpacity>
    );
}

export function headerBack(rootNavigation: any) {
    return () => <HeaderBack rootNavigation={rootNavigation} />;
}

//________________Stacks de navegación de los episodios______________________
function AllEpisodeStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen name="EpisodeList"
                            component={EpisodeList as any}
                            options={{
                                /* headerShown: false title: 'Listado de episodios completo'*/
                                headerTintColor: '#FFC107', // Color del icono hacia atrás
                                headerBackTitle: 'Atrás', // Texto del botón de retroceso
                                headerTitle: 'Todos los episodios', // Título del header
                                // headerTitleAlign: 'center', // Alineación del título
                                headerStyle: { backgroundColor: '#09184D' }, // Color de fondo del header
                                headerTitleStyle: { fontWeight: 'bold' },
                                headerLeft: headerBack(rootNavigation),
                            }}
            />
            <Stack.Screen name="EpisodeDetails"
                            component={EpisodeDetails as any}  />
        </Stack.Navigator>
    );
}

function FilterEpisodeStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen name="EpisodeList"
                            component={EpisodeList as any}
                            options={{
                            headerTintColor: '#FFC107',
                            headerBackTitle: 'Atrás',
                            headerTitle: 'Filtrado de episodios',
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: headerBack(rootNavigation),
                            }}
                />
                <Stack.Screen name="EpisodeDetails"
                            component={EpisodeDetails as any} />
        </Stack.Navigator>
    );
}

function FavEpisodeStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen name="EpisodeList"
                            component={EpisodeList as any}
                            options={{
                            headerTintColor: '#FFC107',
                            headerBackTitle: 'Atrás',
                            headerTitle: 'Episodios favoritos',
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: headerBack(rootNavigation),
                            }}
            />
            <Stack.Screen name="EpisodeDetails"
                            component={EpisodeDetails as any} />
        </Stack.Navigator>
    );
}

export function EpisodeTabs({ navigation }: { navigation: any }) {
    return (
        <Tab.Navigator initialRouteName="AllEpisodeStack"
                            screenOptions={{
                                tabBarStyle: { backgroundColor: '#09184D' }, // TabBar inferior
                                tabBarActiveTintColor: '#FFC107', // Color de icono/texto activo
                                tabBarInactiveTintColor: 'white', // Color inactivo
                                headerStyle: { backgroundColor: '#09184D' }, // TabBar superior
                                headerTintColor: '#FFC107',
                            }}
            >
                <Tab.Screen name="AllEpisodeStack"
                            // component={AllEpisodeStack}
                            options={{
                                title: 'Listado completo',
                                headerShown: false,
                                // tabBarLabel: 'Todos los Episodios',
                                tabBarIcon: HeartTabBarIcon,
                            }}>
                            { () => <AllEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="FilterEpisodeStack"
                            // component={FilterEpisodeStack}
                            options={{
                                title: 'Listado con filtros',
                                headerShown: false, // Ocultamos el encabezado ya que lo manejamos en el stack
                                // tabBarLabel:  'Filtro de los Episodios',
                                tabBarIcon: CalendarTabBarIcon,
                }} >
                    { () => <FilterEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="FavEpisodeStack"
                            // component={FavEpisodeStack}
                            options={{
                                title: 'Listado de favoritos',
                                headerShown: false, // Ocultamos el encabezado ya que lo manejamos en el stack
                                // tabBarLabel:  'Episodios favoritos',
                                tabBarIcon: StartTabBarIcon,
                }} >
                    { () => <FavEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>
        </Tab.Navigator>
    );
}

// Los iconos de las pestañas
export const HeartTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="archive" size={size} color={color} />
);

export const CalendarTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="search" size={size} color={color} />
);

export const StartTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="star" size={size} color={color} />
);


