
import React from 'react';

import { CalendarTabBarIcon, EyeTabBarIcon, HeartTabBarIcon } from '../components/Icons';
import { Stack, Tab } from '../../../App';
import EpisodeList from './EpisodeList';
import EpisodeDetails from './EpisodeDetails';
import { headerBack } from '../components/HeaderBackIcon';

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
                                tabBarIcon: EyeTabBarIcon,
                }} >
                    { () => <FavEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>
        </Tab.Navigator>
    );
}
