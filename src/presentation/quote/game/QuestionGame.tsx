

import React from 'react';
import { Text, View } from 'react-native';

export interface QuestionGameProps {
    readonly navigation: any
}

export interface QuestionGameState { }

export default class QuestionGame extends React.Component<QuestionGameProps, QuestionGameState> {

    render() {
        return (
            <View>
            <Text>Juego de Preguntas</Text>
            {/* Aquí irían los componentes del juego */}
            </View>
        );
    }
}
