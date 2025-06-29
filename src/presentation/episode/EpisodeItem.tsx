import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Episode } from '../../domain/model/Episode';
import i18n from '../../i18n/i18n';

// Importamos el tipo Episode, que es la entidad que vamos a mostrar
interface EpisodeRowProps {
    readonly episode: Episode;      // Propiedad que contiene el episodio a mostra
    readonly index: number;         // Índice del episodio
    readonly onPress: () => void;   // Función que se ejecuta al presionar el elemento
}

export default function EpisodeItem(props: EpisodeRowProps) { // en forma de función

    const { episode,index, onPress } = props;

    const opacity = useRef(new Animated.Value(0)).current; // Inicializa la opacidad en 0 (es decir transparente)

    useEffect(() => {
        // Efecto para animar la opacidad
        Animated.timing(opacity, {
        // Crea una animación de temporización
        toValue: 1,             // Cambia el valor de opacidad a 1
        duration: 1000,         // Duración de la animación en milisegundos (JUGAR CON ESTO PARA VER EL RETRASO)
        delay: index * 250,     // Retraso en la animación basado en el índice
        useNativeDriver: true,  // Utiliza el driver nativo para mejorar el rendimiento
        }).start();
    }, [opacity, index]);       // Se ejecuta cuando la opacidad o el índice cambian

    return (
            <Animated.View style={[styles.container_item, { opacity }]}>
                <TouchableHighlight onPress={onPress} underlayColor="rgba(74, 61, 61, 0.3)" style={styles.touchable}>
                    <View style={styles.container_info}>
                            <Text style={styles.title}> {episode.titulo}</Text>
                        <View style={styles.rowBetween}>
                            <Text style={styles.overview}>{ i18n('episode') } {episode.episodio}</Text>
                            <Text style={styles.overview}>{ i18n('season') }  {episode.temporada}</Text>
                        </View>
                        <Text numberOfLines={1} style={styles.description}>{episode.descripcion}</Text>
                    </View>
                </TouchableHighlight>
            </Animated.View>
    );
}

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 10,
        overflow: 'hidden', // Para que el borde redondeado se aplique correctamente
        width: '100%', // Aseguramos que el Touchable ocupe todo el ancho del contenedor
        padding: 20,
    },
    container_item: {
        flexDirection: 'row',
        gap: 10, // Espacio entre los elementos
        alignItems: 'center', // Alineamos los items al inicio
        borderColor: '#4E209C', // Color del borde
        borderRadius: 10, // Bordes redondeados
        backgroundColor: '#4E5D9C', // Fondo blanco para el item
        borderWidth: 1, // Ancho del borde
        margin: 10, // Margen entre los items
    },
    container_info: {
        flexDirection: 'column', // Alineamos los elementos en columna
        flex: 1, // Ocupa el espacio restante importante para que el texto no se corte
        justifyContent: 'center', // Centra verticalmente el contenido
        gap: 2, // Espacio entre los elementos de texto
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold', // Estilo para el título de la película
        paddingBottom: 5, // Espacio debajo del título
        color: '#FFC107', // Color del título
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#FFC107', // Color oscuro para la descripción
        fontStyle: 'italic', // Estilo de fuente para la descripción
    },
    overview: {
        color: '#FFC107', // Color gris para la descripción
        fontSize: 14,
        textAlign: 'center', // Centrar el texto
        fontWeight: '500', // Negrita para destacar
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20, // Espacio entre los elementos de la fila
    },
});

