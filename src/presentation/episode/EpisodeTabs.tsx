
import React from 'react';

import { CalendarTabBarIcon, EyeTabBarIcon, HeartTabBarIcon } from '../components/Icons';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { Stack, Tab } from '../../../App';
import EpisodeDetails from './EpisodeDetails';
import i18n from '../../i18n/i18n';
import EpisodeListAll from './EpisodeListAll';
import EpisodeListSearch from './EpisodeListSearch';
import EpisodeListView from './EpisodeListView';

//________________Stacks de navegación de los episodios______________________
function AllEpisodeStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen   name="EpisodeList"
                            component={EpisodeListAll as any}
                            options={{
                                // headerShown: false title: 'Listado de episodios completo',
                                headerTintColor: '#FFC107',                     // Color del icono hacia atrás
                                headerBackTitle: i18n('back'),                       // Texto del botón de retroceso
                                headerTitle: i18n('allEpisodes'),               // Título del header
                                // headerTitleAlign: 'center',                  // Alineación del título
                                headerStyle: { backgroundColor: '#09184D' },    // Color de fondo del header
                                headerTitleStyle: { fontWeight: 'bold' },
                                headerLeft: HeaderBackButton(rootNavigation),
                            }}
            />
            <Stack.Screen   name="EpisodeDetails"
                            component={EpisodeDetails as any}  />
        </Stack.Navigator>
    );
}

function FilterEpisodeStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen   name="EpisodeList"
                            component={EpisodeListSearch as any}
                            options={{
                            headerTintColor: '#FFC107',
                            headerBackTitle: i18n('back'),
                            headerTitle: i18n('filterEpisodes'),
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: HeaderBackButton(rootNavigation),
                            }}
                />
                <Stack.Screen   name="EpisodeDetails"
                                component={EpisodeDetails as any} />
        </Stack.Navigator>
    );
}

function ViewEpisodeStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="EpisodeList">
            <Stack.Screen   name="EpisodeList"
                            component={EpisodeListView as any}
                            options={{
                            headerTintColor: '#FFC107',
                            headerBackTitle: i18n('back'),
                            headerTitle: i18n('viewEpisodes'),
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: HeaderBackButton(rootNavigation),
                            }}
            />
            <Stack.Screen   name="EpisodeDetails"
                            component={EpisodeDetails as any} />
        </Stack.Navigator>
    );
}
//_________________________________________________________________________

export function EpisodeTabs({ navigation }: { navigation: any }) {
    return (
            <Tab.Navigator  initialRouteName="AllEpisodeStack"
                            screenOptions={{
                                tabBarStyle: { backgroundColor: '#09184D' }, // TabBar inferior
                                tabBarActiveTintColor: '#FFC107',            // Color de icono/texto activo
                                tabBarInactiveTintColor: 'white',            // Color inactivo
                                headerStyle: { backgroundColor: '#09184D' }, // TabBar superior
                                headerTintColor: '#FFC107',
                            }}
            >
                <Tab.Screen name="AllEpisodeStack"
                            options={{
                                title: i18n('allEpisodes'), // Título de la pestaña
                                headerShown: false,
                                tabBarIcon: HeartTabBarIcon,
                            }}>
                            { () => <AllEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="FilterEpisodeStack"
                            // component={FilterEpisodeStack}
                            options={{
                                // tabBarLabel:  'Filtro de los Episodios',
                                title: i18n('filterEpisodes'), // Título de la pestaña
                                headerShown: false,             // Ocultamos el encabezado ya que lo manejamos en el stack
                                tabBarIcon: CalendarTabBarIcon,
                }} >
                    { () => <FilterEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="ViewEpisodeStack"
                            // component={ViewEpisodeStack}
                            options={{
                                // tabBarLabel:  'Episodios favoritos',
                                title: i18n('viewEpisodes'), // Título de la pestaña
                                headerShown: false,             // Ocultamos el encabezado ya que lo manejamos en el stack
                                tabBarIcon: EyeTabBarIcon,
                }} >
                    { () => <ViewEpisodeStack rootNavigation={navigation} /> }
                </Tab.Screen>
        </Tab.Navigator>
    );
}
