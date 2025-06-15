import React from 'react';
import { Logger } from '../../../utils/Logger';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ResultGameProps {
    readonly navigation: any

    readonly route: {
        readonly params: {
            readonly puntuacion: number; // Episodio seleccionada
        };
    };
}

interface ResultGameState {
    historialPuntuacion: number[] // [number, number]; // Array para almacenar el historial de puntuación, aciertos y total de preguntas
}

const logger = new Logger('ResultGame');

export default class ResultGame extends React.Component<ResultGameProps, ResultGameState> {
    public constructor(props: ResultGameProps) {
        super(props);
        this.state = { historialPuntuacion: [] };

        const { navigation, route } = props;
        const { puntuacion } = route.params;

        logger.info(`Resultado del juego: ${puntuacion}`);

        navigation.setOptions({
            headerShown: true,
            headerTintColor: '#FFC107',
            headerBackTitle: 'Atrás',
            headerTitle: 'Resultado final',
            headerStyle: { backgroundColor: '#09184D' },
            headerTitleStyle: { fontWeight: 'bold' },
        });
    }

    async componentDidMount() {
        const { puntuacion } = this.props.route.params;
        await this.anadirHistorialPuntuacion(puntuacion);
        await this.cargarHistorialPuntuacion();
    }

    async cargarHistorialPuntuacion() {
        const historial = await AsyncStorage.getItem('historialPuntuacion');
        if (historial) {
            const historialPuntuacion = JSON.parse(historial) as number[];
            this.setState({ historialPuntuacion });
            logger.info(`Historial cargado: ${historialPuntuacion}`);
        }
    }

    async anadirHistorialPuntuacion(puntuacion: number) {
        const historialRaw = await AsyncStorage.getItem('historialPuntuacion');
        const historialPuntuacion = historialRaw ? JSON.parse(historialRaw) : [];
        historialPuntuacion.push(puntuacion); // añadimos la puntuación actual
        await AsyncStorage.setItem('historialPuntuacion', JSON.stringify(historialPuntuacion));
    }

    // Nuevo método para reiniciar el historial
    reiniciarHistorialPuntuacion = async () => { // <--- Agrega el '=' y el '=>'
        try {
            await AsyncStorage.removeItem('historialPuntuacion');
            this.setState({ historialPuntuacion: [] });
            logger.info('Historial de puntuación reiniciado a 0.');
        } catch (e) {
            logger.error('Error al reiniciar historial de puntuación: ' + e);
        }
    };

    render(): React.ReactNode {
        const { puntuacion } = this.props.route.params;
        // const { historialPuntuacion } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>¡Juego terminado!</Text>
                <Text style={styles.message}>Resultado final: {puntuacion} / 5</Text>

                {/* Gráfica de la puntuación actual */}
                <View style={styles.barChart}>
                    <Text style={styles.barLabel}>Aciertos {puntuacion}</Text>
                    <View style={[styles.bar, { width: `${(puntuacion / 5) * 100}%`, backgroundColor: '#4CAF50' }]} />
                    <Text style={styles.barLabel}>Fallos {5 - puntuacion}</Text>
                    <View style={[styles.bar, { width: `${((5 - puntuacion) / 5) * 100}%`, backgroundColor: '#F44336' }]} />
                </View>

                {/* Gráfica de barras para el historial de puntuaciones */}
                <ScrollView style={styles.chart}>
                    <Text style={styles.title}>Historial de puntuaciones</Text>
                    {this.state.historialPuntuacion.map((puntuacion, index) => (
                        <View key={index} style={{ marginBottom: 8 }}>
                            <Text style={styles.barLabel}>Juego {index + 1}: {puntuacion} / 5</Text>
                            <View style={[styles.bar, { width: `${(puntuacion / 5) * 100}%`, backgroundColor: '#2196F3' }]} />
                        </View>
                    ))}
                </ScrollView>

                {/* Botón para volver a la lista de citas */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('QuoteList')}
                >
                    <Text style={styles.buttonText}>Volver al inicio</Text>
                </TouchableOpacity>

                        {/* NUEVO: Botón para reiniciar el historial */}
                <TouchableOpacity
                    style={styles.button} // Aplicar estilos adicionales para diferenciar
                    onPress={this.reiniciarHistorialPuntuacion}
                >
                    <Text style={styles.buttonText}>Reiniciar Historial</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0C134F', paddingVertical: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFC107', marginBottom: 16 },
    message: { fontSize: 18, color: '#FFFFFF', marginBottom: 20 },
    button: {
        backgroundColor: '#FFC107',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: { color: '#0C134F', fontWeight: 'bold' },
    chart: { margin: 10, borderRadius: 15, backgroundColor: '#1A1A2E', padding: 20, width: '90%' },
    barChart: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    barLabel: {
        color: 'white',
        marginBottom: 8,
    },
    bar: {
        height: 20,
        borderRadius: 4,
        marginBottom: 10,
    },
});
