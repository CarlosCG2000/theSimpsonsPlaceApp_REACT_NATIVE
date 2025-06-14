import React from 'react';

import { Platform } from 'react-native';
import Ionicon from '@react-native-vector-icons/ionicons';
import EvilIcon from '@react-native-vector-icons/evil-icons';

const Icon = Platform.OS === 'ios' ? EvilIcon : Ionicon;

// Los iconos de las pestañas (tabs) de la aplicación
export const HeartTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="archive" size={size} color={color} />
);

export const CalendarTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="search" size={size} color={color} />
);

export const StartTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="star" size={size} color={color} />
);

export const StarTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="star" size={size} color={color} />
);

export const GameTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Ionicon name="game-controller" size={size} color={color} />
);

export const EyeTabBarIcon = ({ color, size }: { color: string; size: number }) => (
    <Icon name="eye" size={size} color={color} />
);


