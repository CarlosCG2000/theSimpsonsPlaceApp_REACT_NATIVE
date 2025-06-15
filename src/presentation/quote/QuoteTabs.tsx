import React from 'react';

import { CalendarTabBarIcon, GameTabBarIcon, HeartTabBarIcon } from '../components/Icons';
import { Stack, Tab } from '../../../App';
import { headerBack } from '../components/HeaderBackIcon';
import QuoteList from './QuoteList';
import QuoteListSearch from './QuoteItemSearch';
import StartGame from './game/StartGame';
import QuestionGame from './game/QuestionGame';

function AllQuoteStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="QuoteList">
            <Stack.Screen name="QuoteList"
                            component={QuoteList as any}
                            options={{
                                headerTintColor: '#FFC107',
                                headerBackTitle: 'Atrás',
                                headerTitle: '10 citas aleatorias',
                                headerStyle: { backgroundColor: '#09184D' },
                                headerTitleStyle: { fontWeight: 'bold' },
                                headerLeft: headerBack(rootNavigation),
                            }}
            />
            {/* <Stack.Screen name="EpisodeDetails"
                            component={EpisodeDetails as any}  /> */}
        </Stack.Navigator>
    );
}

function FilterQuoteStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="QuoteList">
            <Stack.Screen name="QuoteList"
                            component={QuoteListSearch as any}
                            options={{
                            headerTintColor: '#FFC107',
                            headerBackTitle: 'Atrás',
                            headerTitle: 'Filtrado de citas',
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: headerBack(rootNavigation),
                            }}
                />
                {/* <Stack.Screen name="EpisodeDetails"
                            component={EpisodeDetails as any} /> */}
        </Stack.Navigator>
    );
}

function GameQuoteStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="QuoteList">
            <Stack.Screen name="QuoteList"
                            component={StartGame as any}
                            options={{
                            headerTintColor: '#FFC107',
                            headerBackTitle: 'Atrás',
                            headerTitle: 'Juego de citas',
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: headerBack(rootNavigation),
                            }}
            />
            <Stack.Screen name="QuestionGame" component={QuestionGame} />
        </Stack.Navigator>
    );
}

export function QuoteTabs({ navigation }: { navigation: any }) {
    return (
        <Tab.Navigator  initialRouteName="AllQuoteStack"
                            screenOptions={{
                                tabBarStyle: { backgroundColor: '#09184D' },
                                tabBarActiveTintColor: '#FFC107',
                                tabBarInactiveTintColor: 'white',
                                headerStyle: { backgroundColor: '#09184D' },
                                headerTintColor: '#FFC107',
                            }}
            >
                <Tab.Screen name="AllQuoteStack"
                            options={{
                                title: 'Listado completo',
                                headerShown: false,
                                tabBarIcon: HeartTabBarIcon,
                            }}>
                            { () => <AllQuoteStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="FilterQuoteStack"
                            options={{
                                title: 'Listado con filtros',
                                headerShown: false,
                                tabBarIcon: CalendarTabBarIcon,
                            }} >
                    { () => <FilterQuoteStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="GameQuoteStack"
                            options={{
                                title: 'Juego de citas',
                                headerShown: false,
                                tabBarIcon: GameTabBarIcon,
                            }} >
                    { () => <GameQuoteStack rootNavigation={navigation} /> }
                </Tab.Screen>
        </Tab.Navigator>
    );
}
