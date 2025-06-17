import React from 'react';

import { CalendarTabBarIcon, GameTabBarIcon, HeartTabBarIcon } from '../components/Icons';
import { Stack, Tab } from '../../../App';
import { HeaderBackButton } from '../components/HeaderBackButton';
import QuoteList from './QuoteList';
import QuoteListSearch from './QuoteItemSearch';
import StartGame from './game/StartGame';
import QuestionGame from './game/QuestionGame';
import ResultGame from './game/ResultGame';
import i18n from '../../i18n/i18n';

function AllQuoteStack({ rootNavigation }: { rootNavigation: any }) {
    return (
        <Stack.Navigator initialRouteName="QuoteList">
            <Stack.Screen name="QuoteList"
                            component={QuoteList as any}
                            options={{
                                headerTintColor: '#FFC107',
                                headerBackTitle: i18n('back'),
                                headerTitle: i18n('tenQuotes'),
                                headerStyle: { backgroundColor: '#09184D' },
                                headerTitleStyle: { fontWeight: 'bold' },
                                headerLeft: HeaderBackButton(rootNavigation),
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
                            headerBackTitle: i18n('back'),
                            headerTitle: i18n('filterQuotes'),
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: HeaderBackButton(rootNavigation),
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
                            headerBackTitle: i18n('back'),
                            headerTitle: i18n('gameQuotes'),
                            headerStyle: { backgroundColor: '#09184D' },
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerLeft: HeaderBackButton(rootNavigation),
                            }}
            />
            <Stack.Screen name="QuestionGame" component={QuestionGame as any} />
            <Stack.Screen name="ResultGame" component={ResultGame as any} />
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
                                title: i18n('tenQuotes'),
                                headerShown: false,
                                tabBarIcon: HeartTabBarIcon,
                            }}>
                            { () => <AllQuoteStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="FilterQuoteStack"
                            options={{
                                title: i18n('filterQuotes'),
                                headerShown: false,
                                tabBarIcon: CalendarTabBarIcon,
                            }} >
                    { () => <FilterQuoteStack rootNavigation={navigation} /> }
                </Tab.Screen>

                <Tab.Screen name="GameQuoteStack"
                            options={{
                                title: i18n('gameQuotes'),
                                headerShown: false,
                                tabBarIcon: GameTabBarIcon,
                            }} >
                    { () => <GameQuoteStack rootNavigation={navigation} /> }
                </Tab.Screen>
        </Tab.Navigator>
    );
}
