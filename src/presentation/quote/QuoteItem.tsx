import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Quote } from '../../domain/model/Quote';

// Importamos el tipo Episode, que es la entidad que vamos a mostrar
interface QuoteRowProps {
    readonly quote: Quote; // Propiedad que contiene el episodio a mostra
    readonly index: number; // Índice del episodio
}

export default function QuoteItem(props: QuoteRowProps) { // en forma de función

    const { quote, index } = props;

    const opacity = useRef(new Animated.Value(0)).current; // Inicializa la opacidad en 0 (es decir transparente)

    useEffect(() => {
        // Efecto para animar la opacidad
        Animated.timing(opacity, {
        // Crea una animación de temporización
        toValue: 1, // Cambia el valor de opacidad a 1
        duration: 1000, // Duración de la animación en milisegundos (JUGAR CON ESTO PARA VER EL RETRASO)
        delay: index * 250, // Retraso en la animación basado en el índice
        useNativeDriver: true, // Utiliza el driver nativo para mejorar el rendimiento
        }).start();
    }, [opacity, index]); // Se ejecuta cuando la opacidad o el índice cambian

    return (
            <Animated.View style={[styles.container_item, { opacity }]}>
                    <View style={styles.container_info}>
                        <Text numberOfLines={ 4 } style={styles.title}>{quote.cita}</Text>
                        <Text style={styles.description}>{quote.personaje}</Text>
                    </View>
                    <Image
                        source={{ uri: quote.imagen }} // Asumiendo que quote.imagen es una URL válida
                        style={styles.image}
                        resizeMode="cover" // Ajusta la imagen al contenedor
                    />
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
        height: 180, // o el valor real que uses
        flexDirection: 'row',
        gap: 10, // Espacio entre los elementos
        alignItems: 'center', // Alineamos los items al inicio
        borderColor: '#4E209C', // Color del borde
        borderRadius: 10, // Bordes redondeados
        backgroundColor: '#4E5D9C', // Fondo blanco para el item
        borderWidth: 1, // Ancho del borde
        margin: 10, // Margen entre los items
        paddingEnd: 12, // Espacio al final del item para que no se corte el texto
    },
    container_info: {
        flexDirection: 'column', // Alineamos los elementos en columna
        flex: 1, // Ocupa el espacio restante importante para que el texto no se corte
        justifyContent: 'center', // Centra verticalmente el contenido
        gap: 2, // Espacio entre los elementos de texto
        padding: 15, // Espacio interno del contenedor de información
        //________ PARA HACER PRUEBAS DE ESTILO _______
        // borderColor: 'red', // Color del borde del título
        // borderWidth: 1, // Ancho del borde del título
    },
    image: {
        width: 80,
        height: 140,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold', // Estilo para el título de la película
        paddingBottom: 5, // Espacio debajo del título
        color: '#FFC107', // Color del título
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

