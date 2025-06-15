
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';

export interface StartGameProps {
    readonly navigation: any
}

export interface StartGameState { }

export default class StartGame extends React.Component<StartGameProps, StartGameState> {

    render() {
        return (
            <View style={styles.container}>
            <ImageBackground
                source={require('../../../utils/assets/simpsons-bg.jpg')}
                style={styles.background}
                resizeMode="cover"
                imageStyle={styles.imageOpacity}
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Juego de citas</Text>
                    <Text style={styles.subtitle}>
                        El juego consiste en adivinar a qué personaje pertenece cada cita (en total 5 citas)
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('QuestionGame');}}
                    >
                        <Text style={styles.buttonText}>Comenzar juego</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09184D',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 64, 0.75)', // azul oscuro translúcido
        borderRadius: 100,
        padding: 30,
        paddingHorizontal: 40,
        margin: 20,
        alignItems: 'center',
    },
    title: {
        color: '#FFD700', // amarillo
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageOpacity: {
        opacity: 0.7,
    },
});
